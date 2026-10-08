const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const mast = document.querySelector(".mast");

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    }
  });
});

const onScroll = () => mast?.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const words = document.querySelectorAll("[data-word]");
let wordIndex = 0;
if (words.length > 1) {
  window.setInterval(() => {
    words[wordIndex].classList.remove("is-on");
    wordIndex = (wordIndex + 1) % words.length;
    words[wordIndex].classList.add("is-on");
  }, 2400);
}

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const heroSlides = document.querySelector("[data-hero-slides]");
if (heroSlides) {
  const frames = [...heroSlides.querySelectorAll("img")];
  const dots = [...heroSlides.querySelectorAll(".hero-dots button")];
  let frame = 0;
  const showFrame = (next) => {
    frame = (next + frames.length) % frames.length;
    frames.forEach((img, index) => img.classList.toggle("is-on", index === frame));
    dots.forEach((dot, index) => {
      const on = index === frame;
      dot.classList.toggle("is-on", on);
      dot.setAttribute("aria-selected", String(on));
    });
  };
  dots.forEach((dot, index) => dot.addEventListener("click", () => showFrame(index)));
  if (motionOk && frames.length > 1) {
    window.setInterval(() => showFrame(frame + 1), 3000);
  }
}
if (motionOk) {
  const reveal = [...document.querySelectorAll(
    "main .heading, main .card, main .person, main .stats, main .page-hero-grid > *, main .stack > li, main .timeline > li, main details.service, main .gallery, main .close .shell > *, main .prose"
  )];
  const groups = new Map();
  reveal.forEach((el) => {
    const index = groups.get(el.parentElement) || 0;
    groups.set(el.parentElement, index + 1);
    el.classList.add("reveal");
    el.style.animationDelay = `${Math.min(index, 4) * 40}ms`;
  });
  const updateReveal = () => {
    const viewHeight = window.innerHeight;
    reveal.forEach((el) => {
      const box = el.getBoundingClientRect();
      const gone = box.bottom < viewHeight * 0.04 || box.top > viewHeight * 0.96;
      if (gone) {
        el.classList.remove("is-in");
        return;
      }
      const entered = box.top < viewHeight * 0.84 && box.bottom > viewHeight * 0.05;
      if (entered && !el.classList.contains("is-in")) el.classList.add("is-in");
    });
  };
  document.documentElement.classList.add("motion");
  updateReveal();
  let revealQueued = false;
  const queueReveal = () => {
    if (revealQueued) return;
    revealQueued = true;
    requestAnimationFrame(() => {
      revealQueued = false;
      updateReveal();
    });
  };
  window.addEventListener("scroll", queueReveal, { passive: true });
  window.addEventListener("resize", queueReveal);
  window.addEventListener("load", updateReveal, { once: true });
}

document.querySelectorAll("form[data-enquiry]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = String(data.get("subject") || "Adfinity enquiry");
    const lines = [
      `Name: ${data.get("name") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `About: ${data.get("interest") || ""}`,
      "",
      String(data.get("message") || ""),
    ];
    window.location.href = `mailto:hello@adfinityglobal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
});
