import DocumentEntry from "./DocumentEntry";
import type { Document } from "../types/types";
import { documentList } from "../utils/api";
import { useEffect, useState } from "react";
import QrModal from "./QrModal";

function DocumentList({
  isLogged,
  attemptSign,
}: {
  isLogged: boolean;
  attemptSign: (documentId: string) => Promise<string>;
}) {
  const [documentsList, setDocumentsList] = useState<Document[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrSource, setQrSource] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await documentList();
        setDocumentsList(data);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchDocuments();
  }, [isLogged]);

  if (!isLogged) {
    return <h2>Please log in to access your documents</h2>;
  }

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center container">
        {documentsList.map((document) => (
          <DocumentEntry
            key={document.id}
            document={document}
            attemptSign={attemptSign}
            setIsQrModalOpen={setIsQrModalOpen}
            setQrSource={setQrSource}
          />
        ))}
        {isQrModalOpen && (
          <QrModal isOpen={isQrModalOpen} setIsOpen={setIsQrModalOpen} qrSource={qrSource}/>
        )}
      </div>
    </>
  );
}

export default DocumentList;
