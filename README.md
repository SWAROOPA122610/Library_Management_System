 # Library_Management_System
## Project Description:
Develop a backend application to manage school operations. The system will handle students, teachers, classes, subjects, and attendance. It should provide RESTful APIs for CRUD operations and include business logic to manage relationships between entities.
---
## Requirements:
### Database Tables:

#### Students Table

| Column           | Type             | Description                        |
|------------------|------------------|------------------------------------|
| student_id     | INT              | Primary Key, Auto-Increment        |
| name           | VARCHAR(255)     | Name of the student                |
| date_of_birth  | Date             | Date of birth of the student       |
| class_id       | INT              | Class ID                           |
| parent_contact | INT              | parent phone no                    |



#### Teachers Table
| Column           | Type           | Description                    |
|------------------|----------------|--------------------------------|
| Techer_id      | INT            | Primary Key, Auto-Increment    |
| name           | VARCHAR        | teacher's Name                 |
| subject_id     | INT            | foreign key referring subjects |
| email          | VARCHAR        | teacher's Email (Unique)       |
| phone          | VARCHAR        | teacher's Phone Number         |


#### Classes Table
| Column           | Type           | Description                    |
|------------------|----------------|--------------------------------|
| class_id       | INT            | Primary Key, Auto-Increment    |
| class_name     | VARCHAR        | class name                     |
| teacher_id     | INT            | Foreign Key referencing teacher|


#### Attendance Table
| Column           | Type           | Description                    |
|------------------|----------------|--------------------------------|
| attendance_id  | INT            | Primary Key, Auto-Increment    |
| student_id     | INT            | Foreign Key referencing students |
| date           | DATE           | Date details                        |
| status         | VARCHAR        | status (e.g., "Present", "absent") |

#### 5. subject Table
| Column     | Type                       | Description                                 |
|------------|----------------------------|---------------------------------------------|
| subject_id | INT                      | Primary Key, Auto-Increment                 |
| subject_name | VARCHAR(255)           | subject name                                |
 

---

## Business Logic

### 1. Book Management
- *Ensure available_copies is updated when books are borrowed or returned.*
  - When a book is borrowed, decrease the available_copies by 1.
  - When a book is returned, increase the available_copies by 1.
  
- *Prevent borrowing if no copies are available.*
  - Members will not be able to borrow books if the available_copies is 0.

### 2. Borrowing and Returning Books
- *Allow members to borrow up to 3 books at a time.*
  - A member cannot borrow more than 3 books at once.

- *Generate a fine if a book is returned after the due date.*
  - A fine of $1/day will be charged for late returns.

### 3. Fine Management
- *Automatically calculate fines for overdue books when returned.*
  - When a book is returned after its due date, calculate the fine as $1/day for each day it is late.

- *Allow admins to mark fines as "Paid" after payment.*
  - Admins have the ability to update the status of fines as "Paid" after the payment is made.

### 4. Validation
- *Ensure emails and phone numbers are valid.*
  - Email addresses and phone numbers entered by members must follow proper formats.

- *Prevent duplicate ISBN numbers for books.*
  - Each book's ISBN number must be unique in the database.

- *Restrict borrowing if the member has unpaid fines.*
  - A member with any unpaid fines will not be allowed to borrow new books.
### 5.Authorization
  - Admins must log in with valid credentials 
---

## Endpoints

### 1. Books API
- POST /books - Add a new book (admin only)
- GET /books - Get all books
- GET /books/:id - Get book details by ID
- PUT /books/:id - Update book details (admin only)
- DELETE /books/:id - Remove a book (admin only)

### 2. Members API
- POST /members - Add a new member
- GET /members - Get all members
- GET /members/:id - Get member details
- PUT /members/:id - Update member details

### 3. BorrowRecords API
- POST /borrow - Borrow a book
- PUT /return/:id - Return a book

### 4. Fine API
- GET /fines - Get all fines
- PUT /fines/:id - Update fine status to "Paid" (admin only)

### 5. Admin API
-	POST /admin/login - Log in as an admin

---

## Technology Stack
- *Backend*: Node.js, Express.js
- *Database*: MySQL


---
## Installation

1. Clone the repository:

git clone [https://github.com/SWAROOPA122610]


---
## Improvements and Next Steps

- Add *JWT Authentication* for admin-only features.
- Add *Validation*: express-validator.


---

## Author

*G.Nagamani*  
- *Email*: swarupakoppla4@gmail.com 
- *GitHub*:https://github.com/SWAROOPA122610

---
