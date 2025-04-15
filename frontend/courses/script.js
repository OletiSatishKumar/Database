document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});

async function loadCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courseList').innerHTML = `<li class="error">Error loading courses: ${error.message}</li>`;
    }
}

function displayCourses(courses) {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    courses.forEach(course => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${course.name} (${course.course_id}) - ${course.department} (${course.credits} credits)</span>
            <div class="actions">
                <button onclick="editCourse(${course.course_id})">Edit</button>
                <button onclick="deleteCourse(${course.course_id})">Delete</button>
            </div>
        `;
        courseList.appendChild(listItem);
    });
    if (courses.length === 0) {
        courseList.innerHTML = '<li>No courses found.</li>';
    }
}

function editCourse(courseId) {
    window.location.href = `edit.html?id=${courseId}`;
}

async function deleteCourse(courseId) {
    if (confirm(`Are you sure you want to delete course with ID ${courseId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert(`Error deleting course: ${error.message}`);
        }
    }
}
