import { useEffect, useState } from 'react';
import './AddAdmin.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const AddAdmin = () => {
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
        </>

    );
};

export default AddAdmin;