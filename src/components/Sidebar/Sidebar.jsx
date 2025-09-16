import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const Settings = ({ isSidebarActive, toggleSidebar })  => {

  const [searchTerm, setSearchTerm] = useState('')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleOverlayClick = () => {
    if (isSidebarActive) {
      toggleSidebar()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isSidebarActive) {
      toggleSidebar()
    }
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    navigate('/authentication')
  }

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSidebarActive])

  return (
    <div className="settings-container">
      {/* Sidebar and overlay functions*/}
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
          <Link to="/dashboard" className="menu-item">Dashboard</Link>
          <Link to="/employee-list" className="menu-item">Employees List</Link>
          <Link to="/add-admin" className="menu-item">Add Admin</Link>
          <button onClick={handleLogoutClick} className="menu-item logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        <div className="logobar">
          <img src="/WIB LOGO.png" className="logo-dashboard" />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="logout-modal-overlay" onClick={handleCancelLogout}>
          <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to log out?</h3>
            <div className="logout-modal-buttons">
              <button onClick={handleCancelLogout} className="logout-btn-cancel">No</button>
              <button onClick={handleConfirmLogout} className="logout-btn-confirm">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default Settings