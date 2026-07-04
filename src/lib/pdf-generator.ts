/**
 * PDF Generator Utility
 * Uses jsPDF to create a professional prediction report.
 */

import jsPDF from "jspdf";
import { PredictionResponse } from "./PredictionService";

interface PDFData {
  predictionResponse: PredictionResponse;
}

/**
 * Generates the prediction report PDF and returns it as a Blob URL.
 */
export async function generatePDF({ predictionResponse }: PDFData): Promise<string> {
  // Use landscape for a wider table
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth(); // ~297mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // ~210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // ── Header Strip ──────────────────────────────────────────────
  pdf.setFillColor(204, 0, 0); // MIT Red
  pdf.rect(0, 0, pageWidth, 28, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("MHT-CET & JEE PREDICTOR", margin, 12);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("MIT College of Railway Engineering & Research, Barshi", margin, 19);
  pdf.text("DTE CODE – 06901 | Affiliated to PAH Solapur University", margin, 24);

  // Date on right
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  pdf.setFontSize(9);
  pdf.text(`Generated: ${dateStr}`, pageWidth - margin, 19, { align: "right" });

  // ── Report Title ──────────────────────────────────────────────
  let y = 42;
  pdf.setTextColor(17, 17, 17);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("PREDICTION REPORT", margin, y);

  // Divider
  pdf.setDrawColor(204, 0, 0);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y + 3, pageWidth - margin, y + 3);
  y += 12;

  const { student, predictionSummary, predictions } = predictionResponse;

  // ── Student Info Table & Summary ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("STUDENT INFORMATION & PREDICTION SUMMARY", margin + 4, y + 1);
  y += 10;

  const fields: [string, string][] = [
    ["Full Name", student.name],
    ["Mobile Number", student.mobile],
    ["Marks / Percentile", student.score],
    ["Category", student.category],
    ["Eligible Colleges", predictionSummary.eligibleCount.toString()],
  ];

  pdf.setFontSize(10);
  const labelWidth = 55;
  const rowHeight = 9;

  fields.forEach(([label, value], idx) => {
    const rowY = y + idx * rowHeight;
    if (idx % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, rowY - 4, contentWidth, rowHeight, "F");
    }
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${label}:`, margin + 3, rowY);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(17, 17, 17);
    pdf.text(value, margin + labelWidth, rowY);
  });

  y += fields.length * rowHeight + 10;

  // ── Prediction Table ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("ELIGIBLE COLLEGES (BASED ON CUTOFFS)", margin + 4, y + 1);
  y += 10;

  // Table header
  pdf.setFillColor(204, 0, 0);
  pdf.rect(margin, y - 4, contentWidth, 8, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  
  // Column layout (Landscape width = 297 - 30 = 267mm)
  // Sr | College Name (Autonomous status) | District | Branch | Quota | R1 | R2 | R3 | R4 | Avg | Chance
  const colSrNo     = margin;
  const colCollege  = margin + 8;
  const colDistrict = margin + 120;
  const colBranch   = margin + 140;
  const colQuota    = margin + 190;
  const colR1       = margin + 205;
  const colR2       = margin + 217;
  const colR3       = margin + 229;
  const colR4       = margin + 241;
  const colAvg      = margin + 253;

  pdf.text("Sr.", colSrNo, y + 1);
  pdf.text("College Name (Autonomous Status)", colCollege, y + 1);
  pdf.text("District", colDistrict, y + 1);
  pdf.text("Branch", colBranch, y + 1);
  pdf.text("Quota", colQuota, y + 1);
  pdf.text("R1", colR1, y + 1);
  pdf.text("R2", colR2, y + 1);
  pdf.text("R3", colR3, y + 1);
  pdf.text("R4", colR4, y + 1);
  pdf.text("Avg", colAvg, y + 1);
  y += 8;
  
  predictions.forEach((row, idx) => {
    // Check if we need a new page (leave room for footer)
    if (y > pageHeight - 25) {
      pdf.addPage();
      // Repeat header on new page
      pdf.setFillColor(204, 0, 0);
      pdf.rect(margin, margin - 4, contentWidth, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text("Sr.", colSrNo, margin + 1);
      pdf.text("College Name (Autonomous Status)", colCollege, margin + 1);
      pdf.text("District", colDistrict, margin + 1);
      pdf.text("Branch", colBranch, margin + 1);
      pdf.text("Quota", colQuota, margin + 1);
      pdf.text("R1", colR1, margin + 1);
      pdf.text("R2", colR2, margin + 1);
      pdf.text("R3", colR3, margin + 1);
      pdf.text("R4", colR4, margin + 1);
      pdf.text("Avg", colAvg, margin + 1);
      y = margin + 8;
    }

    // Row background
    if (idx % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, y - 3, contentWidth, 10, "F");
    }

    // Admission chance color indicator strip (left edge)
    const chance = row.admissionChance || '';
    if (chance.includes('High')) {
      pdf.setFillColor(0, 160, 80);
    } else if (chance.includes('Medium')) {
      pdf.setFillColor(255, 160, 0);
    } else {
      pdf.setFillColor(200, 50, 50);
    }
    pdf.rect(margin, y - 3, 2, 10, "F");

    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    
    pdf.text((idx + 1).toString(), colSrNo + 2, y + 2);
    
    // College Name with Autonomous status in brackets
    const autonomyStatus = row.autonomy || 'Status Unknown';
    const fullCollegeName = `${row.collegeName} (${autonomyStatus})`;
    // Truncate if too long (max ~110mm wide at 6.5pt = ~60 chars)
    const maxCollegeChars = 65;
    const truncatedCollegeName = fullCollegeName.length > maxCollegeChars 
      ? fullCollegeName.substring(0, maxCollegeChars - 1) + "…" 
      : fullCollegeName;
    
    // College name in bold
    pdf.setFont("helvetica", "bold");
    pdf.text(truncatedCollegeName, colCollege, y + 2);
    
    pdf.setFont("helvetica", "normal");
    const truncatedBranch = row.branch.length > 28 ? row.branch.substring(0, 25) + "…" : row.branch;
    pdf.text(row.district || '-', colDistrict, y + 2);
    pdf.text(truncatedBranch, colBranch, y + 2);
    pdf.text(row.quota || '-', colQuota, y + 2);
    pdf.text(row.r1 || "-", colR1, y + 2);
    pdf.text(row.r2 || "-", colR2, y + 2);
    pdf.text(row.r3 || "-", colR3, y + 2);
    pdf.text(row.r4 || "-", colR4, y + 2);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 80, 160);
    pdf.text(row.average || "-", colAvg, y + 2);

    // Admission chance badge text below college name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(5.5);
    if (chance.includes('High')) {
      pdf.setTextColor(0, 120, 60);
    } else if (chance.includes('Medium')) {
      pdf.setTextColor(180, 110, 0);
    } else {
      pdf.setTextColor(180, 40, 40);
    }
    pdf.text(`▶ ${chance}`, colCollege, y + 7);
    pdf.setTextColor(17, 17, 17);

    y += 10;
  });

  y += 10;

  // ── Legend ────────────────────────────────────────────────────
  if (y < pageHeight - 30) {
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text("Admission Chance Legend:", margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFillColor(0, 160, 80); pdf.rect(margin + 40, y - 3, 3, 3, "F");
    pdf.text("High Chance (Student score ≥ Avg Cutoff)", margin + 45, y);
    pdf.setFillColor(255, 160, 0); pdf.rect(margin + 130, y - 3, 3, 3, "F");
    pdf.text("Medium Chance (Within 5%)", margin + 135, y);
    pdf.setFillColor(200, 50, 50); pdf.rect(margin + 185, y - 3, 3, 3, "F");
    pdf.text("Low Chance (6-15% below cutoff)", margin + 190, y);
    y += 6;
  }

  // ── Footer ────────────────────────────────────────────────────
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(130, 130, 130);
    pdf.text("Generated using MHT-CET & JEE Predictor | MIT College of Railway Engineering & Research", margin, pageHeight - 10);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }

  // Return as Blob URL for frontend preview
  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}
