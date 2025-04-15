document.addEventListener('DOMContentLoaded', () => {
    loadFaculty();
});

async function loadFaculty() {
    try {
        const response = await fetch('http://localhost:3000/api/faculty');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const faculty = await response.json();
        displayFaculty(faculty);
    } catch (error) {
        console.error('Error loading faculty:', error);
        document.getElementById('facultyList').innerHTML = `<li class="error">Error loading faculty: ${error.message}</li>`;
    }
}

function displayFaculty(faculty) {
    const facultyList = document.getElementById('facultyList');
    facultyList.innerHTML = '';
    faculty.forEach(member => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${member.name} - ${member.email} - ${member.department}</span>
            <div class="actions">
                <button onclick="editFaculty(${member.faculty_id})">Edit</button>
                <button onclick="deleteFaculty(${member.faculty_id})">Delete</button>
            </div>
        `;
        facultyList.appendChild(listItem);
    });
    if (faculty.length === 0) {
        facultyList.innerHTML = '<li>No faculty members found.</li>';
    }
}

function editFaculty(facultyId) {
    window.location.href = `edit.html?id=${facultyId}`;
}

async function deleteFaculty(facultyId) {
    if (confirm(`Are you sure you want to delete faculty member with ID ${facultyId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/faculty/${facultyId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadFaculty();
        } catch (error) {
            console.error('Error deleting faculty member:', error);
            alert(`Error deleting faculty member: ${error.message}`);
        }
    }
}