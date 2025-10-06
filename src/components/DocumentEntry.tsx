import type { Document } from '../types/types';
import './App.css';

function DocumentEntry({
  document,
  attemptSign,
  setIsQrModalOpen,
  setQrSource,
}: {
  document: Document;
  attemptSign: (documentId: string) => Promise<string>;
  setIsQrModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setQrSource: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/documents/${document.id}/download`,
        {
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Reload page after download
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='box border-box m-2 is-flex is-justify-content-space-between w-half has-background-blue-light'>
        <h3 className='subtitle is-5'>
          {document.name.substring(0, 35)}
          {document.name.length > 35 && '...'}
        </h3>
        <div className='buttons'>
          {document.status === 'signed' ? (
            <button
              className='button is-success'
              onClick={handleDownload}
            >
              Download
            </button>
          ) : (
            <button
              className='button is-primary'
              onClick={async () => {
                const qrCode = await attemptSign(document.id);
                setIsQrModalOpen(true);
                setQrSource(qrCode as string);
              }}
            >
              Sign
            </button>
          )}
          <button className='button is-danger'>Delete</button>
        </div>
      </div>
    </>
  );
}

export default DocumentEntry;
