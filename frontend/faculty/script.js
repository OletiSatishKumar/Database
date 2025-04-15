document.addEventListener("DOMContentLoaded", () => {
    loadFaculty();
  });
  
  async function loadFaculty() {
    try {
      const response = await fetch("http://localhost:3000/api/faculty");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const faculty = await response.json();
      displayFaculty(faculty);
    } catch (error) {
      console.error("Error loading faculty:", error);
      document.getElementById(
        "facultyList"
      ).innerHTML = `<tr><td colspan="5" class="error">Error loading faculty: ${error.message}</td></tr>`;
    }
  }
  
  function displayFaculty(faculty) {
    const facultyList = document.getElementById("facultyList");
    facultyList.innerHTML = ""; // Clear the table before adding new rows
    if (faculty.length === 0) {
      facultyList.innerHTML = '<tr><td colspan="5">No faculty found.</td></tr>';
    } else {
      faculty.forEach((member) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${member.faculty_id}</td>
                  <td>${member.name}</td>
                  <td>${member.email}</td>
                  <td>${member.department}</td>
                  <td>
                      <button onclick="editFaculty(${member.faculty_id})">Edit</button>
                      <button onclick="deleteFaculty(${member.faculty_id})">Delete</button>
                  </td>
              `;
        facultyList.appendChild(row);
      });
    }
  }
  
  function editFaculty(facultyId) {
    window.location.href = `edit.html?id=${facultyId}`;
  }
  
  async function deleteFaculty(facultyId) {
    if (confirm(`Are you sure you want to delete faculty member with ID ${facultyId}?`)) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/faculty/${facultyId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.message);
        loadFaculty();
      } catch (error) {
        console.error("Error deleting faculty:", error);
        alert(`Error deleting faculty: ${error.message}`);
      }
    }
  }
  