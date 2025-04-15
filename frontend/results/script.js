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
        document.getElementById('resultsList').innerHTML = `<li class="error">Error loading results: ${error.message}</li>`;
    }
}

function displayResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${result.student_name} - ${result.course_name} - Marks: ${result.marks} - Grade: ${result.grade}</span>
            <div class="actions">
                <button onclick="editResult(${result.result_id})">Edit</button>
                <button onclick="deleteResult(${result.result_id})">Delete</button>
            </div>
        `;
        resultsList.appendChild(listItem);
    });
    if (results.length === 0) {
        resultsList.innerHTML = '<li>No results found.</li>';
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