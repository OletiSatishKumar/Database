document.addEventListener('DOMContentLoaded', () => {
    loadFacultyDetails();
    document.getElementById('editFacultyForm').addEventListener('submit', handleEditFaculty);
});

async function loadFacultyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const facultyId = urlParams.get('id');
    if (!facultyId) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Invalid faculty ID.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/faculty/${facultyId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const faculty = await response.json();

        document.getElementById('faculty_id').value = faculty.faculty_id;
        document.getElementById('name').value = faculty.name;
        document.getElementById('email').value = faculty.email;
        document.getElementById('department').value = faculty.department;

    } catch (error) {
        console.error('Error fetching faculty details:', error);
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = `Error fetching faculty details: ${error.message}`;
    }
}

async function handleEditFaculty(event) {
    event.preventDefault();
    const form = event.target;
    const facultyId = document.getElementById('faculty_id').value;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        department: form.department.value,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/faculty/${facultyId}`, {
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
            messageDiv.textContent = result.error || 'Failed to update faculty member.';
        }
    } catch (error) {
        console.error('Error updating faculty member:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error updating faculty member: ${error.message}`;
    }
}