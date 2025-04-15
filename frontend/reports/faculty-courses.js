document.addEventListener('DOMContentLoaded', () => {
    loadReport();
});

async function loadReport() {
    try {
        const response = await fetch('http://localhost:3000/api/reports/faculty-courses');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayReport(data);
    } catch (error) {
        console.error('Error loading report:', error);
        document.getElementById('reportTable').querySelector('tbody').innerHTML = `<tr><td colspan="5" class="error">Error loading report: ${error.message}</td></tr>`;
    }
}

function displayReport(data) {
    const reportTableBody = document.getElementById('reportTable').querySelector('tbody');
    reportTableBody.innerHTML = '';
    if (data.length === 0) {
        reportTableBody.innerHTML = '<tr><td colspan="5">No data available for this report.</td></tr>';
        return;
    }
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.faculty_id}</td>
            <td>${item.faculty_name}</td>
            <td>${item.email}</td>
            <td>${item.course_id}</td>
            <td>${item.course_name}</td>
        `;
        reportTableBody.appendChild(row);
    });
}
