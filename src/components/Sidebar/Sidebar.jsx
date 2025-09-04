import { useEffect, useState } from 'react';
import './Sidebar.css';

const Settings = ({ isSidebarActive, toggleSidebar })  => {

    // Sidebar state and toggle function
    const [searchTerm, setSearchTerm] = useState('');

    const handleOverlayClick = () => {
        if (isSidebarActive) {
            toggleSidebar();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isSidebarActive) {
            toggleSidebar();
        }
    };

    // useEffect for handling keydown events
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSidebarActive]);

    return (
        <div className="settings-container">
            {/* Sidebar and overlay JSX */}
            <div
                id="overlay"
                className={`overlay ${isSidebarActive ? 'active' : ''}`}
                onClick={handleOverlayClick}
            ></div>

            <button
                id="hamburger"
                className={`hamburger ${isSidebarActive ? 'active' : ''}`}
                onClick={toggleSidebar}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
                <div className="sidebar-content">
                    <h2>Menu</h2>
                    <a href="/Dashboard" className="menu-item">Dashboard</a>
                    <a href="/EmployeesList" className="menu-item">Employees List</a>
                    <a href="/AddAdmin" className="menu-item">Add Admin</a>
                    <a href="/AddEmployee" className="menu-item">Add Employee</a>
                    <a href="/authentication" className="menu-item">Logout</a>
                </div>
            </div>

            <div className="main-content">
                <div className="logobar">
                    <img src="public/WIB LOGO.png" className="logo-dashboard" />
                </div>
            </div>
        </div>

    );
};

export default Settings;