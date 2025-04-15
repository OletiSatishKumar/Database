const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all courses
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Courses';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            res.status(500).json({ error: 'Failed to fetch courses' });
            return;
        }
        res.json(results);
    });
});

// GET a specific course by ID
router.get('/:id', (req, res) => {
    const courseId = req.params.id;
    const sql = 'SELECT * FROM Courses WHERE course_id = ?';
    db.query(sql, [courseId], (err, result) => {
        if (err) {
            console.error('Error fetching course:', err);
            res.status(500).json({ error: 'Failed to fetch course' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json(result[0]);
    });
});

// POST a new course
router.post('/', (req, res) => {
    const { name, department, credits } = req.body;
    const sql = 'INSERT INTO Courses (name, department, credits) VALUES (?, ?, ?)';
    db.query(sql, [name, department, credits], (err, result) => {
        if (err) {
            console.error('Error creating course:', err);
            res.status(500).json({ error: 'Failed to create course' });
            return;
        }
        res.status(201).json({ message: 'Course created successfully', courseId: result.insertId });
    });
});

// PUT (update) an existing course
router.put('/:id', (req, res) => {
    const courseId = req.params.id;
    const { name, department, credits } = req.body;
    const sql = 'UPDATE Courses SET name = ?, department = ?, credits = ? WHERE course_id = ?';
    db.query(sql, [name, department, credits, courseId], (err, result) => {
        if (err) {
            console.error('Error updating course:', err);
            res.status(500).json({ error: 'Failed to update course' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json({ message: 'Course updated successfully' });
    });
});

// DELETE a course
router.delete('/:id', (req, res) => {
    const courseId = req.params.id;
    const sql = 'DELETE FROM Courses WHERE course_id = ?';
    db.query(sql, [courseId], (err, result) => {
        if (err) {
            console.error('Error deleting course:', err);
            res.status(500).json({ error: 'Failed to delete course' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json({ message: 'Course deleted successfully' });
    });
});

module.exports = router;