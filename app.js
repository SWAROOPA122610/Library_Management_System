const express = require('express');
const bodyParser = require('body-parser');
const booksRoutes = require('./books/book');
const membersRoutes = require('./members');
const borrowrecordsRoutes = require('./borrowrecords');
const finesRoutes = require('./fines');
const adminRoutes = require('./admin');


const app = express();

app.use(bodyParser.json());

app.use(booksRoutes);
app.use(membersRoutes);
app.use(borrowrecordsRoutes);
app.use(finesRoutes);
app.use(adminRoutes);





// Include other route files like borrowRecords, fines, admins.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

