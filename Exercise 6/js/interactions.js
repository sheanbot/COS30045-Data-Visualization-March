// js/interactions.js

// ==========================================
// EXERCISE 6.1 HISTOGRAM FILTER SELECTION
// ==========================================

/**
 * Attaches filter selection listeners to your dashboard control panel elements.
 * @param {Array} masterDataset - Unfiltered television data array.
 */
function initializeDisplayFilters(masterDataset) {
    // Clear any existing listeners to avoid double-triggering bugs
    d3.selectAll(".filter-btn").on("click", null);

    d3.selectAll(".filter-btn").on("click", function(event) {
        // 1. Toggle styling highlights across button groups
        d3.selectAll(".filter-btn").classed("active", false);
        d3.select(this).classed("active", true);

        // DEFENSIVE FALLBACK: Read from data-tech, button ID, or the text content inside the button itself
        let selectedTech = d3.select(this).attr("data-tech") || 
                           d3.select(this).attr("id") || 
                           d3.select(this).text().trim();

        console.log("➡️ Filter Clicked Target:", selectedTech);

        let filteredData = masterDataset;
        
        // 2. Robust, Case-Insensitive Filtering Matrix
        if (selectedTech && selectedTech.toLowerCase() !== "all") {
            const targetToken = selectedTech.toLowerCase().trim();
            
            filteredData = masterDataset.filter(d => {
                // List out all known technology field variants used in energy datasets
                const targetFields = [
                    d.technology, 
                    d.panel, 
                    d.type, 
                    d.displayType, 
                    d.screenTech, 
                    d.Screen_Tech, 
                    d["Screen Technology"]
                ];

                // Check the standard fields first using case-insensitive substring matching
                for (let field of targetFields) {
                    if (field != null && String(field).toLowerCase().trim().includes(targetToken)) {
                        return true; 
                    }
                }

                // ULTIMATE FALLBACK: Scan every column key in the row object for a text match
                for (let key in d) {
                    if (d.hasOwnProperty(key) && d[key] != null) {
                        if (String(d[key]).toLowerCase().trim() === targetToken) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        console.log(`📊 Filtered Rows Found for "${selectedTech}":`, filteredData.length);

        if (filteredData.length === 0 && masterDataset.length > 0) {
            console.warn("⚠️ Warning: Filter returned 0 rows. Check a sample data row structure below:", masterDataset[0]);
        }

        // 3. Update graph layers smoothly
        updateHistogramWithData(filteredData);
    });
}

function updateHistogramWithData(updatedData) {
    if (!ex6Scales.xScale || !ex6Scales.yScale) {
        console.error("Scales uninitialized. Verify script execution order.");
        return;
    }

    // Capture baseline height dynamically to prevent layout clipping
    const currentHeight = ex6Scales.yScale.range()[0];

    // 1. Re-generate bins using fixed global X scale intervals
    var strictBinGenerator = d3.bin()
        .value(d => d.energyConsumption) 
        .domain(ex6Scales.xScale.domain())
        .thresholds(ex6Scales.xScale.ticks(14)); 

    var updatedBins = strictBinGenerator(updatedData);

    // Recalculate Y scale ceiling dynamically based on filtered bin height maximums
    var maxFrequency = d3.max(updatedBins, d => d.length) || 0;
    ex6Scales.yScale.domain([0, Math.max(1300, maxFrequency + 50)]);

    var svg = d3.select("#histogram-chart svg");
    var g = svg.select(".inner-chart-group");
    if (g.empty()) {
        g = svg.select("g"); 
    }
    if (g.empty()) return;

    // Transition the Y-axis ticks smoothly
    g.select(".y-axis")
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .call(d3.axisLeft(ex6Scales.yScale).ticks(13).tickFormat(d3.format(",")));

    // 2. Data Join Loop binding elements precisely via x0 thresholds
    g.selectAll("rect.histogram-bar")
        .data(updatedBins, d => d.x0) 
        .join(
            enter => enter.append("rect")
                .attr("class", "histogram-bar")
                .attr("x", d => ex6Scales.xScale(d.x0) + 1)
                .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 2))
                .attr("y", currentHeight) 
                .attr("height", 0)
                .style("fill", "#64748b"),
            update => update,
            exit => exit.transition()
                .duration(300)
                .ease(d3.easeCubicInOut)
                .attr("y", currentHeight)
                .attr("height", 0)
                .remove()
        )
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("x", d => ex6Scales.xScale(d.x0) + 1)
        .attr("width", d => Math.max(0, ex6Scales.xScale(d.x1) - ex6Scales.xScale(d.x0) - 2))
        .attr("y", d => ex6Scales.yScale(d.length))
        .attr("height", d => currentHeight - ex6Scales.yScale(d.length))
        .style("fill", "#64748b"); // Keeps the charcoal theme intact
}

function updateHistogram(filteredData) {
    updateHistogramWithData(filteredData);
}

// ==========================================
// EXERCISE 6.2 SCATTERPLOT INTERACTIVE TOOLTIP
// ==========================================

function createTooltip() {
    d3.select("#scatterplot-tooltip").remove();

    if (typeof innerChartS === "undefined" || innerChartS.empty()) return;

    var tooltipGroup = innerChartS.append("g")
        .attr("id", "scatterplot-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none"); 

    tooltipGroup.append("rect")
        .attr("width", tooltipDimensions.w)
        .attr("height", tooltipDimensions.h)
        .attr("fill", "#334155") 
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("opacity", 0.95);

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
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 8)
                .attr("opacity", 1);

            var activeCircle = d3.select(this);
            var cx = parseFloat(activeCircle.attr("cx"));
            var cy = parseFloat(activeCircle.attr("cy"));
            
            var brandStr = activeCircle.attr("data-brand") || "Unknown";
            var modelStr = activeCircle.attr("data-model") || "Unknown";
            var sizeStr = activeCircle.attr("data-size") || "N/A";
            var techStr = activeCircle.attr("data-tech") || "N/A";
            var energyVal = d.energyConsumption || activeCircle.attr("data-energy") || "N/A";

            tooltip.select(".tooltip-title").text(brandStr + " (" + modelStr + ")");
            tooltip.select(".tooltip-body").text("Specs: " + sizeStr + '" | ' + techStr);
            tooltip.select(".tooltip-value").text("Energy: " + energyVal + " kWh/yr");

            var tooltipX = cx + 12;
            var tooltipY = cy - tooltipDimensions.h / 2;

            if (tooltipX + tooltipDimensions.w > innerW) {
                tooltipX = cx - tooltipDimensions.w - 12;
            }
            if (tooltipY < 0) {
                tooltipY = 4;
            }

            tooltip.transition()
                .duration(100)
                .style("opacity", 1)
                .attr("transform", "translate(" + tooltipX + ", " + tooltipY + ")");
        })
        .on("mouseleave", function() {
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