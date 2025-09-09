// context/UserProfileContext.jsx
import { createContext, useState, useEffect } from "react"

const UserProfileContext = createContext({})

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("userProfile")
      return savedProfile ? JSON.parse(savedProfile) : null
    } catch (error) {
      console.error("Failed to parse user profile from localStorage:", error)
      return null
    }
  })

  // Persist to localStorage whenever userProfile changes
  useEffect(() => {
    if (userProfile) {
      try {
        localStorage.setItem("userProfile", JSON.stringify(userProfile))
      } catch (error) {
        console.error("Failed to save user profile to localStorage:", error)
      }
    } else {
      localStorage.removeItem("userProfile")
    }
  }, [userProfile])

  const updateUserProfile = (updates) => {
    setUserProfile((prev) => (prev ? { ...prev, ...updates } : updates))
  }

  const clearUserProfile = () => {
    setUserProfile(null)
  }

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserProfile,
        clearUserProfile,
        isAuthenticated: !!userProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export default UserProfileContext
