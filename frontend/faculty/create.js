document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addFacultyForm').addEventListener('submit', handleAddFaculty);
});

async function handleAddFaculty(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        department: form.department.value,
    };

    try {
        const response = await fetch('http://localhost:3000/api/faculty', {
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
            messageDiv.textContent = result.error || 'Failed to add faculty member.';
        }
    } catch (error) {
        console.error('Error adding faculty member:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error adding faculty member: ${error.message}`;
    }
}