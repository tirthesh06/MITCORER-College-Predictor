"use client";

import Image from "next/image";
import styles from "./AboutCollege.module.css";
import { motion } from "framer-motion";

export default function AboutCollege() {
  return (
    <section className={styles.section} id="about-section">
      <div className={styles.inner}>
        
        {/* Section Title */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">🏫 About Institute</div>
          <h2 className="section-title">
            About MIT College of Railway Engineering &amp; Research, Barshi
          </h2>
          <div className="red-divider" />
        </motion.div>

        {/* 1. Large Banner Image at the top (First Image - Dome) */}
        <motion.div 
          className={styles.bannerWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/campus-dome.png"
            alt="MIT College of Railway Engineering and Research, Barshi - Administrative Building Dome View"
            width={1200}
            height={500}
            className={styles.bannerImage}
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </motion.div>

        {/* 2. Text description content */}
        <motion.div 
          className={styles.textContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className={styles.textTitle}>
            MIT College of Railway Engineering and Research, Barshi
          </h3>
          <p className={styles.paragraph}>
            MIT Group has launched &ldquo;MIT College of Railway Engineering and Research&rdquo; (MITCORER) at Barshi, Dist. Solapur. MIT Group&rsquo;s legacy in the field of revolutionary education inspired us to venture into the unique field of rail and transportation.
          </p>
          <p className={styles.paragraph}>
            MITCORER aspires to cultivate and train the students who will help provide solutions to the greatest technological and social challenges of the 21st century.
          </p>
        </motion.div>

        {/* 3. Second Image displayed below the text (Second Image - Campus Front) */}
        <motion.div 
          className={styles.secondaryImageWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/campus-main.jpg"
            alt="MIT College of Railway Engineering and Research, Barshi - Campus Building View"
            width={1200}
            height={550}
            className={styles.secondaryImage}
            loading="lazy"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </motion.div>

      </div>
    </section>
  );
}
