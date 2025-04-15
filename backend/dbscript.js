const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',      // replace with your host
    user: 'root',           // replace with your MySQL username
    password: 'Satish@@1303',           // replace with your MySQL password
    database: 'college_database'  // replace with your database name
});

// Function to execute SQL file
function executeSqlFile(filePath, callback) {
    const sql = fs.readFileSync(path.resolve(filePath), 'utf8');  // Read the SQL file

    connection.query(sql, (err, results) => {
        if (err) {
            console.error(`Error executing SQL file: ${filePath}`);
            console.error(err);
            connection.end();  // Ensure we close the connection in case of error
            return;
        }
        console.log(`Successfully executed SQL file: ${filePath}`);
        callback();  // Execute the callback after successful execution
    });
}

// Execute SQL scripts in sequence
executeSqlFile('./database/sql/triggers.sql', () => {
    executeSqlFile('./database/sql/procedures.sql', () => {
        executeSqlFile('./database/sql/views.sql', () => {
            console.log('All SQL scripts executed successfully');
            connection.end();  // Close the database connection when done
        });
    });
});
