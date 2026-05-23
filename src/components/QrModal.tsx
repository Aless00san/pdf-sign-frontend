import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface QrModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  qrSource: string;
  documentId: string | null;
}

const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  setIsOpen,
  qrSource,
  documentId,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.action === 'SIGNED' &&
        event.data.documentId === documentId
      ) {
        const { signature } = event.data;
        setIsOpen(false);
        navigate(`/pdf/${documentId}`, { state: { signature } });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, setIsOpen, documentId]);

  useEffect(() => {
    if (!isOpen || !documentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://pdfsig.xyz/api/documents/${documentId}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();

        if (data.status === 'hasSignature' && data.signature) {
          setIsOpen(false);
          navigate(`/pdf/${documentId}`, {
            state: { signature: data.signature },
          });
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, documentId, navigate, setIsOpen]);

  if (!isOpen) return null;

  const handleSignOnDevice = () => {
    setIsOpen(false);
    if (documentId) {
      navigate(`/sign/${documentId}`);
    }
  };

  return (
    <div className='modal is-active'>
      <div
        className='modal-background is-flex is-justify-content-center is-align-items-center'
        onClick={() => setIsOpen(false)}
      >
        <div className='has-text-centered'>
          <img
            src={
              qrSource !== ''
                ? qrSource
                : 'https://www.w3schools.com/howto/img_lights.jpg'
            }
            alt='qr-code'
            width={250}
            height={250}
          />
          {documentId && (
            <p className='mt-4 has-text-white'>
              or{' '}
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOnDevice();
                }}
                className='has-text-weight-bold has-text-link'
              >
                sign on this device
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrModal;
