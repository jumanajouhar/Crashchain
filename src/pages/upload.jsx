import React, { useState, useRef } from 'react';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadToPinata = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { status: 'uploading', progress: 0 },
      }));

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: {
          status: 'completed',
          ipfsHash: data.IpfsHash,
          pinSize: data.PinSize,
        },
      }));

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { status: 'error', error: error.message },
      }));
      throw error;
    }
  };

  const handleUpload = async (newFiles) => {
    setUploading(true);

    try {
      for (const file of newFiles) {
        await uploadToPinata(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
    await handleUpload(droppedFiles);
  };

  const handleFileInput = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    await handleUpload(selectedFiles);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileToRemove.name];
      return newStatus;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <h1 className="text-2xl font-bold text-white">Upload to IPFS</h1>
            <p className="mt-1 text-blue-100">Files will be stored on IPFS via Pinata</p>
          </div>

          <div className="p-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <svg
                  className={`h-16 w-16 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-4 text-lg text-gray-700">
                  {uploading ? 'Uploading...' : 'Drag and drop your files here'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  or
                  <button
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`mx-1 font-medium text-blue-500 hover:text-blue-600 focus:outline-none focus:underline ${
                      uploading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={uploading}
                  >
                    browse your computer
                  </button>
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  multiple
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Files</h2>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {
                              uploadStatus[file.name]?.status === 'completed' ? (
                                <a
                                  href={`https://gateway.pinata.cloud/ipfs/${uploadStatus[file.name].ipfsHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  View on IPFS
                                </a>
                              ) : uploadStatus[file.name]?.status === 'uploading' ? (
                                'Uploading...'
                              ) : uploadStatus[file.name]?.status === 'error' ? (
                                <span className="text-red-500">Upload failed</span>
                              ) : (
                                'Waiting...'
                              )
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                        disabled={uploading}
                      >
                        <svg
                          className="h-5 w-5 text-gray-500 hover:text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length === 0 && (
              <div className="mt-8 text-center">
                <div className="flex justify-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500">No files uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;