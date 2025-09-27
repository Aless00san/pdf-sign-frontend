import type { Document } from "../types/types";
import "./App.css";

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
  return (
    <>
      <div className="box border-box m-2 is-flex is-justify-content-space-between w-half has-background-blue-light">
        <h3 className="subtitle is-5">
          {document.name.substring(0, 35)}
          {document.name.length > 35 && "..."}
        </h3>
        <div className="buttons">
          <button
            className="button is-primary"
            onClick={async () => {
              const qrCode = await attemptSign(document.id);
              setIsQrModalOpen(true);
              setQrSource(qrCode as string);
            }}
          >
            Sign
          </button>
          <button className="button is-danger">Delete</button>
        </div>
      </div>
    </>
  );
}

export default DocumentEntry;
