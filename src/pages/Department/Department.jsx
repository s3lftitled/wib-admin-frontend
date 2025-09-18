import { useEffect, useState } from 'react'
import './Department.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useCreateDepartment } from '../../hooks/admin/useAdminServices'
import useUserProfile from '../../hooks/user/useUserProfile'

const Department = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const createDepartmentMutation = useCreateDepartment()
  const { userProfile } = useUserProfile()

  const [formData, setFormData] = useState({
    departmentName: ''
  })

  const handleCreateDepartment = (e) => {
    e.preventDefault()
    createDepartmentMutation.mutate({ departmentName: formData.departmentName, createdBy: userProfile._id })
  }

  // Clear form when mutation is successful
  useEffect(() => {
    if (createDepartmentMutation.isSuccess) {
      setFormData({ departmentName: '' })
    }
  }, [createDepartmentMutation.isSuccess])

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

        <div className="department-content">
          <div className="section-department add-admin-section">
            <button
              className="btn-department btn-secondary-depaxrtment"
              onClick={handleBackToDepartments}
              style={{ marginBottom: '20px' }}
            > ← Back to Departments </button>

            <h1 className="main-title-department">
              <span className="green-underline-department">{selectedDepartment.name}</span> Employees
            </h1>
            <p className="section-subtitle-department">
              Employees in the {selectedDepartment.name} department.
            </p>

            <div className="department-container">
              {selectedDepartment.employees.length > 0 ? (
                <div className="department-grid">
                  {selectedDepartment.employees.map(employee => (
                    <div key={employee.id} className="department-card">
                      <div className="employee-info-department">
                        <div className="employee-avatar-department">{employee.avatar}</div>
                        <div className="employee-details-department">
                          <h3>{employee.fullName}</h3>
                          <p>{employee.position}</p>
                          <p>{employee.email}</p>
                        </div>
                      </div>
                      <div className="employee-status-department status-active-department">Active</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-department">
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

      <div className="admin-content-department">
        <div className="section-department add-admin-section">
          <h1 className="main-title-department">
            <span className="green-underline-department">Department</span> Management
          </h1>
          <p className="section-subtitle-department">
            Create and manage departments, assign department heads, and track organizational structure.
          </p>

          <div className="department-sections">
            {/* Left Section - Create Department */}
            <div className="left-section-department">
              <h2>Create New Department</h2>
              <form onSubmit={handleCreateDepartment}>
                <div className="form-grid-department">
                  <div className="form-group-department">
                    <label className="form-label-department" htmlFor="departmentName">Department Name</label>
                    <input
                      id="departmentName"
                      type="text"
                      name="departmentName"
                      className="form-input-department"
                      placeholder="Enter department name"
                      value={formData.departmentName}
                      onChange={handleInputChange}
                      disabled={createDepartmentMutation.isPending}
                      required
                    />
                  </div>
                </div>

                {/* Success Message */}
                {createDepartmentMutation.isSuccess && (
                  <div className="mutation-message success-message">
                    <div className="message-icon">✓</div>
                    <div className="message-content">
                      <strong>Success!</strong> Department created successfully.
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {createDepartmentMutation.isError && (
                  <div className="mutation-message error-message">
                    <div className="message-icon">⚠</div>
                    <div className="message-content">
                      <strong>Error:</strong> {createDepartmentMutation.error?.message || 'Failed to create department. Please try again.'}
                    </div>
                  </div>
                )}

                <div className="btn-group-department">
                  <button 
                    type="submit" 
                    className={`btn-department btn-secondary-department ${createDepartmentMutation.isPending ? 'btn-loading' : ''}`}
                    disabled={createDepartmentMutation.isPending}
                  > 
                    {createDepartmentMutation.isPending ? (
                      <>
                        <span className="loading-spinner"></span>
                        Creating...
                      </>
                    ) : (
                      'Create Department'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Section - Department List */}
            <div className="right-section-department">
              <div className="current-section-department">
                <h2>Current Departments</h2>
                <div className="department-list">
                  {departments.map(department => (
                    <div
                      key={department.id}
                      className="department-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDepartmentClick(department)}
                    >
                      <div className="department-info">
                        <div className="department-avatar">{department.avatar}</div>
                        <div className="department-details">
                          <h3>{department.name}</h3>
                          <p>Head: {department.headOfDepartment} • {department.employees.length} employees</p>
                        </div>
                      </div>
                      <div className="department-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-btn-department action-edit"
                          onClick={() => handleEditDepartment(department.id)}
                        > Edit </button>
                        <button
                          className="action-btn-department action-delete-department"
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