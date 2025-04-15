document.addEventListener('DOMContentLoaded', () => {
    populateStudents();
    populateCourses();
    loadAttendanceDetails();
    document.getElementById('editAttendanceForm').addEventListener('submit', handleEditAttendance);
});

async function populateStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status}`);
        }
        const students = await response.json();
        const studentSelect = document.getElementById('student_id');
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.student_id;
            option.textContent = `${student.name} (${student.student_id})`;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = `Error fetching students: ${error.message}`;
    }
}

async function populateCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        const courses = await response.json();
        const courseSelect = document.getElementById('course_id');
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_id;
            option.textContent = `${course.name} (${course.course_id})`;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = `Error fetching courses: ${error.message}`;
    }
}

async function loadAttendanceDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const attendanceId = urlParams.get('id');
    if (!attendanceId) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Invalid attendance ID.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/attendance/${attendanceId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const attendance = await response.json();

        document.getElementById('attendance_id').value = attendance.attendance_id;
        document.getElementById('student_id').value = attendance.student_id;
        document.getElementById('course_id').value = attendance.course_id;
        document.getElementById('date').value = attendance.date;
        document.getElementById('status').value = attendance.status;

    } catch (error) {
        console.error('Error fetching attendance details:', error);
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = `Error fetching attendance details: ${error.message}`;
    }
}

async function handleEditAttendance(event) {
    event.preventDefault();
    const form = event.target;
    const attendanceId = document.getElementById('attendance_id').value;
    const formData = {
        student_id: form.student_id.value,
        course_id: form.course_id.value,
        date: form.date.value,
        status: form.status.value,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/attendance/${attendanceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to update attendance.';
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error updating attendance: ${error.message}`;
    }
}