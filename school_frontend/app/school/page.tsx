'use client';

import React, { useEffect, useState } from "react";

export default function SchoolDetailsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    } else {
      console.warn("No userId found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setForm({
        name: '',
        code: userId,
        affiliationNumber: '',
        board: 'CBSE',
        medium: 'English',
        establishmentYear: '',
        schoolType: 'Private',
        contactPhone: '',
        contactEmail: '',
        website: '',
        logoUrl: '',
        address: {
          street: '',
          area: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      });
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((prev: any) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!form.name || !form.establishmentYear) {
      alert('Please fill all required fields.');
      setLoading(false);
      return;
    }

    if (isNaN(Number(form.establishmentYear))) {
      alert('Establishment year must be a valid number.');
      setLoading(false);
      return;
    }

    if (form.contactPhone && form.contactPhone.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        establishmentYear: Number(form.establishmentYear),
      };

      const res = await fetch('https://school-backend-2-don7.onrender.com/api/school/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);

      if (!res.ok) {
        alert(`❌ Error: ${data.message || 'Something went wrong'}`);
      } else {
        alert('✅ School created successfully!');
      }
    } catch (err: any) {
      console.error('Network error:', err);
      alert(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return <div className="p-8 text-center text-gray-600 animate-pulse">🔄 Loading form...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 px-4 py-8 font-sans">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8 animate-fade-in">🏫 Create School</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-2xl grid gap-6 transition-all duration-500 hover:shadow-indigo-300 animate-slide-up"
      >
        {/* School Code */}
        <div className="transition-transform duration-300 hover:scale-[1.02]">
          <label htmlFor="code" className="block mb-1 font-semibold text-gray-700">School Code</label>
          <input
            id="code"
            name="code"
            value={form.code}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Editable Fields */}
        {[
          { name: 'name', label: 'School Name' },
          { name: 'affiliationNumber', label: 'Affiliation Number' },
          { name: 'contactPhone', label: 'Contact Phone' },
          { name: 'contactEmail', label: 'Contact Email' },
          { name: 'website', label: 'Website' },
          { name: 'logoUrl', label: 'Logo URL' },
          { name: 'establishmentYear', label: 'Establishment Year' },
        ].map(({ name, label }) => (
          <div key={name} className="transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor={name} className="block mb-1 font-semibold text-gray-700">{label}</label>
            <input
              id={name}
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              placeholder={label}
              required={name !== 'contactPhone' && name !== 'contactEmail' && name !== 'website' && name !== 'logoUrl'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>
        ))}

        {/* Dropdowns */}
        {[
          { name: 'board', label: 'Board', options: ["CBSE", "ICSE", "STATE", "IB", "CAMBRIDGE"] },
          { name: 'medium', label: 'Medium', options: ["English", "Hindi", "Regional"] },
          { name: 'schoolType', label: 'School Type', options: ["Private", "Government", "Aided", "International"] },
        ].map(({ name, label, options }) => (
          <div key={name} className="transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor={name} className="block mb-1 font-semibold text-gray-700">{label}</label>
            <select
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            >
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Address Fields */}
        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white/60 backdrop-blur-md">
          <legend className="text-lg font-semibold text-indigo-700 mb-4">📍 Address</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(form.address).map(([key, value]) => (
              <div key={key} className="transition-transform duration-300 hover:scale-[1.02]">
                <label htmlFor={`address.${key}`} className="block mb-1 font-semibold text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  id={`address.${key}`}
                  name={`address.${key}`}
                  value={String(value)}
                  onChange={handleChange}
                  placeholder={key}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-md text-white transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed animate-pulse'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110'
          }`}
        >
          {loading ? 'Submitting...' : '🚀 Submit School'}
        </button>
      </form>

      {/* Response */}
      {response && (
        <div className="max-w-3xl mx-auto mt-8 bg-white p-4 rounded-md shadow-sm animate-fadeIn">
          <h4 className="font-medium text-gray-700 mb-2">📝 Response:</h4>
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-600">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
