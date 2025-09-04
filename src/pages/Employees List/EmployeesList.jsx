import Sidebar from '../../components/Sidebar/Sidebar';
import './EmployeesList.css';
import { useEffect, useState } from 'react';

const EmployeesList = () => {
    // Sidebar state and toggle function
    const [isSidebarActive, setSidebarActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive);
    };

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
        <>
            <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />

            {/*EmployeesList*/}
            <div className="employeesList-container">
                <div className="employeesList-header">
                    <h2 className="employeesList-title">Employees List</h2>
                    {/*Number of Active Employees*/}
                    
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Find your slaves..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="employees-list">
                        {/* Employee list items */}
                    </div>
                </div>
            </div>

        </>
    );
};

export default EmployeesList;