// Topo ganha fundo depois de rolar
const topbar = document.querySelector("[data-header]");
const onScroll = () => topbar?.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Só toca o vídeo do case que está na tela (economiza bateria e dados)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const caseVideos = document.querySelectorAll(".case-media video");
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting && !reduceMotion) target.play().catch(() => {});
    else target.pause();
  });
}, { threshold: 0.35 });
caseVideos.forEach((v) => videoObserver.observe(v));

if (reduceMotion) document.querySelector(".hero-video")?.pause();

// Marca no dock mobile a seção atual
const dockLinks = document.querySelectorAll("[data-dock]");
const sections = [...dockLinks].map((a) => document.getElementById(a.dataset.dock)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    dockLinks.forEach((a) => {
      if (a.dataset.dock !== target.id) return;
      a.classList.toggle("is-active", isIntersecting);
      if (isIntersecting) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-40% 0px -50%" });
sections.forEach((s) => sectionObserver.observe(s));
