const express = require('express');
const {Web3} = require('web3');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

// Enable JSON parsing for requests
app.use(express.json());

// Connect to Ganache or Ethereum network using Web3
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GANACHE_RPC_URL));

// Your deployed contract address and ABI
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "dataHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vin",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "dataSource",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "MetadataStored",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "metadataCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "metadataMapping",
		"outputs": [
			{
				"internalType": "string",
				"name": "dataHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "vin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "dataSource",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_dataHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_vin",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dataSource",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "storeMetadata",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "verifyMetadata",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "dataHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vin",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "dataSource",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					}
				],
				"internalType": "struct CrashMetadataStorage.CrashMetadata",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Initialize contract
const contract = new web3.eth.Contract(abi, contractAddress);

// Your account and private key from Ganache
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Store crash metadata on the blockchain
app.post('/store-metadata', async (req, res) => {
    const { dataHash, vin, dataSource, location } = req.body;

    try {
        const result = await contract.methods
            .storeMetadata(dataHash, vin, dataSource, location)
            .send({ from: account.address, gas: 3000000 });

        res.json({
            message: 'Metadata stored successfully',
            transactionHash: result.transactionHash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error storing metadata' });
    }
});

// Verify metadata by index
app.get('/verify-metadata/:index', async (req, res) => {
    const { index } = req.params;

    try {
        const metadata = await contract.methods.verifyMetadata(index).call();
        res.json(metadata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error verifying metadata' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
