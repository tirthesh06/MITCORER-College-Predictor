"use client";

import Image from "next/image";
import styles from "./AboutCollege.module.css";
import { BookOpen, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutCollege() {
  return (
    <section className={styles.container} id="about-section">
      <div className={styles.inner}>

        {/* Section 1: Simple Two-Column Layout (MITCORER Information Card) */}
        <div className={styles.splitRow}>

          {/* Left Side: Heading and description */}
          <motion.div
            className={styles.textContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label">🏫 MITCORER CAMPUS</div>
            <h2 className={styles.title}>
              MIT College of Railway Engineering and Research, Barshi
            </h2>
            <div className="red-divider" style={{ margin: "12px 0 20px" }} />

            <div className={styles.paragraphContainer}>
              <p className={styles.paragraph}>
                MIT Group has launched &ldquo;MIT College of Railway Engineering and Research&rdquo; (MITCORER) at Barshi, Dist. Solapur.
              </p>
              <p className={styles.paragraph}>
                MIT Group&rsquo;s legacy in the field of revolutionary education inspired us to venture into the unique field of rail and transportation.
              </p>
              <p className={styles.paragraph}>
                MITCORER aspires to cultivate and train the students who will help provide solutions to the greatest technological and social challenges of the 21st century.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Existing campus building image */}
          <motion.div
            className={styles.imageColumn}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src="/campus-main.jpg"
                alt="MIT College of Railway Engineering and Research, Barshi Campus View"
                width={800}
                height={450}
                className={styles.image}
                priority
                sizes="(max-width: 900px) 100vw, 550px"
              />
            </div>
          </motion.div>

        </div>

        {/* Highlight Stats Info boxes (Highlight identity without altering layout styles) */}
        <div className={styles.highlights}>
          <div className={styles.highlightCard}>
            <BookOpen className={styles.highlightIcon} />
            <h4>Railway Curriculum</h4>
            <p>Syllabus based on actual industry and modern railway technology practices.</p>
          </div>
          <div className={styles.highlightCard}>
            <Award className={styles.highlightIcon} aria-label="AwardIcon" />
            <h4>PAH Approved</h4>
            <p>Affiliated with Punyashlok Ahilyadevi Holkar Solapur University.</p>
          </div>
          <div className={styles.highlightCard}>
            <ShieldCheck className={styles.highlightIcon} />
            <h4>AICTE Recognized</h4>
            <p>Fully approved courses recognizing excellence in technical engineering education.</p>
          </div>
        </div>

        {/* Section 2: Full Width Dome Photo & Detailed About Page */}
        <div className={styles.fullWidthSection}>
          <h2 className={styles.titleCenter}>
            About MIT College of Railway Engineering &amp; Research, Barshi
          </h2>
          <div className={`${styles.dividerCenter} red-divider`} />

          {/* Main Showcase Dome Image */}
          <div className={styles.largeImageWrapper}>
            <Image
              src="/campus-dome.png"
              alt="MITCORER Administrative Building Dome front view"
              width={1200}
              height={500}
              className={styles.image}
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1100px"
            />
          </div>

          <div className={styles.aboutTextColumns}>
            <p className={styles.paragraph}>
              MIT Group has launched &quot;MIT College of Railway Engineering and Research&quot; (MITCORER)
              in Barshi, Dist. Solapur. MIT Group&apos;s legacy in the field of revolutionary education
              inspired us to venture into the unique field of Railway Technology. MITCORER aspires to
              cultivate and train the students who will help / provide solutions to the greatest
              technological and social challenges of the 21st century. Our Vision is to create future
              leaders who would manage and lead powerful organisations in the emerging corporate landscape.
              The curriculum of the programs is railway oriented and is based on the actual railway practices.
            </p>
            <p className={styles.paragraph}>
              MITCORER is focused on giving students real world and practical live education that will
              transform them into successful professionals. Our facilities and amenities are paired
              with assignments, projects, interactive classes and strong industry-institute rapports,
              which will help to make MITCORER one of the best educational institutions in the country.
            </p>
          </div>
        </div>



      </div>
    </section>
  );
}
