-- Nested Queries

-- 10. Students with highest marks in each course
SELECT
    s.student_id,
    s.name AS student_name,
    c.course_id,
    c.name AS course_name,
    r.marks
FROM Students s
JOIN Results r ON s.student_id = r.student_id
JOIN Courses c ON r.course_id = c.course_id
WHERE (r.course_id, r.marks) IN (
    SELECT course_id, MAX(marks)
    FROM Results
    GROUP BY course_id
)
ORDER BY c.course_id, s.student_name;

-- 11. Average marks per department
SELECT
    s.department,
    AVG(r.marks) AS average_marks
FROM Results r
JOIN Students s ON r.student_id = s.student_id
GROUP BY s.department
ORDER BY s.department;

-- 12. Students with perfect attendance (assuming no absences)
SELECT
    s.student_id,
    s.name AS student_name
FROM Students s
WHERE s.student_id NOT IN (
    SELECT DISTINCT student_id
    FROM Attendance
    WHERE status = 'Absent'
);

-- Join-Based Queries

-- 13. List of students with course and result details
SELECT
    s.student_id,
    s.name AS student_name,
    c.course_id,
    c.name AS course_name,
    r.marks,
    r.grade
FROM Students s
JOIN Enrollment e ON s.student_id = e.student_id
JOIN Courses c ON e.course_id = c.course_id
JOIN Results r ON e.student_id = r.student_id AND e.course_id = r.course_id
ORDER BY s.student_name, c.course_name;

-- 14. Faculty-wise course and student list
SELECT
    f.faculty_id,
    f.name AS faculty_name,
    c.course_id,
    c.name AS course_name,
    s.student_id,
    s.name AS student_name
FROM Faculty f
JOIN Courses c ON f.faculty_id = c.faculty_id  -- Assuming faculty_id in Courses
JOIN Enrollment e ON c.course_id = e.course_id
JOIN Students s ON e.student_id = s.student_id
ORDER BY f.faculty_name, c.course_name, s.student_name;

-- 15. Attendance report by student and course
SELECT
    s.student_id,
    s.name AS student_name,
    c.course_id,
    c.name AS course_name,
    a.date,
    a.status
FROM Students s
JOIN Attendance a ON s.student_id = a.student_id
JOIN Courses c ON a.course_id = c.course_id
ORDER BY s.student_name, c.course_name, a.date;