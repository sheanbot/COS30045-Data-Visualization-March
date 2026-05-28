// js/loadCSV.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    // Load and parse the television dataset to populate the HTML table page
    d3.csv(csvPath).then(data => {
        if (!data || !data.length) throw new Error("No data found in televisions.csv");

        // Target the table body inside <section id="televisions">
        const tbody = d3.select("#tv-table tbody");
        tbody.selectAll("*").remove(); // Clear any static placeholder elements

        // Slice to the first 50 entries so the webpage loads instantly without lag
        const sampleEntries = data.slice(0, 50);

        sampleEntries.forEach(d => {
            const row = tbody.append("tr");

            // 1. Column: Model (Combine Brand Name and Model Number)
            const brand = d["Brand_Reg"] || "Unknown";
            const modelNum = d["Model_No"] || "";
            row.append("td").text(`${brand} ${modelNum}`.trim());

            // 2. Column: Technology
            row.append("td").text(d["Screen_Tech"] || "N/A");

            // 3. Column: Star Rating
            const stars = d["Star2"] ? `${parseFloat(d["Star2"]).toFixed(1)} ★` : "N/A";
            row.append("td").text(stars);

            // 4. Column: Annual Energy (kWh)
            // Note: The CSV provides "Avg_mode_power" in Watts. 
            // In Australia, annual kWh is typically calculated assuming ~10 hours of daily use:
            // (Watts * 10 hours * 365 days) / 1000 = Watts * 3.65
            const powerWatts = parseFloat(d["Avg_mode_power"]) || 0;
            const annualKwh = (powerWatts * 3.65).toFixed(0);
            row.append("td").text(`${annualKwh} kWh`);

            // 5. Column: Cost ($/Year)
            // Estimated using a standard Australian average electricity rate of $0.30 per kWh
            const annualCost = (annualKwh * 0.30).toFixed(2);
            row.append("td").text(`$${annualCost}`);
        });

    }).catch(err => {
        console.error("Error populating the television HTML table:", err);
        d3.select("#tv-table tbody").append("tr").append("td")
            .attr("colspan", 5)
            .style("color", "#dc2626")
            .style("text-align", "center")
            .text("Failed to load television table data.");
    });
});