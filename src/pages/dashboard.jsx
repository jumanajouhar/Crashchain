import React, { useEffect, useState } from "react";
import { FileText, Image, File } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard-data");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON data");
        }

        const data = await response.json();
        console.log("Dashboard data received:", data);
        
        setDashboardData(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Detailed error:", err);
        setError(`${err.message}. Please check the console for details.`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) {
      return <Image className="w-6 h-6" />;
    } else if (mimeType?.includes("pdf")) {
      return <FileText className="w-6 h-6" />;
    }
    return <File className="w-6 h-6" />;
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
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 rounded-lg p-6">
          <div className="text-red-600">
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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {(!dashboardData || dashboardData.length === 0) ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No data available. Try uploading some files first.</p>
        </div>
      ) : (
        dashboardData.map((group) => (
          <div key={group.groupId} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold">{group.groupName}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {group.files?.length > 0 ? (
                  group.files.map((file) => (
                    <div
                      key={file.cid}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mr-4 text-gray-500">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{file.name || "Unnamed File"}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="mr-4">CID: {file.cid}</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <a
                        href={`https://lavender-tropical-harrier-912.mypinata.cloud/ipfs/${file.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
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