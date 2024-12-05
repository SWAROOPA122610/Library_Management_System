const express = require('express');
const pool = require('./db');
const router = express.Router();


// GET /books - Get all books
router.get('/fines', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fines');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PUT /fines/:id - Return a book and update fine in the Fines table
router.put('/fines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { return_date } = req.body;

        // Fetch the borrow record by ID
        const [borrowRecord] = await pool.query('SELECT * FROM BorrowRecords WHERE record_id = ?', [id]);
        if (borrowRecord.length === 0) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        // Calculate fine if the book is returned after the due date
        const fineAmount = calculateFine(borrowRecord[0].due_date, return_date);

        // Update the return date in the borrowrecords table
        await pool.query(
            'UPDATE BorrowRecords SET return_date = ? WHERE record_id = ?',
            [return_date, id]
        );

        // Update the available copies of the book
        await pool.query('UPDATE Books SET available_copies = available_copies + 1 WHERE book_id = ?', [borrowRecord[0].book_id]);

        // Insert or update the fine in the Fines table
        await pool.query(
            'INSERT INTO Fines (record_id, fine_amount) VALUES (?, ?) ON DUPLICATE KEY UPDATE fine_amount = ?',
            [id, fineAmount, fineAmount]
        );

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

module.exports = router;
