import { useEffect, useState } from "react";
import "./App.css";
import UploadBox from "./UploadBox";
import type User from "../types/types";
import AuthModal from "./AuthModal";
import { login, register, logout, autoLogin } from "../utils/api";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>("Login");
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    await login(email, password).then((data) => {
      setUser(data.userData);
    });
    setIsLogged(true);
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password).then((data) => {
        setUser(data.userData);
      });
      setIsLogged(true);
    } catch (error: any) {}
  };

  const handleLogout = async () => {
    await logout().then(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await autoLogin().then((data) => {
          if (data.userData != null) {
            setUser(data.userData);
            setIsLogged(true);
          }
        });
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="content container">
        <Navbar
          setIsAuthModalOpen={setIsAuthModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          user={user}
          handleLogout={handleLogout}
        />
        <div className="center">
          <AuthModal
            {...{
              title: modalType,
              isOpen: isAuthModalOpen,
              setIsOpen: setIsAuthModalOpen,
              submit: {
                login: handleLogin,
                register: handleRegister,
              },
            }}
          />
          <UploadBox />
        </div>
      </div>
    </>
  );
}

export default App;
