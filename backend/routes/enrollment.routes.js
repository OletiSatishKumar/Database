const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all enrollments
router.get('/', (req, res) => {
    const sql = `
        SELECT
            e.enrollment_id,
            s.name AS student_name,
            c.name AS course_name,
            e.semester
        FROM Enrollment e
        JOIN Students s ON e.student_id = s.student_id
        JOIN Courses c ON e.course_id = c.course_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            res.status(500).json({ error: 'Failed to fetch enrollments' });
            return;
        }
        res.json(results);
    });
});

// GET a specific enrollment by ID
router.get('/:id', (req, res) => {
    const enrollmentId = req.params.id;
    const sql = `
        SELECT
            e.enrollment_id,
            s.name AS student_name,
            c.name AS course_name,
            e.semester
        FROM Enrollment e
        JOIN Students s ON e.student_id = s.student_id
        JOIN Courses c ON e.course_id = c.course_id
        WHERE e.enrollment_id = ?
    `;
    db.query(sql, [enrollmentId], (err, result) => {
        if (err) {
            console.error('Error fetching enrollment:', err);
            res.status(500).json({ error: 'Failed to fetch enrollment' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }
        res.json(result[0]);
    });
});

// GET enrollments for a specific student
router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const sql = `
        SELECT
            e.enrollment_id,
            s.name AS student_name,
            c.name AS course_name,
            e.semester
        FROM Enrollment e
        JOIN Students s ON e.student_id = s.student_id
        JOIN Courses c ON e.course_id = c.course_id
        WHERE e.student_id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching enrollments for student:', err);
            res.status(500).json({ error: 'Failed to fetch enrollments for student' });
            return;
        }
        res.json(results);
    });
});

// GET enrollments for a specific course
    router.get('/course/:courseId', (req, res) => {
        const courseId = req.params.courseId;
        const sql = `
            SELECT
                e.enrollment_id,
                s.name AS student_name,
                c.name AS course_name,
                e.semester
            FROM Enrollment e
            JOIN Students s ON e.student_id = s.student_id
            JOIN Courses c ON e.course_id = c.course_id
            WHERE e.course_id = ?
        `;
        db.query(sql, [courseId], (err, results) => {
            if (err) {
                console.error('Error fetching enrollments for course:', err);
                res.status(500).json({ error: 'Failed to fetch enrollments for course' });
                return;
            }
            res.json(results);
        });
    });

// POST a new enrollment
router.post('/', (req, res) => {
    const { student_id, course_id, semester } = req.body;
    const sql = 'INSERT INTO Enrollment (student_id, course_id, semester) VALUES (?, ?, ?)';
    db.query(sql, [student_id, course_id, semester], (err, result) => {
        if (err) {
            console.error('Error creating enrollment:', err);
            res.status(500).json({ error: 'Failed to create enrollment' });
            return;
        }
        res.status(201).json({ message: 'Enrollment created successfully', enrollmentId: result.insertId });
    });
});

// PUT (update) an existing enrollment
router.put('/:id', (req, res) => {
    const enrollmentId = req.params.id;
    const { student_id, course_id, semester } = req.body;
    const sql = 'UPDATE Enrollment SET student_id = ?, course_id = ?, semester = ? WHERE enrollment_id = ?';
    db.query(sql, [student_id, course_id, semester, enrollmentId], (err, result) => {
        if (err) {
            console.error('Error updating enrollment:', err);
            res.status(500).json({ error: 'Failed to update enrollment' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }
        res.json({ message: 'Enrollment updated successfully' });
    });
});

// DELETE an enrollment
router.delete('/:id', (req, res) => {
    const enrollmentId = req.params.id;
    const sql = 'DELETE FROM Enrollment WHERE enrollment_id = ?';
    db.query(sql, [enrollmentId], (err, result) => {
        if (err) {
            console.error('Error deleting enrollment:', err);
            res.status(500).json({ error: 'Failed to delete enrollment' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }
        res.json({ message: 'Enrollment deleted successfully' });
    });
});

module.exports = router;