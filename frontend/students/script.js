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

    if (students.length === 0) {
        studentList.innerHTML = '<tr><td colspan="5">No students found.</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td>${student.email || 'N/A'}</td>
            <td>${student.department || 'N/A'}</td>
            <td>
                <button 
                    onclick="editStudent(${student.student_id})" 
                    style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">
                    Edit
                </button>
            </td>
        `;
        studentList.appendChild(row);
    });
}



function editStudent(studentId) {
    window.location.href = `edit.html?id=${studentId}`;
}
