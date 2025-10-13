import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import PdfErrorBoundary from './PdfErrorBoundary';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfFile() {
  const navigate = useNavigate();
  const location = useLocation();
  const signature = location.state?.signature;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    pageNumber: number;
  } | null>(null);

  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const { documentId } = useParams();

  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;

    setLoading(true);
    setPdfReady(false);
    setPdf(null);
    setFile(null);

    fetch(`http://localhost:3000/api/documents/${documentId}/file`, {
      credentials: 'include',
    })
      .then(res => res.blob())
      .then(blob => {
        if (cancelled) return;
        const newFile = new File([blob], 'documento.pdf', {
          type: 'application/pdf',
        });
        setFile(newFile);
      })
      .catch(err => {
        if (!cancelled) console.error('Error loading PDF:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      setPdfReady(false);
      setPdf(null);
      setFile(null);
    };
  }, [documentId]);

  const handleClick = (pageNumber: number, e: React.MouseEvent) => {
    const pageEl = pageRefs.current[pageNumber];
    if (!pageEl) return;

    const rect = pageEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y, pageNumber });
  };

  const embedSignature = async () => {
    if (!file || !coords || !signature || !pdf) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pagePdf = pdfDoc.getPage(coords.pageNumber - 1); // use clicked page
    const signatureImage = await pdfDoc.embedPng(signature);

    const { width: pdfWidth, height: pdfHeight } = pagePdf.getSize();

    const pageWidth = 600;
    const pageHeight = (pdfHeight / pdfWidth) * pageWidth;

    const scaleX = pdfWidth / pageWidth;
    const scaleY = pdfHeight / pageHeight;

    const sigWidth = 150;
    const sigHeight = 50;

    const xPdf = coords.x * scaleX;
    const yPdf = pdfHeight - coords.y * scaleY - sigHeight * scaleY;

    pagePdf.drawImage(signatureImage, {
      x: xPdf - sigWidth / 2,
      y: yPdf + sigHeight / 2,
      width: sigWidth,
      height: sigHeight,
    });

    const pdfBytes = await pdfDoc.save();
    const signedBlob = new Blob([pdfBytes as unknown as BlobPart], {
      type: 'application/pdf',
    });

    const formData = new FormData();
    formData.append('pdf', signedBlob);
    formData.append('status', 'signed');

    fetch(`http://localhost:3000/api/documents/${documentId}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
      .then(res => res.json())
      .then(doc => {
        console.log('Document updated:', doc);
        navigate(`/documents`);
      })
      .catch(err => console.error('Error updating document:', err));
  };

  return (
    <div
      className='is-flex is-flex-direction-column is-justify-content-center is-align-items-center'
      style={{ position: 'relative', height: '90%', background: '#f5f5f5' }}
    >
      {loading && <p style={{ marginTop: '2rem' }}>Loading PDF...</p>}
      {file && (
        <PdfErrorBoundary>
          <Document
            key={file ? file.name : 'empty'}
            file={file}
            onLoadSuccess={pdfDoc => {
              setPdf(pdfDoc);
              requestAnimationFrame(() => setPdfReady(true));
            }}
            onLoadError={err => console.error('Error loading PDF:', err)}
            loading={<p>Loading document...</p>}
            error={<p>Error loading the PDF.</p>}
            noData={<p>No such file available.</p>}
          >
            {pdfReady &&
              pdf &&
              Array.from({ length: pdf.numPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <div
                    key={`page-wrapper-${pageNumber}`}
                    ref={el => {
                      pageRefs.current[pageNumber] = el;
                    }}
                    onClick={e => handleClick(pageNumber, e)}
                    style={{ position: 'relative' }}
                  >
                    <Page
                      key={`page_${pageNumber}`}
                      pageNumber={pageNumber}
                      width={600}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                    <br />
                    {coords &&
                      coords.pageNumber === pageNumber &&
                      signature && (
                        <img
                          src={signature}
                          style={{
                            position: 'absolute',
                            left: coords.x - 75,
                            top: coords.y - 25,
                            width: 150,
                            height: 50,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                  </div>
                );
              })}
          </Document>
        </PdfErrorBoundary>
      )}

      <div>
        {coords && signature && (
          <button
            onClick={embedSignature}
            className='button is-success mt-3'
          >
            Embed signature
          </button>
        )}
      </div>
    </div>
  );
}
