import { useNavigate } from 'react-router-dom'
import './Authentication.css'
import { useState } from 'react'
import { useSignIn } from '../../hooks/authentication/useAuthMutations'

const Authentication = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const signInMutation = useSignIn()

  const handleSignIn = async (e) => {
    e.preventDefault()
    signInMutation.mutate({ email, password })
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
            <div className="form-group-authentication">
              <input
                type="email"
                placeholder="Enter your email acc."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={signInMutation.isPending}
              />
            </div>
            <div className="form-group-authentication">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={signInMutation.isPending}
              />
            </div>
            {signInMutation.error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {signInMutation.error.message}
              </div>
            )}
            <button
              type="submit"
              className="btn-signin"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Authentication;