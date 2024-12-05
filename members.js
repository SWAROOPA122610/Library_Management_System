const express = require('express');
const pool = require('./db');
const router = express.Router();

// POST /members - Add a new member
router.post('/members', async (req, res) => {
    try {
        const { name, email, phone, membership_date } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Members (name, email, phone, membership_date) VALUES (?, ?, ?, ?)',
            [name, email, phone, membership_date || new Date()]
        );
        res.status(201).json({ message: 'Member added', memberId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /members - Get all members
router.get('/members', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Members');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /members/:id - Get member details by ID
router.get('/members/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Members WHERE member_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Member not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /members/:id - Update member details
router.put('/members/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const [result] = await pool.query(
            'UPDATE Members SET name = ?, email = ?, phone = ? WHERE member_id = ?',
            [name, email, phone, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Member not found' });
        res.json({ message: 'Member updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /books/:id - Remove a book (admin only)
router.delete('/members/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM members WHERE member_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'member not found' });
        res.json({ message: 'member deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
