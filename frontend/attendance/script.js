document.addEventListener('DOMContentLoaded', () => {
    loadAttendance();
});

async function loadAttendance() {
    try {
        const response = await fetch('http://localhost:3000/api/attendance');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const attendance = await response.json();
        displayAttendance(attendance);
    } catch (error) {
        console.error('Error loading attendance:', error);
        document.getElementById('attendanceList').innerHTML = `<li class="error">Error loading attendance: ${error.message}</li>`;
    }
}

function displayAttendance(attendance) {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';
    attendance.forEach(record => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${record.student_name} - ${record.course_name} - ${record.date} - ${record.status}</span>
            <div class="actions">
                <button onclick="editAttendance(${record.attendance_id})">Edit</button>
                <button onclick="deleteAttendance(${record.attendance_id})">Delete</button>
            </div>
        `;
        attendanceList.appendChild(listItem);
    });
    if (attendance.length === 0) {
        attendanceList.innerHTML = '<li>No attendance records found.</li>';
    }
}

function editAttendance(attendanceId) {
    window.location.href = `edit.html?id=${attendanceId}`;
}

async function deleteAttendance(attendanceId) {
    if (confirm(`Are you sure you want to delete attendance record with ID ${attendanceId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/attendance/${attendanceId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadAttendance();
        } catch (error) {
            console.error('Error deleting attendance record:', error);
            alert(`Error deleting attendance record: ${error.message}`);
        }
    }
}
