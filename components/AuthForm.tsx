import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isSignUp: boolean;
  loading: boolean;
  error: string;
  signinData: { email: string; password: string };
  signupData: { locationCode: string; email: string; password: string; confirmPassword: string };
  handleSigninChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSigninSubmit: (e: React.FormEvent) => void;
  handleSignupSubmit: (e: React.FormEvent) => void;
};

const AuthForm = ({
  isSignUp,
  loading,
  error,
  signinData,
  signupData,
  handleSigninChange,
  handleSignupChange,
  handleSigninSubmit,
  handleSignupSubmit,
}: Props) => (
  <div className="max-w-sm mx-auto w-full">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
      {isSignUp ? 'Create Account' : 'Welcome Back'}
    </h1>
    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      {isSignUp
        ? 'Join ConnectHub and start your learning journey'
        : 'Sign in to your ConnectHub account'}
    </p>

    {error && (
      <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )}

    <AnimatePresence mode="wait">
      <motion.div
        key={isSignUp ? 'signup' : 'signin'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {!isSignUp ? (
          <form onSubmit={handleSigninSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signinData.email}
              onChange={handleSigninChange}
              required
              disabled={loading}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signinData.password}
              onChange={handleSigninChange}
              required
              disabled={loading}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
              disabled={loading}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
              minLength={6}
              disabled={loading}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              required
              disabled={loading}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  </div>
);

export default AuthForm;
