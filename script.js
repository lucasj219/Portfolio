const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const revealItems = document.querySelectorAll(".reveal");
const campaignVisuals = document.querySelectorAll(".campaign-visual");
const mobileNavLinks = document.querySelectorAll("[data-mobile-nav]");

function updateHeader() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
}

function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });
}

window.addEventListener("scroll", updateHeader);
updateHeader();

// Anima os blocos conforme entram na tela.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Mantém apenas o card visível em reprodução para economizar bateria e dados.
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const visual = entry.target;
      const video = visual.querySelector("video");

      if (entry.isIntersecting) {
        video?.play().catch(() => {});
      } else {
        video?.pause();
      }
    });
  },
  { threshold: 0.22, rootMargin: "120px 0px" }
);

campaignVisuals.forEach((visual) => videoObserver.observe(visual));

// Destaca no dock mobile a seção que está na tela.
const mobileSections = ["cases", "metodologia-kairos", "contato"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const mobileSectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;

    mobileNavLinks.forEach((link) => {
      const isActive = link.dataset.mobileNav === visibleEntry.target.id;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  },
  { threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -55%" }
);

mobileSections.forEach((section) => mobileSectionObserver.observe(section));

const tiltCards = document.querySelectorAll("[data-tilt-card]");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    card.style.setProperty("--rx", `${py * -3}deg`);
    card.style.setProperty("--ry", `${px * 3}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "0%");
  });
});
