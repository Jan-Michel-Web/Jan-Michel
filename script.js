/*
  Jan Michel — personal portfolio
  Lightweight JavaScript for small usability improvements.
  Keep this file next to index.html and style.css.
*/

(() => {
    "use strict";

    // Keep the footer copyright year up to date automatically.
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }


    // Open and close the Logo & Visual Identity gallery without leaving the page.
    const openButtons = document.querySelectorAll("[data-open-modal]");
    let lastModalTrigger = null;

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-open-modal");
            const modal = document.getElementById(modalId);
            if (!(modal instanceof HTMLDialogElement)) return;

            lastModalTrigger = button;
            if (!modal.open) modal.showModal();
        });
    });

    document.querySelectorAll("dialog.project-modal").forEach((modal) => {
        const closeButtons = modal.querySelectorAll("[data-close-modal]");

        closeButtons.forEach((button) => {
            button.addEventListener("click", () => modal.close());
        });

        // Clicking the backdrop closes the dialog; clicking inside it does not.
        modal.addEventListener("click", (event) => {
            if (event.target === modal) modal.close();
        });

        // Native <dialog> closes on Escape and restores focus in modern browsers.
        modal.addEventListener("close", () => {
            if (lastModalTrigger instanceof HTMLElement) lastModalTrigger.focus();
        });
    });

    // Mark the navigation link for the section currently being viewed.
    // The class can also be styled in style.css with .main-nav a.is-active.
    const nav = document.querySelector(".main-nav");
    if (!nav) return;

    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = navLinks
        .map((link) => {
            const id = link.getAttribute("href").slice(1);
            return document.getElementById(id);
        })
        .filter(Boolean);

    if (sections.length === 0) return;

    const header = document.querySelector(".site-header");
    let scheduled = false;

    function updateActiveNavigation() {
        scheduled = false;

        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const activationPoint = window.scrollY + headerHeight + 130;
        const pageBottom = window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 3;

        let activeSection = null;

        if (pageBottom) {
            activeSection = sections[sections.length - 1];
        } else {
            for (const section of sections) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                if (sectionTop <= activationPoint) {
                    activeSection = section;
                } else {
                    break;
                }
            }
        }

        navLinks.forEach((link) => {
            const targetId = link.getAttribute("href").slice(1);
            const isActive = Boolean(activeSection && activeSection.id === targetId);

            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function requestNavigationUpdate() {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(updateActiveNavigation);
    }

    window.addEventListener("scroll", requestNavigationUpdate, { passive: true });
    window.addEventListener("resize", requestNavigationUpdate);
    window.addEventListener("hashchange", requestNavigationUpdate);

    // Also ensure the correct state is applied when the page loads mid-way down.
    updateActiveNavigation();
})();
