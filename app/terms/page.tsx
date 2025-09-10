import React from "react";

const page = () => {
  return (
    <div>
      <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Terms & Conditions
          </h2>
          <div className="space-y-6 text-gray-600 text-base leading-relaxed">
            <p>
              By accessing and using this ECR web application, you agree to
              comply with and be bound by the following terms and conditions.
              Please read them carefully before using our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              1. Use of Services
            </h3>
            <p>
              You agree to use this platform solely for lawful purposes and in
              accordance with all applicable laws and regulations. Unauthorized
              access, misuse of data, or attempts to disrupt system
              functionality are strictly prohibited.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              2. Data Privacy
            </h3>
            <p>
              We are committed to protecting your personal and organizational
              data. By using this application, you consent to the collection,
              storage, and processing of information as outlined in our Privacy
              Policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              3. Limitation of Liability
            </h3>
            <p>
              While we strive to provide a secure and reliable platform, we are
              not liable for any indirect damages, data loss, or disruptions
              that may occur during usage. Users are responsible for maintaining
              the confidentiality of their login credentials.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              4. Modifications
            </h3>
            <p>
              We reserve the right to update or modify these terms at any time.
              Users will be notified of significant changes, and continued use
              of the platform after updates constitutes acceptance of the
              revised terms.
            </p>

            <p className="font-medium text-gray-700">
              If you do not agree with these Terms & Conditions, please
              discontinue using the platform immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
