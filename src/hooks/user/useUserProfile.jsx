// hooks/useUserProfile.js
import { useContext } from "react"
import UserProfileContext from "../../context/UserProfileContext"

const useUserProfile = () => {
  return useContext(UserProfileContext)
}

export default useUserProfile
