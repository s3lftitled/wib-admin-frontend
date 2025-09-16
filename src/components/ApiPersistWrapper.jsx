import { Outlet } from "react-router-dom"
import { useApiClientSetup } from '../hooks/shared/useApiClient'

const ApiPersistWrapper = ({ children }) => {
  const { isInitialized } = useApiClientSetup()

  // Show loading or nothing while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  // If using with React Router
  if (children) {
    return children
  }

  // Default to Outlet for route-based usage
  return <Outlet />
}

export default ApiPersistWrapper