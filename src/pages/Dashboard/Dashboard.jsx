import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import useUserProfile from '../../hooks/user/useUserProfile'
import { 
  useGetLeaveRequests, 
  useAddHoliday,
  useFetchHoliday,
  useGetEmployees,
  useCreateScheduleSlot,
  useAssignEmployeeToSchedule,
  useFetchScheduleSlots,
  useChangeAssignedEmployee,
  useDeleteScheduleSlot,
} from '../../hooks/admin/useAdminServices'

const Dashboard = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null)
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true)
  
  // Pagination state for leave requests
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Holiday state
  const [isAddingHoliday, setIsAddingHoliday] = useState(false)
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    description: '',
    date: '',
    type: 'public'
  })

  // Schedule slot state
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    startTime: '',
    endTime: ''
  })
  const [createdScheduleId, setCreatedScheduleId] = useState(null)
  const [isAssigningEmployee, setIsAssigningEmployee] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [assigningScheduleId, setAssigningScheduleId] = useState(null)
  const [isChangingEmployee, setIsChangingEmployee] = useState(false)
  const [changingScheduleId, setChangingScheduleId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingScheduleId, setDeletingScheduleId] = useState(null)
  
  const { userProfile } = useUserProfile()

  // API Hooks
  const { data: leaveRequestsData, isLoading: isLoadingLeaveRequests, error: leaveRequestsError, refetch } = useGetLeaveRequests(true, currentPage, pageSize)
  
  // Holiday API hooks
  const { mutateAsync: createHoliday, isLoading: isCreatingHoliday } = useAddHoliday()
  const { data: holidaysData, isLoading: isLoadingHolidays, error: holidaysError, refetch: refetchHolidays } = useFetchHoliday(true, currentDate.getFullYear(), newHoliday.type)

  // Schedule and Employee API hooks
  const { data: employeesData, isLoading: isLoadingEmployees, error: employeesError } = useGetEmployees(true)
  const { mutateAsync: createScheduleSlot, isLoading: isCreatingScheduleSlot } = useCreateScheduleSlot()
  const { mutateAsync: assignEmployeeToSchedule, isLoading: isAssigningEmployeeToSchedule } = useAssignEmployeeToSchedule()
  const { mutateAsync: changeAssignedEmployee, isLoading: isChangingAssignedEmployee } = useChangeAssignedEmployee()
  const { mutateAsync: deleteScheduleSlot, isLoading: isDeletingSchedule } = useDeleteScheduleSlot()
  const { data: scheduleSlotsData, isLoading: isLoadingSchedules, error: schedulesError, refetch: refetchSchedules } = useFetchScheduleSlots(
    true, 
    currentDate.getMonth() + 1, 
    currentDate.getFullYear()
  )

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
    setSelectedDate(date)
    setSelectedLeaveRequest(null)
    setIsModalOpen(true)
    
    // Pre-fill schedule date
    const dateString = date.toISOString().split('T')[0]
    setNewSchedule(prev => ({ ...prev, date: dateString }))
  }

  const selectLeaveRequest = (request) => {
    setSelectedLeaveRequest(request)
    setSelectedDate(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
    setSelectedLeaveRequest(null)
    setIsAddingHoliday(false)
    setNewHoliday({ name: '', description: '', date: '', type: 'public' })
    setIsCreatingSchedule(false)
    setNewSchedule({ date: '', startTime: '', endTime: '' })
    setCreatedScheduleId(null)
    setIsAssigningEmployee(false)
    setSelectedEmployeeId('')
    setAssigningScheduleId(null)
    setIsChangingEmployee(false)
    setChangingScheduleId(null)
    setIsDeleteModalOpen(false)
    setDeletingScheduleId(null)
  }

  const closeWelcome = () => {
    setIsWelcomeVisible(false)
  }

  const handleAddHoliday = () => {
    setIsAddingHoliday(true)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      setNewHoliday(prev => ({ ...prev, date: dateString }))
    }
  }

  const handleSaveHoliday = async () => {
    if (newHoliday.name && newHoliday.date) {
      try {
        await createHoliday({
          name: newHoliday.name,
          holidate: newHoliday.date,
          description: newHoliday.description,
          type: newHoliday.type,
          createdBy: userProfile?._id || userProfile?.id
        })
        
        await refetchHolidays()
        
        setIsAddingHoliday(false)
        setNewHoliday({ name: '', description: '', date: '', type: 'public' })
        
        alert('Holiday created successfully!')
        
      } catch (error) {
        console.error('Error creating holiday:', error)
        alert('Failed to create holiday. Please try again.')
      }
    } else {
      alert('Please fill in the holiday name and date.')
    }
  }

  const handleCancelAddHoliday = () => {
    setIsAddingHoliday(false)
    setNewHoliday({ name: '', description: '', date: '', type: 'public' })
  }

  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        console.log('Delete holiday functionality needs to be implemented in the backend')
        alert('Delete functionality is not yet implemented in the backend.')
        
      } catch (error) {
        console.error('Error deleting holiday:', error)
        alert('Failed to delete holiday. Please try again.')
      }
    }
  }

  // Schedule slot handlers
  const handleCreateSchedule = () => {
    setIsCreatingSchedule(true)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      setNewSchedule(prev => ({ ...prev, date: dateString }))
    }
  }

  const handleSaveSchedule = async () => {
    if (newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
      try {
        const result = await createScheduleSlot({
          date: newSchedule.date,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
          adminUserId: userProfile?._id || userProfile?.id
        })
        
        setCreatedScheduleId(result.schedule.id)
        setIsCreatingSchedule(false)
        
        // Refetch schedules to update the list
        await refetchSchedules()
        
        alert('Schedule slot created successfully! You can now assign an employee.')
        
      } catch (error) {
        console.error('Error creating schedule slot:', error)
        alert(error.message || 'Failed to create schedule slot. Please try again.')
      }
    } else {
      alert('Please fill in all schedule fields.')
    }
  }

  const handleCancelCreateSchedule = () => {
    setIsCreatingSchedule(false)
    setNewSchedule({ date: '', startTime: '', endTime: '' })
  }

  const handleAssignEmployee = (scheduleId) => {
    setAssigningScheduleId(scheduleId)
    setIsAssigningEmployee(true)
    setSelectedEmployeeId('')
  }

  const handleSaveAssignment = async () => {
    if (selectedEmployeeId && assigningScheduleId) {
      try {
        await assignEmployeeToSchedule({
          scheduleId: assigningScheduleId,
          employeeId: selectedEmployeeId
        })
        
        // Refetch schedules to show the assigned employee
        await refetchSchedules()
        
        alert('Employee assigned to schedule successfully!')
        
        // Reset state
        setIsAssigningEmployee(false)
        setSelectedEmployeeId('')
        setAssigningScheduleId(null)
        
      } catch (error) {
        console.error('Error assigning employee:', error)
        alert(error.message || 'Failed to assign employee. Please try again.')
      }
    } else {
      alert('Please select an employee.')
    }
  }

  const handleCancelAssignment = () => {
    setIsAssigningEmployee(false)
    setSelectedEmployeeId('')
    setAssigningScheduleId(null)
  }

  // Change employee handlers
  const handleChangeEmployee = (scheduleId, currentEmployeeId) => {
    setChangingScheduleId(scheduleId)
    setIsChangingEmployee(true)
    setSelectedEmployeeId(currentEmployeeId)
  }

  const handleSaveEmployeeChange = async () => {
    if (selectedEmployeeId && changingScheduleId) {
      try {
        await changeAssignedEmployee({
          scheduleId: changingScheduleId,
          employeeId: selectedEmployeeId
        })
        
        await refetchSchedules()
        
        alert('Employee changed successfully!')
        
        setIsChangingEmployee(false)
        setSelectedEmployeeId('')
        setChangingScheduleId(null)
        
      } catch (error) {
        console.error('Error changing employee:', error)
        alert(error.message || 'Failed to change employee. Please try again.')
      }
    } else {
      alert('Please select an employee.')
    }
  }

  const handleCancelEmployeeChange = () => {
    setIsChangingEmployee(false)
    setSelectedEmployeeId('')
    setChangingScheduleId(null)
  }

  // Delete schedule handlers
  const handleDeleteSchedule = (scheduleId) => {
    setDeletingScheduleId(scheduleId)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteSchedule = async () => {
    if (deletingScheduleId) {
      try {
        await deleteScheduleSlot({
          scheduleId: deletingScheduleId
        })
        
        await refetchSchedules()
        
        alert('Schedule slot deleted successfully!')
        
        setIsDeleteModalOpen(false)
        setDeletingScheduleId(null)
        
      } catch (error) {
        console.error('Error deleting schedule:', error)
        alert(error.message || 'Failed to delete schedule. Please try again.')
      }
    }
  }

  const cancelDeleteSchedule = () => {
    setIsDeleteModalOpen(false)
    setDeletingScheduleId(null)
  }

  const getHolidaysForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return holidaysData?.holidays?.filter(holiday => {
      const holidayDate = new Date(holiday.holidate || holiday.date).toISOString().split('T')[0]
      return holidayDate === dateString
    }) || []
  }

  const getScheduleSlotsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return scheduleSlotsData?.schedules?.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0]
      return scheduleDate === dateString
    }) || []
  }

  const isHoliday = (date) => {
    return getHolidaysForDate(date).length > 0
  }

  const hasSchedule = (date) => {
    return getScheduleSlotsForDate(date).length > 0
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (leaveRequestsData?.pagination?.totalPages || 1)) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value)
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending'
      case 'approved':
        return 'status-approved'
      case 'rejected':
      case 'declined':
        return 'status-rejected'
      default:
        return 'status-default'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    let date = 1
    let nextMonthDate = 1
    const rows = []

    for (let week = 0; week < 6; week++) {
      const cells = []

      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDay) {
          const prevDate = daysInPrevMonth - firstDay + day + 1
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
          const hasHoliday = isHoliday(currentDateObj)
          const hasScheduleSlot = hasSchedule(currentDateObj)

          cells.push(
            <td
              key={`current-${date}`}
              className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasHoliday ? 'holiday' : ''} ${hasScheduleSlot ? 'has-schedule' : ''}`}
              onClick={() => selectDate(currentDateObj)}
            >
              <div className="day-number">{date}</div>
              {hasHoliday && <div className="holiday-indicator">🎉</div>}
              {hasScheduleSlot && <div className="schedule-indicator">📅</div>}
            </td>
          )
          date++
        }
      }

      rows.push(<tr key={week}>{cells}</tr>)
    }

    return rows
  }

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSidebarActive])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeVisible(false)
    }, 20000)
    return () => clearTimeout(timer)
  }, [])

  // Refetch schedules when month/year changes
  useEffect(() => {
    if (currentDate) {
      refetchSchedules()
    }
  }, [currentDate.getMonth(), currentDate.getFullYear()])

  return (
    <div className="dashboard">

      <Sidebar isSidebarActive={isSidebarActive} toggleSidebar={toggleSidebar} />

      <div className="dashboard-grid">

        {/* Welcome Section */}
        {isWelcomeVisible && (
          <div className="welcome-section">
            <button className="welcome-close" onClick={closeWelcome}>×</button>
            <div className="welcome-header">
              <h1>Welcome Back, {userProfile?.name}</h1>
              <p>
                Your dashboard is the central hub for managing your account and your employee.
                Here you can track their progress, view important notifications, and access key features.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="main-content">
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
              <tbody id="calendarBody">
                {isLoadingHolidays ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading holidays...</td></tr>
                ) : (
                  renderCalendar()
                )}
              </tbody>
            </table>
          </div>

          {/* Request Leave Section */}
          <div className="request-leave">
            <div className="request-leave-header-container">
              <h2 className="request-leave-header">Leave Requests</h2>
              <div className="pagination-controls">
                <select 
                  value={pageSize} 
                  onChange={handlePageSizeChange}
                  className="page-size-select"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
            
            <div className="request-leave-container">
              {isLoadingLeaveRequests ? (
                <div className="loading-container">
                  <p>Loading leave requests...</p>
                </div>
              ) : leaveRequestsError ? (
                <div className="error-container">
                  <p>Error loading leave requests: {leaveRequestsError.message}</p>
                  <button onClick={() => refetch()} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : leaveRequestsData?.leaves?.length > 0 ? (
                <>
                  <div className="leave-requests-list">
                    {leaveRequestsData.leaves.map((request) => (
                      <div 
                        key={request._id} 
                        className="leave-request-item" 
                        onClick={() => selectLeaveRequest(request)} 
                        style={{cursor: 'pointer'}}
                      >
                        <div className="request-info">
                          <div className="request-header">
                            <h4>{request.employeeName}</h4>
                            <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {leaveRequestsData.pagination && leaveRequestsData.pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      
                      <div className="pagination-info">
                        <span>
                          Page {leaveRequestsData.pagination.currentPage} of {leaveRequestsData.pagination.totalPages}
                        </span>
                        <span className="total-requests">
                          ({leaveRequestsData.pagination.totalRequests} total requests)
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === leaveRequestsData.pagination.totalPages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-requests">
                  <p>No leave requests found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay-dashboard" onClick={closeModal}>
          <div className="modal-content-dashboard" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              
              {/* Leave Request Details */}
              {selectedLeaveRequest ? (
                <div className="modal-info">
                  <h3>Leave Request Details</h3>
                  <div className="request-details">
                    <p><strong>Employee:</strong> {selectedLeaveRequest.employeeName}</p>
                    <p><strong>Email:</strong> {selectedLeaveRequest.employeeEmail}</p>
                    <p><strong>Type:</strong> {selectedLeaveRequest.leaveType}</p>
                    <p><strong>Category:</strong> {selectedLeaveRequest.leaveCategory}</p>
                    <p><strong>From:</strong> {formatDate(selectedLeaveRequest.startDate)}</p>
                    <p><strong>To:</strong> {formatDate(selectedLeaveRequest.endDate)}</p>
                    <p><strong>Days:</strong> {selectedLeaveRequest.numberOfDays}</p>
                    {selectedLeaveRequest.daysApproved && (
                      <p><strong>Days Approved:</strong> {selectedLeaveRequest.daysApproved}</p>
                    )}
                    {selectedLeaveRequest.reason && (
                      <p><strong>Reason:</strong> {selectedLeaveRequest.reason}</p>
                    )}
                    {selectedLeaveRequest.declineReason && (
                      <p><strong>Decline Reason:</strong> {selectedLeaveRequest.declineReason}</p>
                    )}
                    <p><strong>Requested:</strong> {formatDate(selectedLeaveRequest.createdAt)}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${getStatusBadgeClass(selectedLeaveRequest.status)}`}>{selectedLeaveRequest.status}</span></p>
                  </div>
                  <div className="request-actions">
                    {selectedLeaveRequest.status === 'PENDING' && (
                      <>
                        <button className="approve-btn">Approve</button>
                        <button className="reject-btn">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Calendar/Date Info */}
                  <div className="modal-info">
                    <h3>Date: {selectedDate?.toLocaleDateString()}</h3>
                    <p>Manage schedule slots and holidays for this date</p>
                  </div>

                  {/* Schedule Slot Management Container */}
                  <div className="schedule-container">
                    <h4>📅 Schedule Slots</h4>

                    {/* Display Existing Schedules for Selected Date */}
                    <div className="schedule-list">
                      {isLoadingSchedules ? (
                        <p className="loading-text">Loading schedules...</p>
                      ) : schedulesError ? (
                        <div className="error-container">
                          <p>Error loading schedules: {schedulesError.message}</p>
                          <button onClick={() => refetchSchedules()} className="retry-btn">
                            Retry
                          </button>
                        </div>
                      ) : getScheduleSlotsForDate(selectedDate || new Date()).length > 0 ? (
                        <>
                          <h5 className="schedule-list-title">Scheduled Slots for this Date:</h5>
                          {getScheduleSlotsForDate(selectedDate || new Date()).map(schedule => (
                            <div key={schedule.id} className="schedule-item">
                              <div className="schedule-header-row">
                                <div className="schedule-time">
                                  <span className="time-badge">
                                    ⏰ {new Date(schedule.startTime).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                    {' - '}
                                    {new Date(schedule.endTime).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                  </span>
                                </div>
                                <div className="schedule-actions-btns">
                                  {schedule.assignedEmployee && (
                                    <button 
                                      className="edit-schedule-btn"
                                      onClick={() => handleChangeEmployee(schedule.id, schedule.assignedEmployee.id)}
                                      title="Change Employee"
                                    >
                                      ✏️
                                    </button>
                                  )}
                                  <button 
                                    className="delete-schedule-btn"
                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                    title="Delete Schedule"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                              <div className="schedule-employee">
                                {schedule.assignedEmployee ? (
                                  <>
                                    {isChangingEmployee && changingScheduleId === schedule.id ? (
                                      <div className="assign-employee-form inline">
                                        <h6 className="change-employee-title">Change Assigned Employee</h6>
                                        {isLoadingEmployees ? (
                                          <p className="loading-text">Loading employees...</p>
                                        ) : employeesError ? (
                                          <div className="error-container">
                                            <p>Error loading employees: {employeesError.message}</p>
                                          </div>
                                        ) : (
                                          <>
                                            <select
                                              value={selectedEmployeeId}
                                              onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                              className="schedule-input compact"
                                              disabled={isChangingAssignedEmployee}
                                            >
                                              <option value="">Select an employee...</option>
                                              {employeesData?.employees?.map(employee => (
                                                <option key={employee._id || employee.id} value={employee._id || employee.id}>
                                                  {employee.name} - {employee.email}
                                                </option>
                                              ))}
                                            </select>
                                            <div className="inline-form-buttons">
                                              <button 
                                                className="save-btn compact" 
                                                onClick={handleSaveEmployeeChange}
                                                disabled={isChangingAssignedEmployee || !selectedEmployeeId}
                                              >
                                                {isChangingAssignedEmployee ? '...' : '✓'}
                                              </button>
                                              <button 
                                                className="cancel-btn compact" 
                                                onClick={handleCancelEmployeeChange}
                                                disabled={isChangingAssignedEmployee}
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="employee-info">
                                        <div className="employee-avatar">
                                          {schedule.assignedEmployee.displayImage ? (
                                            <img src={schedule.assignedEmployee.displayImage} alt={schedule.assignedEmployee.name} />
                                          ) : (
                                            <div className="avatar-placeholder">
                                              {schedule.assignedEmployee.name.charAt(0).toUpperCase()}
                                            </div>
                                          )}
                                        </div>
                                        <div className="employee-details">
                                          <p className="employee-name">👤 {schedule.assignedEmployee.name}</p>
                                          <p className="employee-email">✉️ {schedule.assignedEmployee.email}</p>
                                          <p className="employee-status">
                                            <span className={`status-dot ${schedule.assignedEmployee.isActive ? 'active' : 'inactive'}`}></span>
                                            {schedule.assignedEmployee.isActive ? 'Active' : 'Inactive'}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {isAssigningEmployee && assigningScheduleId === schedule.id ? (
                                      <div className="assign-employee-form inline">
                                        {isLoadingEmployees ? (
                                          <p className="loading-text">Loading employees...</p>
                                        ) : employeesError ? (
                                          <div className="error-container">
                                            <p>Error loading employees: {employeesError.message}</p>
                                          </div>
                                        ) : (
                                          <>
                                            <select
                                              value={selectedEmployeeId}
                                              onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                              className="schedule-input compact"
                                              disabled={isAssigningEmployeeToSchedule}
                                            >
                                              <option value="">Select an employee...</option>
                                              {employeesData?.employees?.map(employee => (
                                                <option key={employee._id || employee.id} value={employee._id || employee.id}>
                                                  {employee.name} - {employee.email}
                                                </option>
                                              ))}
                                            </select>
                                            <div className="inline-form-buttons">
                                              <button 
                                                className="save-btn compact" 
                                                onClick={handleSaveAssignment}
                                                disabled={isAssigningEmployeeToSchedule || !selectedEmployeeId}
                                              >
                                                {isAssigningEmployeeToSchedule ? '...' : '✓'}
                                              </button>
                                              <button 
                                                className="cancel-btn compact" 
                                                onClick={handleCancelAssignment}
                                                disabled={isAssigningEmployeeToSchedule}
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="no-assignment-container">
                                        <p className="no-assignment">⚠️ No employee assigned yet</p>
                                        <button 
                                          className="assign-employee-btn-inline" 
                                          onClick={() => handleAssignEmployee(schedule.id)}
                                        >
                                          👤 Assign Employee
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="no-schedules">📭 No schedule slots for this date</p>
                      )}
                    </div>

                    {/* Create Schedule Slot Form */}
                    {isCreatingSchedule && (
                      <div className="schedule-form">
                        <h5>Create New Schedule Slot</h5>
                        <input
                          type="date"
                          value={newSchedule.date}
                          onChange={(e) => setNewSchedule(prev => ({...prev, date: e.target.value}))}
                          className="schedule-input"
                          disabled={isCreatingScheduleSlot}
                        />
                        <div className="time-inputs">
                          <input
                            type="time"
                            value={newSchedule.startTime}
                            onChange={(e) => setNewSchedule(prev => ({...prev, startTime: e.target.value}))}
                            className="schedule-input"
                            placeholder="Start Time"
                            disabled={isCreatingScheduleSlot}
                          />
                          <span className="time-separator">to</span>
                          <input
                            type="time"
                            value={newSchedule.endTime}
                            onChange={(e) => setNewSchedule(prev => ({...prev, endTime: e.target.value}))}
                            className="schedule-input"
                            placeholder="End Time"
                            disabled={isCreatingScheduleSlot}
                          />
                        </div>
                        <div className="form-buttons">
                          <button 
                            className="save-btn" 
                            onClick={handleSaveSchedule}
                            disabled={isCreatingScheduleSlot}
                          >
                            {isCreatingScheduleSlot ? 'Creating...' : 'Create Slot'}
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={handleCancelCreateSchedule}
                            disabled={isCreatingScheduleSlot}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="schedule-actions">
                      {!isCreatingSchedule && !isAssigningEmployee && (
                        <button className="create-schedule-btn" onClick={handleCreateSchedule}>
                          ➕ Create Schedule Slot
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Holiday Management Container */}
                  <div className="holiday-container">
                    <h4>Holidays for this date</h4>
                    <div className="holiday-list">
                      {isLoadingHolidays ? (
                        <p>Loading holidays...</p>
                      ) : holidaysError ? (
                        <div className="error-container">
                          <p>Error loading holidays: {holidaysError.message}</p>
                          <button onClick={() => refetchHolidays()} className="retry-btn">
                            Retry
                          </button>
                        </div>
                      ) : getHolidaysForDate(selectedDate || new Date()).length > 0 ? (
                        getHolidaysForDate(selectedDate || new Date()).map(holiday => (
                          <div key={holiday._id || holiday.id} className="holiday-item">
                            <div className="holiday-info">
                              <h5>{holiday.name}</h5>
                              <p>{holiday.description}</p>
                              <small>Type: {holiday.type}</small>
                            </div>
                            <button 
                              className="delete-holiday-btn"
                              onClick={() => handleDeleteHoliday(holiday._id || holiday.id)}
                              title="Delete Holiday"
                            >
                              🗑️
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="no-holidays">No holidays on this date</p>
                      )}
                    </div>

                    {/* Add Holiday Form */}
                    {isAddingHoliday && (
                      <div className="add-holiday-form">
                        <h5>Add New Holiday</h5>
                        <input
                          type="text"
                          placeholder="Holiday name"
                          value={newHoliday.name}
                          onChange={(e) => setNewHoliday(prev => ({...prev, name: e.target.value}))}
                          className="holiday-input"
                          disabled={isCreatingHoliday}
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newHoliday.description}
                          onChange={(e) => setNewHoliday(prev => ({...prev, description: e.target.value}))}
                          className="holiday-input"
                          disabled={isCreatingHoliday}
                        />
                        <input
                          type="date"
                          value={newHoliday.date}
                          onChange={(e) => setNewHoliday(prev => ({...prev, date: e.target.value}))}
                          className="holiday-input"
                          disabled={isCreatingHoliday}
                        />
                        <select
                          value={newHoliday.type}
                          onChange={(e) => setNewHoliday(prev => ({...prev, type: e.target.value}))}
                          className="holiday-input"
                          disabled={isCreatingHoliday}
                        >
                          <option value="public">Public Holiday</option>
                          <option value="company">Company Holiday</option>
                          <option value="regional">Regional Holiday</option>
                        </select>
                        <div className="form-buttons">
                          <button 
                            className="save-btn" 
                            onClick={handleSaveHoliday}
                            disabled={isCreatingHoliday}
                          >
                            {isCreatingHoliday ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={handleCancelAddHoliday}
                            disabled={isCreatingHoliday}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Add Holiday Button */}
                    {!isAddingHoliday && (
                      <div className="modal-actions">
                        <button className="add-holiday-btn" onClick={handleAddHoliday}>
                          Add Holiday
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <button className="modal-close-dashboard" onClick={closeModal}>×</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay-dashboard delete-modal" onClick={cancelDeleteSchedule}>
          <div className="modal-content-dashboard delete-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon">🗑️</div>
              <h3>Delete Schedule Slot</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this schedule slot?</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="confirm-delete-btn" 
                onClick={confirmDeleteSchedule}
                disabled={isDeletingSchedule}
              >
                {isDeletingSchedule ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                className="cancel-delete-btn" 
                onClick={cancelDeleteSchedule}
                disabled={isDeletingSchedule}
              >
                Cancel
              </button>
            </div>
            <button className="modal-close-dashboard" onClick={cancelDeleteSchedule}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard