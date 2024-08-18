import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ForgotPasswordPage from './pages/ForgetPasswordPage/ForgotPasswordPage';
import MessagingPage from './pages/MessagingPage';
import Sidebar from './pages/Sidebar/Sidebar';
import { UserProvider } from '../src/pages/UserContext';

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
            <Route path="/" element={auth ? <HomePage /> : <Navigate to="/login" />} />
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
    <div className="flex min-h-screen">
      {/* Toggle button for mobile devices */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 bg-gray-800 text-white"
      >
        
      </button>

      {/* Sidebar component with toggle functionality */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className={`flex-grow p-6 ${isSidebarOpen ? 'ml-64' : 'ml-5 lg:ml-64'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
