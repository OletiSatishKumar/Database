const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all students
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            res.status(500).json({ error: 'Failed to fetch students' });
            return;
        }
        res.json(results);
    });
});

// GET a specific student by ID
router.get('/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM Students WHERE student_id = ?';
    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error fetching student:', err);
            res.status(500).json({ error: 'Failed to fetch student' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(result[0]);
    });
});

// POST a new student
router.post('/', (req, res) => {
    const { name, dob, email, department } = req.body;
    const sql = 'INSERT INTO Students (name, dob, email, department) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, dob, email, department], (err, result) => {
        if (err) {
            console.error('Error creating student:', err);
            res.status(500).json({ error: 'Failed to create student' });
            return;
        }
        res.status(201).json({ message: 'Student created successfully', studentId: result.insertId });
    });
});

// PUT (update) an existing student
router.put('/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, dob, email, department } = req.body;
    const sql = 'UPDATE Students SET name = ?, dob = ?, email = ?, department = ? WHERE student_id = ?';
    db.query(sql, [name, dob, email, department, studentId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            res.status(500).json({ error: 'Failed to update student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student updated successfully' });
    });
});

// DELETE a student
router.delete('/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM Students WHERE student_id = ?';
    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            res.status(500).json({ error: 'Failed to delete student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

module.exports = router;