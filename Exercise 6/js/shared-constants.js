// js/shared-constants.js

// 1. Chart Dimensions (Dufour & Meeks Inner-Chart Strategy)
const ex6Dimensions = {
    viewBoxW: 850,
    viewBoxH: 450,
    margins: { top: 40, right: 30, bottom: 60, left: 65 }
};

ex6Dimensions.innerW = ex6Dimensions.viewBoxW - ex6Dimensions.margins.left - ex6Dimensions.margins.right;
ex6Dimensions.innerH = ex6Dimensions.viewBoxH - ex6Dimensions.margins.top - ex6Dimensions.margins.bottom;

// 2. Color Configuration Schema
const ex6Colors = {
    barFill: "#1e3a8a",           // Theme deep blue
    barHover: "#3b82f6",          // Responsive hover state electric blue
    gapColor: "#ffffff",          // Separator line color matching card background
    textPrimary: "#1e293b"
};

// 3. Shared Scales
const ex6Scales = {
    xScale: d3.scaleLinear(),
    yScale: d3.scaleLinear()
};

// 4. Data Filter State Tracking Array (Step 7.2)
// IDs align perfectly with the screenTech text values in Ex6_TVdata.csv
const filters_screen = [
    { id: "all", label: "Show All Tech", isActive: true },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "LED", label: "LED", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// 5. Shared Bin Generator Engine (Step 6.2)
// Directs D3 to bin records according to their energyConsumption values
const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .thresholds(25);