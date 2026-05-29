// js/ex6-scatterplot.js

function drawScatterplot(dataset) {
    var container = d3.select("#scatterplot-chart");
    if (container.empty()) return; // Stop if the container element doesn't exist on this page view
    container.selectAll("*").remove(); // Prevent canvas layout corruption on hot-reloads

    // REFRESH LIFECYCLE FIX: If router sends an empty or broken array on refresh, fallback to global cache
    var safeDataset = (dataset && dataset.length > 0) ? dataset : globalDataset;
    if (!safeDataset || safeDataset.length === 0) {
        console.warn("Scatterplot waiting for globalDataset array to finish loading...");
        return; 
    }

    var svg = container.append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("width", "100%")
        .style("height", "auto")
        .style("display", "block");

    // Inner plotting group offset by padding
    innerChartS = svg.append("g")
        .attr("class", "inner-scatterplot-group")
        .attr("transform", "translate(" + padding + ", 40)");

    // Configure numerical mapping bounds (X-axis ranges up to 8.5 stars)
    ex6ScalesScatter.xScaleS
        .domain([0, 8.5]) 
        .range([0, innerW]);

    // Energy Consumption y-axis ceiling metrics
    ex6ScalesScatter.yScaleS
        .domain([0, 2600]) 
        .range([innerH, 0]);

    // Categorical color mapping matching your tech strings
    ex6ScalesScatter.colorScale
        .domain(["LED", "LCD", "OLED"])
        .range(["#3b82f6", "#f97316", "#22c55e"]); 

    // --- RENDER AXES ---
    innerChartS.append("g")
        .attr("class", "x-axis-s")
        .attr("transform", "translate(0, " + innerH + ")")
        .call(d3.axisBottom(ex6ScalesScatter.xScaleS).ticks(9).tickFormat(d3.format(".1f")))
        .style("font-size", "11px");

    innerChartS.append("g")
        .attr("class", "y-axis-s")
        .call(d3.axisLeft(ex6ScalesScatter.yScaleS).ticks(12).tickFormat(d3.format(",")))
        .style("font-size", "11px");

    // Axis Labels
    innerChartS.append("text")
        .attr("x", innerW)
        .attr("y", innerH + 40)
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("fill", "#475569")
        .text("Star Rating");

    innerChartS.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerH / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("fill", "#475569")
        .text("Labeled Energy Consumption (kWh/year)");

    // --- PLOT SCATTER POINTS ---
    var circles = innerChartS.selectAll("circle.scatterplot-dot")
        .data(safeDataset) // Using our verified safe data structure
        .join("circle")
        .attr("class", "scatterplot-dot")
        .attr("cx", d => ex6ScalesScatter.xScaleS(d.starRating || 0)) 
        .attr("cy", d => ex6ScalesScatter.yScaleS(d.energyConsumption || 0)) 
        .attr("r", 5.5)
        .attr("fill", d => ex6ScalesScatter.colorScale(d.screenTech || "LED"))
        .attr("opacity", 0.65)
        .attr("data-brand", d => d.brand)
        .attr("data-model", d => d.model)
        .attr("data-size", d => d.size)
        .attr("data-tech", d => d.screenTech);

    // --- BUILD CATEGORICAL LEGEND ---
    var legend = innerChartS.append("g")
        .attr("class", "chart-legend")
        .attr("transform", "translate(" + (innerW - 100) + ", 20)");

    var technologicalCategories = ex6ScalesScatter.colorScale.domain();
    
    technologicalCategories.forEach((techName, index) => {
        var legendRow = legend.append("g")
            .attr("transform", "translate(0, " + (index * 20) + ")");

        legendRow.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", ex6ScalesScatter.colorScale(techName));

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .style("font-size", "12px")
            .style("fill", "#1e293b")
            .text(techName);
    });

    // --- INTERACTION WIRING ---
    createTooltip();
    HandleMouseEvents(circles); 
}