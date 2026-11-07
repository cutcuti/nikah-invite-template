/* ============================================================
   CONFIG — edit these
   ============================================================ */
const CONFIG = {
  // Nikah date/time (local time of the venue)
  weddingDate: "2026-10-31T20:00:00",

  // RSVPs go to a Google Form. Generate this block by running
  // backend/google-form-setup.gs. Leave null to run in demo mode.
  googleForm: null,

  // Opening animation: "envelope" (letter) or "doors"
  intro: "envelope",
};

/* ---------- Countdown ---------- */
(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = Math.max(0, target - Date.now());
    units.days.textContent = Math.floor(diff / 86400000);
    units.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    units.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
    units.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Opening: envelope or doors ---------- */
(function intro() {
  const chosen = CONFIG.intro === "doors" ? "doors" : "envelope";
  document.querySelectorAll(".intro").forEach((el) => { if (el.id !== chosen) el.remove(); });
  const overlay = document.getElementById(chosen);
  document.body.classList.add("locked");

  function enterSite() {
    document.body.classList.remove("locked");
    document.dispatchEvent(new Event("invite:open"));
  }

  if (chosen === "doors") {
    document.getElementById("open-doors").addEventListener("click", () => {
      overlay.classList.add("open");
      enterSite();
    }, { once: true });
    return;
  }

  // Envelope: tap the seal to open it, then tap (or scroll) to move on to the site
  let ready = false;
  let left = false;
  let touchY = null;

  function leave() {
    if (!ready || left) return;
    left = true;
    scrollTo(0, 0);
    overlay.classList.add("leave");
    enterSite();
    removeEventListener("wheel", onWheel);
    removeEventListener("keydown", onKey);
  }
  const onWheel = (e) => { if (e.deltaY > 4) leave(); };
  const onKey = (e) => { if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) leave(); };

  // first tap anywhere opens the envelope; once the letter is out, a tap opens the invitation
  let opened = false;
  overlay.addEventListener("click", () => {
    if (!opened) {
      opened = true;
      overlay.classList.add("open");
      setTimeout(() => { ready = true; }, 1700);   // once the letter has risen
      return;
    }
    leave();
  });

  addEventListener("wheel", onWheel, { passive: true });
  addEventListener("keydown", onKey);
  overlay.addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  overlay.addEventListener("touchmove", (e) => {
    if (touchY !== null && touchY - e.touches[0].clientY > 30) leave();
  }, { passive: true });
  document.getElementById("env-continue").addEventListener("click", leave);
})();

/* ---------- Centre the S ♡ Z monogram ----------
   Script glyphs have lopsided swashes, so centring by advance width looks off.
   Measure each letter's ink and nudge it to the middle of its box. */
(function centerGlyphs() {
  const ctx = document.createElement("canvas").getContext("2d");
  function measure(el, text) {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(text);
    return {
      adv: m.width,
      ink: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
      centreX: (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2,
      centreY: (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2,   // ink middle, from the baseline
    };
  }
  function run() {
    document.querySelectorAll(".mono").forEach((mono) => {
      const glyphs = [...mono.querySelectorAll(".glyph")];
      const heart = mono.querySelector(".mono-heart");
      const metrics = glyphs.map((el) => measure(el, el.textContent));
      // both letters get the same box, as wide as the wider letter's ink
      const box = Math.max(...metrics.map((m) => m.ink));
      // when letters share a baseline (Arabic), line up their visual middles instead
      const shared = mono.matches('[lang="ar"]');
      const mid = metrics.reduce((sum, m) => sum + m.centreY, 0) / metrics.length;
      glyphs.forEach((el, i) => {
        const dx = metrics[i].adv / 2 - metrics[i].centreX;
        const dy = shared ? mid - metrics[i].centreY : 0;
        el.style.width = box.toFixed(1) + "px";
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      });
      if (shared && heart) {
        const h = measure(heart, heart.textContent);
        heart.style.transform = `translateY(${(mid - h.centreY).toFixed(2)}px)`;
      }
    });
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
  addEventListener("resize", run);
})();

/* ---------- Page: plain scrolling, sections fade in once ---------- */
(function page() {
  const invite = document.getElementById("story");

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    io.unobserve(e.target);
  }), { threshold: 0.2 });

  invite.querySelectorAll(".scene, .panel, .closing").forEach((section) => {
    section.querySelectorAll(".stage-copy > *, .panel-title, .rsvp-lead, .rsvp-contact, .rsvp-form")
      .forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = Math.min(i, 4) * 0.15 + "s";
      });
  });
  // start once the doors have opened so the first scene fades in as they part
  document.addEventListener("invite:open", () => {
    invite.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }, { once: true });

  addEventListener("scroll", () => {
    if (scrollY > 30) invite.classList.add("hint-done");
  }, { passive: true });

  document.getElementById("next-btn").addEventListener("click", () => {
    scrollBy({ top: innerHeight, behavior: "smooth" });
  });
})();

/* ---------- RSVP ---------- */
(function rsvp() {
  const section = document.getElementById("rsvp");
  document.getElementById("rsvp-btn").addEventListener("click", () => {
    section.classList.add("open");
    section.scrollIntoView({ behavior: "smooth" });
  });

  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("form-status");
  const button = form.querySelector("button[type=submit]");

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    if (!fd.get("name")?.trim()) return setStatus("Please enter your name.", "err");
    if (!fd.get("attending")) return setStatus("Please let us know if you can attend.", "err");

    const data = {
      name: fd.get("name").trim(),
      phone: fd.get("phone") || "",
      attending: fd.get("attending"),
      guests: fd.get("guests"),
      message: fd.get("message") || "",
      submittedAt: new Date().toISOString(),
    };

    button.disabled = true;
    setStatus("Sending…");

    try {
      const gf = CONFIG.googleForm;
      if (!gf) {
        console.info("[demo] RSVP payload:", data);
        await new Promise((r) => setTimeout(r, 600));
      } else {
        const body = new URLSearchParams();
        for (const [key, entry] of Object.entries(gf.fields)) {
          if (data[key]) body.append(entry, data[key]);
        }
        // Google Forms doesn't send CORS headers, so the response is opaque.
        await fetch(gf.action, { method: "POST", mode: "no-cors", body });
      }

      form.reset();
      setStatus(
        data.attending === "Yes"
          ? "JazakAllahu khayran! We can't wait to celebrate with you."
          : "JazakAllahu khayran for letting us know. You'll be missed!",
        "ok"
      );
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong — please try again.", "err");
    } finally {
      button.disabled = false;
    }
  });
})();
