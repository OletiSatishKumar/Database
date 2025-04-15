// frontend/students/script.js
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
});

async function loadStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('studentList').innerHTML = `<li class="error">Error loading students: ${error.message}</li>`;
    }
}

function displayStudents(students) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${student.name} (${student.student_id}) - ${student.department}</span>
            <div class="actions">
                <button onclick="editStudent(${student.student_id})">Edit</button>
                <button onclick="deleteStudent(${student.student_id})">Delete</button>
            </div>
        `;
        studentList.appendChild(listItem);
    });
    if (students.length === 0) {
        studentList.innerHTML = '<li>No students found.</li>';
    }
}

function editStudent(studentId) {
    window.location.href = `edit.html?id=${studentId}`;
}

async function deleteStudent(studentId) {
    if (confirm(`Are you sure you want to delete student with ID ${studentId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadStudents(); // Reload the student list
        } catch (error) {
            console.error('Error deleting student:', error);
            alert(`Error deleting student: ${error.message}`);
        }
    }
}