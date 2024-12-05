const express = require('express');
const pool = require('../db');
const router = express.Router();

// POST /books - Add a new book (admin only)
router.post('/books', async (req, res) => {
    try {
        const { title, author, isbn, genre, available_copies } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Books (title, author, isbn, genre, available_copies) VALUES (?, ?, ?, ?, ?)',
            [title, author, isbn, genre, available_copies]
        );
        res.status(201).json({ message: 'Book added', bookId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /books - Get all books
router.get('/books', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Books');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /books/:id - Get book details by ID
router.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Books WHERE book_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Book not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /books/:id - Update book details (admin only)
router.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, isbn, genre, available_copies } = req.body;
        const [result] = await pool.query(
            'UPDATE Books SET title = ?, author = ?, isbn = ?, genre = ?, available_copies = ? WHERE book_id = ?',
            [title, author, isbn, genre, available_copies, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /books/:id - Remove a book (admin only)
router.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Books WHERE book_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
