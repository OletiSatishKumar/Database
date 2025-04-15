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
        document.getElementById('attendanceList').innerHTML = `
            <tr><td colspan="5" class="error">Error loading attendance: ${error.message}</td></tr>`;
    }
}

function displayAttendance(attendance) {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (attendance.length === 0) {
        attendanceList.innerHTML = '<tr><td colspan="5">No attendance records found.</td></tr>';
        return;
    }

    attendance.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.attendance_id}</td>
            <td>${record.student_name}</td>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.status}</td>
            <td>
                <button onclick="editAttendance(${record.attendance_id})">Edit</button>
                <button onclick="deleteAttendance(${record.attendance_id})">Delete</button>
            </td>
        `;
        attendanceList.appendChild(row);
    });
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
