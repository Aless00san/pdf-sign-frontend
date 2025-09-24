import type User from "../types/types";
import "./Navbar.css";

function Navbar({
  setIsAuthModalOpen,
  setModalType,
  user,
  handleLogout,
  setContent,
}: {
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  handleLogout: () => void;
  setContent: React.Dispatch<
    React.SetStateAction<"Upload" | "Documents" | "About">
  >;
}) {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand ml-4"></div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-brand">
            <a className="navbar">
              <img src="pdf-sign-com.svg" alt="Logo" width="32" height="28" />
            </a>
          </div>
          <div className="navbar-start">
            <a
              className="navbar-item"
              onClick={() => {
                setContent("Upload");
              }}
            >
              Home
            </a>

            <a
              className="navbar-item"
              onClick={() => {
                setContent("Documents");
              }}
            >
              Documents
            </a>

            <a
              className="navbar-item"
              onClick={() => {
                setContent("About");
              }}
            >
              About
            </a>
          </div>

          {user === null && (
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons mr-4">
                  <a
                    className="button is-primary"
                    onClick={() => {
                      setModalType("Register");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    <strong>Sign up</strong>
                  </a>
                  <a
                    className="button is-light"
                    onClick={() => {
                      setModalType("Login");
                      setIsAuthModalOpen(true);
                    }}
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          )}
          {user != null && (
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons mr-4">
                  <p className="mt-4"> Welcome {user.email}</p>
                  <button className="button" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
