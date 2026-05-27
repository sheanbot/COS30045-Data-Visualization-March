// Simple D3 horizontal bar chart for Exercise 4.3
// Ensure data file exists at: /Exercise 4/data/tvBrandCount.csv (columns: brand,count)

(() => {
  const viewBoxW = 500;
  const viewBoxH = 1600;
  const margin = { top: 20, right: 20, bottom: 20, left: 160 };

  const svg = d3.select("#chart-container")
    .append("svg")
      .attr("viewBox", `0 0 ${viewBoxW} ${viewBoxH}`)
      .style("border", "1px solid #222");

  // Step 3 test rectangle
  svg.append("rect")
    .attr("x", 10).attr("y", 10).attr("width", 414).attr("height", 16)
    .attr("fill", "blue");

  const csvPath = "../data/televisions.csv"; // update if needed

  d3.csv(csvPath, d => ({ brand: d.brand, count: +d.count }))
    .then(data => {
      if (!data.length) throw new Error("CSV empty or failed to parse");
      data.sort((a,b) => d3.descending(a.count, b.count));
      createBarChart(data);
    })
    .catch(err => {
      console.error(err);
      d3.select("#chart-container").append("div").text("Failed to load CSV: " + err.message);
    });

  function createBarChart(data) {
    const innerW = viewBoxW - margin.left - margin.right;
    const barBand = 36;
    const innerH = Math.max(data.length * barBand, 300);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, innerW]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.brand))
      .range([0, innerH])
      .padding(0.15);

    g.selectAll("rect.bar")
      .data(data)
      .join("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.brand))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.count))
        .attr("fill", "#0b6ef6");

    g.selectAll("text.val")
      .data(data)
      .join("text")
        .attr("class", "val")
        .attr("x", d => xScale(d.count) + 6)
        .attr("y", d => yScale(d.brand) + yScale.bandwidth() / 2 + 4)
        .text(d => d.count)
        .attr("font-size", 12)
        .attr("fill", "#022");

    g.append("g").selectAll("text")
      .data(data)
      .join("text")
        .attr("x", -8)
        .attr("y", d => yScale(d.brand) + yScale.bandwidth() / 2 + 4)
        .attr("text-anchor", "end")
        .text(d => d.brand)
        .attr("font-size", 12)
        .attr("fill", "#102a43");

    const requiredH = margin.top + innerH + margin.bottom;
    svg.attr("viewBox", `0 0 ${viewBoxW} ${Math.max(requiredH, viewBoxH)}`);
  }
})();