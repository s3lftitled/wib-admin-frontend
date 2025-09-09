import React from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../utils/apiClient'
import useAuth from './useAuth'

export const useApiClientSetup = () => {
  const { auth, setAuth } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  React.useEffect(() => {
    apiClient.configure({
      getToken: () => auth?.accessToken,

      refreshToken: async () => {
        const response = await axios.post('/token/api/refresh', {}, {
          withCredentials: true,
        })

        if (!response.ok) {
          throw new Error('Token refresh failed')
        }

        const data = await response.json()
        const newToken = data.newAccessToken

        setAuth((prev) => ({
          ...prev,
          accessToken: newToken,
        }))

        return newToken
      },

      onAuthFailure: (error) => {
        console.error('Authentication failed:', error)
        setAuth(null)
        queryClient.clear()
        navigate('/login')
      },
    })
  }, [auth, setAuth, queryClient, navigate])
}
