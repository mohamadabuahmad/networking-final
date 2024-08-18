import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar for all screen sizes */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-grow p-4 sm:p-6 pt-[6rem] lg:pt-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;
