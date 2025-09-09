import Sidebar from '../../components/Sidebar/Sidebar'
import { useGetEmployees } from '../../hooks/admin/useAdminServices'
import './EmployeesList.css'
import { useState, useEffect } from 'react'

const EmployeesList = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, error, refetch } = useGetEmployees()

  // Extract employees array from the API response
  const employeesArray = Array.isArray(data?.employees) ? data.employees : []
  const activeEmployeesCount = employeesArray.length

  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive)
  }

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

  // Fixed: Use useEffect instead of useState for side effects
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSidebarActive) {
        toggleSidebar()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSidebarActive])

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleAddEmployee = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (error) {
    return (
      <>
        <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
        <div className="employeesList-container">
          <div className="error-message">
            <h3>Error loading employees</h3>
            <p>{error.message}</p>
            <button onClick={() => refetch()}>Try Again</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <div className="employeesList-container">
        <div className="employeesList-header">
          <h2 className="employeesList-title">Employees List</h2>
          <div className="employees-count">
            {activeEmployeesCount} Active Employees • {employeesArray.length} Total
          </div>
        </div>

        <div className="employee-container">
          {!isLoading && (
            <div className="employees-controls">
              <button className="add-employee-btn" onClick={handleAddEmployee}>
                + Add Employee
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : employeesArray.length === 0 ? (
            <div className="empty-state">
              <h3>No employees found</h3>
              <p>Start by adding your first employee</p>
            </div>
          ) : (
            <div className="employees-grid">
              {employeesArray.map((employee) => (
                <div key={employee?.id} className="employee-card">
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {getInitials(employee?.name)}
                    </div>
                    <div className="employee-details">
                      <h3>{employee?.name || 'Unknown'}</h3>
                      <p>{employee?.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className={`employee-status status-${employee?.isActive}`}>
                    {employee?.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </>
  )
}

export default EmployeesList