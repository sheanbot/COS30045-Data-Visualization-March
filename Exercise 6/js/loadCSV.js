// js/loadCSV.js
let globalDataset = []; // Globally scoped storage array for downstream visualizations

document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    d3.csv(csvPath, function(d) {
    // Calculate energy metrics safely
    const powerWatts = parseFloat(d["Avg_mode_power"]) || 0;
    const annualKwh = Math.round(powerWatts * 3.65);
    const annualCost = parseFloat((annualKwh * 0.30).toFixed(2));

    // DYNAMIC KEY MATCHING: Look for any common variation of the Star Rating column
    const rawStarValue = d["Star2"] || d["Star"] || d["Stars"] || d["Star_Rating"] || d["Star Rating"] || 0;
    const parsedStarRating = parseFloat(rawStarValue);

    // Return the cleaned object with standard properties
    return {
        brand: d["Brand_Reg"] || "Unknown",
        model: d["Model_No"] || "Unknown",
        screenTech: d["Screen_Tech"] || "N/A",
        starRating: isNaN(parsedStarRating) ? 0 : parsedStarRating, // Fallback safely if string parsing fails
        energyConsumption: annualKwh,
        costPerYear: annualCost,
        size: d["Screen_Size"] || d["Size"] || "N/A"
    };
    }).then(data => {
        if (!data || !data.length) throw new Error("No data found in televisions.csv");

        // Cache the parsed rows so charts can access clean structures instantly
        globalDataset = data;

        // Target the table body inside <section id="televisions">
        const tbody = d3.select("#tv-table tbody");
        tbody.selectAll("*").remove(); // Clear any static placeholder elements

        // Slice to the first 50 entries so the webpage loads instantly without lag
        const sampleEntries = globalDataset.slice(0, 50);

        sampleEntries.forEach(d => {
            const row = tbody.append("tr");

            // 1. Column: Model (Combine Brand Name and Model Number)
            row.append("td").text(`${d.brand} ${d.model}`.trim());

            // 2. Column: Technology
            row.append("td").text(d.screenTech);

            // 3. Column: Star Rating
            row.append("td").text(d.starRating > 0 ? `${d.starRating.toFixed(1)} ★` : "N/A");

            // 4. Column: Annual Energy (kWh)
            row.append("td").text(`${d.energyConsumption} kWh`);

            // 5. Column: Cost ($/Year)
            row.append("td").text(`$${d.costPerYear.toFixed(2)}`);
        });

        // Initialize visualization components safely if they exist on the current page context
        if (typeof drawScatterplot === "function") {
            drawScatterplot(globalDataset);
        }

    }).catch(err => {
        console.error("Error populating the television HTML table:", err);
        d3.select("#tv-table tbody").append("tr").append("td")
            .attr("colspan", 5)
            .style("color", "#dc2626")
            .style("text-align", "center")
            .text("Failed to load television table data.");
    });
});