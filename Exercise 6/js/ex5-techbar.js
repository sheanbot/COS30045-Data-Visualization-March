// js/ex5-techbar.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/Ex5_TV_energy_55inchtv_byScreenType.csv";

    d3.csv(csvPath, d => {
        return {
            tech: d["Screen_Tech"],
            meanEnergy: +d["Mean(Labelled energy consumption (kWh/year))"]
        };
    }).then(data => {
        const cleanData = data.filter(d => d.tech && !isNaN(d.meanEnergy));
        renderTechBarChart(cleanData);
    }).catch(err => console.error("Error rendering tech bars:", err));

    function renderTechBarChart(data) {
        const viewBoxW = 800;
        const viewBoxH = 450;
        const margins = { top: 30, right: 120, bottom: 50, left: 100 };
        const innerW = viewBoxW - margins.left - margins.right;
        const innerH = viewBoxH - margins.top - margins.bottom;

        const container = d3.select("#group-bar-container");
        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
            .style("width", "100%")
            .style("height", "auto");

        const g = svg.append("g").attr("transform", `translate(${margins.left}, ${margins.top})`);

        // High contrast distinct colors for each screen row block asset
        const barColors = d3.scaleOrdinal()
            .domain(["LCD", "LED", "OLED"])
            .range(["#2563eb", "#10b981", "#000000ff"]); // Blue, Emerald, Purple

        const xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.meanEnergy) + 50]).range([0, innerW]);
        const yScale = d3.scaleBand().domain(data.map(d => d.tech)).range([0, innerH]).padding(0.35);

        const rows = g.selectAll("g.tech-row")
            .data(data)
            .join("g")
            .attr("class", "tech-row")
            .attr("transform", d => `translate(0, ${yScale(d.tech)})`);

        // Draw structural bars with dynamic row colors
        rows.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => xScale(d.meanEnergy))
            .attr("height", yScale.bandwidth())
            .attr("fill", d => barColors(d.tech))
            .attr("rx", 5)
            .style("cursor", "pointer")
            .style("transition", "opacity 0.15s ease")
            .on("mouseover", function() { d3.select(this).style("opacity", 0.8); })
            .on("mouseout", function() { d3.select(this).style("opacity", 1); });

        // Left Category Labels
        g.append("g")
            .call(d3.axisLeft(yScale).tickSize(0))
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "13px")
            .style("font-weight", "600");

        // Bottom Scale Axis
        g.append("g")
            .attr("transform", `translate(0, ${innerH})`)
            .call(d3.axisBottom(xScale).ticks(6))
            .style("font-family", "system-ui, sans-serif");

        // Text values on the right of bars
        rows.append("text")
            .attr("x", d => xScale(d.meanEnergy) + 12)
            .attr("y", yScale.bandwidth() / 2 + 5)
            .style("font-family", "system-ui, sans-serif")
            .style("font-size", "13px")
            .style("font-weight", "700")
            .style("fill", "#334155")
            .text(d => `${Math.round(d.meanEnergy)} kWh`);
    }
});