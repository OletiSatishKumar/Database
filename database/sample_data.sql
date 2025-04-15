-- Insert sample data into Students table
INSERT INTO Students (name, dob, email, department) VALUES
('Alice Smith', '2002-02-15', 'alice.smith@example.com', 'Computer Science'),
('Bob Johnson', '2001-05-20', 'bob.johnson@example.com', 'Electrical Engineering'),
('Charlie Brown', '2003-09-10', 'charlie.brown@example.com', 'Mechanical Engineering'),
('Diana Miller', '2002-11-05', 'diana.miller@example.com', 'Computer Science'),
('Ethan Davis', '2001-07-22', 'ethan.davis@example.com', 'Electrical Engineering');

-- Insert sample data into Faculty table
INSERT INTO Faculty (name, email, department) VALUES
('Prof. John Williams', 'john.williams@example.com', 'Computer Science'),
('Dr. Jane Anderson', 'jane.anderson@example.com', 'Electrical Engineering'),
('Prof. David Rodriguez', 'david.rodriguez@example.com', 'Mechanical Engineering');

-- Insert sample data into Courses table
INSERT INTO Courses (name, department, credits) VALUES
('Introduction to Programming', 'Computer Science', 3),
('Data Structures and Algorithms', 'Computer Science', 4),
('Circuit Analysis', 'Electrical Engineering', 3),
('Electromagnetics', 'Electrical Engineering', 4),
('Thermodynamics', 'Mechanical Engineering', 3),
('Fluid Mechanics', 'Mechanical Engineering', 4);

-- Insert sample data into Enrollment table
INSERT INTO Enrollment (student_id, course_id, semester) VALUES
(1, 1, 'Fall 2023'),  -- Alice enrolled in Intro to Programming in Fall 2023
(1, 2, 'Spring 2024'), -- Alice enrolled in Data Structures in Spring 2024
(2, 3, 'Fall 2023'),  -- Bob enrolled in Circuit Analysis in Fall 2023
(2, 4, 'Spring 2024'), -- Bob enrolled in Electromagnetics in Spring 2024
(3, 5, 'Fall 2023'),  -- Charlie enrolled in Thermodynamics in Fall 2023
(3, 6, 'Spring 2024'), -- Charlie enrolled in Fluid Mechanics in Spring 2024
(4,1, 'Fall 2023'),
(5,3,'Fall 2023');

-- Insert sample data into Attendance table
INSERT INTO Attendance (student_id, course_id, date, status) VALUES
(1, 1, '2023-10-26', 'Present'),
(1, 1, '2023-10-27', 'Absent'),
(2, 3, '2023-10-26', 'Present'),
(2, 3, '2023-10-27', 'Present'),
(3, 5, '2023-10-26', 'Present'),
(3, 5, '2023-10-27', 'Absent'),
(1, 1, '2023-11-02', 'Present'),
(4,1,'2023-11-02','Present'),
(5,3,'2023-11-02','Absent');

-- Insert sample data into Results table
INSERT INTO Results (student_id, course_id, marks, grade) VALUES
(1, 1, 85, 'B'),
(1, 2, 92, 'A+'),
(2, 3, 78, 'C'),
(2, 4, 88, 'B+'),
(3, 5, 95, 'A+'),
(3, 6, 82, 'A'),
(4,1,90,'A+'),
(5,3,65,'C');


SELECT * FROM Courses;
SELECT * FROM Enrollment;


DROP DATABASE college_database;
