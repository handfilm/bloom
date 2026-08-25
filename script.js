(function(){
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     1. HERO 3D COVERFLOW
     ============================================================ */
  const track = document.getElementById("coverflowTrack");
  const items = Array.from(track.children);
  let current = 0;
  let autoTimer = null;

  function layout(){
    const n = items.length;
    items.forEach((item, i) => {
      let offset = i - current;
      // wrap offset to shortest path (-n/2 .. n/2)
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;

      const abs = Math.abs(offset);
      const x = offset * 460;               // horizontal spacing (wide, full-bleed hero)
      const z = -abs * 320;                  // recede into the scene
      const rotY = offset * -24;             // 3D turn
      const scale = abs === 0 ? 1 : 0.82;
      const opacity = abs > 2 ? 0 : (abs === 0 ? 1 : 0.4);

      item.style.transform =
        `translateX(-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = String(100 - abs);
      item.style.filter = abs === 0 ? "brightness(1)" : "brightness(0.55)";
      item.style.pointerEvents = abs === 0 ? "auto" : "none";
    });
  }

  function goTo(i){
    const n = items.length;
    current = ((i % n) + n) % n;
    layout();
  }

  function startAuto(){
    if (prefersReduced) return;
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }
  function stopAuto(){
    if (autoTimer) clearInterval(autoTimer);
  }

  document.getElementById("cfNext").addEventListener("click", () => { goTo(current + 1); startAuto(); });
  document.getElementById("cfPrev").addEventListener("click", () => { goTo(current - 1); startAuto(); });
  const coverflowEl = document.getElementById("coverflow");
  coverflowEl.addEventListener("mouseenter", stopAuto);
  coverflowEl.addEventListener("mouseleave", startAuto);

  layout();
  startAuto();

  /* ============================================================
     2. SECTION LIST + LEAF RAIL NAV
     ============================================================ */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const railNodes = document.getElementById("railNodes");
  const railFill = document.getElementById("railFill");

  slides.forEach((slide, i) => {
    const btn = document.createElement("li");
    const inner = document.createElement("button");
    inner.className = "leaf-rail__node";
    inner.setAttribute("aria-label", slide.dataset.title || `সেকশন ${i+1}`);
    inner.addEventListener("click", () => slide.scrollIntoView({ behavior: "smooth" }));
    btn.appendChild(inner);
    railNodes.appendChild(btn);
  });
  const railButtons = Array.from(railNodes.querySelectorAll(".leaf-rail__node"));

  let activeIndex = 0;
  function setActive(i){
    activeIndex = i;
    railButtons.forEach((b, idx) => b.classList.toggle("is-active", idx === i));
    railFill.style.height = `${(i / (slides.length - 1)) * 100}%`;
  }
  setActive(0);

  /* ============================================================
     3. UP / DOWN ARROW NAVIGATION
     ============================================================ */
  document.getElementById("navDown").addEventListener("click", () => {
    const next = Math.min(activeIndex + 1, slides.length - 1);
    slides[next].scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("navUp").addEventListener("click", () => {
    const prev = Math.max(activeIndex - 1, 0);
    slides[prev].scrollIntoView({ behavior: "smooth" });
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown"){
      e.preventDefault();
      slides[Math.min(activeIndex + 1, slides.length - 1)].scrollIntoView({ behavior: "smooth" });
    } else if (e.key === "ArrowUp" || e.key === "PageUp"){
      e.preventDefault();
      slides[Math.max(activeIndex - 1, 0)].scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ============================================================
     4. REVEAL ON SCROLL + ACTIVE SECTION TRACKING + COUNTERS
     ============================================================ */
  const counted = new WeakSet();

  function animateCounter(el){
    if (counted.has(el)) return;
    counted.add(el);
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced){
      el.textContent = target.toLocaleString("bn-BD") + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString("bn-BD") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const idx = slides.indexOf(entry.target);
      if (entry.isIntersecting && entry.intersectionRatio > 0.5){
        setActive(idx);
      }
    });
  }, { threshold: [0.5] });
  slides.forEach((s) => sectionObserver.observe(s));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".counter").forEach(animateCounter);
        if (entry.target.classList.contains("counter")) animateCounter(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  // counters that live outside a .reveal wrapper (safety net)
  document.querySelectorAll(".counter").forEach((el) => revealObserver.observe(el));

  /* ============================================================
     5. COVER WORDMARK LOAD-IN
     ============================================================ */
  window.addEventListener("load", () => {
    const wordmark = document.getElementById("wordmark");
    if (!prefersReduced && wordmark){
      wordmark.style.opacity = "0";
      wordmark.style.transform = "translateY(10px)";
      wordmark.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      requestAnimationFrame(() => {
        setTimeout(() => {
          wordmark.style.opacity = "1";
          wordmark.style.transform = "translateY(0)";
        }, 150);
      });
    }
  });

})();
