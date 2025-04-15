function searchStudents() {
    const query = document.getElementById('searchQuery').value;
    const department = document.getElementById('searchDepartment').value;
    const studentId = document.getElementById('searchStudentId').value;

    let url = 'http://localhost:3000/api/students?';

    // Append query parameters based on user input
    if (query) {
        url += `name=${encodeURIComponent(query)}`;
    }
    if (department) {
        url += `&department=${encodeURIComponent(department)}`;
    }
    if (studentId) {
        url += `&student_id=${encodeURIComponent(studentId)}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const resultsDiv = document.getElementById('studentResults');
            resultsDiv.innerHTML = "";

            if (data.length === 0) {
                resultsDiv.innerHTML = "<p>No matching students found.</p>";
                return;
            }

            const list = document.createElement('ul');
            data.forEach(student => {
                const item = document.createElement('li');
                item.textContent = `Name: ${student.name}, Department: ${student.department}, ID: ${student.student_id}`;
                list.appendChild(item);
            });

            resultsDiv.appendChild(list);
        })
        .catch(err => {
            console.error("Error:", err);
        });
}
