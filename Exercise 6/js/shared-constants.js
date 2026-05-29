// js/shared-constants.js

// 1. Core Chart Layout Dimensions (Set directly to prevent initialization reference errors)
var w = 850;
var h = 450;
var padding = 65;

// Inner dimensions calculated safely using direct variables
var innerW = 850 - 65 - 30; // Equals 755
var innerH = 450 - 40 - 65; // Equals 345

// 2. Color Configuration Schema
const ex6Colors = {
    barFill: "#64748b",           // Charcoal slate color to match your template screenshot
    barHover: "#475569",          // Deeper hover state accent
    gapColor: "#ffffff",          // Separator line color matching card background
    textPrimary: "#1e293b"
};

// 3. Shared Scales for Exercise 6.1 Histogram
const ex6Scales = {
    xScale: d3.scaleLinear(),
    yScale: d3.scaleLinear()
};

// 4. Data Filter State Tracking Array
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// 5. Shared Bin Generator Engine
var binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(20); // Aligns threshold intervals cleanly with the 2800 Max Limit grid

// 6. Sizing metrics for Scatterplot Vector Tooltips (Exercise 6.2)
const tooltipDimensions = {
    w: 160,
    h: 55
};

// 7. Isolated global canvas anchor group hook for the Scatterplot
var innerChartS; 

// 8. Shared Scales for Scatterplot Coordinate Engine mapping
const ex6ScalesScatter = {
    xScaleS: d3.scaleLinear(),
    yScaleS: d3.scaleLinear(),
    colorScale: d3.scaleOrdinal() // Categorical hue map for panel types
};