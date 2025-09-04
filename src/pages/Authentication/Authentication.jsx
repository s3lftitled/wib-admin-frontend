import { useNavigate } from 'react-router-dom'
import './Authentication.css'
import { useState } from 'react'

const Authentication = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signInError, setSignInError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSignInError("")
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/v1/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        // Save token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token)
        }
        navigate("/dashboard")
      } else {
        // Handle error response from server
        setSignInError(data.message || "Sign in failed")
      }
    } catch (err) {
      setSignInError("Network error. Please try again.")
      console.error("Sign in error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="container">
        <div className="left-panel">
          <img
            src="/Wib.png"
            alt="When in Baguio Logo"
            className="main-logo"
          />
          <div className="blob-shape1"></div>
          <div className="blob-shape2"></div>
        </div>
        <div className="right-panel">
          <img
            src="/WIB LOGO.png"
            alt="When in Baguio Logo"
            className="logo-small"
          />
          <form className="login-form" onSubmit={handleSignIn}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Enter your email acc."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {signInError && (
              <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
                {signInError}
              </div>
            )}
            <button 
              type="submit" 
              className="btn-signin"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Authentication