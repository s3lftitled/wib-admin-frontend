import './Authentication.css'

const Authentication = () => {
  return (
    <>
      <div className="container">
        <div className="left-panel">
          <img
            src="public/Wib.png"
            alt="When in Baguio Logo"
            className="main-logo"
          />
          <div className="blob-shape1"></div>
          <div className="blob-shape2"></div>
        </div>
        <div className="right-panel">
          <img
            src="public/WIB LOGO.png"
            alt="When in Baguio Logo"
            className="logo-small"
          />
          <div className="login-form">
            <div className="form-group">
              <input type="email" placeholder="Enter your email acc." />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Enter your password" />
            </div>
            <a href="/Dashboard">
              <button className="btn-signin">Sign in</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication