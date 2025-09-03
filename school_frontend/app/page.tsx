"use client";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import NewsSection from "@/app/components/NewsSection";
import { motion,easeOut  } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: easeOut },
  }),
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white font-sans scroll-smooth transition-colors duration-300">
      <Header />

      <main className="space-y-32">
        {/* Hero */}
        <motion.section
          id="hero"
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <HeroSection />
          {/* floating glow effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/2 w-96 h-96 bg-teal-500/30 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-indigo-500/20 blur-2xl rounded-full animate-pulse delay-700"></div>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          id="about"
          className="px-4 md:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <AboutSection />
          </motion.div>
        </motion.section>

        {/* News */}
        <motion.section
          id="news"
          className="bg-gray-50 dark:bg-gray-800 px-4 md:px-8 py-20 rounded-t-3xl shadow-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div custom={1} variants={fadeUp}>
            <NewsSection />
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section
          id="cta"
          className="relative bg-gradient-to-r from-teal-600 via-teal-500 to-indigo-600 text-white py-24 px-6 text-center overflow-hidden rounded-t-3xl shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_50%)] animate-pulse"></div>

          <motion.h2
            custom={0}
            variants={fadeUp}
            className="relative text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg"
          >
            🚀 Ready to Join the Future of Learning?
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="relative max-w-2xl mx-auto text-lg mb-10 leading-relaxed opacity-90"
          >
            SchoolConnect empowers students, educators, and families to connect,
            grow, and succeed together. Discover how our platform transforms
            education into a collaborative journey.
          </motion.p>

          <motion.a
            custom={2}
            variants={fadeUp}
            href="/login"
            className="relative inline-block bg-white text-teal-700 font-semibold px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            aria-label="Sign up for SchoolConnect"
          >
            Get Started
          </motion.a>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
