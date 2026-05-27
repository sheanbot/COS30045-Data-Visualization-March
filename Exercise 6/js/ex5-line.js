// js/ex5-line.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/Ex5_ARE_Spot_Prices.csv";

    d3.csv(csvPath, d => {
        return {
            year: +d["Year"],
            avg: +d["Average Price (notTas-Snowy)"]
        };
    }).then(data => {
        const cleanData = data.filter(d => !isNaN(d.year) && d.year >= 1998 && !isNaN(d.avg));
        renderLineChart(cleanData);
    }).catch(err => console.error("Error loading line chart:", err));

    function renderLineChart(data) {
        const viewBoxW = 850;
        const viewBoxH = 450;
        const margins = { top: 40, right: 40, bottom: 50, left: 70 };
        const innerW = viewBoxW - margins.left - margins.right;
        const innerH = viewBoxH - margins.top - margins.bottom;

        const container = d3.select("#line-chart-container");
        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
            .style("width", "100%")
            .style("height", "auto");

        const g = svg.append("g").attr("transform", `translate(${margins.left}, ${margins.top})`);

        // Fixed domains mapping the data bounds
        const xScale = d3.scaleLinear().domain([1998, 2024]).range([0, innerW]);
        const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.avg) + 15]).range([innerH, 0]);

        const lineGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.avg))
            .curve(d3.curveMonotoneX);

        // Light tracking grid background lines
        g.append("g")
            .attr("opacity", 0.05)
            .call(d3.axisLeft(yScale).tickSize(-innerW).tickFormat(""));

        // Render trend path lines
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#1e3a8a")
            .attr("stroke-width", 4)
            .attr("d", lineGenerator);

        // Interactive interactive hover circle nodes
        g.selectAll("circle.trend-node")
            .data(data)
            .join("circle")
            .attr("class", "trend-node")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.avg))
            .attr("r", 4.5)
            .attr("fill", "#3b82f6")
            .style("cursor", "pointer")
            .on("mouseover", function() {
                d3.select(this).attr("r", 7.5).attr("fill", "#ef4444");
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 4.5).attr("fill", "#3b82f6");
            });

        // X-AXIS RULE: Generate exact 5-year step ticks manually [1998, 2003, 2008, 2013, 2018, 2023]
        const fiveYearTicks = d3.range(1998, 2025, 5);

        g.append("g")
            .attr("transform", `translate(0, ${innerH})`)
            .call(d3.axisBottom(xScale)
                .tickValues(fiveYearTicks)
                .tickFormat(d3.format("d"))
            )
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "12px")
            .style("color", "#334155");

        // Y-Axis setup
        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(d => `$${d}`))
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "11px");

        // Simple line name summary text
        const lastPoint = data[data.length - 1];
        g.append("text")
            .attr("x", xScale(lastPoint.year) - 15)
            .attr("y", yScale(lastPoint.avg) - 15)
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "12px")
            .style("font-weight", "700")
            .style("fill", "#1e3a8a")
            .style("text-anchor", "end")
          
    }
});