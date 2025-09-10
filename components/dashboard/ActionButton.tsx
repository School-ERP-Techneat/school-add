const ActionButton = ({ label }: { label: string }) => (
  <div className="mt-4 dark:bg-gray-800">
    <button className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:brightness-110 text-white dark:text-gray-200 px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:scale-105">
      {label}
    </button>
  </div>
);

export default ActionButton;
