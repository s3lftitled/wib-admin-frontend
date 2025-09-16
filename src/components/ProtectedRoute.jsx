import { Navigate, Outlet } from 'react-router-dom'
import useAuth from "../hooks/shared/useAuth"
import useUserProfile from '../hooks/user/useUserProfile'

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const { userProfile } = useUserProfile()

  // Check if access token is present and user has the required role
  const isAuthorized = auth?.accessToken && allowedRoles.includes(userProfile.role)

  // Redirect to authentication if there's no access token
  if (!auth?.accessToken) {
    return <Navigate to="/authentication" />
  }

  // Redirect to home if user role is not allowed
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />
  }

  return <Outlet />
}

export default ProtectedRoute