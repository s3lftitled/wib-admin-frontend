import Sidebar from '../../components/Sidebar/Sidebar'
import './EmployeesList.css'
import { useEffect, useState } from 'react'

const EmployeesList = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    status: '',
    hireDate: ''
  })

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      try {
        // Replace this with your backend API call
        // Here daw ilagay backend sheet na mag coconnect sa database sabi ni AI (Ata).
      } catch (error) {
        console.error('Error loading employees:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  useEffect(() => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, statusFilter])

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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSidebarActive])

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getActiveEmployeesCount = () => {
    return employees.filter(emp => emp.status === 'active').length
  }

  const handleAddEmployee = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />

      <div className="employeesList-container">
        <div className="employeesList-header">
          <h2 className="employeesList-title">Slaves List</h2>
          <div className="employees-count">
            {getActiveEmployeesCount()} Active Slaves • {employees.length} Total
          </div>
        </div>

        <div className="employee-container">
          {!loading && (
            <div className="employees-controls">
              <input
                type="text"
                placeholder="Search slave collection..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                className="add-employee-btn"
                onClick={handleAddEmployee}
              >
                + Add Slaves
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <h3>No slaves found</h3>
              <p>
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first slaves'
                }
              </p>
            </div>
          ) : (
            <div className="employees-grid">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="employee-card">
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {getInitials(employee.name)}
                    </div>
                    <div className="employee-details">
                      <h3>{employee.name}</h3>
                      <p>{employee.position}</p>
                      <p>{employee.department}</p>
                      <p>{employee.email}</p>
                      <p>{employee.phone}</p>
                    </div>
                  </div>
                  <div className={`employee-status status-${employee.status}`}>
                    {employee.status.toUpperCase()}
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