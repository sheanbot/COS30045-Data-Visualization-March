// js/ex6-histogram.js

document.addEventListener("DOMContentLoaded", () => {
    // Targets the lab spec dataset file path
    const dataPath = "data/Ex6_TVdata.csv";

    // Asynchronous loader reading camelCase columns from Ex6_TVdata.csv
    d3.csv(dataPath, d => {
        return {
            brand: d.brand, 
            model: d.model,
            screenTech: d.screenTech, 
            screenSize: +d.screenSize || 0,
            energyConsumption: +d.energyConsumption || 0, 
            starRating: +d.starRating || 0
        };
    }).then(cleanedDataset => {
        console.log("Ex6_TVdata.csv loaded. Total rows parsed:", cleanedDataset.length);
        
        // Initialize visualization components
        drawHistogram(cleanedDataset);
        populateFilters(cleanedDataset);
    }).catch(error => {
        console.error("Error loading Ex6_TVdata.csv dataset:", error);
    });
});

// Step 6: Initial Histogram Renderer
function drawHistogram(dataset) {
    const container = d3.select("#histogram-chart");
    container.selectAll("*").remove(); // Prevent duplicate layout accumulation

    // Construct responsive scaling ViewBox container
    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${ex6Dimensions.viewBoxW} ${ex6Dimensions.viewBoxH}`)
        .style("width", "100%")
        .style("height", "auto")
        .style("display", "block");

    // Establish transformed inner coordinate area
    const g = svg.append("g")
        .attr("class", "inner-chart-group")
        .attr("transform", `translate(${ex6Dimensions.margins.left}, ${ex6Dimensions.margins.top})`);

    // Compile initial dataset slice records grouping buckets
    const initialBins = binGenerator(dataset);

    // Derive scale bounds
    const xMin = d3.min(initialBins, d => d.x0);
    const xMax = d3.max(initialBins, d => d.x1);
    const maxY = d3.max(initialBins, d => d.length) || 0;

    ex6Scales.xScale
        .domain([xMin, xMax])
        .range([0, ex6Dimensions.innerW]);

    ex6Scales.yScale
        .domain([0, maxY + Math.ceil(maxY * 0.1)]) // 10% vertical padding safety margin
        .range([ex6Dimensions.innerH, 0]);

    // Step 6.4: Populate initial vector bars
    g.selectAll("rect.histogram-bar")
        .data(initialBins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => ex6Scales.xScale(d.x0))
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0)))
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => ex6Dimensions.innerH - ex6Scales.yScale(d.length))
        .attr("fill", ex6Colors.barFill)
        .attr("stroke", ex6Colors.gapColor)
        .attr("stroke-width", "1.5px")
        // Micro-interactions feedback loop assignments
        .on("mouseover", function() { d3.select(this).attr("fill", ex6Colors.barHover); })
        .on("mouseout", function() { d3.select(this).attr("fill", ex6Colors.barFill); });

    // Step 6.5: Draw x-axis
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${ex6Dimensions.innerH})`)
        .call(d3.axisBottom(ex6Scales.xScale).ticks(10))
        .style("font-size", "11px");

    // Step 6.6: Draw y-axis
    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(ex6Scales.yScale).ticks(8))
        .style("font-size", "11px");

    // Static horizontal alignment label descriptions
    g.append("text")
        .attr("x", ex6Dimensions.innerW / 2)
        .attr("y", ex6Dimensions.innerH + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", ex6Colors.textPrimary)
        .text("Annual Energy Consumption (kWh/year)");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -ex6Dimensions.innerH / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", ex6Colors.textPrimary)
        .text("Frequency (Number of Models)");
}

// Configure the histogram bin layouts
const histogramGenerator = d3.histogram()
    .value(d => d.energyConsumption) // <--- Check this line verbatim!
    .domain(xScale.domain())
    .thresholds(xScale.ticks(20)); // Adjust bin sizing counts