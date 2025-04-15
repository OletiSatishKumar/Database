const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Utility: validate numeric parameters
const isNumeric = (value) => /^\d+$/.test(value);

// Report 1: Get all students and their courses with pagination
router.get('/students-courses', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const sql = `
        SELECT
            s.student_id,
            s.name AS student_name,
            s.email,
            c.course_id,
            c.name AS course_name,
            c.credits
        FROM Students s
        JOIN Enrollment e ON s.student_id = e.student_id
        JOIN Courses c ON e.course_id = c.course_id
        ORDER BY s.student_id, c.course_id
        LIMIT ? OFFSET ?
    `;

    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching student courses report:', err);
            return res.status(500).json({ error: 'Failed to fetch student courses report' });
        }
        res.json(results);
    });
});

// Report 2: Get all faculty members and the courses they teach with pagination
router.get('/faculty-courses', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const sql = `
      SELECT
          f.faculty_id,
          f.name AS faculty_name,
          f.email,
          c.course_id,
          c.name AS course_name
      FROM Faculty f
      JOIN Courses c ON f.faculty_id = c.faculty_id
      ORDER BY f.faculty_id, c.course_id
      LIMIT ? OFFSET ?
  `;

  db.query(sql, [limit, offset], (err, results) => {
      if (err) {
          console.error('Error fetching faculty courses report:', err);
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

// Report 3: Attendance summary by course
router.get('/attendance-summary/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  if (!isNumeric(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID format' });
  }

  const sql = `
      SELECT
          c.course_id,
          c.name AS course_name,
          a.date,
          SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
          SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
          COUNT(a.student_id) AS total_students
      FROM Attendance a
      JOIN Courses c ON a.course_id = c.course_id
      WHERE a.course_id = ?
      GROUP BY c.course_id, c.name, a.date
      ORDER BY a.date
  `;

  db.query(sql, [courseId], (err, results) => {
      if (err) {
          console.error('Error fetching attendance summary:', err);
          return res.status(500).json({ error: 'Failed to fetch attendance summary' });
      }

      if (results.length === 0) {
          return res.status(200).json({ message: 'No attendance records found for this course' });
      }

      res.json(results);
  });
});

// Report 4: List of students in a course
router.get('/course-roster/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    if (!isNumeric(courseId)) {
        return res.status(400).json({ error: 'Invalid course ID format' });
    }

    const sql = `
        SELECT
            c.course_id,
            c.name AS course_name,
            s.student_id,
            s.name AS student_name,
            s.email
        FROM Courses c
        JOIN Enrollment e ON c.course_id = e.course_id
        JOIN Students s ON e.student_id = s.student_id
        WHERE c.course_id = ?
        ORDER BY s.name
    `;

    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching course roster:', err);
            return res.status(500).json({ error: 'Failed to fetch course roster' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No students found for this course' });
        }
        res.json(results);
    });
});

module.exports = router;
