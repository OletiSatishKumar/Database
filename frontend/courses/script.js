document.addEventListener("DOMContentLoaded", () => {
    loadCourses();
  });
  
  async function loadCourses() {
    try {
      const response = await fetch("http://localhost:3000/api/courses");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const courses = await response.json();
      displayCourses(courses);
    } catch (error) {
      console.error("Error loading courses:", error);
      document.getElementById(
        "courseList"
      ).innerHTML = `<tr><td colspan="6" class="error">Error loading courses: ${error.message}</td></tr>`;
    }
  }
  
  function displayCourses(courses) {
    const courseList = document.getElementById("courseList");
    courseList.innerHTML = ""; // Clear the table before adding new rows
    if (courses.length === 0) {
      courseList.innerHTML = '<tr><td colspan="6">No courses found.</td></tr>';
    } else {
      courses.forEach((course) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${course.course_id}</td>
                  <td>${course.name}</td>
                  <td>${course.department}</td>
                  <td>${course.faculty_id ? course.faculty_id : "Not assigned"}</td>
                  <td>${course.credits}</td>
                  <td>
                      <button onclick="editCourse(${course.course_id})">Edit</button>
                  </td>
              `;
        courseList.appendChild(row);
      });
    }
  }
  
  function editCourse(courseId) {
    window.location.href = `edit.html?id=${courseId}`;
  }
  
  