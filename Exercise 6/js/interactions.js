// js/interactions.js

// Step 7.1 & 7.3: Populate Filters and Attach Interaction Listeners
function populateFilters(globalDataset) {
    const filterContainer = d3.select("#filters-container");
    filterContainer.selectAll("*").remove(); // Clear prior entries

    // Bind state array to create interactive buttons
    const buttons = filterContainer.selectAll("button.filter-btn")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter-btn ${d.isActive ? "active" : ""}`)
        .text(d => d.label);

    // Attach click event listeners
    buttons.on("click", function(event, selectedFilter) {
        // Enforce active single-selection state ruleset
        filters_screen.forEach(f => f.isActive = (f.id === selectedFilter.id));
        
        // Update button visual classes immediately
        buttons.classed("active", d => d.isActive);

        // Pass selection criteria down to update the visualization
        updateHistogram(selectedFilter.id, globalDataset);
    });
}

// Step 7.4: Filter Data and Handle Transition Animations
function updateHistogram(techId, rawDataset) {
    // Filter dataset based on screen technology selection
    let updatedData = (techId === "all") 
        ? rawDataset 
        : rawDataset.filter(d => d.screenTech === techId);

    // Recompute histogram bin segments
    const updatedBins = binGenerator(updatedData);

    // Recalculate Y domain with a 10% safety cushion
    const maxY = d3.max(updatedBins, d => d.length) || 0;
    ex6Scales.yScale.domain([0, maxY + Math.ceil(maxY * 0.1)]);

    const svg = d3.select("#histogram-chart svg");
    const innerChartGroup = svg.select("g.inner-chart-group");

    // Animate Y-Axis modifications smoothly
    innerChartGroup.select(".y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(ex6Scales.yScale).ticks(8));

    // Execute D3 Data Join protocols over bars
    innerChartGroup.selectAll("rect.histogram-bar")
        .data(updatedBins)
        .join(
            enter => enter.append("rect")
                .attr("class", "histogram-bar")
                .attr("x", d => ex6Scales.xScale(d.x0))
                .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0)))
                .attr("y", ex6Dimensions.innerH) 
                .attr("height", 0)
                .attr("fill", ex6Colors.barFill)
                .attr("stroke", ex6Colors.gapColor)
                .attr("stroke-width", "1.5px"),
            update => update,
            exit => exit.transition().duration(250).attr("height", 0).attr("y", ex6Dimensions.innerH).remove()
        )
        // Apply responsive smooth cubic transition
        .transition()
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr("x", d => ex6Scales.xScale(d.x0))
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0)))
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => ex6Dimensions.innerH - ex6Scales.yScale(d.length));
}

// Filter logic example when a user clicks a display panel button
const filteredData = globalData.filter(d => {
    if (activeFilter === "All") return true;
    return d.screenTech === activeFilter; // <--- Must look for d.screenTech
});