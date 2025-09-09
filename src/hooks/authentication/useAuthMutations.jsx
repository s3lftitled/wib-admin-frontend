import { useApiMutation } from '../shared/useApiMutation'
import { useNavigate } from 'react-router-dom'
import useAuth from '../shared/useAuth'
import useUserProfile from '../user/useUserProfile'

export const useSignIn = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { setUserProfile } = useUserProfile()

  return useApiMutation(
    'post',
    ({ email, password }) => ({
      endpoint: 'api/auth/v1/sign-in', 
      data: { email, password }
    }),
    {
      onSuccess: (data) => {
        setAuth({ accessToken: data.accessToken })
        setUserProfile(data.user)
        navigate('/dashboard')
      },
    }
  )
}
