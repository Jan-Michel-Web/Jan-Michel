
document.addEventListener("DOMContentLoaded", () => {
    // Update the copyright year automatically.
    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Highlight the navigation link for the current section.
    const links = document.querySelectorAll(".main-nav a[href^='#']");

    function updateNavigation() {
        let activeId = "";

        links.forEach(link => {
            const section = document.querySelector(link.getAttribute("href"));

            if (section && section.getBoundingClientRect().top <= 150) {
                activeId = section.id;
            }
        });

        if (window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 10) {
            activeId = "contact";
        }

        links.forEach(link => {
            const active = link.getAttribute("href") === "#" + activeId;

            link.classList.toggle("is-active", active);

            if (active) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateNavigation, { passive: true });
    window.addEventListener("resize", updateNavigation);
    updateNavigation();
});
