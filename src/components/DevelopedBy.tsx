"use client";

import { motion } from "framer-motion";
import styles from "./DevelopedBy.module.css";

interface Developer {
  name: string;
  designation: string;
  responsibilities: string[];
  phone: string;
  linkedin: string;
  email?: string;
  // Inline SVG rendering function
  renderIcon: () => React.ReactNode;
}

const developers: Developer[] = [
  {
    name: "Tirthesh Vaijnath Gutte",
    designation: "Junior Full-Stack Developer",
    responsibilities: [
      "Full-stack development (Frontend + Backend)",
      "Backend API Integration",
      "Prediction Algorithm Development",
      "Database Design & Management",
      "College Cutoff Data Collection & Processing",
      "Prediction Logic Testing & Validation",
    ],
    phone: "7757851700",
    linkedin: "https://www.linkedin.com/in/tirthesh-vaijnath-gutte/",
    email: "tirtheshgutte17@gmail.com",
    renderIcon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
  {
    name: "Vivek Suresh Borwar",
    designation: "Frontend Developer & Testing Developer",
    responsibilities: [
      "Frontend Development",
      "UI Components",
      "User Experience Testing",
      "Functional Testing",
      "Quality Assurance",
    ],
    phone: "7028849741",
    linkedin: "https://www.linkedin.com/in/vivekborwar",
    email: "trailblazervivek50@gmail.com",
    renderIcon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    name: "Sumit Takbhate",
    designation: "Frontend Developer – Ideation & Solutions Guide",
    responsibilities: [
      "Frontend Development Support",
      "Feature Ideation",
      "Solution Planning",
      "Design Suggestions",
      "User Flow Improvements",
    ],
    phone: "7666863499",
    linkedin: "https://www.linkedin.com/in/sumit-takbhate-29206b40b",
    email: "", // Placeholder - leave blank for now
    renderIcon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.83.47-1.64.91-2.4C16.92 10.05 18 8.62 18 7A6 6 0 0 0 6 7c0 1.62 1.08 3.05 2 4.6.44.76.73 1.57.91 2.4H15.09z"></path>
      </svg>
    ),
  },
];

export default function DevelopedBy() {
  return (
    <section className={styles.section} id="developed-by-section" aria-labelledby="developed-by-title">
      <div className={styles.inner}>
        
        {/* Section Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">💻 Our Team</div>
          <h2 id="developed-by-title" className="section-title">
            Developed By
          </h2>
          <div className="red-divider" />
          <p className="section-subtitle">
            Meet the talented developers who envisioned and built the MITCORER College Prediction portal.
          </p>
        </motion.div>

        {/* Developer Cards Grid */}
        <div className={styles.grid}>
          {developers.map((developer, idx) => {
            return (
              <motion.div
                key={developer.name}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Visual Header / Avatar Spot */}
                <div className={styles.cardHeader}>
                  <div className={styles.iconCircle}>
                    {developer.renderIcon()}
                  </div>
                  <h3 className={styles.devName}>{developer.name}</h3>
                  <span className={styles.devDesignation}>{developer.designation}</span>
                </div>

                {/* Responsibilities list */}
                <div className={styles.cardBody}>
                  <span className={styles.sectionHeading}>Responsibilities</span>
                  <ul className={styles.responsibilityList}>
                    {developer.responsibilities.map((resp, index) => (
                      <li key={index} className={styles.responsibilityItem}>
                        <span>•</span> {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer / contacts */}
                <div className={styles.cardFooter}>
                  {/* Phone */}
                  <a href={`tel:+91${developer.phone}`} className={styles.phoneLink} title={`Call ${developer.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>+91 {developer.phone}</span>
                  </a>

                  {/* Social Buttons */}
                  <div className={styles.socialButtons}>
                    {/* LinkedIn */}
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      title="LinkedIn Profile"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>

                    {/* Email */}
                    {developer.email ? (
                      <a
                        href={`mailto:${developer.email}`}
                        className={styles.socialLink}
                        title="Send Email"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </a>
                    ) : (
                      <span
                        className={`${styles.socialLink} ${styles.disabled}`}
                        title="Email unavailable (placeholder)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
