const dotenv = require('dotenv');
dotenv.config();

const whitelistedAddresses = process.env.WHITELISTED_ADDRESSES.split(',');

console.log('Whitelisted Addresses:', whitelistedAddresses);

function isAddressWhitelisted(address) {
    return whitelistedAddresses.includes(address.toLowerCase());
}

module.exports = {
    isAddressWhitelisted,
}; 