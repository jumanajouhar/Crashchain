import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const MetaMaskAuth = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center">
      {isConnected ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(account)}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <img
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
            alt="MetaMask"
            className="w-5 h-5"
          />
          <span>Connect MetaMask</span>
        </button>
      )}
    </div>
  );
};

export default MetaMaskAuth;
