"use client";
import React, { ReactNode } from "react";

interface InfoCardProps {
  label: string;
  value: ReactNode; // ✅ can be string OR JSX
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <div className="bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
      <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
      <div className="text-lg font-semibold text-teal-800 dark:text-teal-300 break-words">
        {value}
      </div>
    </div>
  );
};

export default InfoCard;
