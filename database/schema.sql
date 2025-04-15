CREATE DATABASE college_database;
USE college_database;

show tables;

CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE Faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    credits INT
);

CREATE TABLE Enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    semester VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE KEY unique_enrollment (student_id, course_id, semester) -- Prevent duplicate enrollments
);

CREATE TABLE Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE KEY unique_attendance (student_id, course_id, date) -- Prevent duplicate attendance records for the same student, course, and date
);

CREATE TABLE Results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    marks INT,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE KEY unique_result (student_id, course_id) -- One result per student per course
);


ALTER TABLE Courses
ADD COLUMN faculty_id INT,
ADD FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);



ALTER TABLE Courses
    ADD COLUMN faculty_id INT,
    ADD FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);

-- Example: Assign faculty_id = 1 to course_id = 1
UPDATE Courses SET faculty_id = 1 WHERE course_id = 1;
