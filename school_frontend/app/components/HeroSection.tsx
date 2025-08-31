"use client";
import React from "react";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Animated Background */}
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

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Floating Particles (optional) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* You can add a canvas or SVG particle effect here */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl animate-fade-up">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Unlock Brilliance with{" "}
          <span className="text-teal-400">SchoolConnect</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-gray-200">
          Where curiosity meets opportunity. Join a community that nurtures
          minds and builds futures.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg font-semibold rounded-full shadow-xl transition-transform transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
