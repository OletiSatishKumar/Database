DELIMITER $$

-- 4. Insert new student with default values
CREATE PROCEDURE insert_new_student(
    IN student_name VARCHAR(255),
    IN student_email VARCHAR(255),
    IN student_dept VARCHAR(100),
    IN student_dob DATE
)
BEGIN
    -- If student_dob is NULL, set it to CURRENT_DATE (default date)
    IF student_dob IS NULL THEN
        SET student_dob = CURRENT_DATE;
    END IF;

    -- Insert a new student with the provided or default DOB
    INSERT INTO Students (name, email, department, dob)
    VALUES (student_name, student_email, student_dept, student_dob);
END$$


-- 5. Calculate GPA for a student
CREATE PROCEDURE calculate_gpa(
    IN student_id INT,
    OUT gpa DECIMAL(3,2)
)
BEGIN
    -- Local variables to hold the total credits, weighted sum of grades, course credits, and grade points
    DECLARE total_credits INT DEFAULT 0;
    DECLARE weighted_sum DECIMAL(5,2) DEFAULT 0;
    DECLARE course_credits INT;
    DECLARE grade_points DECIMAL(2,1);

    -- Cursor to iterate through the results and corresponding course credits
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR
        SELECT c.credits, r.grade
        FROM Results r
        JOIN Courses c ON r.course_id = c.course_id
        WHERE r.student_id = student_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open the cursor and process each result
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO course_credits, grade_points;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Convert letter grade to grade points
        SET grade_points = CASE
            WHEN grade = 'A+' THEN 4.0
            WHEN grade = 'A' THEN 4.0
            WHEN grade = 'A-' THEN 3.7
            WHEN grade = 'B+' THEN 3.3
            WHEN grade = 'B' THEN 3.0
            WHEN grade = 'B-' THEN 2.7
            WHEN grade = 'C+' THEN 2.3
            WHEN grade = 'C' THEN 2.0
            WHEN grade = 'C-' THEN 1.7
            WHEN grade = 'D+' THEN 1.3
            WHEN grade = 'D' THEN 1.0
            WHEN grade = 'D-' THEN 0.7
            ELSE 0.0
        END;

        -- Accumulate the weighted sum of grade points and total credits
        SET weighted_sum = weighted_sum + (course_credits * grade_points);
        SET total_credits = total_credits + course_credits;
    END LOOP read_loop;
    CLOSE cur;

    -- Calculate the GPA
    IF total_credits > 0 THEN
        SET gpa = weighted_sum / total_credits;
    ELSE
        SET gpa = NULL;  -- Set to NULL if no courses or grades are available
    END IF;
END$$

-- 6. Generate course-wise attendance report
CREATE PROCEDURE generate_course_attendance_report(
    IN course_id INT
)
BEGIN
    -- Generate the attendance report by aggregating attendance for each student in the specified course
    SELECT
        c.course_id,
        c.name AS course_name,
        s.student_id,
        s.name AS student_name,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
        COUNT(CASE WHEN a.status IS NOT NULL THEN 1 END) AS total_classes  -- Count only non-null status entries
    FROM Courses c
    JOIN Attendance a ON c.course_id = a.course_id
    JOIN Students s ON a.student_id = s.student_id
    WHERE c.course_id = course_id
    GROUP BY c.course_id, c.name, s.student_id, s.name
    ORDER BY s.student_name;
END$$
