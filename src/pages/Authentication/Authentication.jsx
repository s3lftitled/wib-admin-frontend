import { useNavigate } from 'react-router-dom';
import './Authentication.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Authentication = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); // State to store the timeout ID

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignInError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/v1/sign-in", {
        email,
        password,
      })

      const data = res.data;

      if (res.status === 200) {
        if (data.token) {

          const id = setTimeout(() => {
            handleSessionTimeout()
          }, 30 * 60 * 1000)
          setTimeoutId(id)
        }
        navigate("/dashboard")
      } else {
        setSignInError(data.message || "Sign in failed")
      }
    } catch (err) {
      if (err.response) {
        setSignInError(err.response.data.message || "Sign in failed")
      } else {
        setSignInError("Network error. Please try again.")
      }
      console.error("Sign in error:", err)
    } finally {
      setIsLoading(false);
    }
  }

  const handleSessionTimeout = () => {
    alert("Your session has expired. Please sign in again.")
    navigate("/authentication")
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [timeoutId]);

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
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
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
  );
};

export default Authentication;