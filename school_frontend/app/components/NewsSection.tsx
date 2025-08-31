"use client";
import React from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    date: "2023-10-26",
    title: "Upcoming School Fair",
    description:
      "Celebrate learning and community at our annual School Fair. Expect student showcases, games, and delicious food.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/QBHKS0erxk.png",
  },
  {
    id: "2",
    date: "2023-10-20",
    title: "Parent-Teacher Conferences",
    description:
      "Connect with educators on November 1st & 2nd. Schedule your appointments online to discuss your child’s progress.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/qjFjmLADk5.png",
  },
  {
    id: "3",
    date: "2023-10-15",
    title: "New Science Lab Opening",
    description:
      "Our cutting-edge science lab is now open, offering students hands-on experiences in biology, chemistry, and physics.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/ZLqSut4AuX.png",
  },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const NewsSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-teal-700">
            📰 News & Announcements
          </h2>
          <p className="mt-2 text-gray-600 text-lg">
            What’s happening at SchoolConnect — stay in the loop
          </p>
        </header>

        {/* News Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map(({ id, date, title, description, image }) => (
            <Link
              key={id}
              href="#"
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <time className="block text-sm text-gray-500">
                  {formatDate(date)}
                </time>
                <h3 className="text-xl font-semibold text-teal-700 group-hover:underline">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="#"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300"
          >
            Explore More News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
