import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../utils/apiClient'
import useAuth from './useAuth'

export const useApiClientSetup = () => {
  const { auth, setAuth } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isInitialized, setIsInitialized] = useState(false)

  const refreshTokenFunction = async () => {
    try {
      const response = await apiClient.post('/api/token/refresh', {}, {
        withCredentials: true,
      })

      const newToken = response.accessToken

      setAuth((prev) => ({
        ...prev,
        accessToken: newToken,
      }))

      return newToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }

  const onAuthFailure = (error) => {
    console.error('Authentication failed:', error)
    setAuth(null)
    queryClient.clear()
    navigate('/authentication')
  }

  // Initialize apiClient on mount and when auth changes
  useEffect(() => {
    apiClient.configure({
      getToken: () => auth?.accessToken,
      refreshToken: refreshTokenFunction,
      onAuthFailure,
    })

    // Auto-refresh logic similar to PersistLogin
    const initializeAuth = async () => {
      try {
        // If no access token, try to refresh
        if (!auth?.accessToken) {
          await refreshTokenFunction()
        }
      } catch (error) {
        onAuthFailure(error)
      } finally {
        setIsInitialized(true)
      }
    }

    // Only run initialization once on mount
    if (!isInitialized) {
      initializeAuth()
    } else {
      // If already initialized and auth changes, just reconfigure
      setIsInitialized(true)
    }
  }, [auth?.accessToken]) // Only depend on accessToken to avoid infinite loops

  return {
    isInitialized,
    apiClient
  }
}