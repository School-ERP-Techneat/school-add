'use client';
import { useState, useCallback, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import AuthToggle from '@/components/AuthToggle';
import AuthForm from '@/components/AuthForm';

const API_BASE = 'https://developed-ballet-projectors-shall.trycloudflare.com/api';

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

  // Load theme preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    if (match) {
      router.push('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  // Autofocus email
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

  /** ==============================
   *  🔐 SIGNUP
   * ============================== */
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
        setError(result.message || 'Signup failed');
        toast.error(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** ==============================
   *  🔑 SIGNIN
   * ============================== */
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
  console.log(result);
      if (res.ok && result.data) {
        const { user, accessToken } = result.data;
        const schoolCode = user?.schoolCode;
    
        if (!schoolCode || !accessToken) {
          throw new Error('Invalid login response: missing schoolCode or accessToken');
        }

        // Store token & schoolCode
        localStorage.setItem('accessToken', accessToken);
        document.cookie = `userId=${schoolCode}; path=/; secure`;

        // Fetch school details with token
        const schoolRes = await fetch(`${API_BASE}/school/${schoolCode}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
        setError(result.message || 'Login failed');
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /** ==============================
   *  ⏳ LOADING STATE
   * ============================== */
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        🔐 Redirecting to dashboard...
      </div>
    );
  }

  /** ==============================
   *  🎨 RENDER
   * ============================== */
  return (
    <div className="h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-indigo-900 dark:to-black flex flex-col overflow-hidden relative">
      {/* Floating background orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400/30 dark:bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/30 dark:bg-blue-600/30 rounded-full blur-3xl animate-ping"></div>

      {/* Header with theme toggle */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl h-full max-h-[calc(100vh-120px)]"
        >
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/70 rounded-3xl shadow-2xl overflow-hidden h-full flex border border-white/20 dark:border-gray-700/30">
            {/* Left: Auth Form */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
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
            </div>

            {/* Right: Futuristic Welcome Panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-teal-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 opacity-80"></div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 p-10 text-center text-white"
              >
                <h2 className="text-4xl font-extrabold tracking-wide drop-shadow-lg mb-4">
                  {isSignUp ? '🚀 Join the Future of Learning' : '⚡ Welcome Back to ConnectHub'}
                </h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  {isSignUp
                    ? 'Sign up today and be part of the most vibrant school network — where learning meets community.'
                    : 'Log in to your dashboard and explore your school’s digital hub. Stay connected. Stay ahead.'}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
