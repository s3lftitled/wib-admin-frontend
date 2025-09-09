import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../../utils/apiClient'

export const useApiMutation = (method = 'post', configFn, options = {}) => {
  return useMutation({
    mutationFn: (params) => {
      const { endpoint, data } = configFn(params)
      return apiClient[method.toLowerCase()](endpoint, data)
    },
    ...options,
  })
}
