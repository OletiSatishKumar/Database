const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all faculty members
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Faculty';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching faculty:', err);
            res.status(500).json({ error: 'Failed to fetch faculty' });
            return;
        }
        res.json(results);
    });
});

// GET a specific faculty member by ID
router.get('/:id', (req, res) => {
    const facultyId = req.params.id;
    const sql = 'SELECT * FROM Faculty WHERE faculty_id = ?';
    db.query(sql, [facultyId], (err, result) => {
        if (err) {
            console.error('Error fetching faculty member:', err);
            res.status(500).json({ error: 'Failed to fetch faculty member' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Faculty member not found' });
            return;
        }
        res.json(result[0]);
    });
});

// POST a new faculty member
router.post('/', (req, res) => {
    const { name, email, department } = req.body;
    const sql = 'INSERT INTO Faculty (name, email, department) VALUES (?, ?, ?)';
    db.query(sql, [name, email, department], (err, result) => {
        if (err) {
            console.error('Error creating faculty member:', err);
            res.status(500).json({ error: 'Failed to create faculty member' });
            return;
        }
        res.status(201).json({ message: 'Faculty member created successfully', facultyId: result.insertId });
    });
});

// PUT (update) an existing faculty member
router.put('/:id', (req, res) => {
    const facultyId = req.params.id;
    const { name, email, department } = req.body;
    const sql = 'UPDATE Faculty SET name = ?, email = ?, department = ? WHERE faculty_id = ?';
    db.query(sql, [name, email, department, facultyId], (err, result) => {
        if (err) {
            console.error('Error updating faculty member:', err);
            res.status(500).json({ error: 'Failed to update faculty member' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Faculty member not found' });
            return;
        }
        res.json({ message: 'Faculty member updated successfully' });
    });
});

// DELETE a faculty member
router.delete('/:id', (req, res) => {
    const facultyId = req.params.id;
    const sql = 'DELETE FROM Faculty WHERE faculty_id = ?';
    db.query(sql, [facultyId], (err, result) => {
        if (err) {
            console.error('Error deleting faculty member:', err);
            res.status(500).json({ error: 'Failed to delete faculty member' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Faculty member not found' });
            return;
        }
        res.json({ message: 'Faculty member deleted successfully' });
    });
});

module.exports = router;