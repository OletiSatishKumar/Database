-- 1. Trigger to update grade when marks are entered
CREATE TRIGGER update_grade_on_insert
AFTER INSERT ON Results
FOR EACH ROW
BEGIN
    UPDATE Results
    SET grade = CASE
        WHEN NEW.marks >= 90 THEN 'A+'
        WHEN NEW.marks >= 80 THEN 'A'
        WHEN NEW.marks >= 70 THEN 'B'
        WHEN NEW.marks >= 60 THEN 'C'
        WHEN NEW.marks >= 50 THEN 'D'
        ELSE 'F'
    END
    WHERE result_id = NEW.result_id;
END;

-- 1.1 Trigger to update grade when marks are updated
CREATE TRIGGER update_grade_on_update
AFTER UPDATE ON Results
FOR EACH ROW
BEGIN
    UPDATE Results
    SET grade = CASE
        WHEN NEW.marks >= 90 THEN 'A+'
        WHEN NEW.marks >= 80 THEN 'A'
        WHEN NEW.marks >= 70 THEN 'B'
        WHEN NEW.marks >= 60 THEN 'C'
        WHEN NEW.marks >= 50 THEN 'D'
        ELSE 'F'
    END
    WHERE result_id = NEW.result_id;
END;

-- 2. Trigger to notify low attendance (assuming a threshold of 75%)
CREATE TRIGGER notify_low_attendance
AFTER INSERT ON Attendance
FOR EACH ROW
BEGIN
    DECLARE attendance_percentage DECIMAL(5,2);
    DECLARE student_name VARCHAR(255);
    DECLARE course_name VARCHAR(255);

    SELECT s.name INTO student_name FROM Students s WHERE s.student_id = NEW.student_id;
    SELECT c.name INTO course_name FROM Courses c WHERE c.course_id = NEW.course_id;

    -- Calculate attendance percentage for the student in the course
    SELECT
        (COUNT(CASE WHEN status = 'Present' THEN 1 ELSE NULL END) / COUNT(*)) * 100
    INTO attendance_percentage
    FROM Attendance
    WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

    IF attendance_percentage < 75 THEN
        -- Insert into a notification table (you might need to create one)
        INSERT INTO Notifications (student_id, course_id, message, notification_date)
        VALUES (NEW.student_id, NEW.course_id, CONCAT('Low attendance (', attendance_percentage, '%) in ', course_name, ' for student ', student_name), NOW());
    END IF;
END;

-- 3. Trigger to validate enrollment before result entry
CREATE TRIGGER validate_enrollment_before_result
BEFORE INSERT ON Results
FOR EACH ROW
BEGIN
    DECLARE enrollment_exists INT;

    SELECT COUNT(*) INTO enrollment_exists
    FROM Enrollment
    WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

    IF enrollment_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot enter result: Student is not enrolled in this course.';
    END IF;
END;
