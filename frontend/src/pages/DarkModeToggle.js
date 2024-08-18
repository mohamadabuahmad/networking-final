import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={darkMode ? 'text-gray-400' : 'text-black'}>Light</span>
      <button
        onClick={toggleDarkMode}
        className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
            darkMode ? 'translate-x-full border-blue-600' : 'translate-x-0 border-gray-300'
          }`}
        />
      </button>
      <span className={darkMode ? 'text-white' : 'text-gray-400'}>Dark</span>
    </div>
  );
};

export default DarkModeToggle;
