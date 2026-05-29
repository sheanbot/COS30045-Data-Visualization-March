// js/interactions.js

function populateFilters(globalDataset) {
    var filterContainer = d3.select("#filters-container");
    filterContainer.selectAll("*").remove(); 

    var buttons = filterContainer.selectAll("button.filter-btn")
        .data(filters_screen)
        .join("button")
        .attr("class", d => "filter-btn " + (d.isActive ? "active" : ""))
        .text(d => d.label);

    buttons.on("click", function(event, selectedFilter) {
        filters_screen.forEach(f => f.isActive = (f.id === selectedFilter.id));
        buttons.classed("active", d => d.isActive);

        updateHistogram(selectedFilter.id, globalDataset);
    });
}

// Exercise 6.2 Animation Sequences
function updateHistogram(techId, rawDataset) {
    var updatedData = (techId === "all") 
        ? rawDataset 
        : rawDataset.filter(d => d.screenTech === techId);

    // Bins maintain steady bounds because domain structure was safely anchored on boot
    var updatedBins = binGenerator(updatedData);

    var maxFrequency = d3.max(updatedBins, d => d.length) || 0;
    ex6Scales.yScale.domain([0, maxFrequency + 50]);

    var g = d3.select("#histogram-chart svg .inner-chart-group");

    // 1. Interpolate dynamic Y axis layout grids cleanly over 500ms
    g.select(".y-axis")
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .call(d3.axisLeft(ex6Scales.yScale).ticks(8));

    // 2. Manage explicit D3 enter/update/exit selection loops
    g.selectAll("rect.histogram-bar")
        .data(updatedBins)
        .join(
            enter => enter.append("rect")
                .attr("class", "histogram-bar")
                .attr("stroke", ex6Colors.gapColor)
                .attr("stroke-width", "1px")
                .attr("x", d => ex6Scales.xScale(d.x0))
                .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 1))
                .attr("y", innerH) 
                .attr("height", 0)
                .attr("fill", ex6Colors.barFill),
            update => update,
            exit => exit.transition()
                .duration(200)
                .ease(d3.easeCubicInOut)
                .attr("y", innerH)
                .attr("height", 0)
                .remove()
        )
        .on("mouseover", function() { d3.select(this).attr("fill", ex6Colors.barHover); })
        .on("mouseout", function() { d3.select(this).attr("fill", ex6Colors.barFill); })
        // Apply unified 500ms easing transition over visual updates
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("x", d => ex6Scales.xScale(d.x0))
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 1))
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => innerH - ex6Scales.yScale(d.length));
}

// ==========================================
// EXERCISE 6.2 SCATTERPLOT INTERACTIVE TOOLTIP
// ==========================================

function createTooltip() {
    // Append a hidden graphic layer inside the chart to store tooltip text nodes
    var tooltipGroup = innerChartS.append("g")
        .attr("id", "scatterplot-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none"); 

    // Render structural background container card
    tooltipGroup.append("rect")
        .attr("width", tooltipDimensions.w)
        .attr("height", tooltipDimensions.h)
        .attr("fill", "#334155") // Clean slate-gray context card hue
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("opacity", 0.95);

    // Multi-line Text Node Configurations
    tooltipGroup.append("text")
        .attr("class", "tooltip-title")
        .attr("x", 10)
        .attr("y", 18)
        .style("fill", "#ffffff")
        .style("font-size", "11px")
        .style("font-weight", "700");

    tooltipGroup.append("text")
        .attr("class", "tooltip-body")
        .attr("x", 10)
        .attr("y", 34)
        .style("fill", "#cbd5e1")
        .style("font-size", "11px")
        .style("font-weight", "500");
    
    tooltipGroup.append("text")
        .attr("class", "tooltip-value")
        .attr("x", 10)
        .attr("y", 48)
        .style("fill", "#38bdf8")
        .style("font-size", "10px")
        .style("font-weight", "600");
}

function HandleMouseEvents(circlesSelection) {
    var tooltip = d3.select("#scatterplot-tooltip");

    circlesSelection
        .on("mouseenter", function(event, d) {
            // Emphasize the currently hovered element
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("opacity", 1);

            var activeCircle = d3.select(this);
            var cx = parseFloat(activeCircle.attr("cx"));
            var cy = parseFloat(activeCircle.attr("cy"));
            
            // Re-extract data metrics directly from the programmatic node tags
            var brandStr = activeCircle.attr("data-brand");
            var modelStr = activeCircle.attr("data-model");
            var sizeStr = activeCircle.attr("data-size");
            var techStr = activeCircle.attr("data-tech");

            // Update content layers dynamically (Using lowercase fallback mapping if explicit d lacks property)
            var energyVal = d.energyConsumption || activeCircle.attr("data-energy") || "N/A";

            tooltip.select(".tooltip-title").text(brandStr + " (" + modelStr + ")");
            tooltip.select(".tooltip-body").text("Specs: " + sizeStr + '" | ' + techStr);
            tooltip.select(".tooltip-value").text("Energy: " + energyVal + " kWh/yr");

            // Plot alignment layout position coordinates
            var tooltipX = cx + 12;
            var tooltipY = cy - tooltipDimensions.h / 2;

            // Strict boundary safety threshold evaluation
            if (tooltipX + tooltipDimensions.w > innerW) {
                tooltipX = cx - tooltipDimensions.w - 12;
            }
            if (tooltipY < 0) {
                tooltipY = 4;
            }

            // Bring into view smoothly
            tooltip.transition()
                .duration(100)
                .style("opacity", 1)
                .attr("transform", "translate(" + tooltipX + ", " + tooltipY + ")");
        })
        .on("mouseleave", function() {
            // Restore structural baseline appearance criteria
            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 5.5)
                .attr("opacity", 0.65);

            tooltip.transition()
                .duration(150)
                .style("opacity", 0);
        });
}