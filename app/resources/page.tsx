"use client"
import Header from "@/components/Header";
import React, { useState } from "react";
import Footer from "../components/Footer";

const page = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Resources
          </h2>
          <p className="text-lg  mb-10">
            Explore guides, articles, and tools to help you make the most out of
            our ECR platform.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Getting Started
              </h3>
              <p className="text-gray-600">
                Learn how to set up your account, onboard employees, and
                configure your dashboard.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Compliance Guides
              </h3>
              <p className="text-gray-600">
                Stay updated with the latest compliance regulations and best
                practices.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">FAQs</h3>
              <p className="text-gray-600">
                Find answers to the most common questions about using the
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default page;
