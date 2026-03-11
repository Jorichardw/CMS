const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/connection'); // Database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Parses JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Load routes
app.use('/api', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
