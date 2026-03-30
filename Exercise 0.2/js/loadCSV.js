fetch('data/televisions.csv')
    .then(response => response.text())
    .then(csvText => {
        const rows = csvText.trim().split('\n');
        const tbody = document.querySelector('#tv-table tbody');

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            const tr = document.createElement('tr');

            cols.forEach(col => {
                const td = document.createElement('td');
                td.textContent = col;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        }
    })
    .catch(error => console.error('CSV load error:', error));

  