// -------- Mobile menu logic --------
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    if (!button || !nav) return;

    function updateArrow() {
        const bottom =
            nav.scrollHeight - nav.scrollTop <= nav.clientHeight + 10;
        nav.classList.toggle("at-bottom", bottom);
    }

    // Open / close mobile menu
    button.addEventListener("click", () => {
        nav.classList.toggle("open");
        document.body.classList.toggle("menu-open");
        // Recalculate arrow after menu opens
        setTimeout(updateArrow, 50);

    });
    // Update arrow while scrolling
    nav.addEventListener("scroll", updateArrow);

});