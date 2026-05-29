// js/loadCSV.js
let globalDataset = []; // Globally scoped storage array for downstream visualizations
let isDataLoaded = false; // State flag to prevent race conditions

document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    // Load and parse the television dataset to populate the HTML table page
    d3.csv(csvPath, function(d) {
        // Calculate energy metrics upfront using raw metrics
        const powerWatts = parseFloat(d["Avg_mode_power"]) || 0;
        const annualKwh = Math.round(powerWatts * 3.65);
        const annualCost = parseFloat((annualKwh * 0.30).toFixed(2));

        // Dynamically locate the star rating column cleanly
        let foundStarRating = 0;
        for (let originalKey in d) {
            if (originalKey.toLowerCase().trim().includes("star")) {
                let rawVal = d[originalKey];
                if (rawVal !== undefined && rawVal !== null && rawVal.trim() !== "") {
                    foundStarRating = parseFloat(rawVal);
                    break;
                }
            }
        }
        if (!foundStarRating) {
            foundStarRating = parseFloat(d["Star2"]) || parseFloat(d["Star"]) || 0;
        }

        return {
            brand: d["Brand_Reg"] || "Unknown",
            model: d["Model_No"] || "Unknown",
            screenTech: d["Screen_Tech"] || "N/A",
            starRating: isNaN(foundStarRating) ? 0 : foundStarRating, 
            energyConsumption: annualKwh,
            costPerYear: annualCost,
            size: d["Screen_Size"] || d["Size"] || d["Screen_Size_Inches"] || "N/A"
        };
    }).then(data => {
        if (!data || !data.length) throw new Error("No data found in televisions.csv");

        // Cache a completely clean clone safely
        globalDataset = JSON.parse(JSON.stringify(data));
        isDataLoaded = true; 

        // 1. Populate the HTML Table View safely if the container exists
        const tbody = d3.select("#tv-table tbody");
        if (!tbody.empty()) {
            tbody.selectAll("*").remove(); 
            globalDataset.slice(0, 50).forEach(d => {
                const row = tbody.append("tr");
                row.append("td").text(`${d.brand} ${d.model}`.trim());
                row.append("td").text(d.screenTech);
                row.append("td").text(d.starRating > 0 ? `${d.starRating.toFixed(1)} ★` : "N/A");
                row.append("td").text(`${d.energyConsumption} kWh`);
                row.append("td").text(`$${d.costPerYear.toFixed(2)}`);
            });
        }

        // 2. INITIALIZE BOTH CHARTS DYNAMICALLY
        // Boot Exercise 6.1 Histogram Chart
        if (typeof drawHistogram === "function") {
            drawHistogram(globalDataset);
        } else if (typeof updateHistogram === "function") {
            updateHistogram("all", globalDataset);
        }

        // Boot Exercise 6.2 Scatterplot Chart
        if (typeof drawScatterplot === "function") {
            drawScatterplot(globalDataset);
        }

        // 3. Initialize Interactive Filter Buttons Layout Context
        if (typeof populateFilters === "function") {
            populateFilters(globalDataset);
        }

        // Broadcast global notification event for navigation router architectures
        window.dispatchEvent(new CustomEvent("dataReady", { detail: globalDataset }));

    }).catch(err => {
        console.error("Error populating components:", err);
    });
});