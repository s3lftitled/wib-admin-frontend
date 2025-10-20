import { useApiMutation } from '../shared/useApiMutation'
import { useApiQuery } from '../shared/useApiQuery'

export const useGetEmployees = (enabled = true) => {
  return useApiQuery(
    ['employees'],
    '/api/admin/v1/fetch-active-employees',
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )
}

export const useGetLeaveRequests = (enabled = true, page = 1, pageSize = 10) => {
  return useApiQuery(
    ['allLeaveRequests', page, pageSize],
    `/api/admin/v1/fetch-leave-requests?page=${page}&pageSize=${pageSize}`, 
    {
      enabled,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000, 
      keepPreviousData: true, 
    }
  )
}

export const useCreateDepartment = (enabled = true) => {
  return useApiMutation(
    'post',
    ({ departmentName, createdBy}) => ({
      endpoint: `/api/admin/v1/create-new-department/${createdBy}`,
      data: { departmentName }
    }),
  )
}

export const useFetchDepartments = (enabled = true) => {
  return useApiQuery(
    ['departments'],
    '/api/admin/v1/fetch-departments',
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )
}

export const useAddHoliday = () => {
  return useApiMutation(
    'post',
    ({ name, holidate, description, type, createdBy }) => ({
      endpoint: `/api/admin/v1/add-holiday/${createdBy}`,
      data: { name, holidate, description, type }
    }),
  )
}

export const useFetchHoliday = (enabled = true, year, type) => {
  return useApiQuery(
    ['holidays', 'count', year, type],
    `/api/admin/v1/fetch-all-holidays?year=${year}&type=${type}`,
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )
}

// New hooks for schedule management
export const useCreateScheduleSlot = () => {
  return useApiMutation(
    'post',
    ({ date, startTime, endTime, adminUserId }) => ({
      endpoint: `/api/admin/v1/add-schedule-slot/${adminUserId}`,
      data: { date, startTime, endTime }
    }),
  )
}

export const useAssignEmployeeToSchedule = () => {
  return useApiMutation(
    'post',
    ({ scheduleId, employeeId }) => ({
      endpoint: `/api/admin/v1/assign-employee-schedule/${scheduleId}/${employeeId}`,
      data: {}
    }),
  )
}

export const useFetchScheduleSlots = (enabled = true, month, year) => {
  return useApiQuery(
    ['scheduleSlots', month, year],
    `/api/admin/v1/fetch-schedule-slots?month=${month}&year=${year}`,
    {
      enabled: enabled && !!month && !!year,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  )
}

export const useChangeAssignedEmployee = () => {
  return useApiMutation(
    'put',
    ({ scheduleId, employeeId }) => ({
      endpoint: `/api/admin/v1/change-assigned-employee/${scheduleId}/${employeeId}`,
      data: {}
    }),
  )
}

export const useDeleteScheduleSlot = () => {
  return useApiMutation(
    'delete',
    ({ scheduleId }) => ({
      endpoint: `/api/admin/v1/delete/schedule-slot/${scheduleId}`,
      data: {}
    }),
  )
}