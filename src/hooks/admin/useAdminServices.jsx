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
