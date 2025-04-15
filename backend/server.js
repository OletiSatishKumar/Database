const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const studentRoutes = require('./routes/students.routes');
const courseRoutes = require('./routes/courses.routes');
const facultyRoutes = require('./routes/faculty.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const reportRoutes = require('./routes/reports.routes'); 
const resultsRoutes = require('./routes/results.routes'); 

const app = express();
const port = 3000;

// Middleware
const corsOptions = {
    origin: 'http://127.0.0.1:5501' // Only allow requests from this origin
    // You can also specify methods, headers, etc.
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/results', resultsRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('College Database System Backend is running!');
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


