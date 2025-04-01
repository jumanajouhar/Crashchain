# Crashchain 🚗

A blockchain-integrated vehicular forensic investigation tool designed to capture and verify crash data securely. The system provides tamper-proof vehicle accident data verification and storage using blockchain technology.

## Features

- Real-time OBD (On-Board Diagnostics) data collection
- Secure crash footage storage and verification
- Blockchain-based data integrity verification
- User-friendly investigation dashboard
- PDF report generation
- Anomaly detection system
- Smart contract integration for data storage

## Technical Stack

### Backend

- Node.js
- Web3.js
- Truffle Framework
- PDFKit for report generation
- Axios for API communications

### Blockchain

- Ethereum Smart Contracts
- CrashMetadataStorage Contract
- Truffle for deployment and testing

### Security

- Environment-based configuration
- Secure file handling

## Data Structure

The system captures comprehensive crash data including:

- Vehicle Identification Number (VIN)
- Timestamp
- Location data
- Vehicle dynamics (speed, RPM, etc.)
- Video footage
- Crash event details

## Setup

1. Clone the repository
2. Install dependencies:

```bash:terminal
npm install
```
3. Deploy smart contracts:

```bash:terminal
truffle migrate
```
4. Configure environment variables:

- CONTRACT_ADDRESS in .env
- Other necessary environment configs



5. Start the server:

```bash:terminal
npm start
```

## API Endpoints

- Crash Report Submission
- Data Verification
- Report Generation
- Anomaly Detection

## Security Considerations

- All crash data is verified on the blockchain
- Secure file storage and handling
- Data integrity checks


## License

MIT License

## Contact

For questions and support, please open an issue in the repository.
