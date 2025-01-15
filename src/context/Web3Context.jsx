import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const web3Instance = new Web3(window.ethereum);
      
      // Request network change to localhost:7545 if not already on it
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // Chain ID 1337 in hex
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x539', // Chain ID 1337 in hex
                  chainName: 'Ganache Local',
                  rpcUrls: ['http://127.0.0.1:7545'],
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                },
              ],
            });
          } catch (addError) {
            throw new Error('Failed to add Ganache network to MetaMask');
          }
        } else {
          throw switchError;
        }
      }

      const chainId = await web3Instance.eth.getChainId();
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setIsConnected(true);
      setChainId(chainId);
      setError(null);

      return accounts[0];
    } catch (error) {
      setError(error.message);
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setIsConnected(false);
    setChainId(null);
    setError(null);
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else {
        // Account changed, update the state
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainId) => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      web3,
      isConnected,
      chainId,
      error,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
