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
        string location;   // GPS location (e.g., 40.7128N, 74.0060W)
    }

    CrashMetadata[] public metadataArray;

    function storeMetadata(
        string memory _dataId,
        string memory _vin,
        string memory _location
    ) public onlyOwner {
        metadataArray.push(
            CrashMetadata({
                dataId: _dataId,
                vin: _vin,
                timestamp: block.timestamp,
                location: _location
            })
        );
    }

    function getMetadata(uint index) public view returns (CrashMetadata memory) {
        require(index < metadataArray.length, "Index out of bounds");
        return metadataArray[index];
    }

    function getTotalMetadataCount() public view returns (uint) {
        return metadataArray.length;
    }
}
