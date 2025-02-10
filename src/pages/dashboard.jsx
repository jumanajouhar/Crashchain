import React, { useEffect, useState, useRef } from "react";
import { FileText, Image, File, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState("connecting");
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connectWebSocket = () => {
    try {
      ws.current = new WebSocket("ws://localhost:3000");

      ws.current.onopen = () => {
        setWsStatus("connected");
        setError(null);
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (["initialData", "update"].includes(message.type) && Array.isArray(message.data)) {
            setDashboardData(message.data);
            setLoading(false);
          } else {
            setError("Invalid data format received from server");
          }
        } catch {
          setError("Failed to process server message");
        }
      };

      ws.current.onerror = () => setError("Failed to establish real-time connection");

      ws.current.onclose = () => {
        setWsStatus("disconnected");
        reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
      };
    } catch {
      setError("Failed to create WebSocket connection");
      setWsStatus("error");
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws.current?.close();
      reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    };
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) return <Image className="w-6 h-6 text-blue-500" />;
    if (mimeType?.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (size) => {
    if (!size) return "Unknown size";
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const isGroupVerified = (group) => {
    if (!group.blockchainData?.length || !group.files?.length) return false;
    const blockchainCids = group.blockchainData.flatMap((data) => data.cids || []);
    return group.files.every((file) => blockchainCids.includes(file.cid));
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-6 bg-white p-6 rounded-lg ">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              wsStatus === "connected"
                ? "bg-green-100 text-green-800"
                : wsStatus === "connecting"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {wsStatus === "connected" ? "Live Updates Active" : wsStatus === "connecting" ? "Connecting..." : "Connection Lost"}
          </span>
        </div>
        {loading && <p className="text-center text-gray-600">Loading dashboard data...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {dashboardData.length === 0 && !loading && !error && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            No data available. Try uploading some files first.
          </div>
        )}
        {dashboardData.map((group) => (
          <div key={group.groupId} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-700">{group.groupName}</h2>
              {isGroupVerified(group) ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" /> Verified
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="w-5 h-5 mr-1" /> Unverified
                </span>
              )}
            </div>
            <div className="space-y-4">
              {group.files.map((file) => (
                <div key={file.cid} className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="mr-4">{getFileIcon(file.mimeType)}</div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-800 truncate">{file.name || "Unnamed File"}</h3>
                    <p className="text-sm text-gray-500">CID: {file.cid}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <a href={`https://gateway.pinata.cloud/ipfs/${file.cid}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                    View File
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
