document.addEventListener("DOMContentLoaded", () => {
    // 1. Get current file name from the URL path
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html"; // Defaults to index.html if blank

    // 2. Select all navigation links
    const navLinks = document.querySelectorAll(".nav-item");

    // 3. Loop through links and toggle 'active-page' class
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        if (href === page) {
            link.classList.add("active-page");
        } else {
            link.classList.remove("active-page");
        }
    });
});