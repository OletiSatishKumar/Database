const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import your database connection

// GET all results
router.get('/', (req, res) => {
    const sql = `
        SELECT
            r.result_id,
            s.name AS student_name,
            c.name AS course_name,
            r.marks,
            r.grade
        FROM Results r
        JOIN Students s ON r.student_id = s.student_id
        JOIN Courses c ON r.course_id = c.course_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching results:', err);
            res.status(500).json({ error: 'Failed to fetch results' });
            return;
        }
        res.json(results);
    });
});

// GET a specific result by ID
router.get('/:id', (req, res) => {
    const resultId = req.params.id;
    const sql = `
        SELECT
            r.result_id,
            s.name AS student_name,
            c.name AS course_name,
            r.marks,
            r.grade
        FROM Results r
        JOIN Students s ON r.student_id = s.student_id
        JOIN Courses c ON r.course_id = c.course_id
        WHERE r.result_id = ?
    `;
    db.query(sql, [resultId], (err, result) => {
        if (err) {
            console.error('Error fetching result:', err);
            res.status(500).json({ error: 'Failed to fetch result' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Result not found' });
            return;
        }
        res.json(result[0]);
    });
});

// GET results for a specific student
router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const sql = `
        SELECT
            r.result_id,
            c.name AS course_name,
            r.marks,
            r.grade
        FROM Results r
        JOIN Courses c ON r.course_id = c.course_id
        WHERE r.student_id = ?
    `;
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error('Error fetching results for student:', err);
            res.status(500).json({ error: 'Failed to fetch results for student' });
            return;
        }
        res.json(results);
    });
});

// GET results for a specific course
router.get('/course/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const sql = `
        SELECT
            r.result_id,
            s.name AS student_name,
            r.marks,
            r.grade
        FROM Results r
        JOIN Students s ON r.student_id = s.student_id
        WHERE r.course_id = ?
    `;
    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching results for course:', err);
            res.status(500).json({ error: 'Failed to fetch results for course' });
            return;
        }
        res.json(results);
    });
});

// POST a new result
router.post('/', (req, res) => {
    const { student_id, course_id, marks } = req.body;
    //  Calculate grade based on marks (you can adjust the grading scale)
    let grade = 'F';
    if (marks >= 90) {
        grade = 'A+';
    } else if (marks >= 80) {
        grade = 'A';
    } else if (marks >= 70) {
        grade = 'B';
    } else if (marks >= 60) {
        grade = 'C';
    } else if (marks >= 50) {
        grade = 'D';
    } else {
        grade = 'F';
    }

    const sql = 'INSERT INTO Results (student_id, course_id, marks, grade) VALUES (?, ?, ?, ?)';
    db.query(sql, [student_id, course_id, marks, grade], (err, result) => {
        if (err) {
            console.error('Error creating result:', err);
            res.status(500).json({ error: 'Failed to create result' });
            return;
        }
        res.status(201).json({ message: 'Result created successfully', resultId: result.insertId });
    });
});

// PUT (update) an existing result
router.put('/:id', (req, res) => {
    const resultId = req.params.id;
    const { student_id, course_id, marks } = req.body;
      // Calculate grade based on marks
    let grade = 'F';
    if (marks >= 90) {
        grade = 'A+';
    } else if (marks >= 80) {
        grade = 'A';
    } else if (marks >= 70) {
        grade = 'B';
    } else if (marks >= 60) {
        grade = 'C';
    } else if (marks >= 50) {
        grade = 'D';
    } else {
        grade = 'F';
    }
    const sql = 'UPDATE Results SET student_id = ?, course_id = ?, marks = ?, grade = ? WHERE result_id = ?';
    db.query(sql, [student_id, course_id, marks, grade, resultId], (err, result) => {
        if (err) {
            console.error('Error updating result:', err);
            res.status(500).json({ error: 'Failed to update result' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Result not found' });
            return;
        }
        res.json({ message: 'Result updated successfully' });
    });
});

// DELETE a result
router.delete('/:id', (req, res) => {
    const resultId = req.params.id;
    const sql = 'DELETE FROM Results WHERE result_id = ?';
    db.query(sql, [resultId], (err, result) => {
        if (err) {
            console.error('Error deleting result:', err);
            res.status(500).json({ error: 'Failed to delete result' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Result not found' });
            return;
        }
        res.json({ message: 'Result deleted successfully' });
    });
});

module.exports = router;