import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  let html = '';
  let responseStatus = 0;

  try {
    body = await request.json();
    
    // Create form data to forward to Eduvale prediction engine
    const formData = new URLSearchParams();
    
    // Map Exam Type appropriately
    let examTypeVal = body.exam_type || 'MHT-CET';
    if (examTypeVal === 'MHT-CET') examTypeVal = 'MHTCET';
    
    formData.append('exam_type', examTypeVal);
    formData.append('pred_mode', body.pred_mode || 'percentile');
    formData.append('score', body.score?.toString() || '');
    formData.append('district', body.district || 'Any');
    formData.append('gender', body.gender || 'Male');
    formData.append('category', body.category || 'OPEN');
    
    if (body.branch && Array.isArray(body.branch)) {
      body.branch.forEach((b: string) => formData.append('branch[]', b));
    } else if (body.branch) {
      formData.append('branch', body.branch);
    }
    
    if (body.tfws) formData.append('tfws', 'true');
    if (body.ews) formData.append('ews', 'true');
    if (body.university) formData.append('university', body.university);

    const targetUrl = 'https://eduvale.in/mht-cet/college-predictor/predict.php';
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://eduvale.in/mht-cet/',
      },
      body: formData.toString(),
    });

    responseStatus = response.status;

    if (!response.ok) {
      throw new Error(`Failed to fetch from prediction engine: ${response.statusText}`);
    }

    html = await response.text();
    const $ = cheerio.load(html);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPredictions: any[] = [];
    
    // Parse the student's score for intelligent filtering
    const studentScore = parseFloat(body.score?.toString() || '0');
    const predMode = body.pred_mode || 'percentile';

    $('.result-card').each((i, el) => {
      const card = $(el);
      const collegeName = card.find('h4').text().trim();
      
      // Parse district from result-meta (format: "📍 District | University")
      const metaText = card.find('.result-meta').text().replace('📍', '').trim();
      const metaParts = metaText.split('|').map((s: string) => s.trim());
      const district = metaParts[0] || '';
      
      // Extract autonomy status from result-autonomy element
      const autonomy = card.find('.result-autonomy').text().trim() || 'Status Unknown';
      
      // Parse branch: the HTML is <div class="result-branch"><strong>Branch:</strong> Computer Engineering</div>
      let branch = '';
      let quota = '';
      
      card.find('.result-branch').each((j, branchEl) => {
        const branchDiv = $(branchEl);
        const fullText = branchDiv.text().trim();
        // Handles both "Branch: Computer Engineering" and "Quota: GOPENH"
        if (fullText.toLowerCase().startsWith('branch:')) {
          branch = fullText.replace(/^branch:\s*/i, '').trim();
        } else if (fullText.toLowerCase().startsWith('quota:')) {
          quota = branchDiv.find('.quota-badge').text().trim();
          if (!quota) {
            quota = fullText.replace(/^quota:\s*/i, '').trim();
          }
        }
      });
      
      // Parse round cutoff data from the table
      const trs = card.find('.round-table tr');
      let round1 = '-', round2 = '-', round3 = '-', round4 = '-', average = '-';
      
      trs.each((rowIdx, rowEl) => {
        if (rowIdx === 0) return; // Skip header row
        
        const tds = $(rowEl).find('td');
        if (tds.length === 5) {
          const val1 = tds.eq(0).text().trim();
          const val2 = tds.eq(1).text().trim();
          const val3 = tds.eq(2).text().trim();
          const val4 = tds.eq(3).text().trim();
          const valAvg = tds.eq(4).text().trim();
          
          round1 = val1 && val1 !== '' ? val1 : '-';
          round2 = val2 && val2 !== '' ? val2 : '-';
          round3 = val3 && val3 !== '' ? val3 : '-';
          round4 = val4 && val4 !== '' ? val4 : '-';
          average = valAvg && valAvg !== '' ? valAvg : '-';
        }
      });
      
      if (collegeName) {
        rawPredictions.push({
          rank: i + 1,
          collegeCode: 'N/A', // Will be assigned after filtering
          collegeName,
          district,
          branch,
          quota,
          r1: round1,
          r2: round2,
          r3: round3,
          r4: round4,
          average,
          autonomy: autonomy || 'Status Unknown',
          avgNumeric: parseFloat(average) || 0,
        });
      }
    });

    // ─── INTELLIGENT FILTERING ────────────────────────────────────────────────
    // The Eduvale API returns ALL colleges sorted by average cutoff descending.
    // We filter to show only colleges where the student's score is realistic.
    // Logic:
    //   - For percentile mode: show colleges whose average cutoff is within a
    //     window around the student's score.
    //   - "High Chance":   student score >= avgCutoff (score exceeds cutoff)
    //   - "Medium Chance": student score between (avgCutoff - 5) and avgCutoff
    //   - "Low Chance":    student score between (avgCutoff - 12) and (avgCutoff - 5)
    //   - Colleges where student score < (avgCutoff - 12) are NOT shown (unreachable)
    //   - Also exclude colleges where avgCutoff is 0 or invalid

    const TOLERANCE_HIGH = 15;   // Show colleges where avg cutoff is up to 15 points above score (student might just qualify for lower ranks)
    const TOLERANCE_LOW  = 30;   // Show colleges up to 30 points below score (student clearly eligible)

    const filteredPredictions = rawPredictions
      .filter(p => {
        if (p.avgNumeric <= 0) return false; // Skip colleges with no valid average

        if (predMode === 'percentile') {
          // For percentile: higher cutoff = harder to get in
          // Show colleges where student's score is within a realistic window
          const diff = p.avgNumeric - studentScore; 
          // diff > 0 means college cutoff is higher than student score = harder
          // diff < 0 means college cutoff is lower than student score = student easily eligible
          
          // Include if: cutoff is not more than TOLERANCE_HIGH points above student score
          // AND cutoff is not more than TOLERANCE_LOW points below student score
          return diff <= TOLERANCE_HIGH && diff >= -TOLERANCE_LOW;
        } else {
          // For rank mode: lower rank = harder to get in (better rank number = fewer seats)
          // Ranks work inversely - lower number is better
          const diff = studentScore - p.avgNumeric;
          return diff >= 0 && diff <= 5000; // Show if student rank is within 5000 of cutoff rank
        }
      })
      .map(p => {
        // Calculate admission chance based on score vs average cutoff
        let admissionChance = 'Low Chance';
        
        if (predMode === 'percentile') {
          const diff = p.avgNumeric - studentScore;
          if (diff <= 0) {
            // Student score >= cutoff (student clears the bar)
            admissionChance = 'High Chance';
          } else if (diff <= 5) {
            // Student score is within 5 percentile below cutoff
            admissionChance = 'Medium Chance';
          } else {
            // Student score is 5-15 percentile below cutoff
            admissionChance = 'Low Chance';
          }
        } else {
          // Rank mode: lower student rank is better
          const diff = studentScore - p.avgNumeric;
          if (diff <= 500) {
            admissionChance = 'High Chance';
          } else if (diff <= 2000) {
            admissionChance = 'Medium Chance';
          } else {
            admissionChance = 'Low Chance';
          }
        }
        
        return { ...p, admissionChance };
      });

    // Sort by average cutoff closest to student's score (most relevant first)
    filteredPredictions.sort((a, b) => {
      const diffA = Math.abs(a.avgNumeric - studentScore);
      const diffB = Math.abs(b.avgNumeric - studentScore);
      return diffA - diffB;
    });

    // Re-assign rank and remove internal avgNumeric field
    const predictions = filteredPredictions.map((p, idx) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avgNumeric, ...rest } = p;
      return { ...rest, rank: idx + 1, collegeCode: 'N/A' };
    });

    if (predictions.length === 0) {
      console.warn("Prediction Filtering Warning: No colleges matched for score:", studentScore);
      console.log("Total raw results from API:", rawPredictions.length);
      console.log("POST payload:", formData.toString());
      console.log("HTTP Status:", responseStatus);
    }

    return NextResponse.json({
      student: {
        name: body.fullName || '',
        score: body.score || '',
        category: body.category || '',
        district: body.district || '',
        gender: body.gender || ''
      },
      predictions
    });

  } catch (error) {
    console.error('Error in prediction API:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
