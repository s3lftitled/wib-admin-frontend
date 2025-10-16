import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import useUserProfile from '../../hooks/user/useUserProfile'
import { useGetLeaveRequests } from '../../hooks/admin/useAdminServices'

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

  const [holidays, setHolidays] = useState([
    { id: 1, date: '2025-01-01', name: 'New Year\'s Day', description: 'New Year celebration' },
    { id: 2, date: '2025-12-25', name: 'Christmas Day', description: 'Christmas celebration' },
    { id: 3, date: '2025-07-04', name: 'Independence Day', description: 'National holiday' }
  ])
  const [isAddingHoliday, setIsAddingHoliday] = useState(false)
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    description: '',
    date: ''
  })

  const { userProfile } = useUserProfile()
  // Fetch leave requests with pagination
  const { data: leaveRequestsData, isLoading: isLoadingLeaveRequests, error: leaveRequestsError, refetch } = useGetLeaveRequests(true, currentPage, pageSize)

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

  const selectLeaveRequest = (request) => {
    setSelectedLeaveRequest(request);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedLeaveRequest(null);
    setIsAddingHoliday(false);
    setNewHoliday({ name: '', description: '', date: '' });
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

  const handleSaveHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const holiday = {
        id: Date.now(),
        name: newHoliday.name,
        description: newHoliday.description,
        date: newHoliday.date
      };
      setHolidays(prev => [...prev, holiday]);
      setIsAddingHoliday(false);
      setNewHoliday({ name: '', description: '', date: '' });
    }
  }

  const handleCancelAddHoliday = () => {
    setIsAddingHoliday(false);
    setNewHoliday({ name: '', description: '', date: '' });
  }

  const handleDeleteHoliday = (holidayId) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
  }

  const getHolidaysForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return holidays.filter(holiday => holiday.date === dateString);
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
              <tbody id="calendarBody">{renderCalendar()}</tbody>
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
                      <div key={request._id} className="leave-request-item" onClick={() => selectLeaveRequest(request)} style={{ cursor: 'pointer' }}>
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

      {isModalOpen && (
        <div className="modal-overlay-dashboard" onClick={closeModal}>
          <div className="modal-content-dashboard" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              {selectedLeaveRequest ? (
                <div className="modal-info">
                  <div className="request-header-section">
                    <h3>Leave Request Details</h3>
                    <span className={`status-badge ${getStatusBadgeClass(selectedLeaveRequest.status)}`}>
                      {selectedLeaveRequest.status}
                    </span>
                  </div>

                  <div className="request-details-grid">
                    {/* Employee Information Section */}
                    <div className="detail-section">
                      <h4 className="section-title">Employee Information</h4>
                      <div className="detail-group">
                        <div className="detail-item">
                          <span className="detail-label">👤 Employee:</span>
                          <span className="detail-value">{selectedLeaveRequest.employeeName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📧 Email:</span>
                          <span className="detail-value">{selectedLeaveRequest.employeeEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Leave Details Section */}
                    <div className="detail-section">
                      <h4 className="section-title">Leave Details</h4>
                      <div className="detail-group">
                        <div className="detail-item">
                          <span className="detail-label">📋 Type:</span>
                          <span className="detail-value">{selectedLeaveRequest.leaveType}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">🏷️ Category:</span>
                          <span className="detail-value">{selectedLeaveRequest.leaveCategory}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📅 Duration:</span>
                          <span className="detail-value">
                            {formatDate(selectedLeaveRequest.startDate)} - {formatDate(selectedLeaveRequest.endDate)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">⏰ Days Requested:</span>
                          <span className="detail-value highlight-days">{selectedLeaveRequest.numberOfDays} days</span>
                        </div>
                        {selectedLeaveRequest.daysApproved && (
                          <div className="detail-item">
                            <span className="detail-label">✅ Days Approved:</span>
                            <span className="detail-value highlight-approved">{selectedLeaveRequest.daysApproved} days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="detail-section full-width">
                      <h4 className="section-title">Additional Information</h4>
                      <div className="detail-group">
                        {selectedLeaveRequest.reason && (
                          <div className="detail-item reason-item">
                            <span className="detail-label">Reason:</span>
                            <div className="reason-text">{selectedLeaveRequest.reason}</div>
                          </div>
                        )}
                        {selectedLeaveRequest.declineReason && (
                          <div className="detail-item decline-item">
                            <span className="detail-label">❌ Decline Reason:</span>
                            <div className="decline-text">{selectedLeaveRequest.declineReason}</div>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">📝 Requested On:</span>
                          <span className="detail-value">{formatDate(selectedLeaveRequest.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedLeaveRequest.status === 'PENDING' && (
                    <div className="request-actions-enhanced">
                      <button className="approve-btn enhanced-btn">
                        <span>✓</span> Approve Request
                      </button>
                      <button className="reject-btn enhanced-btn">
                        <span>✕</span> Reject Request
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="modal-info">
                    <h3>Date: {selectedDate?.toLocaleDateString()}</h3>
                    <p>Calendar content time in and out of employee functionality will be implemented here...</p>
                  </div>

                  {/* Holiday Management Container */}
                  <div className="holiday-container">
                    <h4>Holidays for this date</h4>
                    <div className="holiday-list">
                      {getHolidaysForDate(selectedDate || new Date()).length > 0 ? (
                        getHolidaysForDate(selectedDate || new Date()).map(holiday => (
                          <div key={holiday.id} className="holiday-item">
                            <div className="holiday-info">
                              <h5>{holiday.name}</h5>
                              <p>{holiday.description}</p>
                            </div>
                            <button
                              className="delete-holiday-btn"
                              onClick={() => handleDeleteHoliday(holiday.id)}
                              title="Delete Holiday"> 🗑️</button>
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
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                          className="holiday-input"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newHoliday.description}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
                          className="holiday-input"
                        />
                        <input
                          type="date"
                          value={newHoliday.date}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                          className="holiday-input"
                        />
                        <div className="form-buttons">
                          <button className="save-btn" onClick={handleSaveHoliday}>Save</button>
                          <button className="cancel-btn" onClick={handleCancelAddHoliday}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Add Holiday Button - Bottom Right */}
            {!selectedLeaveRequest && (
              <div className="modal-actions">
                {!isAddingHoliday && (
                  <button className="add-holiday-btn" onClick={handleAddHoliday}> Add Holiday </button>
                )}
              </div>
            )}

            <button className="modal-close-dashboard" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default Dashboard