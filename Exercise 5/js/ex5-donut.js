// js/ex5-donut.js
document.addEventListener("DOMContentLoaded", () => {
    const csvPath = "data/Ex5_TV_energy_Allsizes_byScreenType.csv";

    d3.csv(csvPath, d => {
        return {
            tech: d["Screen_Tech"],
            meanEnergy: +d["Mean(Labelled energy consumption (kWh/year))"]
        };
    }).then(data => {
        const cleanData = data.filter(d => d.tech && !isNaN(d.meanEnergy));
        renderDonutChart(cleanData);
    }).catch(err => console.error("Error rendering donut chart engine:", err));

    function renderDonutChart(data) {
        const width = 600;
        const height = 450;
        const radius = Math.min(width, height) / 2 - 35;

        const container = d3.select("#donut-chart-container");
        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("width", "100%")
            .style("height", "auto");

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2 - 70}, ${height / 2})`);

        // Diverse color system matching your horizontal bars
        const color = d3.scaleOrdinal()
            .domain(["LCD", "LED", "OLED"])
            .range(["#2563eb", "#a3ad50ff", "#f42a2aff"]); // Blue, Emerald, Purple

        const pie = d3.pie().value(d => d.meanEnergy).sort(null);
        const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);

        // Draw donut segments
        g.selectAll("path.slice")
            .data(pie(data))
            .join("path")
            .attr("class", "slice")
            .attr("d", arc)
            .attr("fill", d => color(d.data.tech))
            .attr("stroke", "#ffffff")
            .style("stroke-width", "3px")
            .style("cursor", "pointer")
            .style("transition", "opacity 0.15s ease")
            .on("mouseover", function() { d3.select(this).style("opacity", 0.8); })
            .on("mouseout", function() { d3.select(this).style("opacity", 1.0); });

        // Sidebar clean layout legend box
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 170}, ${height / 2 - (data.length * 30) / 2})`);

        data.forEach((d, i) => {
            const row = legend.append("g").attr("transform", `translate(0, ${i * 30})`);
            
            row.append("rect")
                .attr("width", 16)
                .attr("height", 16)
                .attr("rx", 4)
                .attr("fill", color(d.tech));

            row.append("text")
                .attr("x", 24)
                .attr("y", 13)
                .style("font-family", "system-ui, sans-serif")
                .style("font-size", "13px")
                .style("font-weight", "600")
                .style("fill", "#334155")
                .text(`${d.tech}: ${Math.round(d.meanEnergy)} kWh`);
        });
    }
});