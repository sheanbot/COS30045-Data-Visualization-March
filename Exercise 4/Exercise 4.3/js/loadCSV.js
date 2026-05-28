// js/loadCSV.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('data/televisions.csv')
        .then(response => {
            if (!response.ok) throw new Error("Network issue reading CSV");
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.trim().split('\n');
            const tbody = document.querySelector('#tv-table tbody');
            if(!tbody) return;
            tbody.innerHTML = ''; 

            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;

                // Split by column commas directly
                const cols = rows[i].split(',');
                const tr = document.createElement('tr');

                cols.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = col.replace(/^"|"$/g, '').trim(); 
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            }
        })
        .catch(error => console.error('Data Table CSV Error:', error));
});