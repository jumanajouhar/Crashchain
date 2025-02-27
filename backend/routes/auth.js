const express = require('express');
const { isAddressWhitelisted } = require('../services/authService');
const router = express.Router();

router.post('/login', (req, res) => {
    const { address } = req.body;

    console.log('Login attempt from address:', address);

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    if (!isAddressWhitelisted(address)) {
        console.log('Address not whitelisted:', address);
        return res.status(403).json({ error: 'Address not whitelisted' });
    }

    // Proceed with login logic
    res.status(200).json({ message: 'Login successful' });
});

module.exports = router; 