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
      const x = offset * 620;               // horizontal spacing (wide-screen landscape hero)
      const z = -abs * 360;                  // recede into the scene
      const rotY = offset * -20;             // 3D turn
      const scale = abs === 0 ? 1 : 0.86;
      const opacity = abs > 2 ? 0 : (abs === 0 ? 1 : 0.5);

      // base anchor centers the item on both axes; landscape frame keeps full photo visible
      item.style.transform =
        `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = String(100 - abs);
      item.style.filter = abs === 0 ? "brightness(1)" : "brightness(0.65)";
      item.style.pointerEvents = abs <= 2 ? "auto" : "none";
      item.style.cursor = abs === 0 ? "default" : "pointer";
    });
  }

  function goTo(i){
    const n = items.length;
    current = ((i % n) + n) % n;
    const cfCounter = document.getElementById("cfCounter");
    if (cfCounter) {
      cfCounter.textContent = `${(current + 1).toLocaleString("bn-BD")} / ${n.toLocaleString("bn-BD")}`;
    }
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

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      goTo(index);
      startAuto();
    });
  });

  const cfNext = document.getElementById("cfNext");
  const cfPrev = document.getElementById("cfPrev");
  if (cfNext) cfNext.addEventListener("click", () => { goTo(current + 1); startAuto(); });
  if (cfPrev) cfPrev.addEventListener("click", () => { goTo(current - 1); startAuto(); });
  const coverflowEl = document.getElementById("coverflow");
  if (coverflowEl) {
    coverflowEl.addEventListener("mouseenter", stopAuto);
    coverflowEl.addEventListener("mouseleave", startAuto);
  }

  layout();
  startAuto();

  /* ============================================================
     2. SECTION LIST + LEAF RAIL NAV
     ============================================================ */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const railNodes = document.getElementById("railNodes");
  const railFill = document.getElementById("railFill");

  if (railNodes) {
    slides.forEach((slide, i) => {
      const btn = document.createElement("li");
      const inner = document.createElement("button");
      inner.className = "leaf-rail__node";
      inner.setAttribute("aria-label", slide.dataset.title || `সেকশন ${i+1}`);
      inner.addEventListener("click", () => slide.scrollIntoView({ behavior: "smooth" }));
      btn.appendChild(inner);
      railNodes.appendChild(btn);
    });
  }
  const railButtons = railNodes ? Array.from(railNodes.querySelectorAll(".leaf-rail__node")) : [];

  let activeIndex = 0;
  function setActive(i){
    activeIndex = i;
    railButtons.forEach((b, idx) => b.classList.toggle("is-active", idx === i));
    if (railFill && slides.length > 1) {
      railFill.style.height = `${(i / (slides.length - 1)) * 100}%`;
    }
    const presSlideIndicator = document.getElementById("presSlideIndicator");
    if (presSlideIndicator) {
      presSlideIndicator.textContent = `${(i + 1).toLocaleString("bn-BD")} / ${slides.length.toLocaleString("bn-BD")}`;
    }
  }
  setActive(0);

  /* ============================================================
     3. UP / DOWN ARROW NAVIGATION
     ============================================================ */
  const navDown = document.getElementById("navDown");
  const navUp = document.getElementById("navUp");
  if (navDown) {
    navDown.addEventListener("click", () => {
      const next = Math.min(activeIndex + 1, slides.length - 1);
      slides[next].scrollIntoView({ behavior: "smooth" });
    });
  }
  if (navUp) {
    navUp.addEventListener("click", () => {
      const prev = Math.max(activeIndex - 1, 0);
      slides[prev].scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ============================================================
     4. PRESENTATION MODE CONTROLS
     ============================================================ */
  const btnTogglePres = document.getElementById("btnTogglePres");
  const presPrev = document.getElementById("presPrev");
  const presNext = document.getElementById("presNext");
  const presExit = document.getElementById("presExit");
  let isPresMode = false;

  function togglePresMode(enable) {
    isPresMode = enable !== undefined ? enable : !isPresMode;
    document.body.classList.toggle("deck-mode--pres", isPresMode);
    if (isPresMode) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      slides[activeIndex].scrollIntoView({ behavior: "smooth" });
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  if (btnTogglePres) btnTogglePres.addEventListener("click", () => togglePresMode(true));
  if (presExit) presExit.addEventListener("click", () => togglePresMode(false));
  if (presPrev) presPrev.addEventListener("click", () => {
    const prev = Math.max(activeIndex - 1, 0);
    slides[prev].scrollIntoView({ behavior: "smooth" });
  });
  if (presNext) presNext.addEventListener("click", () => {
    const next = Math.min(activeIndex + 1, slides.length - 1);
    slides[next].scrollIntoView({ behavior: "smooth" });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isPresMode) {
      togglePresMode(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "PageDown" || (isPresMode && (e.key === " " || e.key === "ArrowRight"))){
      e.preventDefault();
      slides[Math.min(activeIndex + 1, slides.length - 1)].scrollIntoView({ behavior: "smooth" });
    } else if (e.key === "ArrowUp" || e.key === "PageUp" || (isPresMode && e.key === "ArrowLeft")){
      e.preventDefault();
      slides[Math.max(activeIndex - 1, 0)].scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ============================================================
     5. EMBEDDED LIVE APP TESTER
     ============================================================ */
  const btnEmbedViewer = document.getElementById("btnEmbedViewer");
  const heroEmbedBtn = document.getElementById("heroEmbedBtn");
  const embeddedDemoWrapper = document.getElementById("embeddedDemoWrapper");
  const liveDemoIframe = document.getElementById("liveDemoIframe");
  const btnCloseFrame = document.getElementById("btnCloseFrame");
  const btnReloadFrame = document.getElementById("btnReloadFrame");

  function openEmbedDemo() {
    if (embeddedDemoWrapper && liveDemoIframe) {
      embeddedDemoWrapper.style.display = "block";
      if (!liveDemoIframe.src || liveDemoIframe.src === "about:blank") {
        liveDemoIframe.src = "https://hiya.handsandhead.com";
      }
      embeddedDemoWrapper.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (btnEmbedViewer) btnEmbedViewer.addEventListener("click", openEmbedDemo);
  if (heroEmbedBtn) heroEmbedBtn.addEventListener("click", openEmbedDemo);
  if (btnCloseFrame && embeddedDemoWrapper) {
    btnCloseFrame.addEventListener("click", () => {
      embeddedDemoWrapper.style.display = "none";
    });
  }
  if (btnReloadFrame && liveDemoIframe) {
    btnReloadFrame.addEventListener("click", () => {
      liveDemoIframe.src = "https://hiya.handsandhead.com";
    });
  }

  /* ============================================================
     6. INTERACTIVE NATIONAL ROLLOUT SIMULATOR
     ============================================================ */
  const districtRange = document.getElementById("districtRange");
  const districtCountLabel = document.getElementById("districtCountLabel");
  const simChildrenVal = document.getElementById("simChildrenVal");
  const simSchoolsVal = document.getElementById("simSchoolsVal");
  const simSavingsVal = document.getElementById("simSavingsVal");
  const simLiteracyVal = document.getElementById("simLiteracyVal");
  const presetBtns = Array.from(document.querySelectorAll(".preset-btn"));
  const btnToggleSimBox = document.getElementById("btnToggleSimBox");
  const simulatorBox = document.getElementById("simulatorBox");
  const simToggleArrow = document.getElementById("simToggleArrow");
  const btnOpenSimulator = document.getElementById("btnOpenSimulator");

  if (btnOpenSimulator) {
    btnOpenSimulator.addEventListener("click", () => {
      const s4 = document.getElementById("s4");
      if (s4) s4.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnToggleSimBox && simulatorBox) {
    btnToggleSimBox.addEventListener("click", () => {
      const isHidden = window.getComputedStyle(simulatorBox).display === "none";
      simulatorBox.style.display = isHidden ? "block" : "none";
      if (simToggleArrow) {
        simToggleArrow.textContent = isHidden ? "▲" : "▼";
      }
      if (isHidden) {
        simulatorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function updateSimulator(districtCount) {
    const d = parseInt(districtCount, 10) || 1;
    let label = `${d.toLocaleString("bn-BD")} জেলা`;
    if (d === 1) label = "১ জেলা (প্রাথমিক পাইলট)";
    else if (d === 8) label = "৮ জেলা (বিভাগীয় পাইলট)";
    else if (d === 64) label = "৬৪ জেলা (সারাদেশে ১০০% কভারেজ)";

    if (districtCountLabel) districtCountLabel.textContent = label;

    // Calculations based on 64 districts having ~1.8 crore children and ~65,000 primary schools
    const childrenPerDistrict = 280000;
    const schoolsPerDistrict = 1015;

    let totalChildren = d * childrenPerDistrict;
    if (d === 1) totalChildren = 150000;
    else if (d === 64) totalChildren = 18000000;

    let totalSchools = Math.round(d * schoolsPerDistrict);
    if (d === 64) totalSchools = 65000;

    const savingsPercent = (88 + (d / 64) * 5.4).toFixed(1);
    const speed = (3.5 + (d / 64) * 1.5).toFixed(1);

    if (simChildrenVal) simChildrenVal.textContent = totalChildren >= 100000 ? `${(totalChildren / 100000).toLocaleString("bn-BD", { maximumFractionDigits: 1 })} লক্ষ+` : `${totalChildren.toLocaleString("bn-BD")}+`;
    if (simSchoolsVal) simSchoolsVal.textContent = `${totalSchools.toLocaleString("bn-BD")}+`;
    if (simSavingsVal) simSavingsVal.textContent = `${savingsPercent.toLocaleString("bn-BD")}%`;
    if (simLiteracyVal) simLiteracyVal.textContent = `+${speed.toLocaleString("bn-BD")} গুণ`;

    presetBtns.forEach(btn => {
      btn.classList.toggle("active", parseInt(btn.dataset.val, 10) === d);
    });
  }

  if (districtRange) {
    districtRange.addEventListener("input", (e) => {
      updateSimulator(e.target.value);
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.dataset.val, 10);
      if (districtRange) districtRange.value = val;
      updateSimulator(val);
    });
  });

  updateSimulator(8);

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
     5. COVER WORDMARK LOAD-IN & RURAL MEDIA SWITCHER
     ============================================================ */
  window.switchRuralMedia = function(mode) {
    const pane1 = document.getElementById("ruralPanePhoto1");
    const pane2 = document.getElementById("ruralPanePhoto2");
    const paneVideo = document.getElementById("ruralPaneVideo");
    
    const tab1 = document.getElementById("tabMediaPhoto1");
    const tab2 = document.getElementById("tabMediaPhoto2");
    const tabVideo = document.getElementById("tabMediaVideo");

    const thumb1 = document.getElementById("thumbRural1");
    const thumb2 = document.getElementById("thumbRural2");
    const thumb3 = document.getElementById("thumbRural3");

    const videoEl = document.getElementById("ruralDemoVideo");

    // Clear active states
    [pane1, pane2, paneVideo].forEach(p => p && p.classList.remove("active"));
    [tab1, tab2, tabVideo].forEach(t => t && t.classList.remove("active"));
    [thumb1, thumb2, thumb3].forEach(th => th && th.classList.remove("active"));

    if (mode === "photo2") {
      if (pane2) pane2.classList.add("active");
      if (tab2) tab2.classList.add("active");
      if (thumb2) thumb2.classList.add("active");
      if (videoEl) { try { videoEl.pause(); } catch(e) {} }
    } else if (mode === "video") {
      if (paneVideo) paneVideo.classList.add("active");
      if (tabVideo) tabVideo.classList.add("active");
      if (thumb3) thumb3.classList.add("active");
      if (videoEl) {
        try {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => { /* Autoplay restricted, user can click play */ });
          }
        } catch(e) {}
      }
    } else {
      // Default to photo1
      if (pane1) pane1.classList.add("active");
      if (tab1) tab1.classList.add("active");
      if (thumb1) thumb1.classList.add("active");
      if (videoEl) { try { videoEl.pause(); } catch(e) {} }
    }
  };

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
