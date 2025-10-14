import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import useUserProfile from '../../hooks/user/useUserProfile'
import { 
  useGetLeaveRequests, 
  useAddHoliday,
  useFetchHoliday  // ✅ Added missing import
} from '../../hooks/admin/useAdminServices'

const Dashboard = () => {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
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
  
  const { userProfile } = useUserProfile()

  // API Hooks
  const { data: leaveRequestsData, isLoading: isLoadingLeaveRequests, error: leaveRequestsError, refetch } = useGetLeaveRequests(true, currentPage, pageSize)
  
  // ✅ Holiday API hooks - properly implemented
  const { mutateAsync: createHoliday, isLoading: isCreatingHoliday } = useAddHoliday()
  const { data: holidaysData, isLoading: isLoadingHolidays, error: holidaysError, refetch: refetchHolidays } = useFetchHoliday(true, currentDate.getFullYear(), newHoliday.type)

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
    setSelectedDate(date);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddingHoliday(false);
    setNewHoliday({ name: '', description: '', date: '', type: 'public' });
  }

  const closeWelcome = () => {
    setIsWelcomeVisible(false);
  }

  const handleAddHoliday = () => {
    setIsAddingHoliday(true);
    // Set the selected date as default date for new holiday
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setNewHoliday(prev => ({ ...prev, date: dateString }));
    }
  }

  // ✅ Fixed to match API structure
  const handleSaveHoliday = async () => {
    if (newHoliday.name && newHoliday.date) {
      try {
        await createHoliday({
          name: newHoliday.name,
          holidate: newHoliday.date, // ✅ Using 'holidate' to match API
          description: newHoliday.description,
          type: newHoliday.type,
          createdBy: userProfile?._id || userProfile?.id
        });
        
        // Refetch holidays to get updated list
        await refetchHolidays();
        
        // Reset form
        setIsAddingHoliday(false);
        setNewHoliday({ name: '', description: '', date: '', type: 'public' });
        
        // Show success message (optional)
        alert('Holiday created successfully!');
        
      } catch (error) {
        console.error('Error creating holiday:', error);
        alert('Failed to create holiday. Please try again.');
      }
    } else {
      alert('Please fill in the holiday name and date.');
    }
  }

  const handleCancelAddHoliday = () => {
    setIsAddingHoliday(false);
    setNewHoliday({ name: '', description: '', date: '', type: 'public' });
  }

  // ✅ Note: Delete functionality would need a new API endpoint
  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        // ✅ This would require implementing a delete holiday API endpoint
        console.log('Delete holiday functionality needs to be implemented in the backend');
        alert('Delete functionality is not yet implemented in the backend.');
        
      } catch (error) {
        console.error('Error deleting holiday:', error);
        alert('Failed to delete holiday. Please try again.');
      }
    }
  }

  // ✅ Fixed to use correct data structure
  const getHolidaysForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return holidaysData?.holidays?.filter(holiday => {
      const holidayDate = new Date(holiday.holidate || holiday.date).toISOString().split('T')[0];
      return holidayDate === dateString;
    }) || [];
  }

  const isHoliday = (date) => {
    return getHolidaysForDate(date).length > 0;
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (leaveRequestsData?.pagination?.totalPages || 1)) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value)
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending'
      case 'approved':
        return 'status-approved'
      case 'rejected':
      case 'declined': // ✅ Added declined status
        return 'status-rejected'
      default:
        return 'status-default'
    }
  }

  // Format date for display
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
      const cells = [];

      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDay) {
          const prevDate = daysInPrevMonth - firstDay + day + 1;
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

          cells.push(
            <td
              key={`current-${date}`}
              className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasHoliday ? 'holiday' : ''}`}
              onClick={() => selectDate(currentDateObj)}
            >
              <div className="day-number">{date}</div>
              {hasHoliday && <div className="holiday-indicator">🎉</div>}
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
    }, 20000);
    return () => clearTimeout(timer)
  }, [])

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
                      <div key={request.id || request._id} className="leave-request-item">
                        <div className="request-info">
                          <div className="request-header">
                            <h4>{request.employeeName}</h4>
                            <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="request-details">
                            <p><strong>Email:</strong> {request.employeeEmail}</p>
                            <p><strong>Type:</strong> {request.leaveType}</p>
                            <p><strong>Category:</strong> {request.leaveCategory}</p>
                            <p><strong>From:</strong> {formatDate(request.startDate)}</p>
                            <p><strong>To:</strong> {formatDate(request.endDate)}</p>
                            <p><strong>Days:</strong> {request.numberOfDays}</p>
                            {request.daysApproved && (
                              <p><strong>Days Approved:</strong> {request.daysApproved}</p>
                            )}
                            {request.reason && (
                              <p><strong>Reason:</strong> {request.reason}</p>
                            )}
                            {request.declineReason && (
                              <p><strong>Decline Reason:</strong> {request.declineReason}</p>
                            )}
                            <p><strong>Requested:</strong> {formatDate(request.createdAt)}</p>
                          </div>
                        </div>
                        <div className="request-actions">
                          {request.status === 'PENDING' && (
                            <>
                              <button className="approve-btn">Approve</button>
                              <button className="reject-btn">Reject</button>
                            </>
                          )}
                          <button className="view-details-btn">View Details</button>
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

      {isModalOpen && (
        <div className="modal-overlay-dashboard" onClick={closeModal}>
          <div className="modal-content-dashboard" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="modal-info">
                <h3>Date: {selectedDate?.toLocaleDateString()}</h3>
                <p>Calendar content time in and out of employee functionality will be implemented here...</p>
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
                      <div key={holiday.id || holiday._id} className="holiday-item">
                        <div className="holiday-info">
                          <h5>{holiday.name}</h5>
                          <p>{holiday.description}</p>
                          <small>Type: {holiday.type}</small>
                        </div>
                        <button 
                          className="delete-holiday-btn"
                          onClick={() => handleDeleteHoliday(holiday.id || holiday._id)}
                          title="Delete Holiday"
                        > 🗑️</button>
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
              </div>
            </div>

            {/* Add Holiday Button - Bottom Right */}
            <div className="modal-actions">
              {!isAddingHoliday && (
                <button className="add-holiday-btn" onClick={handleAddHoliday}> Add Holiday </button>
              )}
            </div>

            <button className="modal-close-dashboard" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard