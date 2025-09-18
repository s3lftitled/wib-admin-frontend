import { useState } from 'react'
import './Settings.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Edit, Lock } from 'lucide-react'

const Settings = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [fullName, setFullName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const toggleSidebar = () => setSidebarActive(!isSidebarActive)
  
  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Add save logic here
  }

  const handlePasswordChange = () => {
    // Add password change logic here
    console.log('Password change requested')
  }

  return (
    <>
      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      
      <div className="settings-container">
        <div className="settings-content">
          <div className="settings-header">
            <h1 className="settings-title">Profile Settings</h1>
            <p className="settings-subtitle">Manage your account settings and preferences</p>
          </div>

          <div className="profile-section">
            <div className="profile">
              <div className="avatar">
                <div className="avatar-circle">
                  <span className="avatar-initials">"_"</span>
                </div>
                <button className="camera-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
              </div>
              <div className="profile-name-section">
                <h2 className="profile-name">name</h2>
                <p className="profile-username">email</p>
              </div>
            </div>

            <div className="profile-right">
              <div className="profile-info">
                <div className="info-header">
                  <h3 className="info-title">Profile Information</h3>
                  <button 
                    className="edit-button-settings"
                    onClick={handleEdit}
                  >
                    <Edit className="icon" />
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  ) : (
                    <div className="form-display">{fullName}</div>
                  )}
                </div>
              </div>

              <div className="password-section">
                <div className="password-header">
                  <h3 className="password-title">Change Password</h3>
                  <button 
                    className="change-button-settings"
                    onClick={handlePasswordChange}
                  >
                    <Lock className="icon" />
                    Change
                  </button>
                </div>
                
                <p className="password-info">Password was last changed 2 months ago</p>
                <p className="password-help">Click 'Change' to update your password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
