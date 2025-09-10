import React from "react";

const HelpPage = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Help Center
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          Find quick answers, troubleshooting steps, and support resources to
          keep you moving.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              How do I reset my password?
            </h3>
            <p className="text-gray-600">
              Go to the login page, click {`"Forgot Password"`}, and follow the
              instructions to reset your account.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Can I export employee data?
            </h3>
            <p className="text-gray-600">
              Yes, admins can export employee records in multiple formats
              including Excel and PDF from the dashboard.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Is my data secure?
            </h3>
            <p className="text-gray-600">
              Absolutely. We use encryption, role-based access, and regular
              audits to keep your information safe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpPage;
