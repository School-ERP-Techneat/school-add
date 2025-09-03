type Props = {
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
};

const AuthToggle = ({ isSignUp, setIsSignUp }: Props) => (
  <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
    <button
      onClick={() => setIsSignUp(false)}
      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
        !isSignUp ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      Sign In
    </button>
    <button
      onClick={() => setIsSignUp(true)}
      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
        isSignUp ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      Sign Up
    </button>
  </div>
);

export default AuthToggle;
