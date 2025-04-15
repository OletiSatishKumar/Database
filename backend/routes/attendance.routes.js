const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all attendance records
router.get('/', (req, res) => {
    const sql = `
        SELECT
            a.attendance_id,
            s.name AS student_name,
            c.name AS course_name,
            a.date,
            a.status
        FROM Attendance a
        JOIN Students s ON a.student_id = s.student_id
        JOIN Courses c ON a.course_id = c.course_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            res.status(500).json({ error: 'Failed to fetch attendance' });
            return;
        }
        res.json(results);
    });
});

// GET attendance for a specific student
router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const sql = `
        SELECT
            a.attendance_id,
            s.name AS student_name,
            c.name AS course_name,
            a.date,
            a.status
        FROM Attendance a
        JOIN Students s ON a.student_id = s.student_id
        JOIN Courses c ON a.course_id = c.course_id
        WHERE a.student_id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching attendance for student:', err);
            res.status(500).json({ error: 'Failed to fetch attendance for student' });
            return;
        }
        res.json(results);
    });
});

// GET attendance for a specific course
router.get('/course/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const sql = `
        SELECT
            a.attendance_id,
            s.name AS student_name,
            c.name AS course_name,
            a.date,
            a.status
        FROM Attendance a
        JOIN Students s ON a.student_id = s.student_id
        JOIN Courses c ON a.course_id = c.course_id
        WHERE a.course_id = ?
    `;
    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching attendance for course:', err);
            res.status(500).json({ error: 'Failed to fetch attendance for course' });
            return;
        }
        res.json(results);
    });
});

// POST a new attendance record
router.post('/', (req, res) => {
    const { student_id, course_id, date, status } = req.body;
    const sql = 'INSERT INTO Attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [student_id, course_id, date, status], (err, result) => {
        if (err) {
            console.error('Error creating attendance record:', err);
            res.status(500).json({ error: 'Failed to create attendance record' });
            return;
        }
        res.status(201).json({ message: 'Attendance record created successfully', attendanceId: result.insertId });
    });
});

// PUT (update) an existing attendance record
router.put('/:id', (req, res) => {
    const attendanceId = req.params.id;
    const { student_id, course_id, date, status } = req.body;
    const sql = 'UPDATE Attendance SET student_id = ?, course_id = ?, date = ?, status = ? WHERE attendance_id = ?';
    db.query(sql, [student_id, course_id, date, status, attendanceId], (err, result) => {
        if (err) {
            console.error('Error updating attendance record:', err);
            res.status(500).json({ error: 'Failed to update attendance record' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Attendance record not found' });
            return;
        }
        res.json({ message: 'Attendance record updated successfully' });
    });
});

// DELETE an attendance record
router.delete('/:id', (req, res) => {
    const attendanceId = req.params.id;
    const sql = 'DELETE FROM Attendance WHERE attendance_id = ?';
    db.query(sql, [attendanceId], (err, result) => {
        if (err) {
            console.error('Error deleting attendance record:', err);
            res.status(500).json({ error: 'Failed to delete attendance record' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Attendance record not found' });
            return;
        }
        res.json({ message: 'Attendance record deleted successfully' });
    });
});

module.exports = router;