// utils/apiClient.js
import axios from 'axios'

class AuthError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}

class ApiClient {
  constructor(baseURL = 'http://localhost:5000') {
    this.axios = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.getToken = null
    this.refreshToken = null
    this.onAuthFailure = null
    this.isRefreshing = false
    this.failedQueue = []

    this.setupInterceptors()
  }

  // Configure auth methods
  configure({ getToken, refreshToken, onAuthFailure }) {
    this.getToken = getToken
    this.refreshToken = refreshToken
    this.onAuthFailure = onAuthFailure
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.axios.interceptors.request.use(
      (config) => {
        const token = this.getToken?.()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        console.log('Making request to:', config.url) // Debug log
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token refresh
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then(() => {
              return this.axios(originalRequest)
            }).catch(err => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            if (this.refreshToken) {
              const newToken = await this.refreshToken()
              
              // Process queued requests
              this.processQueue(null, newToken)
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.axios(originalRequest)
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.onAuthFailure?.(refreshError)
            throw new AuthError('Unauthorized', 401)
          } finally {
            this.isRefreshing = false
          }
        }

        // Convert axios error to custom format
        if (error.response?.status === 401) {
          throw new AuthError('Unauthorized', 401)
        }

        const errorMessage = error.response?.data?.message || 
                           `HTTP ${error.response?.status}: ${error.response?.statusText}` ||
                           error.message

        throw new Error(errorMessage)
      }
    )
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    
    this.failedQueue = []
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    const { params, ...restOptions } = options
    const response = await this.axios.get(endpoint, {
      params,
      ...restOptions,
    })
    return response.data
  }

  async post(endpoint, data, options = {}) {
    const response = await this.axios.post(endpoint, data, options)
    return response.data
  }

  async put(endpoint, data, options = {}) {
    const response = await this.axios.put(endpoint, data, options)
    return response.data
  }

  async patch(endpoint, data, options = {}) {
    const response = await this.axios.patch(endpoint, data, options)
    return response.data
  }

  async delete(endpoint, options = {}) {
    const response = await this.axios.delete(endpoint, options)
    return response.data
  }

  // Special method for file uploads
  async upload(endpoint, formData, options = {}) {
    const response = await this.axios.post(endpoint, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers,
      },
    })
    return response.data
  }

  // Direct access to axios instance for advanced use cases
  get instance() {
    return this.axios
  }
}

// Create singleton instance
export const apiClient = new ApiClient()
