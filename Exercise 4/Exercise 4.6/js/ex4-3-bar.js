// js/ex4-3-bar.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    // Request data and cast numeric column parameters cleanly
    d3.csv(csvPath, d => {
        const modelName = d["Model"] || d["model"] || "Unknown Model";
        const energyValue = d["Annual Energy (kWh)"] || d["energy"] || d["Annual Energy"] || 0;

        return {
            model: modelName.trim(),
            technology: d["Technology"] || "N/A",
            starRating: d["Star Rating"] || "0",
            energy: +energyValue, 
            cost: d["Cost ($/Year)"] || "$0"
        };
    }).then(data => {
        if (!data || !data.length) throw new Error("Dataset is empty or structural parse failed.");
        
        // Sort descending by highest energy consumption
        data.sort((a, b) => b.energy - a.energy);
        
        // Trigger the drawing engine
        createBarChart(data);
    }).catch(err => {
        console.error("D3 Engine Error Details:", err);
        d3.select("#chart-container").selectAll("*").remove();
        d3.select("#chart-container").append("div")
          .style("color", "#dc2626")
          .style("padding", "20px")
          .style("background", "#fee2e2")
          .style("border-radius", "6px")
          .html(`<strong>Failed to render chart:</strong> ${err.message}`);
    });

    function createBarChart(data) {
        // --- GIANT CANVAS SCALING PARAMETERS ---
        const viewBoxW = 1400; 
        const rowHeightAlloc = 65; 
        const margins = { top: 40, right: 120, bottom: 40, left: 260 }; 
        
        const innerW = viewBoxW - margins.left - margins.right;
        const innerH = data.length * rowHeightAlloc;
        const viewBoxH = innerH + margins.top + margins.bottom; 

        // Clean out target container before appending fresh SVG elements
        const container = d3.select("#chart-container");
        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
            .style("border", "1px solid #cbd5e1")
            .style("background-color", "#ffffff")
            .style("border-radius", "8px")
            .style("box-shadow", "0 6px 16px rgba(0,0,0,0.06)");

        // Base transform group to respect global outer page margins
        const mainGroup = svg.append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);

        // --- SCALES CONFIGURATION ---
        const maxEnergy = d3.max(data, d => d.energy) || 100;
        const xScale = d3.scaleLinear()
            .domain([0, maxEnergy])
            .range([0, innerW]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.model))
            .range([0, innerH])
            .padding(0.2); 

        // =============================================================
        // STEP 2: CREATE OBJECT GROUP HELDERS (<g>) FOR BARS & LABELS
        // =============================================================
        // This selection binds data to structural group tags instead of direct rect elements.
        // The Y position is handled entirely by translating the parent group track!
        const barAndLabel = mainGroup.selectAll("g.bar-row")
            .data(data)
            .join("g")
            .attr("class", "bar-row")
            .attr("transform", d => `translate(0, ${yScale(d.model)})`);

        // =============================================================
        // STEP 3: APPEND THE RECTANGLES TO THE GROUP HOOKS
        // =============================================================
        // Notice that .attr("y", 0) because the group wrapper coordinates handle the vertical layout offset.
        barAndLabel.append("rect")
            .attr("class", d => `bar bar-${d.energy}`)
            .attr("x", 0)
            .attr("y", 0) // Reset to zero as per exercise rules
            .attr("width", d => xScale(d.energy))
            .attr("height", yScale.bandwidth())
            .attr("fill", "#2e7d32")
            .style("cursor", "pointer")
            .style("transition", "fill 0.2s ease")
            .on("mouseover", function() { d3.select(this).attr("fill", "#1b5e20"); })
            .on("mouseout", function() { d3.select(this).attr("fill", "#2e7d32"); });

        // =============================================================
        // STEP 4: APPEND CATEGORY TEXT (MODEL NAMES ON THE LEFT)
        // =============================================================
        barAndLabel.append("text")
            .text(d => d.model)
            .attr("x", -18) // Positioned slightly left of the starting bar line edge
            .attr("y", yScale.bandwidth() / 2 + 5) // Centered vertically relative to individual bar heights
            .attr("text-anchor", "end")
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .style("fill", "#1e293b");

        // =============================================================
        // STEP 5: APPEND COUNT VALUES (ENERGY CONSUMPTION VALUES ON THE RIGHT)
        // =============================================================
        barAndLabel.append("text")
            .text(d => `${d.energy} kWh`)
            .attr("x", d => xScale(d.energy) + 14) // Automatically offsets horizontally past the expanding scaled bar width
            .attr("y", yScale.bandwidth() / 2 + 5) // Centered vertically relative to individual bar heights
            .attr("text-anchor", "start")
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#475569");
    }
});