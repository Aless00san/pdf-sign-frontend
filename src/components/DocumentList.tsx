import DocumentEntry from "./DocumentEntry";
import type { Document } from "../types/types";
import { documentList } from "../utils/api";
import { useEffect, useState } from "react";

function DocumentList({ isLogged }: { isLogged: boolean }) {
  const [documentsList, setDocumentsList] = useState<Document[]>([]);

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
          <DocumentEntry key={document.id} document={document} />
        ))}
      </div>
    </>
  );
}

export default DocumentList;
