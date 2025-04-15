document.addEventListener('DOMContentLoaded', () => {
    loadEnrollments();
  });
  
  async function loadEnrollments() {
    try {
      const response = await fetch('http://localhost:3000/api/enrollment');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const enrollments = await response.json();
      displayEnrollments(enrollments);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      document.getElementById('enrollmentList').innerHTML = `
        <tr><td colspan="5" class="error">Error loading enrollments: ${error.message}</td></tr>`;
    }
  }
  
  function displayEnrollments(enrollments) {
    const enrollmentList = document.getElementById('enrollmentList');
    enrollmentList.innerHTML = '';
    if (enrollments.length === 0) {
      enrollmentList.innerHTML = '<tr><td colspan="5">No enrollments found.</td></tr>';
      return;
    }
  
    enrollments.forEach(enrollment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${enrollment.enrollment_id}</td>
        <td>${enrollment.student_name}</td>
        <td>${enrollment.course_name}</td>
        <td>${enrollment.semester}</td>
        <td class="actions">
          <button onclick="editEnrollment(${enrollment.enrollment_id})">Edit</button>
          <button onclick="deleteEnrollment(${enrollment.enrollment_id})">Delete</button>
        </td>
      `;
      enrollmentList.appendChild(row);
    });
  }
  
  function editEnrollment(enrollmentId) {
    window.location.href = `edit.html?id=${enrollmentId}`;
  }
  
  async function deleteEnrollment(enrollmentId) {
    if (confirm(`Are you sure you want to delete enrollment with ID ${enrollmentId}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/enrollment/${enrollmentId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.message);
        loadEnrollments();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        alert(`Error deleting enrollment: ${error.message}`);
      }
    }
  }
  