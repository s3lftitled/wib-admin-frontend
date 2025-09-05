import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Sidebar from '../../components/Sidebar/Sidebar'

const Dashboard = () => {
    const [isSidebarActive, setSidebarActive] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true)

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isSidebarActive) {
            toggleSidebar()
        }
    }

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value)
        const newDate = new Date(currentDate)
        newDate.setMonth(newMonth)
        setCurrentDate(newDate)
    }

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value)
        const newDate = new Date(currentDate)
        newDate.setFullYear(newYear)
        setCurrentDate(newDate)
    }

    const selectDate = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const closeWelcome = () => {
        setIsWelcomeVisible(false);
    }

    const renderCalendar = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        let date = 1;
        let nextMonthDate = 1;
        const rows = [];

        for (let week = 0; week < 6; week++) {
            const cells = [];

            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < firstDay) {
                    const prevDate = daysInPrevMonth - firstDay + day + 1;
                    cells.push(
                        <td key={`prev-${prevDate}`} className="day-cell other-month">
                            <div className="day-number">{prevDate}</div>
                        </td>
                    )
                } else if (date > daysInMonth) {
                    cells.push(
                        <td key={`next-${nextMonthDate}`} className="day-cell other-month">
                            <div className="day-number">{nextMonthDate}</div>
                        </td>
                    )
                    nextMonthDate++
                } else {
                    const currentDateObj = new Date(year, month, date)
                    const isToday = isSameDate(currentDateObj, new Date())
                    const isSelected = selectedDate && isSameDate(currentDateObj, selectedDate)

                    cells.push(
                        <td
                            key={`current-${date}`}
                            className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => selectDate(currentDateObj)}
                        >
                            <div className="day-number">{date}</div>
                        </td>
                    );
                    date++
                }
            }

            rows.push(<tr key={week}>{cells}</tr>)

            if (date > daysInMonth && nextMonthDate > 7) break;
        }

        return rows
    };

    const isSameDate = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isSidebarActive])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsWelcomeVisible(false);
        }, 20000);
        return () => clearTimeout(timer);
    }, [])

    return (
        <div className="dashboard">

            <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />

            <div className="dashboard-grid">

                {/* Welcome Section */}
                {isWelcomeVisible && (
                    <div className="welcome-section">
                        <button className="welcome-close" onClick={closeWelcome}>×</button>
                        <div className="welcome-header">
                            <h1>Welcome Back, [Admin Name!]</h1>
                            <p>
                                Your dashboard is the central hub for managing your account and your employee.
                                Here you can track their progress, view important notifications, and access key features.
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Main Content */}
                <div className="main-content">
                    <div className="logobar">
                        <img src="/WIB LOGO.png" className="logo-dashboard" />
                    </div>

                    {/* Calendar Section*/}
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <h2 className="calendar-title">Calendar</h2>
                            <div className="date-selector">
                                <select value={currentDate.getMonth()} onChange={handleMonthChange} className="month-select">
                                    {monthNames.map((month, index) => (
                                        <option key={month} value={index}>{month}</option>
                                    ))}
                                </select>
                                <select value={currentDate.getFullYear()} onChange={handleYearChange} className="year-select">
                                    {Array.from({ length: 50 }, (_, i) => currentDate.getFullYear() - 10 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <table className="calendar-table">
                            <thead>
                                <tr>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <th key={day} className="day-header">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody id="calendarBody">{renderCalendar()}</tbody>
                        </table>
                    </div>

                    {/* Request Leave Section */}
                    <div className="request-leave">
                        <h2 className="request-leave-header">Request Leave</h2>
                        {/* Number of request */}
                        <div className="request-leave-container">
                            {/* Content for requesting leave */}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        {/* Modal content will be added here */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard