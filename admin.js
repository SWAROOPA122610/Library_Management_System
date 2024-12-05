const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const router = express.Router();
const secretKey = 'admin_123';

// Generate a token
const token = jwt.sign({ username: 'testuser' }, secretKey, { expiresIn: '1h' });
console.log('Generated Token:', token);

// Verify a token
try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded Token:', decoded);
} catch (err) {
    console.error('Token verification failed:', err.message);
}

// GET /members - Get all members
router.get('/admins', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admins');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /admin/login - Admin login and generate JWT
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the admin by username and password
        const [rows] = await pool.query(
            'SELECT * FROM Admins WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

       // Replace process.env.JWT_SECRET with a direct secret string
const token = jwt.sign({ adminId: rows[0].admin_id, username: rows[0].username }, 'admin_123', { expiresIn: '1h' });


        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
