"use client";
import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className="relative bg-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-gray-100 opacity-40 pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-teal-700 tracking-tight">
            Discover SchoolConnect
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Where curiosity meets opportunity — and every learner finds their path.
          </p>
        </header>

        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="font-semibold text-teal-600">SchoolConnect</span> is more than a school — it&apos;s a vibrant learning community. We combine academic excellence with emotional intelligence, creativity, and purpose. Our mission is to empower students to become confident, compassionate changemakers.
          </p>
        </div>

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
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 group bg-white"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-teal-700 mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition duration-300"
          >
            Connect With Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
