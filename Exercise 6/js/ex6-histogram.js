// js/ex6-histogram.js

function drawHistogram(dataset) {
    const container = d3.select("#histogram-chart");
    
    // GUARD: If container is missing, abort to prevent crashing
    if (container.empty()) {
        console.warn("Histogram container #histogram-chart not found in DOM.");
        return;
    }

    container.selectAll("*").remove(); // Clear previous drawing cycles

    // ASYNC REFRESH LIFECYCLE CHECK
    if (typeof isDataLoaded !== 'undefined' && (!isDataLoaded || !globalDataset || globalDataset.length === 0)) {
        console.log("Histogram rendering paused: Waiting for dataReady event...");
        window.addEventListener("dataReady", function handleReady(e) {
            drawHistogram(e.detail); 
            window.removeEventListener("dataReady", handleReady); 
        });
        return; 
    }

    var safeDataset = (dataset && dataset.length > 0) ? dataset : globalDataset;

    // Define standard D3 margins
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Split SVG and Group appending to ensure accurate class tagging
    var svgElement = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("width", "100%")
        .style("height", "auto")
        .style("display", "block");

    var svg = svgElement.append("g")
        .attr("class", "inner-chart-group") // Crucial selector for interaction updates
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // --- CONFIGURE GLOBAL X SCALE (Saved directly to ex6Scales) ---
    ex6Scales.xScale = d3.scaleLinear()
        .domain([0, 2800]) 
        .range([0, width]);

    // --- CONFIGURE D3 BINNING ---
    const histogram = d3.bin()
        .value(d => d.energyConsumption) 
        .domain(ex6Scales.xScale.domain())
        .thresholds(ex6Scales.xScale.ticks(14));   

    const bins = histogram(safeDataset);

    // --- CONFIGURE GLOBAL Y SCALE (Saved directly to ex6Scales) ---
    const yMax = d3.max(bins, d => d.length) || 0;
    ex6Scales.yScale = d3.scaleLinear()
        .domain([0, Math.max(1300, yMax)]) 
        .range([height, 0]);

    // --- RENDER AXES ---
    // X-Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(ex6Scales.xScale).ticks(14))
        .style("font-size", "11px");

    // Y-Axis
    svg.append("g")
        .attr("class", "y-axis") // Crucial selector for animation loops
        .call(d3.axisLeft(ex6Scales.yScale).ticks(13).tickFormat(d3.format(",")))
        .style("font-size", "11px");

    // --- AXIS LABELS ---
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .style("font-size", "11px")
        .style("fill", "#475569")
        .text("Labeled Energy Consumption (kWh/year)");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .attr("y", -10)
        .style("font-size", "11px")
        .style("fill", "#475569")
        .text("Frequency");

    // --- DRAW INITIAL BARS WITH THEME GRAPHS ---
    svg.selectAll("rect.histogram-bar")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => ex6Scales.xScale(d.x0) + 1) 
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 2))
        .attr("y", height) 
        .attr("height", 0)
        .style("fill", "#64748b") // Charcoal theme color
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => height - ex6Scales.yScale(d.length));

    // AUTOMATIC INVOCATION: Wire up interactive click events instantly
    if (typeof initializeDisplayFilters === "function") {
        initializeDisplayFilters(safeDataset);
    }
}