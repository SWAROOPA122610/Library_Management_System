const express = require('express');
const pool = require('./db');
const router = express.Router();

// POST /borrow - Borrow a book
router.post('/borrowrecords', async (req, res) => {
    try {
        const { member_id, book_id, borrow_date, due_date } = req.body;
        const [result] = await pool.query(
            'INSERT INTO borrowrecords (member_id, book_id, borrow_date, due_date) VALUES (?, ?, ?, ?)',
            [member_id, book_id, borrow_date, due_date]
        );
        // Update the available copies of the book
        await pool.query('UPDATE Books SET available_copies = available_copies - 1 WHERE book_id = ?', [book_id]);

        res.status(201).json({ message: 'Book borrowed', recordId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /books/:id - Get book details by ID
router.get('/borrowrecords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM borrowrecords WHERE record_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'record not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /return/:id - Return a book
// PUT /return/:id - Return a book
router.put('/borrowrecords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { return_date } = req.body;

        // Fetch the borrow record by ID
        const [borrowRecords] = await pool.query('SELECT * FROM borrowrecords WHERE record_id = ?', [id]);
        if (borrowRecords.length === 0) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        // Calculate fine if the book is returned after the due date
        const fineAmount = calculateFine(borrowRecords[0].due_date, return_date);

        // Update the return date in the borrowrecords table
        await pool.query(
            'UPDATE BorrowRecords SET return_date = ? WHERE record_id = ?',
            [return_date, id]
        );

        // Update the available copies of the book
        const borrowRecord = borrowRecords[0]; // Get the actual borrow record
        await pool.query('UPDATE Books SET available_copies = available_copies + 1 WHERE book_id = ?', [borrowRecord.book_id]);

        // Return the response with the fine amount
        res.json({ message: 'Book returned', fine: fineAmount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Utility function to calculate fine (fine = $1/day late)
function calculateFine(dueDate, returnDate) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const diffTime = returned - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}


router.delete('/borrowrecords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM borrowrecords WHERE record_id = ?', [id]); // Fixed the table name
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
