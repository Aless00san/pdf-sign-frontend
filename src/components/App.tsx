import { useEffect, useState } from "react";
import "./App.css";
import UploadBox from "./UploadBox";
import type User from "../types/types";
import AuthModal from "./AuthModal";
import { login, register, logout, autoLogin, getQRCode } from "../utils/api";
import Navbar from "./Navbar";
import DocumentList from "./DocumentList";
import About from "./About";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>("Login");
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState("");

  const [content, setContent] = useState<"Upload" | "Documents" | "About">(
    "Upload"
  );

  const handleLogin = async (email: string, password: string) => {
    await login(email, password).then((data) => {
      setUser(data.userData);
    });
    setIsLogged(true);
  };

  const attemptSign = async (documentId: string): Promise<string> => {
  try {
    const data = await getQRCode(documentId);
    let qr = data.qr;

    return qr;
  } catch (error: any) {
    setError(error.message);
    return "";
  }
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
      setIsLogged(false);
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

  const docs = [
    { id: "1", name: "Documento 1", userId: "1" },
    { id: "2", name: "Documento 2", userId: "2" },
    { id: "3", name: "Documento 3", userId: "3" },
    { id: "4", name: "Documento 4", userId: "4" },
    { id: "5", name: "Documento 5", userId: "5" },
  ];

  return (
    <>
      <div className="content container">
        <Navbar
          setIsAuthModalOpen={setIsAuthModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          user={user}
          handleLogout={handleLogout}
          setContent={setContent}
        />
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
        <div className="main-content">
          {content === "Upload" && (
            <div className="center">
              <UploadBox />
            </div>
          )}

          {content === "Documents" && (
            <div className="content container center has-text-centered">
              <DocumentList isLogged={isLogged} attemptSign={attemptSign} />
            </div>
          )}

          {content === "About" && (
            <div className="center">
              <About />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
