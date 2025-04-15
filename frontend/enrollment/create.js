document.addEventListener('DOMContentLoaded', () => {
    populateStudents();
    populateCourses();
    document.getElementById('addEnrollmentForm').addEventListener('submit', handleAddEnrollment);
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

async function handleAddEnrollment(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {
        student_id: form.student_id.value,
        course_id: form.course_id.value,
        enrollment_date: form.enrollment_date.value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/enrollment', {
            method: 'POST',
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
            form.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to add enrollment.';
        }
    } catch (error) {
        console.error('Error adding enrollment:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error adding enrollment: ${error.message}`;
    }
}