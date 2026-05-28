// js/ex4-3-bar.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/televisions.csv";

    // Request data and parse the Brand and Power consumption metrics
    d3.csv(csvPath, d => {
        let brandName = (d["Brand_Reg"] || "Unknown Brand").trim().toUpperCase();
        
        // Normalize common brand variations so they merge into a single row
        if (brandName.includes("SAMSUNG")) brandName = "SAMSUNG";
        if (brandName.includes("SPARK")) brandName = "SPARK ELECTRONICS";
        if (brandName.includes("TCL")) brandName = "TCL";
        if (brandName.includes("KOGAN")) brandName = "KOGAN";

        return {
            brand: brandName,
            energy: +(d["Avg_mode_power"] || 0)
        };
    }).then(rawData => {
        if (!rawData || !rawData.length) throw new Error("Dataset is empty or structural parse failed.");
        
        // =============================================================
        // STEP 1: AGGREGATE DATA BY BRAND (GROUP BY)
        // =============================================================
        const brandTotals = {};
        const brandCounts = {};

        rawData.forEach(d => {
            if (!brandTotals[d.brand]) {
                brandTotals[d.brand] = 0;
                brandCounts[d.brand] = 0;
            }
            brandTotals[d.brand] += d.energy;
            brandCounts[d.brand] += 1;
        });

        // Convert the grouped data into an array of averages
        let aggregatedData = Object.keys(brandTotals).map(brandKey => {
            return {
                brand: brandKey,
                energy: brandTotals[brandKey] / brandCounts[brandKey] // Calculates average power
            };
        });

        // 2. Sort descending by highest average power consumption
        aggregatedData.sort((a, b) => b.energy - a.energy);
        
        // 3. Take the top 15 unique brands to display
        const topUniqueBrands = aggregatedData.slice(0, 15);
        
        // Trigger the drawing engine
        createBarChart(topUniqueBrands);
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
        // --- CANVAS SCALING PARAMETERS ---
        const viewBoxW = 1400; 
        const rowHeightAlloc = 55; 
        const margins = { top: 40, right: 140, bottom: 50, left: 240 }; 
        
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
            .style("box-shadow", "0 4px 12px rgba(0,0,0,0.04)");

        // Base transform group to respect global outer page margins
        const mainGroup = svg.append("g")
            .attr("transform", `translate(${margins.left}, ${margins.top})`);

        // --- SCALES CONFIGURATION ---
        const maxEnergy = d3.max(data, d => d.energy) || 100;
        const xScale = d3.scaleLinear()
            .domain([0, maxEnergy * 1.05]) // 5% buffer on the right for text padding
            .range([0, innerW]);

        // Since brands are now completely unique, we can safely use brand names as the domain directly
        const yScale = d3.scaleBand()
            .domain(data.map(d => d.brand)) 
            .range([0, innerH])
            .padding(0.25); 

        // --- OBJECT GROUP HOLDERS (<g>) FOR BARS & LABELS ---
        const barAndLabel = mainGroup.selectAll("g.bar-row")
            .data(data)
            .join("g")
            .attr("class", "bar-row")
            .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

        // --- APPEND THE HORIZONTAL BARS ---
        barAndLabel.append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", 0) 
            .attr("width", d => xScale(d.energy))
            .attr("height", yScale.bandwidth())
            .attr("fill", "#2e7d32")
            .style("cursor", "pointer")
            .on("mouseover", function() { d3.select(this).attr("fill", "#1b5e20"); })
            .on("mouseout", function() { d3.select(this).attr("fill", "#2e7d32"); });

        // --- APPEND BRAND LABELS (ONE UNIQUE ENTRY PER BRAND) ---
        barAndLabel.append("text")
            .text(d => d.brand) 
            .attr("x", -15) 
            .attr("y", yScale.bandwidth() / 2 + 5) 
            .attr("text-anchor", "end")
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", "#1e293b");

        // --- APPEND DATA METRIC VALUES (AVERAGE POWER) ---
        barAndLabel.append("text")
            .text(d => `${d.energy.toFixed(1)} W (Avg)`)
            .attr("x", d => xScale(d.energy) + 12) 
            .attr("y", yScale.bandwidth() / 2 + 5) 
            .attr("text-anchor", "start")
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "13px")
            .style("font-weight", "600")
            .style("fill", "#475569");

        // --- ADD BOTTOM GRID AXIS LINE FOR REFERENCE ---
        const xAxis = d3.axisBottom(xScale).ticks(8);
        mainGroup.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${innerH})`)
            .call(xAxis)
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "12px")
            .style("color", "#64748b");
    }
});