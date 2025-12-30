const express = require('express');
const router = express.Router();

// Placeholder route to prevent server crash
router.get('/', (req, res) => {
    res.send("Social routes working");
});

module.exports = router;