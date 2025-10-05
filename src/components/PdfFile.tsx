import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useParams } from "react-router-dom";

import PdfErrorBoundary from "./PdfErrorBoundary";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [pdfReady, setPdfReady] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const { documentId } = useParams();

  useEffect(() => {
    if (!documentId) return;

    fetch(`http://localhost:3000/api/documents/${documentId}/file`, {
      credentials: "include",
    })
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "documento.pdf", {
          type: "application/pdf",
        });
        setFile(file);
      });
  }, [documentId]);

  const handleClick = (e: React.MouseEvent) => {
    if (!pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pageWidth = 600;
    const scale = pageWidth / rect.width;

    const coordsPdf = { x: x * scale, y: y * scale };
    setCoords(coordsPdf);

    console.log("   X PDF:", coordsPdf.x, " Y PDF:", coordsPdf.y);
  };

  return (
    <div
      className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
      style={{ position: "relative", height: "90%", background: "#f5f5f5" }}
    >
      <div ref={pageRef} onClick={handleClick} style={{ position: "relative" }}>
        {file && (
          <PdfErrorBoundary>
            <Document
              file={file}
              onLoadSuccess={() => setPdfReady(true)}
              onLoadError={(err) => console.error("Error cargando PDF:", err)}
            >
              {pdfReady && (
                <Page
                  pageNumber={1}
                  width={600}
                  renderAnnotationLayer={false}
                />
              )}
            </Document>
          </PdfErrorBoundary>
        )}

        {coords && (
          <img
            src={`https://placehold.co/150x50`}
            style={{
              position: "absolute",
              left: coords.x - 75,
              top: coords.y - 25,
              width: 150,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "transparent",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
