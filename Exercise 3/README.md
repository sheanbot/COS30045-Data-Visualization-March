# Exercise 3 – Data Story: TV Energy Consumption

This README documents the Storyboard deliverable for Exercise 3. The storyboard presents three related narratives about television energy use and buyer decision-making. Each storyboard is designed to highlight a specific issue, show data that illustrates the problem, propose practical ideas that help consumers, and give concrete recommendations.

Contents
 - Storyboard summaries (three storyboards)
 - How the Storyboard page works (UI/interaction)
 - Assets and file locations
 - How to run and test locally
 - Accessibility, design notes and next steps

---

## Storyboard Summaries

Each storyboard follows the same structure: Issue → Demonstration (chart) → Idea to overcome → Recommendation → Before/After → Goals. The versions below summarise the panels and the intended message.

Storyboard One — "Size ≠ Power"
- Issue: Consumers often assume larger screen size means higher power consumption, and opt for smaller TVs to save energy.
- Demonstrate: Scatter plot (size vs annual energy) shows that while power does tend to increase with size, there are many large models with reasonable energy use — size alone isn't a reliable indicator.
- Idea: Encourage buyers to check the actual power usage or energy star rating rather than judging by screen size.
- Recommendation: Don’t judge a TV by screen size alone. Check the wattage and energy rating before purchasing. Consumers can find large screens with efficient designs.
- Before / After: Before — buyer avoids large TVs fearing high bills. After — buyer finds a large, energy-efficient model and enjoys a bigger screen without undue cost.
- Goal: Help consumers make purchasing choices based on energy use (wattage / rating) rather than size.

Storyboard Two — "OLED: Great Picture, Smart Settings"
- Issue: OLED panels deliver excellent picture quality, but many OLED models consume more power because pixels emit their own light.
- Demonstrate: A bar chart comparing typical everyday power use across LED, LCD (LED-backlit), and OLED shows OLED often uses more power on average.
- Idea: Show power-saving options like Eco Mode, automatic brightness, and picture-mode settings that can reduce OLED power use significantly.
- Recommendation: If picture quality is the priority, choose an OLED but enable Eco Mode and adaptive brightness; otherwise, high-rated LED/LCD TVs offer a strong balance of quality and efficiency.
- Before / After: Before — user uses maximum brightness and pays more in electricity. After — user switches on Eco Mode and keeps excellent picture quality while lowering power draw.
- Goal: Enable movie lovers to enjoy high picture quality without large electricity bills by using smart settings.

Storyboard Three — "Marketing vs. Reality"
- Issue: Heavy advertising and premium positioning make OLED seem like the must-have option, which pressures buyers toward more expensive and often less efficient models.
- Demonstrate: A market-share pie chart shows most available models are LED/LCD options; OLED remains a smaller portion of the market.
- Idea: Encourage buyers to consider advanced LED technologies (e.g., Mini-LED) and high-rated LED options as practical, energy-efficient alternatives to OLED.
- Recommendation: For most buyers, stick with a high-rated LED/LCD TV unless you’re prepared to accept the higher cost and power use of OLED.
- Before / After: Before — buyer chases rare, expensive OLED options and becomes frustrated. After — buyer chooses an affordable, efficient LED that meets needs and budget.
- Goal: Help buyers choose realistic, widely available, efficient models without overspending on premium panel types.

---

## Storyboard Page: UI & Interaction

Location: `Exercise 3/index.html` (Storyboard section)

Behaviour:
- Side-by-side layout: left selection panel (thumbnails) + right main display (large preview + title).
- Thumbnails: three small images (from `image/` folder) arranged vertically. Clicking a thumbnail selects it.
- Default: the first storyboard is selected and displayed when the page loads.
- On selection: the main preview image and the title update; the selected thumbnail is visually highlighted; `aria-pressed` reflects state for accessibility.

Files involved:
- `index.html` — contains the markup for the Storyboard page and thumbnails.
- `css/style.css` — styles for layout, thumbnail sizing, preview area and responsive rules.
- `js/storyboard.js` — selection logic which updates the preview `img` and title.

---

## Assets

Storyboard images (already included):
- `Exercise 3/image/Storyboard1.png` — Storyboard One image
- `Exercise 3/image/Storyboard2.png` — Storyboard Two image
- `Exercise 3/image/Storyboard3.png` — Storyboard Three image

It is recommended to keep two versions of images for best performance:
- a small thumbnail (for the selection panel)
- a larger, high-resolution preview (for the main display)

---

## How to run & test locally

1. From the repository root, open the Storyboard page in your browser:

```bash
open "Exercise 3/index.html"
```

2. Click the "Storyboard" link in the navigation (or call `showPage('storyboard')` in the browser console).
3. Confirm the following:
 - The page loads showing "Storyboard One" by default.
 - Clicking each thumbnail updates the preview image and title.
 - The selected thumbnail receives a visual highlight and its `aria-pressed` attribute becomes `true`.

---

## Accessibility & Design Notes

- Thumbnails are implemented as `<button>` elements to be keyboard-focusable and to expose press state via `aria-pressed`.
- Contrast, spacing and type sizes are adjusted for readability. The preview area uses `object-fit: contain` to preserve the storyboard image aspect ratio while maximizing visibility.
- On smaller screens the layout stacks vertically so thumbnails become a horizontal row above the preview.

---

## Recommendations & Next Steps

- Create optimized thumbnails (smaller files) plus hi-res preview images to balance load time and readability.
- Add a keyboard navigation feature (arrow keys) to move between storyboards.
- Add a click-to-zoom or lightbox so users can inspect storyboard text in high detail.
- Add a small fade transition when changing previews to improve perceived polish.

If you want, I can implement any of the recommended improvements and wire in separate thumbnail files and a lightbox.
