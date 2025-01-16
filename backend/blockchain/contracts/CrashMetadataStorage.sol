// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrashMetadataStorage {
    address internal owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    struct CrashMetadata {
        string dataId;     // MongoDB document ID
        string vin;        // Vehicle Identification Number
        uint256 timestamp; // Time of data recording
        string location;   // GPS location
        string[] cids;     // IPFS CIDs for associated files
    }

    CrashMetadata[] public metadataArray;
    
    // Event to emit when new metadata is stored
    event MetadataStored(uint256 indexed index, string dataId, string vin, string[] cids);
    
    function storeMetadata(
        string memory _dataId,
        string memory _vin,
        string memory _location,
        string[] memory _cids
    ) public onlyOwner {
        CrashMetadata memory newMetadata = CrashMetadata({
            dataId: _dataId,
            vin: _vin,
            timestamp: block.timestamp,
            location: _location,
            cids: _cids
        });
        
        metadataArray.push(newMetadata);
        emit MetadataStored(metadataArray.length - 1, _dataId, _vin, _cids);
    }

    function getMetadata(uint256 index) public view returns (
        string memory dataId,
        string memory vin,
        uint256 timestamp,
        string memory location,
        string[] memory cids
    ) {
        require(index < metadataArray.length, "Index out of bounds");
        CrashMetadata memory metadata = metadataArray[index];
        return (
            metadata.dataId,
            metadata.vin,
            metadata.timestamp,
            metadata.location,
            metadata.cids
        );
    }

    function getTotalMetadataCount() public view returns (uint256) {
        return metadataArray.length;
    }
    
    function getCidsForMetadata(uint256 index) public view returns (string[] memory) {
        require(index < metadataArray.length, "Index out of bounds");
        return metadataArray[index].cids;
    }
}
