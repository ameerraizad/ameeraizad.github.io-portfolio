const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

const setActiveLink = () => {
    const currentSection = sections.find((section) => {
        const box = section.getBoundingClientRect();
        return box.top <= 160 && box.bottom > 160;
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", currentSection && link.getAttribute("href") === `#${currentSection.id}`);
    });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

const projectCards = document.querySelectorAll(".project-card[data-project]");
const projectDetailsSection = document.querySelector("#project-details");
const projectDetails = document.querySelectorAll(".project-detail");

projectCards.forEach((card) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();

        const selectedProjectId = card.dataset.project;
        const selectedProject = document.getElementById(selectedProjectId);

        projectDetailsSection.hidden = false;

        projectDetails.forEach((detail) => {
            detail.hidden = detail.id !== selectedProjectId;
        });

        projectCards.forEach((projectCard) => {
            projectCard.classList.toggle("active", projectCard === card);
        });

        selectedProject.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

/**
 * Video Mute/Unmute Toggle
 * All robotics videos start muted and autoplay with loop.
 * Click the overlay button to toggle sound on/off.
 */
const videoWrappers = document.querySelectorAll(".video-wrapper");

videoWrappers.forEach((wrapper) => {
    const video = wrapper.querySelector("video");
    const toggle = wrapper.querySelector(".mute-toggle");
    const icon = toggle?.querySelector(".mute-icon");

    if (!video || !toggle || !icon) return;

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();

        if (video.muted) {
            video.muted = false;
            toggle.dataset.muted = "false";
            icon.textContent = "🔊";
            toggle.setAttribute("aria-label", "Mute video");
        } else {
            video.muted = true;
            toggle.dataset.muted = "true";
            icon.textContent = "🔇";
            toggle.setAttribute("aria-label", "Unmute video");
        }
    });
});

/**
 * Lightbox: Click any media item to view full-size
 * Uses event delegation on #project-details for dynamic content
 */
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightbox-content");
const lightboxClose = document.querySelector(".lightbox-close");

function openLightbox(element) {
    if (!lightbox || !lightboxContent) return;

    lightboxContent.innerHTML = "";

    if (element.tagName === "IMG") {
        const clone = element.cloneNode(true);
        clone.removeAttribute("loading");
        clone.removeAttribute("class");
        clone.style.cssText = "";
        lightboxContent.appendChild(clone);
    } else if (element.tagName === "VIDEO") {
        const clone = element.cloneNode(true);
        clone.removeAttribute("class");
        clone.style.cssText = "";
        clone.controls = true;
        clone.autoplay = true;
        clone.muted = element.muted;
        lightboxContent.appendChild(clone);
    }

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxContent.innerHTML = "";
    document.body.style.overflow = "";
}

// Close button
if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

// Click overlay background to close
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Escape key to close
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) {
        closeLightbox();
    }
});

// Event delegation on project-details container
if (projectDetailsSection) {
    projectDetailsSection.addEventListener("click", (e) => {
        // Find the closest clickable media element
        const img = e.target.closest(".media-item img");
        const videoWrapper = e.target.closest(".video-wrapper");
        const muteBtn = e.target.closest(".mute-toggle");

        // If click is on mute toggle button, ignore (handled separately)
        if (muteBtn) return;

        // If click is on a video wrapper (not on the mute button)
        if (videoWrapper) {
            const video = videoWrapper.querySelector("video");
            if (video) {
                openLightbox(video);
                return;
            }
        }

        // If click is on an image inside media-item
        if (img) {
            openLightbox(img);
        }
    });
}

// Set cursor:pointer on all media images
document.querySelectorAll(".media-item img").forEach((img) => {
    img.style.cursor = "pointer";
});

/**
 * Scroll-triggered Reveal Animations
 * Uses Intersection Observer to add .revealed class when elements enter viewport.
 * Supports: .reveal (fade up), .reveal-left (slide from left), .reveal-right (slide from right)
 */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Unobserve after revealing to improve performance
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
    }
);

// Observe all elements with reveal classes
document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
    revealObserver.observe(el);
});

