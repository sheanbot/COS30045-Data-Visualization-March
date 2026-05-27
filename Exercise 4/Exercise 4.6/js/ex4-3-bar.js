// js/ex4-3-bar.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    // Request data and cast numeric column parameters cleanly
    d3.csv(csvPath, d => {
        // Fallback checks to prevent script crashing if column headers are slightly off
        const modelName = d["Model"] || d["model"] || "Unknown Model";
        const energyValue = d["Annual Energy (kWh)"] || d["energy"] || d["Annual Energy"] || 0;

        return {
            model: modelName.trim(),
            technology: d["Technology"] || "N/A",
            starRating: d["Star Rating"] || "0",
            energy: +energyValue, // Cast string to number explicitly
            cost: d["Cost ($/Year)"] || "$0"
        };
    }).then(data => {
        if (!data || !data.length) throw new Error("Dataset is empty or structural parse failed.");
        
        // Sort descending by highest energy consumption
        data.sort((a, b) => b.energy - a.energy);
        
        // Trigger the upscaled drawing engine
        createBarChart(data);
    }).catch(err => {
        console.error("D3 Engine Error Details:", err);
        // Visual indicator on screen if data loading failed
        d3.select("#chart-container").selectAll("*").remove();
        d3.select("#chart-container").append("div")
          .style("color", "#dc2626")
          .style("padding", "20px")
          .style("background", "#fee2e2")
          .style("border-radius", "6px")
          .html(`<strong>Failed to render chart:</strong> ${err.message}<br><small>Check browser console (F12) for detailed logs.</small>`);
    });

    function createBarChart(data) {
        // --- GIANT CANVAS SCALING PARAMETERS ---
        const viewBoxW = 1400; // Expanded base aspect canvas width 
        const rowHeightAlloc = 65; // Height dedicated to each item track
        const margins = { top: 40, right: 120, bottom: 40, left: 260 }; 
        
        const innerW = viewBoxW - margins.left - margins.right;
        const innerH = data.length * rowHeightAlloc;
        const viewBoxH = innerH + margins.top + margins.bottom; 

        // Clean out target container before appending fresh SVG elements
        const container = d3.select("#chart-container");
        container.selectAll("*").remove();

        // Safety: If innerH calculations result in zero or invalid math, stop execution
        if (isNaN(innerH) || innerH <= 0) {
            console.error("Invalid dimensions computed: innerH =", innerH);
            return;
        }

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
            .style("border", "1px solid #cbd5e1")
            .style("background-color", "#ffffff")
            .style("border-radius", "8px")
            .style("box-shadow", "0 6px 16px rgba(0,0,0,0.06)");

        const g = svg.append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);

        // --- SCALES CONFIGURATION ---
        const maxEnergy = d3.max(data, d => d.energy) || 100;
        const xScale = d3.scaleLinear()
            .domain([0, maxEnergy])
            .range([0, innerW]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.model))
            .range([0, innerH])
            .padding(0.18); // Thick bold bars look

        // --- DRAW BARS ---
        g.selectAll("rect.bar")
            .data(data)
            .join("rect")
            .attr("class", d => `bar bar-${d.energy}`)
            .attr("x", 0)
            .attr("y", d => yScale(d.model))
            .attr("width", d => xScale(d.energy))
            .attr("height", yScale.bandwidth())
            .attr("fill", "#2e7d32")
            .style("cursor", "pointer")
            .style("transition", "fill 0.2s ease")
            .on("mouseover", function() { d3.select(this).attr("fill", "#1b5e20"); })
            .on("mouseout", function() { d3.select(this).attr("fill", "#2e7d32"); });

        // --- DATA VALUE LABELS (RIGHT SIDE) ---
        g.selectAll("text.val")
            .data(data)
            .join("text")
            .attr("class", "val")
            .attr("x", d => xScale(d.energy) + 14) 
            .attr("y", d => yScale(d.model) + yScale.bandwidth() / 2 + 5) 
            .text(d => `${d.energy} kWh`)
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .attr("fill", "#475569")
            .attr("font-family", "system-ui, sans-serif");

        // --- MODEL BRAND LABELS (LEFT SIDE) ---
        g.selectAll("text.label")
            .data(data)
            .join("text")
            .attr("class", "label")
            .attr("x", -18) 
            .attr("y", d => yScale(d.model) + yScale.bandwidth() / 2 + 5)
            .attr("text-anchor", "end")
            .text(d => d.model)
            .attr("font-size", "14px")
            .attr("font-weight", "500")
            .attr("fill", "#1e293b")
            .attr("font-family", "system-ui, sans-serif");
    }
});