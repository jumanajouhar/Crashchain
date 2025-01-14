import React, { useEffect, useState, useRef } from "react";
import { FileText, Image, File } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState('connecting');
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connectWebSocket = () => {
    try {
      ws.current = new WebSocket('ws://localhost:3000');

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        setWsStatus('connected');
        setError(null);
        // Clear any existing reconnection timeout
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received WebSocket message:', message);
          
          if (message.type === 'initialData' || message.type === 'update') {
            if (Array.isArray(message.data)) {
              console.log('Setting dashboard data:', message.data);
              setDashboardData(message.data);
              setLoading(false);
            } else {
              console.error('Received data is not an array:', message.data);
              setError('Invalid data format received from server');
            }
          } else {
            console.warn('Unknown message type:', message.type);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
          setError('Failed to process server message');
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to establish real-time connection');
        setWsStatus('error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setWsStatus('disconnected');
        // Attempt to reconnect after 5 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 5000);
      };
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
      setWsStatus('error');
    }
  };

  useEffect(() => {
    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (mimeType?.includes("pdf")) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (size) => {
    if (!size) return "Unknown size";
    const units = ["B", "KB", "MB", "GB"];
    let formattedSize = size;
    let unitIndex = 0;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg mt-4">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-6">
          <div className="text-red-700">
            <h2 className="text-lg font-semibold mb-2">Error loading dashboard</h2>
            <p>{error}</p>
            <div className="mt-4 text-sm">
              <p>Please ensure:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>The server is running on port 3000</li>
                <li>CORS is properly configured</li>
                <li>Pinata API is properly configured</li>
                <li>Check the browser console for detailed error messages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className={`px-3 py-1 rounded-full text-sm ${
          wsStatus === 'connected' ? 'bg-green-100 text-green-800' :
          wsStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {wsStatus === 'connected' ? 'Live Updates Active' :
           wsStatus === 'connecting' ? 'Connecting...' :
           'Connection Lost'}
        </div>
      </div>
      {(!dashboardData || dashboardData.length === 0) ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No data available. Try uploading some files first.</p>
        </div>
      ) : (
        dashboardData.map((group) => (
          <div
            key={group.groupId}
            className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div className="border-b bg-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-700">{group.groupName}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {group.blockchainData.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Blockchain Data</h3>
                    {group.blockchainData.map((metadata, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700">Block Index: {metadata.index}</p>
                            <p className="text-blue-700">VIN: {metadata.vin || 'Not provided'}</p>
                            <p className="text-blue-700">Location: {metadata.location}</p>
                            <p className="text-blue-700">
                              Timestamp: {new Date(metadata.timestamp * 1000).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-700">Associated CIDs:</p>
                            <ul className="list-disc pl-4">
                              {metadata.cids.map((cid, cidIndex) => (
                                <li key={cidIndex} className="text-blue-600 break-all">
                                  {cid}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {group.files?.length > 0 ? (
                  group.files.map((file) => (
                    <div
                      key={file.cid}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mr-4">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">
                          {file.name || "Unnamed File"}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="mr-4">CID: {file.cid}</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <a
                        href={`https://lavender-tropical-harrier-912.mypinata.cloud/ipfs/${file.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        View File
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No files in this group.</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
