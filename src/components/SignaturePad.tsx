import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import './App.css';
import CloseModal from './CloseModal';

function SignaturePad() {
  const [modalOpen, setModalOpen] = useState(false);

  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const { documentId } = useParams();

  const clear = () => {
    sigCanvasRef.current?.clear();
  };

  const save = () => {
    const sig = sigCanvasRef.current;
    if (!sig || sig.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }

    const dataURL = sig.toDataURL('image/png');
    handleNext(dataURL);
    setModalOpen(true);
  };

  const handleNext = async (signatureDataUrl: string) => {
    await fetch(`http://localhost:3000/api/documents/${documentId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature: signatureDataUrl }),
      credentials: 'include',
    });

    if (window.opener) {
      window.opener.postMessage(
        { action: 'SIGNED', documentId, signature: signatureDataUrl },
        '*'
      );
      window.close();
    }
  };

  return (
    <div className='signature-wrapper'>
      <h2>Draw your signature</h2>
      <SignatureCanvas
        ref={sigCanvasRef}
        canvasProps={{
          width: 400,
          height: 200,
          className: 'signature-canvas',
        }}
        backgroundColor='transparent'
        penColor='black'
      />
      <div className='buttons'>
        <button
          onClick={clear}
          className='button is-warning'
        >
          Clear
        </button>
        <button
          onClick={save}
          className='button is-primary ml-2'
        >
          Save
        </button>
      </div>

      <CloseModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
      />
    </div>
  );
}

export default SignaturePad;
