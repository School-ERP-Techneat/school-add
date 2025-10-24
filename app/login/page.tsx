'use client';
import { useState, useEffect, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/app/components/Header';
import AuthToggle from '@/components/AuthToggle';
import AuthForm from '@/components/AuthForm';
import { Inter, Poppins } from 'next/font/google';

// Fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: '700', variable: '--font-poppins' });

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;
console.log('API_BASE:', API_BASE);
const LoginPage = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [signupData, setSignupData] = useState({
    locationCode: '1234',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  // Dark mode persistence
  useEffect(() => {
    const stored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Check if already logged in
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    if (match) {
      router.push('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  // Autofocus email input when toggling forms
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[name="email"]');
    input?.focus();
  }, [isSignUp]);

  const handleSignupChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const handleSigninChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  // Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/school-owner/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          locationCode: signupData.locationCode,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('🚀 Account created successfully! Please log in.');
        setIsSignUp(false);
        setSignupData({ locationCode: '1234', email: '', password: '', confirmPassword: '' });
      } else {
        const msg = result.message || 'Signup failed';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Signin
  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/school-owner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData),
      });

      const result = await res.json();

      if (res.ok && result.data) {
        const { user, accessToken } = result.data;
        const schoolCode = user?.schoolCode;

        if (!schoolCode || !accessToken) {
          throw new Error('Invalid login response: missing schoolCode or accessToken');
        }

        localStorage.setItem('accessToken', accessToken);
        // For local dev, remove `secure`
        document.cookie = `userId=${schoolCode}; path=/;`;

        const schoolRes = await fetch(`${API_BASE}/school/${schoolCode}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const schoolData = await schoolRes.json();

        if (schoolRes.ok && schoolData.data?.name?.trim()) {
          toast.success('✨ Login successful!');
          startTransition(() => router.push('/dashboard'));
        } else {
          toast('⚡ Please complete your school profile');
          startTransition(() => router.push('/school'));
        }
      } else {
        const msg = result.message || 'Login failed';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        🔐 Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen relative overflow-hidden dark:bg-black bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 dark:from-indigo-900 dark:via-purple-800 dark:to-black ${inter.variable}`}
    >
      <Toaster position="top-right" />

      {/* Background particles */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400/30 dark:bg-purple-700/30 rounded-full top-[-150px] left-[-150px] blur-3xl animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute w-[400px] h-[400px] bg-teal-300/30 dark:bg-blue-700/30 rounded-full bottom-[-100px] right-[-100px] blur-3xl animate-pulse"></div>
      <div className="absolute w-[200px] h-[200px] bg-pink-300/20 dark:bg-pink-600/20 rounded-full top-1/3 right-1/2 blur-xl animate-bounce"></div>

      {/* Header */}
      <Header  />

      <div className="flex flex-col lg:flex-row h-full items-center justify-center relative z-10 p-6">
        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className={`relative w-full lg:w-1/2 p-8 sm:p-12 backdrop-blur-2xl bg-white/20 dark:bg-gray-900/40 border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 ${poppins.variable}`}
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="w-full"
            whileHover={{ rotateY: 5, rotateX: 5 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <AuthToggle isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
            <AuthForm
              isSignUp={isSignUp}
              loading={loading}
              error={error}
              signinData={signinData}
              signupData={signupData}
              handleSigninChange={handleSigninChange}
              handleSignupChange={handleSignupChange}
              handleSigninSubmit={handleSigninSubmit}
              handleSignupSubmit={handleSignupSubmit}
            />
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative p-12 text-center"
          >
            <h2 className="text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-teal-400">
              {isSignUp ? '🚀 Unlock Premium School Tools' : '⚡ Welcome Back!'}
            </h2>
            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 opacity-95 leading-relaxed">
              {isSignUp
                ? 'Sign up now to access exclusive features and manage your school like a pro.'
                : 'Log in to your dashboard and experience next-level school management.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
