import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import FriendsPage from './pages/FriendsPage/FriendsPage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import ForgotPasswordPage from './pages/ForgetPasswordPage/ForgotPasswordPage.jsx';
import MessagingPage from './pages/messages/MessagingPage.jsx';
import Sidebar from './pages/Sidebar/Sidebar.js';
import { UserProvider } from './pages/UserContext';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    // Check for authentication state (this example just uses a simple state)
    // In a real app, you would check for a token or session
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<MainLayout auth={auth} />}>
            <Route path="/home" element={auth ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/friends" element={auth ? <FriendsPage /> : <Navigate to="/login" />} />
            <Route path="/profile/:userId" element={auth ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={auth ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={auth ? <NotificationsPage /> : <Navigate to="/login" />} />
            <Route path="/messages" element={auth ? <MessagingPage /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} /> {/* Default route redirects to login */}
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

const MainLayout = ({ auth }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toggle button for mobile devices */}
      <div className="p-4 bg-gray-800 text-white flex justify-between lg:hidden">
        <button onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar component with toggle functionality */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        />

        {/* Main content area */}
        <div className={`flex-grow p-6 transition-all duration-300 lg:ml-10`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};



export default App;
