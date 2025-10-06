import { useEffect, useState, type SetStateAction } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UploadBox from './UploadBox';
import type User from '../types/types';
import AuthModal from './AuthModal';
import { login, register, logout, autoLogin, getQRCode } from '../utils/api';
import Navbar from './Navbar';
import DocumentList from './DocumentList';
import About from './About';
import SignaturePad from './SignaturePad';
import PdfFile from './PdfFile';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('Login');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    await login(email, password).then(data => {
      setUser(data.userData);
    });
    setIsLogged(true);
  };

  const attemptSign = async (documentId: string): Promise<string> => {
    try {
      const data = await getQRCode(documentId);
      setSelectedDocument(documentId);
      let qr = data.qr;

      return qr;
    } catch (error: any) {
      setError(error.message);
      return '';
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password).then(data => {
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
        await autoLogin().then(data => {
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
    <BrowserRouter>
      <div className='content container'>
        <AuthModal
          title={modalType}
          isOpen={isAuthModalOpen}
          setIsOpen={setIsAuthModalOpen}
          submit={{
            login: handleLogin,
            register: handleRegister,
          }}
        />
        <Navbar
          setIsAuthModalOpen={setIsAuthModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          user={user}
          handleLogout={handleLogout}
        />
        <div className='main-content'>
          <Routes>
            <Route
              path='/'
              element={<UploadBox />}
            />
            <Route
              path='/documents'
              element={
                <DocumentList
                  isLogged={isLogged}
                  attemptSign={attemptSign}
                  selectedDocument={selectedDocument}
                />
              }
            />
            <Route
              path='/about'
              element={<About />}
            />
            <Route
              path='/sign/:documentId'
              element={<SignaturePad />}
            />
            <Route
              path='/pdf/:documentId'
              element={<PdfFile />}
            />

            <Route
              path='*'
              element={<h2>Page Not Found</h2>}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
