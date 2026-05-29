// js/ex6-histogram.js

var globalHistogramDataset = [];

document.addEventListener("DOMContentLoaded", () => {
    var dataPath = "data/Ex6_TVdata.csv";

    d3.csv(dataPath).then(function(cleanedDataset) {
        // Map raw strings to numerical formats safely
        globalHistogramDataset = cleanedDataset.map(d => ({
            brand: d.brand,
            model: d.model,
            screenTech: d.screenTech,
            screenSize: +d.screenSize || 0,
            energyConsumption: +d.energyConsumption || 0,
            starRating: +d.starRating || 0 // Ensures this is a strict number type
        }));
        
        // Find the absolute maximum energy consumption across the dataset
        var maxKwh = d3.max(globalHistogramDataset, d => d.energyConsumption) || 2800;
        
        // Establish standard X Scale domain for Histogram
        ex6Scales.xScale
            .domain([0, 2800]) // Match your target grid maximum limit
            .range([0, innerW]);

        // Anchor the bin generator domain permanently to prevent layout shifting
        binGenerator.domain(ex6Scales.xScale.domain());

        // FIX: Render both visualizations sequentially within the promise chain
        drawHistogram(globalHistogramDataset);
        populateFilters(globalHistogramDataset);
        
        // Initialize Scatterplot now that data is clean and fully parsed
        drawScatterplot(globalHistogramDataset);

    }).catch(function(error) {
        console.error("D3 error fetching TV data source:", error);
    });
});

function drawHistogram(dataset) {
    var container = d3.select("#histogram-chart");
    container.selectAll("*").remove(); // Prevent duplicate canvas build up

    var svg = container.append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("width", "100%")
        .style("height", "auto")
        .style("display", "block");

    var g = svg.append("g")
        .attr("class", "inner-chart-group")
        .attr("transform", "translate(" + padding + ", 40)");

    var initialBins = binGenerator(dataset);
    var maxFrequency = d3.max(initialBins, d => d.length) || 0;

    ex6Scales.yScale
        .domain([0, maxFrequency + 50]) // Extra breathing padding to avoid hitting canvas top ceiling
        .range([innerH, 0]);

    // Plot initial visual bar rows
    g.selectAll("rect.histogram-bar")
        .data(initialBins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => ex6Scales.xScale(d.x0))
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 1))
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => innerH - ex6Scales.yScale(d.length))
        .attr("fill", ex6Colors.barFill)
        .attr("stroke", ex6Colors.gapColor)
        .attr("stroke-width", "1px")
        .on("mouseover", function() { d3.select(this).attr("fill", ex6Colors.barHover); })
        .on("mouseout", function() { d3.select(this).attr("fill", ex6Colors.barFill); });

    // Draw X-axis
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + innerH + ")")
        .call(d3.axisBottom(ex6Scales.xScale).ticks(12))
        .style("font-size", "11px");

    // Draw Y-axis
    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(ex6Scales.yScale).ticks(8))
        .style("font-size", "11px");

    // Static text labels
    g.append("text")
        .attr("x", innerW / 2)
        .attr("y", innerH + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#475569")
        .text("Labeled Energy Consumption (kWh/year)");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerH / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#475569")
        .text("Frequency");
}