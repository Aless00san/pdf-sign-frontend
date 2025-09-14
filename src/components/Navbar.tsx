import "./Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">

        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-brand">
            <a className="navbar">
              <img src="pdf-sign-com.svg" alt="Logo" width="32" height="28" />
            </a>
          </div>
          <div className="navbar-start">
            <a className="navbar-item">
              Home
            </a>

            <a className="navbar-item">
              Documents
            </a>

            <a className="navbar-item">
              About
            </a>

            
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a className="button is-light">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
