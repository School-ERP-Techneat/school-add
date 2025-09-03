type Props = {
  isSignUp: boolean;
};

const WelcomePanel = ({ isSignUp }: Props) => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-600 p-6 xl:p-12 flex-col justify-center items-center text-white">
    <div className="text-center max-w-sm xl:max-w-md">
      <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6">
        {isSignUp ? 'Welcome to ConnectHub!' : 'Hello, Friend!'}
      </h2>
      <p className="text-teal-100 text-base xl:text-lg leading-relaxed mb-6 xl:mb-8">
        {isSignUp
          ? 'Join our community of learners and educators. Start your journey with us today!'
          : 'Enter your details and continue your learning journey with us.'}
      </p>
      <div className="w-16 h-16 xl:w-24 xl:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 xl:w-12 xl:h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

export default WelcomePanel;
