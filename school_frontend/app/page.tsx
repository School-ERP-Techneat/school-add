"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import NewsSection from "@/app/components/NewsSection";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth">
      <Header variant="landing" />

      <main className="space-y-24">
        {/* Hero */}
        <section id="hero" className="relative">
          <HeroSection />
        </section>

        {/* About */}
        <section id="about" className="px-4 md:px-8">
          <AboutSection />
        </section>

        {/* News */}
        <section id="news" className="bg-gray-50 px-4 md:px-8 py-16">
          <NewsSection />
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-700 text-white py-20 px-4 text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
            🚀 Ready to Join the Future of Learning?
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
            SchoolConnect empowers students, educators, and families to connect,
            grow, and succeed together. Discover how our platform transforms
            education into a collaborative journey.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-white text-teal-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 shadow-md"
            aria-label="Sign up for SchoolConnect"
          >
            Get Started
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
