import React, { useCallback, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './App.css';
import { uploadDocument } from '../utils/api';

interface SinglePDFUploaderProps {
  isLogged: boolean;
}

const SinglePDFUploader: React.FC<SinglePDFUploaderProps> = ({ isLogged }) => {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [error, setError] = useState<string>('');

  const upload = async (file: File) => {
    try {
      const data = await uploadDocument(file);
      setFile(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        setError('Only PDF files are allowed');
        return;
      }

      if (acceptedFiles.length > 1) {
        setError('You can only upload one PDF at a time');
        return;
      }

      setError('');
      setFile(acceptedFiles[0]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  return (
    <div
      className='container'
      style={{ maxWidth: '500px', marginTop: '50px' }}
    >
      <h1 className='title has-text-centered'>Upload your PDF to sign it</h1>

      {isLogged && (
        <div
          {...getRootProps()}
          className={`box has-text-centered ${
            isDragActive ? 'has-background-light' : ''
          }`}
          style={{
            border: '3px dotted #4A90E2',
            cursor: 'pointer',
            backgroundColor: '#f5fbfe',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className='has-text-primary has-text-weight-bold'>
              Drop your PDF here...
            </p>
          ) : (
            <p style={{ fontSize: '20px' }}>
              Drag & drop a PDF file here or click to select
            </p>
          )}
          <FaCloudUploadAlt
            className='has-svg-blue-light'
            size={175}
          />
        </div>
      )}

      {!isLogged && (
        <div className='has-text-centered'>
          <p className='has-text-weight-bold'>
            Please login to be able to upload
          </p>
        </div>
      )}

      {error && (
        <p
          className='has-text-danger has-text-centered'
          style={{ marginTop: '10px' }}
        >
          {error}
        </p>
      )}

      {file && (
        <div
          className='box'
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className='has-text-weight-medium'>{file.name}</span>
          <button
            className='button is-danger is-small'
            onClick={removeFile}
          >
            Remove
          </button>
        </div>
      )}

      {file && (
        <div
          className='content'
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            className='button is-primary is-large'
            onClick={() => upload(file)}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default SinglePDFUploader;
