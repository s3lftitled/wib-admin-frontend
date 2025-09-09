import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../utils/apiClient'

export const useApiQuery = (key, endpoint, options = {}) => {
  const { params, ...queryOptions } = options
  
  return useQuery({
    queryKey: key,
    queryFn: () => apiClient.get(endpoint, { params }),
    ...queryOptions,
  })
}