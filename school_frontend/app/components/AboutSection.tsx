"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" as const },
  }),
};

const AboutSection: React.FC = () => {
  return (
    <section className="relative bg-white dark:bg-gray-900 py-24 px-4 overflow-hidden">
      {/* Futuristic glowing orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400/30 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-indigo-400/20 blur-[120px] rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 tracking-tight drop-shadow-md">
            Discover SchoolConnect
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Where curiosity meets opportunity — and every learner finds their path.
          </p>
        </motion.header>

        {/* Mission Statement */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              SchoolConnect
            </span>{" "}
            is more than a school — it&apos;s a vibrant learning community. We
            combine academic excellence with emotional intelligence, creativity,
            and purpose. Our mission is to empower students to become confident,
            compassionate changemakers.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              src: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/gyF8H9gk0q.png",
              alt: "Modern school facility",
              title: "Innovative Spaces",
              description: "Designed to inspire learning and collaboration.",
            },
            {
              src: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/OPbPQzSBn7.png",
              alt: "Students engaged in learning",
              title: "Engaged Learners",
              description: "Students thrive through hands-on, inquiry-based education.",
            },
            {
              src: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/o2y3n0DXAd.png",
              alt: "Students participating in activities",
              title: "Holistic Growth",
              description: "From arts to athletics, we nurture every dimension of development.",
            },
          ].map(({ src, alt, title, description }, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white dark:bg-gray-800 transform hover:-translate-y-2 hover:rotate-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-teal-700 dark:text-teal-400 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-teal-600 to-indigo-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            Connect With Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
