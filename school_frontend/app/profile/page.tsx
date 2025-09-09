import React from "react";
import Image from "next/image";

const ProfilePage = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
          <Image
            src="https://via.placeholder.com/120"
            alt="Profile"
            width={128} // same as w-32
            height={128} // same as h-32
            className="rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">John Doe</h2>
            <p className="text-gray-600">Software Engineer</p>
            <p className="text-gray-500 text-sm">john.doe@example.com</p>
            <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
            <p>
              <span className="font-medium text-gray-700">Full Name:</span> John
              Doe
            </p>
            <p>
              <span className="font-medium text-gray-700">Employee ID:</span>{" "}
              ECR12345
            </p>
            <p>
              <span className="font-medium text-gray-700">Department:</span>{" "}
              Development
            </p>
            <p>
              <span className="font-medium text-gray-700">Phone:</span>{" "}
              +91-9876543210
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Account Settings
            </h3>
            <p>
              <span className="font-medium text-gray-700">Role:</span> Admin
            </p>
            <p>
              <span className="font-medium text-gray-700">Joined:</span> Jan 15,
              2023
            </p>
            <p>
              <span className="font-medium text-gray-700">Last Login:</span> Sep
              5, 2025
            </p>
            <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
