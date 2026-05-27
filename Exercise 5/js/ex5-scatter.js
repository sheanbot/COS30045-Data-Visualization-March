// js/ex5-scatter.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/Ex5_TV_energy.csv";

    d3.csv(csvPath, d => {
        return {
            brand: d.brand,
            tech: d.screen_tech,
            size: +d.screensize,
            energy: +d.energy_consumpt,
            star: +d.star2
        };
    }).then(data => {
        const cleanData = data.filter(d => !isNaN(d.star) && !isNaN(d.energy) && d.energy > 0 && d.tech);
        renderScatterPlot(cleanData);
    }).catch(err => console.error("Error rendering colorful scatter plot:", err));

    function renderScatterPlot(data) {
        const viewBoxW = 800;
        const viewBoxH = 500;
        const margins = { top: 40, right: 40, bottom: 60, left: 70 };
        const innerW = viewBoxW - margins.left - margins.right;
        const innerH = viewBoxH - margins.top - margins.bottom;

        const container = d3.select("#scatter-plot-container");
        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
            .style("width", "100%")
            .style("height", "auto");

        const g = svg.append("g").attr("transform", `translate(${margins.left}, ${margins.top})`);

        // Distinct, clean color system for screen hardware variations
        const colorScale = d3.scaleOrdinal()
            .domain(["LCD", "LCD (LED)", "LED", "OLED"])
            .range(["#2563eb", "#3b82f6", "#10b981", "#8b5cf6"]); // Blue, Light Blue, Emerald, Purple

        const xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.star) + 0.5]).range([0, innerW]);
        const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.energy) + 50]).range([innerH, 0]);

        g.append("g").attr("opacity", 0.06).call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(""));

        // Render nodes with diverse color tracks
        g.selectAll("circle.dot")
            .data(data)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.star))
            .attr("cy", d => yScale(d.energy))
            .attr("r", 5.5)
            .attr("fill", d => colorScale(d.tech))
            .attr("opacity", 0.7)
            .style("cursor", "pointer")
            .on("mouseover", function() {
                d3.select(this).attr("r", 9).attr("opacity", 1);
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 5.5).attr("opacity", 0.7);
            });

        // Axes Configuration
        g.append("g")
            .attr("transform", `translate(0, ${innerH})`)
            .call(d3.axisBottom(xScale))
            .style("font-family", "system-ui, sans-serif");

        g.append("g")
            .call(d3.axisLeft(yScale))
            .style("font-family", "system-ui, sans-serif");
    }
});