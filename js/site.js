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
    "main .heading, main .card, main .person, main .frame, main .belief, main .quote-photo, main .quote-copy, main .stats, main .page-hero-grid > *, main .stack > li, main .timeline > li, main details.service, main .gallery, main .close .shell > *, main .prose"
  )];
  const groups = new Map();
  reveal.forEach((el) => {
    const index = groups.get(el.parentElement) || 0;
    groups.set(el.parentElement, index + 1);
    el.classList.add("reveal");
    el.style.animationDelay = `${Math.min(index, 6) * 90}ms`;
  });
  const heroImg = document.querySelector(".hero-photo img");
  const driftImgs = [...document.querySelectorAll(".frame > img")];
  const storyReel = document.querySelector("[data-story-reel]");
  const storyScenes = storyReel ? [...storyReel.querySelectorAll("[data-scene]")] : [];
  let storyStep = 0;
  let storyBusy = false;
  const storyMax = Math.max(storyScenes.length * 2 - 1, 1);
  const applyStoryStep = (step) => {
    const active = Math.max(0, Math.floor(step / 2));
    storyScenes.forEach((scene, index) => {
      const current = index === active;
      const photoOn = step >= index * 2;
      const sloganOn = step >= index * 2 + 1;
      if (current) {
        scene.classList.add("is-current");
        scene.classList.remove("is-leaving");
      } else if (scene.classList.contains("is-current")) {
        scene.classList.remove("is-current");
        scene.classList.add("is-leaving");
        window.setTimeout(() => scene.classList.remove("is-leaving"), 700);
      }
      const img = scene.querySelector("img");
      const slogan = scene.querySelector("[data-slogan]");
      if (index === 0 && current && photoOn) {
        img.classList.add("is-set");
        img.classList.remove("is-in");
      } else {
        img.classList.remove("is-set");
        if (!(current && photoOn)) img.classList.remove("is-in");
        if (current && photoOn && !img.classList.contains("is-in")) {
          requestAnimationFrame(() => img.classList.add("is-in"));
        }
      }
      if (!(current && sloganOn)) slogan.classList.remove("is-in");
      if (current && sloganOn && !slogan.classList.contains("is-in")) {
        requestAnimationFrame(() => slogan.classList.add("is-in"));
      }
      scene.style.pointerEvents = current && sloganOn ? "auto" : "none";
      if (!current && scene.classList.contains("is-open")) {
        scene.classList.remove("is-open");
        const button = scene.querySelector(".story-scene-more");
        if (button) {
          button.textContent = "Read more";
          button.setAttribute("aria-expanded", "false");
        }
      }
    });
  };
  if (storyReel) {
    const headerOffset = () => {
      const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
      return Number.isFinite(value) ? value : 76;
    };
    const pin = storyReel.querySelector(".story-reel-pin");
    storyReel.style.height = "165vh";
    applyStoryStep(0);
    const releaseReel = () => {
      const top = storyReel.getBoundingClientRect().top;
      storyReel.style.height = `${Math.max(window.innerHeight - top + 16, window.innerHeight)}px`;
    };
    const goToStoryStep = (next) => {
      const previous = storyStep;
      storyStep = Math.max(0, Math.min(storyMax, next));
      applyStoryStep(storyStep);
      if (storyStep >= storyMax && storyStep > previous) {
        window.setTimeout(() => {
          if (storyStep >= storyMax) releaseReel();
        }, 1000);
      }
    };
    const reelParked = () => {
      const pinTop = pin.getBoundingClientRect().top;
      const reelBottom = storyReel.getBoundingClientRect().bottom;
      return pinTop <= headerOffset() + 4 && reelBottom > window.innerHeight + 24;
    };
    window.addEventListener("wheel", (event) => {
      const direction = Math.sign(event.deltaY);
      if (!direction || !reelParked()) return;
      if (storyBusy && direction > 0 && storyStep >= storyMax) {
        event.preventDefault();
        return;
      }
      if (direction > 0 && storyStep >= storyMax) return;
      if (direction < 0 && storyStep <= 0) return;
      event.preventDefault();
      if (storyBusy) return;
      storyBusy = true;
      goToStoryStep(storyStep + direction);
      window.setTimeout(() => { storyBusy = false; }, 1000);
    }, { passive: false });
    let touchStart = 0;
    window.addEventListener("touchstart", (event) => {
      touchStart = event.changedTouches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchmove", (event) => {
      if (!reelParked()) return;
      const delta = touchStart - event.changedTouches[0].clientY;
      const goingOn = delta > 0;
      const canStep = (goingOn && storyStep < storyMax) || (!goingOn && storyStep > 0);
      const holding = storyBusy && goingOn && storyStep >= storyMax;
      if (canStep || holding) event.preventDefault();
    }, { passive: false });
    window.addEventListener("touchend", (event) => {
      if (!reelParked() || storyBusy) return;
      const delta = touchStart - event.changedTouches[0].clientY;
      if (Math.abs(delta) < 42) return;
      const direction = delta > 0 ? 1 : -1;
      if (direction > 0 && storyStep >= storyMax) return;
      if (direction < 0 && storyStep <= 0) return;
      storyBusy = true;
      goToStoryStep(storyStep + direction);
      window.setTimeout(() => { storyBusy = false; }, 1000);
    }, { passive: true });
  }
  const updateMotion = () => {
    const viewHeight = window.innerHeight;
    reveal.forEach((el) => {
      const box = el.getBoundingClientRect();
      const gone = box.bottom < viewHeight * 0.04 || box.top > viewHeight * 0.96;
      if (gone) {
        el.classList.remove("is-in");
        return;
      }
      const entered = box.top < viewHeight * 0.86 && box.bottom > viewHeight * 0.05;
      if (entered && !el.classList.contains("is-in")) el.classList.add("is-in");
    });
    if (heroImg) {
      const hero = heroImg.closest(".hero");
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      heroImg.style.transform = `translate3d(0, ${progress * 72}px, 0) scale(${1.06 + progress * 0.08})`;
    }
    driftImgs.forEach((img) => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < -40 || rect.top > viewHeight + 40) return;
      const delta = (rect.top + rect.height / 2 - viewHeight / 2) / viewHeight;
      img.style.transform = `translate3d(0, ${delta * -32}px, 0) scale(1.08)`;
    });
  };
  document.documentElement.classList.add("motion");
  updateMotion();
  let queued = false;
  const queueMotion = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      updateMotion();
    });
  };
  window.addEventListener("scroll", queueMotion, { passive: true });
  window.addEventListener("resize", queueMotion);
  window.addEventListener("load", updateMotion, { once: true });
}

document.querySelectorAll(".story-scene-more").forEach((button) => {
  button.addEventListener("click", () => {
    const scene = button.closest(".story-scene");
    const open = scene.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Close" : "Read more";
  });
});

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
