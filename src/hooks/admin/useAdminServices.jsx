import { useApiMutation } from '../shared/useApiMutation'
import { useApiQuery } from '../shared/useApiQuery'

export const useGetEmployees = (enabled = true) => {
  return useApiQuery(
    ['employees'],
    'api/admin/v1/fetch-active-employees',
    {
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}
