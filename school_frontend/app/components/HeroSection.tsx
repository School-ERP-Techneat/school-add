"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source
          src="https://videos.pexels.com/video-files/4498282/4498282-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg leading-tight"
        >
          Unlock Brilliance with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            SchoolConnect
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-2xl mb-10 leading-relaxed text-gray-200"
        >
          Where curiosity meets opportunity. Join a vibrant community that{" "}
          <span className="text-teal-300 font-semibold">
            nurtures minds
          </span>{" "}
          and{" "}
          <span className="text-cyan-300 font-semibold">
            builds futures
          </span>
          .
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg font-semibold rounded-full shadow-xl transition-transform transform hover:scale-110 relative overflow-hidden"
          >
            <span className="relative z-10">🚀 Get Started</span>
            {/* Shimmer Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
          </Link>
        </motion.div>
      </div>

      {/* Shimmer Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
