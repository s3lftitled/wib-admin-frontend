import Sidebar from '../../components/Sidebar/Sidebar'
import { useGetEmployees } from '../../hooks/admin/useAdminServices'
import './EmployeesList.css'
import { useState, useEffect } from 'react'

const EmployeesList = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data, isLoading, error, refetch } = useGetEmployees()

  const employeesArray = Array.isArray(data?.employees) ? data.employees : []
  
  const filteredEmployees = employeesArray.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && employee?.isActive) || 
      (statusFilter === 'inactive' && !employee?.isActive)
    
    return matchesSearch && matchesStatus
  })
  
  const activeEmployeesCount = filteredEmployees.filter(e => e?.isActive).length

  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive)
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false)
        } else if (isSidebarActive) {
          setSidebarActive(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSidebarActive, isModalOpen])

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) 
  }

  const handleAddEmployee = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  if (error) {
    return (
      <>
        <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />
        <div className="employeesList-container">
          <div className="error-message">
            <h3>Error loading employees</h3>
            <p>{error.message || 'Something went wrong'}</p>
            <button onClick={() => refetch()} className="retry-button">
              Try Again
            </button>
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
            {activeEmployeesCount} Active Employee{activeEmployeesCount !== 1 ? 's' : ''} • {filteredEmployees.length} Total
          </div>
        </div>

        <div className="employee-container">
          {!isLoading && (
            <div className="employees-controls">
              <input 
                type="text" 
                placeholder="Search employees..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-input" 
              />
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <button 
                className="add-employee-btn" 
                onClick={handleAddEmployee}
                aria-label="Add new employee"
              >
                + Add Employee
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" aria-label="Loading employees"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <h3>No employees found</h3>
              <p>
                {employeesArray.length === 0 
                  ? 'Start by adding your first employee' 
                  : 'No employees match your search or filter criteria'
                }
              </p>
            </div>
          ) : (
            <div className="employees-grid">
              {filteredEmployees.map((employee) => (
                <div key={employee?.id || Math.random()} className="employee-card">
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {getInitials(employee?.name)}
                    </div>
                    <div className="employee-details">
                      <h3>{employee?.name || 'Unknown Employee'}</h3>
                      <p>{employee?.email || 'No email provided'}</p>
                      {employee?.department && <p>{employee.department}</p>}
                      {employee?.position && <p>{employee.position}</p>}
                    </div>
                  </div>
                  <div className={`employee-status ${employee?.isActive ? 'status-active' : 'status-inactive'}`}>
                    {employee?.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={handleModalOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 id="modal-title">Add New Employee</h2>
            {/* Modal content will be added here */}
          </div>
        </div>
      )}
    </>
  )
}

export default EmployeesList  