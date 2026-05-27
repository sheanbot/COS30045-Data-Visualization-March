// Load the CSV file from the 'data' folder
fetch('data/televisions.csv')
    .then(response => response.text()) // Convert the response into plain text
    .then(csvText => {
        // Split the CSV text into an array of rows by new line
        const rows = csvText.trim().split('\n');
        
        // Select the table body element where rows will be inserted
        const tbody = document.querySelector('#tv-table tbody');
        tbody.innerHTML = ''; // Clear any existing placeholder rows

        // Loop through each row, starting from index 1 to skip the header
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue; // Skip empty rows

            // Since our new CSV has no commas inside quotes, we split simply by comma
            const cols = rows[i].split(',');

            // Create a new table row element
            const tr = document.createElement('tr');

            // Because the CSV columns perfectly match the HTML headers now:
            // cols[0] is Model, cols[1] is Technology, cols[2] is Star Rating, etc.
            cols.forEach(col => {
                const td = document.createElement('td'); // Create a <td> element
                td.textContent = col.trim();             // Set cell text to the column value
                tr.appendChild(td);                      // Add the cell to the current row
            });

            // Add the completed row to the table body
            tbody.appendChild(tr);
        }
    })
    // Handle any errors, e.g., file not found
    .catch(error => console.error('CSV load error:', error));