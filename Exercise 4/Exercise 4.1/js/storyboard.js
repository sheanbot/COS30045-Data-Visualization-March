// storyboard selection logic
const storyboardImages = [
    'image/Storyboard1.png',
    'image/Storyboard2.png',
    'image/Storyboard3.png'
];

function selectStoryboard(index) {
    const cards = document.querySelectorAll('.storyboard-card');
    const titleEl = document.getElementById('storyboard-title');
    const previewWrapper = document.getElementById('preview-image-wrapper');
    const previewImg = document.getElementById('preview-image');

    cards.forEach((c, i) => {
        const pressed = i === index;
        c.classList.toggle('selected', pressed);
        c.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });

    // Update title and preview
    const titles = ['Storyboard One', 'Storyboard Two', 'Storyboard Three'];
    titleEl.textContent = titles[index] || 'Storyboard Preview';
    if (previewImg) {
        previewImg.src = storyboardImages[index] || '';
        previewImg.alt = titles[index] + ' large preview';
    }
}

// expose to global so inline onclick works
window.selectStoryboard = selectStoryboard;

// ensure initial state
document.addEventListener('DOMContentLoaded', () => {
    // if the storyboard page is visible on load, ensure preview matches selected option
    const selected = document.querySelector('.storyboard-card.selected');
    const idx = selected ? Number(selected.getAttribute('data-index')) : 0;
    selectStoryboard(idx);
});
