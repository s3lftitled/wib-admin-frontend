import Sidebar from '../../components/Sidebar/Sidebar'
import { useGetEmployees } from '../../hooks/admin/useAdminServices'
import './EmployeesList.css'
import { useState, useEffect } from 'react'

const EmployeesList = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editingTotalLeaves, setEditingTotalLeaves] = useState(false)
  const [newTotalLeaves, setNewTotalLeaves] = useState('')
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'success', 'error'
  const [employeeLeaves, setEmployeeLeaves] = useState({}) // Store custom leave allocations
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('')
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('')

  const { data, isLoading, error, refetch } = useGetEmployees()

  const employeesArray = Array.isArray(data?.employees) ? data.employees : []

  const filteredEmployees = employeesArray.filter(employee => {
    const matchesSearch =
      !searchTerm ||
      employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
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
        } else if (isLeaveModalOpen) {
          setIsLeaveModalOpen(false)
        } else if (isSidebarActive) {
          setSidebarActive(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSidebarActive, isModalOpen, isLeaveModalOpen])

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

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee)
    setIsLeaveModalOpen(true)
    setEditingTotalLeaves(false)
    setSaveStatus('')
  }

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false)
    setSelectedEmployee(null)
    setEditingTotalLeaves(false)
    setSaveStatus('')
  }

  const handleLeaveModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLeaveModal()
    }
  }

  const handleEditTotalLeaves = () => {
    setEditingTotalLeaves(true)
  }

  const handleCancelEdit = () => {
    if (selectedEmployee) {
      setNewTotalLeaves(getEmployeeLeaveData(selectedEmployee).totalLeaves.toString())
    }
    setEditingTotalLeaves(false)
    setSaveStatus('')
  }

  const handleSaveTotalLeaves = () => {
    if (!newTotalLeaves || isNaN(newTotalLeaves) || parseInt(newTotalLeaves) < 0) {
      setSaveStatus('error')
      return
    }

    setSaveStatus('saving')

    setTimeout(() => {
      const total = parseInt(newTotalLeaves)
      setEmployeeLeaves(prev => ({
        ...prev,
        [selectedEmployee.id]: total
      }))

      setSaveStatus('success')

      setTimeout(() => {
        setEditingTotalLeaves(false)
        setSaveStatus('')
      }, 1500)
    }, 1000)
  }

  const handleTotalLeavesChange = (e) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setNewTotalLeaves(value)
    }
  }

  // 🟢 Safe: handles null employee
  const getEmployeeLeaveData = (employee) => {
    if (!employee) {
      return {
        totalLeaves: 0,
        usedLeaves: 0,
        remainingLeaves: 0,
        leaveHistory: []
      }
    }

    const totalLeaves = employeeLeaves[employee.id] || 20

    return {
      totalLeaves,
      usedLeaves: employee.id % 2 === 0 ? 8 : 12,
      remainingLeaves: totalLeaves - (employee.id % 2 === 0 ? 8 : 12),
      leaveHistory: [
        { type: 'Annual Leave', startDate: '2024-05-15', endDate: '2024-05-19', days: 5, status: 'Approved' },
        { type: 'Sick Leave', startDate: '2024-08-10', endDate: '2024-08-11', days: 2, status: 'Approved' },
        { type: 'Personal Leave', startDate: '2024-10-05', endDate: '2024-10-06', days: 2, status: 'Pending' },
      ]
    }
  }

  // 🟢 Initialize newTotalLeaves when employee changes
  useEffect(() => {
    if (selectedEmployee) {
      setNewTotalLeaves(getEmployeeLeaveData(selectedEmployee).totalLeaves.toString())
    }
  }, [selectedEmployee])

  const handleAddEmployeeSubmit = () => {
    // For now, just log the values and close modal
    console.log('New Employee:', { name: newEmployeeName, email: newEmployeeEmail, department: newEmployeeDepartment })
    setIsModalOpen(false)
    // Reset states
    setNewEmployeeName('')
    setNewEmployeeEmail('')
    setNewEmployeeDepartment('')
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
              > + Add Employee </button>
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
                  : 'No employees match your search or filter criteria'}
              </p>
            </div>
          ) : (
            <div className="employees-grid">
              {filteredEmployees.map((employee) => {
                const leaveData = getEmployeeLeaveData(employee)
                return (
                  <div
                    key={employee?.id || Math.random()}
                    className="employee-card"
                    onClick={() => handleEmployeeClick(employee)}
                  >
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
                    <div className="employee-footer">
                      <div className={`employee-status ${employee?.isActive ? 'status-active' : 'status-inactive'}`}>
                        {employee?.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="leave-badge">
                        {leaveData.usedLeaves}/{leaveData.totalLeaves} leaves used
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Add Employee Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
              <h2 id="modal-title" className="modal-title">
                Add New Employee
              </h2>
              <p className="modal-subtitle">
                Fill in the details below to add a new team member
              </p>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="new-hired-employee">
                <div className="input-group" data-field="name">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    placeholder="Enter employee's full name"
                    required
                  />
                </div>

                <div className="input-group" data-field="email">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={newEmployeeEmail}
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    placeholder="Enter employee's email"
                    required
                  />
                </div>

                <div className="input-group" data-field="department">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={newEmployeeDepartment}
                    onChange={(e) => setNewEmployeeDepartment(e.target.value)}
                    placeholder="Enter department name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="add-employee-submit-btn"
                onClick={handleAddEmployeeSubmit}
                disabled={!newEmployeeName || !newEmployeeEmail || !newEmployeeDepartment}
                type="submit"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Leave Modal */}
      {isLeaveModalOpen && selectedEmployee && (
        <div
          className="modal-overlay"
          onClick={handleLeaveModalOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-modal-title"
        >
          <div className="modal-content leave-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeLeaveModal}
              aria-label="Close leave modal"
            >
              ×
            </button>

            <div className="leave-modal-header">
              <div className="employee-modal-avatar">
                {getInitials(selectedEmployee.name)}
              </div>
              <div>
                <h2 id="leave-modal-title">{selectedEmployee.name}'s Leave Information</h2>
                <p>{selectedEmployee.email} • {selectedEmployee.department || 'No department'}</p>
              </div>
            </div>

            <div className="leave-stats">
              <div className="stat-card">
                <h3>Total Leaves</h3>
                {editingTotalLeaves ? (
                  <div className="edit-total-leaves">
                    <input
                      type="text"
                      value={newTotalLeaves}
                      onChange={handleTotalLeavesChange}
                      className="total-leaves-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={handleSaveTotalLeaves}
                        disabled={saveStatus === 'saving'}
                      >
                        {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                        disabled={saveStatus === 'saving'}
                      >
                        Cancel
                      </button>
                    </div>
                    {saveStatus === 'success' && (
                      <div className="save-status success">Saved successfully!</div>
                    )}
                    {saveStatus === 'error' && (
                      <div className="save-status error">Please enter a valid number</div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="stat-number">{getEmployeeLeaveData(selectedEmployee).totalLeaves}</div>
                    <button
                      className="edit-total-btn"
                      onClick={handleEditTotalLeaves}
                    >
                      Edit Total
                    </button>
                  </>
                )}
              </div>
              <div className="stat-card">
                <h3>Used Leaves</h3>
                <div className="stat-number used">{getEmployeeLeaveData(selectedEmployee).usedLeaves}</div>
              </div>
              <div className="stat-card">
                <h3>Remaining Leaves</h3>
                <div className="stat-number remaining">{getEmployeeLeaveData(selectedEmployee).remainingLeaves}</div>
              </div>
            </div>

            <div className="leave-history">
              <h3>Leave History</h3>
              {getEmployeeLeaveData(selectedEmployee).leaveHistory.length > 0 ? (
                <div className="leave-history-list">
                  {getEmployeeLeaveData(selectedEmployee).leaveHistory.map((leave, index) => (
                    <div key={index} className="leave-item">
                      <div className="leave-type">{leave.type}</div>
                      <div className="leave-dates">{leave.startDate} to {leave.endDate}</div>
                      <div className="leave-days">{leave.days} day{leave.days !== 1 ? 's' : ''}</div>
                      <div className={`leave-status ${leave.status.toLowerCase()}`}>{leave.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-leaves">No leave records found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EmployeesList
