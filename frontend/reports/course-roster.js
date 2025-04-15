document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
    document.getElementById('courseRosterForm').addEventListener('submit', handleGenerateReport);
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
        const response = await fetch(`http://localhost:3000/api/reports/course-roster/${courseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayReport(data);
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
        reportTableBody.innerHTML = '<tr><td colspan="5">No data available for this report.</td></tr>';
        return;
    }
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.course_id}</td>
            <td>${item.course_name}</td>
            <td>${item.student_id}</td>
            <td>${item.student_name}</td>
            <td>${item.email}</td>
        `;
        reportTableBody.appendChild(row);
    });
}
