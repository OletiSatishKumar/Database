-- Views

-- 7. Department-wise student report
CREATE VIEW department_student_report AS
SELECT
    d.department,
    COUNT(s.student_id) AS total_students
FROM (SELECT DISTINCT department from Students) as d
LEFT JOIN Students s ON d.department = s.department
GROUP BY d.department
ORDER BY d.department;

-- 8. Semester-wise result summary (assuming semester is stored in Enrollment)
CREATE VIEW semester_result_summary AS
SELECT
    e.semester,
    c.course_id,
    c.name AS course_name,
    AVG(r.marks) AS average_marks,
    MAX(r.marks) AS highest_marks,
    MIN(r.marks) AS lowest_marks
FROM Enrollment e
JOIN Results r ON e.student_id = r.student_id AND e.course_id = r.course_id
JOIN Courses c ON e.course_id = c.course_id
GROUP BY e.semester, c.course_id, c.name
ORDER BY e.semester, c.course_id;

-- 9. Course enrollment statistics
CREATE VIEW course_enrollment_statistics AS
SELECT
    c.course_id,
    c.name AS course_name,
    COUNT(e.student_id) AS total_enrollments,
    AVG(c.credits) as avg_credits
FROM Courses c
LEFT JOIN Enrollment e ON c.course_id = e.course_id
GROUP BY c.course_id, c.name;