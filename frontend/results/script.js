document.addEventListener('DOMContentLoaded', () => {
    loadResults();
});

async function loadResults() {
    try {
        const response = await fetch('http://localhost:3000/api/results');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Error loading results:', error);
        document.getElementById('resultsList').innerHTML = `<tr><td colspan="4" class="error">Error loading results: ${error.message}</td></tr>`;
    }
}

function displayResults(results) {
    const resultsTableBody = document.getElementById('resultsList');
    resultsTableBody.innerHTML = ''; // Clear the loading message

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.student_name}</td>
            <td>${result.course_name}</td>
            <td>${result.marks}</td>
            <td>${result.grade}</td>
            <td>
                <button onclick="editResult(${result.result_id})">Edit</button>
                <button onclick="deleteResult(${result.result_id})">Delete</button>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });

    if (results.length === 0) {
        resultsTableBody.innerHTML = '<tr><td colspan="5">No results found.</td></tr>';
    }
}

function editResult(resultId) {
    window.location.href = `edit.html?id=${resultId}`;
}

async function deleteResult(resultId) {
    if (confirm(`Are you sure you want to delete result with ID ${resultId}?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/results/${resultId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            loadResults();
        } catch (error) {
            console.error('Error deleting result:', error);
            alert(`Error deleting result: ${error.message}`);
        }
    }
}
