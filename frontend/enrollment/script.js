document.addEventListener('DOMContentLoaded', () => {
    loadEnrollments();
});

async function loadEnrollments() {
    try {
        const response = await fetch('http://localhost:3000/api/enrollment');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const enrollments = await response.json();
        displayEnrollments(enrollments);
    } catch (error) {
        console.error('Error loading enrollments:', error);
        document.getElementById('enrollmentList').innerHTML = `<li class="error">Error loading enrollments: ${error.message}</li>`;
    }
}

function displayEnrollments(enrollments) {
    const enrollmentList = document.getElementById('enrollmentList');
    enrollmentList.innerHTML = '';
    enrollments.forEach(enrollment => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${enrollment.student_name} - ${enrollment.course_name} - ${enrollment.enrollment_date}</span>
            <div class="actions">
                <button onclick="editEnrollment(${enrollment.enrollment_id})">Edit</button>
                <button onclick="deleteEnrollment(${enrollment.enrollment_id})">Delete</button>
            </div>
        `;
        enrollmentList.appendChild(listItem);
    });
    if (enrollments.length === 0) {
        enrollmentList.innerHTML = '<li>No enrollments found.</li>';
    }
}

function editEnrollment(enrollmentId) {
    window.location.href = `edit.html?id=${enrollmentId}`;
}

async function deleteEnrollment(enrollmentId) {
    if (confirm(`Are you sure you want to delete enrollment with ID ${enrollmentId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/enrollment/${enrollmentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadEnrollments();
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            alert(`Error deleting enrollment: ${error.message}`);
        }
    }
}