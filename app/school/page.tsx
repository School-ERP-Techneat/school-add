'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/school`;

const SchoolFormPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    affiliationNumber: '',
    board: '',
    medium: '',
    establishmentYear: '',
    schoolType: '',
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

  /** ==============================
   *  Load dark mode preference
   * ============================== */
  useEffect(() => {
    const stored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  /** ==============================
   *  Get schoolCode from cookie
   * ============================== */
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    if (match) {
      setSchoolCode(match[1]);
      setFormData((prev) => ({ ...prev, code: match[1] }));
    } else {
      toast.error('No school code found. Please login first.');
      router.push('/');
    }
  }, [router]);

  /** ==============================
   *  Handle input changes
   * ============================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** ==============================
   *  Submit form
   * ============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !schoolCode) {
      toast.error('Missing authentication. Please log in again.');
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('🏫 School profile created successfully!');
        router.push('/dashboard');
      } else {
        if (result?.error && Array.isArray(result.error)) {
          result.error.forEach((err: any) => toast.error(err.message));
        } else {
          toast.error(result.message || 'Failed to create school');
        }
      }
    } catch (err) {
      console.error('School creation error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** ==============================
   *  Render form
   * ============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-indigo-900 dark:to-black p-6">
      

      <div className="max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/80 rounded-2xl shadow-2xl p-10 backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🏫 Create School Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Basic Info */}
          <div className="sm:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              School Information
            </h2>
            <hr className="mb-4 border-gray-300 dark:border-gray-600" />
          </div>

          <input
            name="name"
            placeholder="School Name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="code"
            placeholder="School Code"
            value={formData.code}
            onChange={handleChange}
            className="input"
            disabled
          />
          <input
            name="affiliationNumber"
            placeholder="Affiliation Number"
            value={formData.affiliationNumber}
            onChange={handleChange}
            className="input"
          />

          {/* Dropdowns */}
          <select
            name="board"
            value={formData.board}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="STATE">STATE</option>
            <option value="IB">IB</option>
            <option value="CAMBRIDGE">CAMBRIDGE</option>
          </select>

          <select
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select Medium</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Regional">Regional</option>
          </select>

          <input
            type="number"
            name="establishmentYear"
            placeholder="Establishment Year"
            value={formData.establishmentYear}
            onChange={handleChange}
            className="input"
          />

          <select
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select School Type</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
            <option value="Aided">Aided</option>
            <option value="International">International</option>
          </select>

          {/* Contact */}
          <div className="sm:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Contact Details
            </h2>
            <hr className="mb-4 border-gray-300 dark:border-gray-600" />
          </div>

          <input
            name="contactPhone"
            placeholder="Contact Phone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="input"
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="input"
          />
          <input
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            className="input"
          />
          <input
            name="logoUrl"
            placeholder="Logo URL"
            value={formData.logoUrl}
            onChange={handleChange}
            className="input"
          />

          {/* Address */}
          <div className="sm:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Address
            </h2>
            <hr className="mb-4 border-gray-300 dark:border-gray-600" />
          </div>

          <input
            name="address.street"
            placeholder="Street"
            value={formData.address.street}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address.area"
            placeholder="Area"
            value={formData.address.area}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address.city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address.state"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address.country"
            placeholder="Country"
            value={formData.address.country}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address.zipCode"
            placeholder="Zip Code"
            value={formData.address.zipCode}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : '✅ Create School'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchoolFormPage;
