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
          `http://localhost:3000/api/documents/${documentId}`,
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

  return (
    <div className='modal is-active'>
      <div
        className='modal-background is-flex is-justify-content-center is-align-items-center'
        onClick={() => setIsOpen(false)}
      >
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
      </div>
    </div>
  );
};

export default QrModal;
