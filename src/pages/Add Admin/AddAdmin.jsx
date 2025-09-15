import { useEffect, useState } from 'react'
import './AddAdmin.css'
import Sidebar from '../../components/Sidebar/Sidebar'

const AddAdmin = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'HR Admin'
  })

  const [admins] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Super Admin',
      lastActive: '2 hrs ago',
      avatar: 'JD'
    }
  ])

  const [pendingInvitations] = useState([
    { id: 1, email: 'alice.brown@company.com', role: 'HR Admin', sentDate: '2 days ago', status: 'Pending' },
    { id: 2, email: 'mike.wilson@company.com', role: 'Department Admin', sentDate: '1 week ago', status: 'Sent' }
  ])

  const toggleSidebar = () => setSidebarActive(!isSidebarActive)
  const handleOverlayClick = () => { if (isSidebarActive) toggleSidebar() }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  return (
    <>
      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <div className={`overlay ${isSidebarActive ? 'active' : ''}`} onClick={handleOverlayClick}></div>

      <div className="admin-content">
        <div className="section add-admin-section">
          <h1 className="main-title">Admin Management</h1>
          <p className="section-subtitle">
            Manage administrators, send invitations, and review current access.
          </p>

          {/* Flex wrapper */}
          <div className="admin-sections">

            {/* Left: Add Admin Form */}
            <div className="left-section">
              <h2>Add New Administrator</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="btn-group">
                <button className="btn btn-secondary">
                  Send Invitation
                </button>
              </div>
            </div>

            {/* Right: Pending + Current */}
            <div className="right-section">

              {/* Pending Invitations Dropdown */}
              <div className="pending-section">
                <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <span>Pending Invitations</span>
                    <span className="arrow">{dropdownOpen ? '▴' : '▾'}</span>
                  </div>
                  <div className="dropdown-content">
                    {pendingInvitations.map(invitation => (
                      <div key={invitation.id} className="invitation-item">
                        <div>
                          <strong>{invitation.email}</strong>
                          <p className="invitation-meta">
                            {invitation.role} • Sent {invitation.sentDate}
                          </p>
                        </div>
                        <span className={`status-badge status-${invitation.status.toLowerCase()}`}>
                          {invitation.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Admins (always visible) */}
              <div className="current-section">
                <h2>Current Administrators</h2>
                <div className="admin-list">
                  {admins.map(admin => (
                    <div key={admin.id} className="admin-item">
                      <div className="admin-info">
                        <div className="admin-avatar">{admin.avatar}</div>
                        <div className="admin-details">
                          <h3>{admin.name}</h3>
                          <p>{admin.role} • Last active: {admin.lastActive}</p>
                        </div>
                      </div>
                      <div className="admin-actions">
                        <button className="action-btn action-edit">Edit</button>
                        <button className="action-btn action-delete">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddAdmin