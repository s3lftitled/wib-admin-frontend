import { useEffect, useState } from 'react'
import './Department.css'
import Sidebar from '../../components/Sidebar/Sidebar'

const Department = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const [formData, setFormData] = useState({
    departmentName: ''
  })

  // Mock data - API calls dito need lagyan para sa real data
  const [departments] = useState([
    {
      id: 1,
      name: 'Marketing',
      headOfDepartment: 'Ronalie Bazar',
      avatar: 'M',
      employees: [
        {
          id: 101,
          fullName: ' Dyana Rose Bibat',
          email: 'dyana.bibat@company.com',
          position: 'Marketing Specialist',
          avatar: 'DR'
        },
        {
          id: 102,
          fullName: 'Frances June Ortiguero',
          email: 'francesjune.ortiguero@company.com',
          position: 'Marketing Manager',
          avatar: 'FJ'
        }
      ]
    }
  ])

  const toggleSidebar = () => setSidebarActive(!isSidebarActive)
  const handleOverlayClick = () => { if (isSidebarActive) toggleSidebar() }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (selectedDepartment) {
        setSelectedDepartment(null)
      } else if (isSidebarActive) {
        toggleSidebar()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSidebarActive, selectedDepartment])

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    try {
      // Lagyan ng API call
      console.log('Creating department:', formData)

      setFormData({
        departmentName: ''
      })
    } catch (error) {
      console.error('Error creating department:', error)
    }
  }

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department)
  }

  const handleBackToDepartments = () => {
    setSelectedDepartment(null)
  }

  const handleEditDepartment = (departmentId) => {
    // Functionality niya need pang i-implement
    console.log('Edit department:', departmentId)
  }

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        // Lagyan ng API call
        console.log('Delete department:', departmentId)
      } catch (error) {
        console.error('Error deleting department:', error)
      }
    }
  }

  // Employee List
  if (selectedDepartment) {
    return (
      <>
        <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
        <div className={`overlay ${isSidebarActive ? 'active' : ''}`} onClick={handleOverlayClick}></div>

        <div className="admin-content">
          <div className="section add-admin-section">
            <button
              className="btn btn-secondary"
              onClick={handleBackToDepartments}
              style={{ marginBottom: '20px' }}
            > ← Back to Departments </button>

            <h1 className="main-title">
              <span className="green-underline">{selectedDepartment.name}</span> Employees
            </h1>
            <p className="section-subtitle">
              Employees in the {selectedDepartment.name} department.
            </p>

            <div className="employee-container">
              {selectedDepartment.employees.length > 0 ? (
                <div className="employees-grid">
                  {selectedDepartment.employees.map(employee => (
                    <div key={employee.id} className="employee-card">
                      <div className="employee-info">
                        <div className="employee-avatar">{employee.avatar}</div>
                        <div className="employee-details">
                          <h3>{employee.fullName}</h3>
                          <p>{employee.position}</p>
                          <p>{employee.email}</p>
                        </div>
                      </div>
                      <div className="employee-status status-active">Active</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No employees in this department yet.</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main Departments
  return (
    <>
      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <div className={`overlay ${isSidebarActive ? 'active' : ''}`} onClick={handleOverlayClick}></div>

      <div className="admin-content">
        <div className="section add-admin-section">
          <h1 className="main-title">
            <span className="green-underline">Department</span> Management
          </h1>
          <p className="section-subtitle">
            Create and manage departments, assign department heads, and track organizational structure.
          </p>

          <div className="admin-sections">
            {/* Left Section - Create Department */}
            <div className="left-section">
              <h2>Create New Department</h2>
              <form onSubmit={handleCreateDepartment}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="departmentName">Department Name</label>
                    <input
                      id="departmentName"
                      type="text"
                      name="departmentName"
                      className="form-input"
                      placeholder="Enter department name"
                      value={formData.departmentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="btn-group">
                  <button type="submit" className="btn btn-secondary"> Create Department </button>
                </div>
              </form>
            </div>

            {/* Right Section - Department List */}
            <div className="right-section">
              <div className="current-section">
                <h2>Current Departments</h2>
                <div className="admin-list">
                  {departments.map(department => (
                    <div
                      key={department.id}
                      className="admin-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDepartmentClick(department)}
                    >
                      <div className="admin-info">
                        <div className="admin-avatar">{department.avatar}</div>
                        <div className="admin-details">
                          <h3>{department.name}</h3>
                          <p>Head: {department.headOfDepartment} • {department.employees.length} employees</p>
                        </div>
                      </div>
                      <div className="admin-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-btn action-edit"
                          onClick={() => handleEditDepartment(department.id)}
                        > Edit </button>
                        <button
                          className="action-btn action-delete"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >  Delete </button>
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

export default Department