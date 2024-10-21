const CrashMetadataStorage = artifacts.require("CrashMetadataStorage");

module.exports = function (deployer) {
  deployer.deploy(CrashMetadataStorage);
};
