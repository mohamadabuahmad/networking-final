import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { currentUser, setCurrentUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setCurrentUser(null);
        navigate('/login');
    };

    if (!currentUser) {
        return null;
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar on the right */}
            <div
                className={`fixed lg:static inset-y-0 right-0 transform lg:transform-none transition-transform duration-200 ease-in-out bg-gray-800 text-white w-64 p-6 flex flex-col z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="mb-6 flex justify-between items-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-auto" />
                </div>
                <nav className="flex-grow">
                    <Link
                        to="/home"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/home' ? 'bg-gray-700' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to={`/profile/${currentUser.user_id}`}
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === `/profile/${currentUser.user_id}` ? 'bg-gray-700' : ''}`}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/settings"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/settings' ? 'bg-gray-700' : ''}`}
                    >
                        Settings
                    </Link>
                    <Link
                        to="/notifications"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/notifications' ? 'bg-gray-700' : ''}`}
                    >
                        Notifications
                    </Link>
                    <Link
                        to="/messages"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/messages' ? 'bg-gray-700' : ''}`}
                    >
                        Messages
                    </Link>
                    <Link
                        to="/friends"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/friends' ? 'bg-gray-700' : ''}`}
                    >
                        Friends
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
