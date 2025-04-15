document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
    document.getElementById('attendanceSummaryForm').addEventListener('submit', handleGenerateReport);
});

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

async function handleGenerateReport(event) {
    event.preventDefault();
    const form = event.target;
    const courseId = form.course_id.value;

    try {
        const response = await fetch(`http://localhost:3000/api/reports/attendance-summary/${courseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.message === 'No attendance records found for this course') {
            document.getElementById('message').className = 'message warning';
            document.getElementById('message').textContent = data.message;
            document.getElementById('reportContainer').style.display = 'none';
            return;
        }

        displayReport(data);
        document.getElementById('message').textContent = ''; // clear any previous messages
        document.getElementById('reportContainer').style.display = 'block';

    } catch (error) {
        console.error('Error loading report:', error);
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = `Error loading report: ${error.message}`;
        document.getElementById('reportContainer').style.display = 'none';
    }
}

function displayReport(data) {
    const reportTableBody = document.getElementById('reportTable').querySelector('tbody');
    reportTableBody.innerHTML = '';

    if (data.length === 0) {
        reportTableBody.innerHTML = '<tr><td colspan="6">No data available for this report.</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course_id}</td>
            <td>${item.course_name}</td>
            <td>${item.date}</td>
            <td>${item.present_count}</td>
            <td>${item.absent_count}</td>
            <td>${item.total_students}</td>
        `;
        reportTableBody.appendChild(row);
    });
}
