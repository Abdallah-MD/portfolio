(function () {
  "use strict";

  /* =====================================================================
   1. CONFIG — the only block you need to edit
   ===================================================================== */
  const CONFIG = {
    NAME: "Abdallah Mwadime",
    ROLE: "Web Developer & Graphic Designer",
    EMAIL: "abdidallaz3@gmail.com",

    INSTAGRAM_URL: "https://www.instagram.com/_uxcent_/",
    FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61575755204310",

    /* WhatsApp — the number lives HERE and nowhere else. */
    WHATSAPP: {
      LOCAL: "0758533159",
      COUNTRY_CODE: "254",
      MESSAGE:
        "Hi Abdallah, I found your portfolio and would like to discuss a project with you.",
    },

    /* Contact form delivery — paste ONE of these.
     A) Web3Forms (free, no server): web3forms.com → verify abdidallaz3@gmail.com → paste key.
     B) Formspree: formspree.io → paste the id after /f/ in your endpoint.
     Until one is set, the form falls back to opening a pre-filled email. */
    FORM: {
      WEB3FORMS_KEY: "WEB3FORMS_ACCESS_KEY",
      FORMSPREE_ID: "FORMSPREE_FORM_ID",
    },
  };

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const waNumber =
    CONFIG.WHATSAPP.COUNTRY_CODE +
    CONFIG.WHATSAPP.LOCAL.replace(/\D/g, "").replace(/^0+/, "");
  const waHref =
    "https://wa.me/" +
    waNumber +
    "?text=" +
    encodeURIComponent(CONFIG.WHATSAPP.MESSAGE);

  $$("[data-ig]").forEach((el) => (el.href = CONFIG.INSTAGRAM_URL));
  $$("[data-fb]").forEach((el) => (el.href = CONFIG.FACEBOOK_URL));
  $$("[data-wa]").forEach((el) => (el.href = waHref));
  $$("[data-mail]").forEach((el) => {
    el.href = "mailto:" + CONFIG.EMAIL;
    if (!el.querySelector("span")) el.textContent = CONFIG.EMAIL;
  });
  $$("[data-waphone]").forEach(
    (el) => (el.textContent = CONFIG.WHATSAPP.LOCAL),
  );
  $("#year").textContent = new Date().getFullYear();

  /* =====================================================================
   2. Theme
   ===================================================================== */
  const root = document.documentElement;
  try {
    const s = localStorage.getItem("am-theme");
    if (s === "light" || s === "dark") root.setAttribute("data-theme", s);
  } catch (e) {}
  $("#theme").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("am-theme", next);
    } catch (e) {}
    paintPalette();
  });

  /* =====================================================================
   3. Nav + accessible mobile menu
   ===================================================================== */
  const nav = $("#nav"),
    burger = $("#burger"),
    sheet = $("#sheet"),
    bar = $("#progress");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-stuck", scrollY > 40);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function openSheet() {
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
    const first = sheet.querySelector("a");
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 220);
  }
  function closeSheet(returnFocus) {
    if (!sheet.classList.contains("open")) return;
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    if (returnFocus) burger.focus({ preventScroll: true });
  }
  burger.addEventListener("click", () =>
    sheet.classList.contains("open") ? closeSheet(true) : openSheet(),
  );
  $$("#sheet a").forEach((a) =>
    a.addEventListener("click", () => closeSheet(false)),
  );
  /* tap outside the links closes it */
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet(true);
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSheet(true);
      return;
    }
    if (e.key !== "Tab" || !sheet.classList.contains("open")) return;
    const f = $$("a,button", sheet).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0],
      last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  /* close if the viewport grows into the desktop nav */
  matchMedia("(min-width:1024px)").addEventListener?.("change", (e) => {
    if (e.matches) closeSheet(false);
  });

  const navLinks = $$("[data-nav]");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          navLinks.forEach((l) => l.removeAttribute("aria-current"));
          const m = navLinks.find(
            (l) => l.getAttribute("href") === "#" + en.target.id,
          );
          if (m) m.setAttribute("aria-current", "true");
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    $$("main section[id]").forEach((s) => spy.observe(s));
  }

  /* =====================================================================
   4. Ticker
   ===================================================================== */
  const words = [
    "Web development",
    "Brand identity",
    "UI/UX design",
    "Graphics & print",
    "Social media design",
    "Maintenance & fixes",
  ];
  const track = $("#track");
  for (let p = 0; p < 2; p++)
    words.forEach((w) => {
      const s = document.createElement("span");
      s.textContent = w;
      track.appendChild(s);
    });

  /* =====================================================================
   5. Reveal + counters
   ===================================================================== */
  function count(el) {
    const target = parseFloat(el.dataset.count) || 0,
      suffix = el.dataset.suffix || "";
    if (reduced) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1400,
      t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1),
        e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ("IntersectionObserver" in window) {
    const rv = new IntersectionObserver(
      (es, o) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            o.unobserve(en.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    $$(".rv").forEach((el) => rv.observe(el));
    const cs = new IntersectionObserver(
      (es, o) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            count(en.target);
            o.unobserve(en.target);
          }
        }),
      { threshold: 0.5 },
    );
    $$("[data-count]").forEach((el) => cs.observe(el));
  } else {
    $$(".rv").forEach((el) => el.classList.add("in"));
    $$("[data-count]").forEach(
      (el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")),
    );
  }

  /* =====================================================================
   6. Pointer-only enhancements (never required to use the site)
   ===================================================================== */
  const finePointer = matchMedia(
    "(hover:hover) and (pointer:fine) and (min-width:1024px)",
  ).matches;

  if (finePointer) {
    $$(".spot").forEach((card) =>
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty(
          "--mx",
          ((e.clientX - r.left) / r.width) * 100 + "%",
        );
        card.style.setProperty(
          "--my",
          ((e.clientY - r.top) / r.height) * 100 + "%",
        );
      }),
    );
  }
  if (finePointer && !reduced) {
    $$(".magnet").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform =
          "translate(" +
          (e.clientX - r.left - r.width / 2) * 0.18 +
          "px," +
          ((e.clientY - r.top - r.height / 2) * 0.25 - 3) +
          "px)";
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
    const dot = $(".cursor"),
      ring = $(".cursor-ring");
    let cx = innerWidth / 2,
      cy = innerHeight / 2,
      rx = cx,
      ry = cy;
    addEventListener("pointermove", (e) => {
      cx = e.clientX;
      cy = e.clientY;
    });
    (function loop() {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      dot.style.transform = "translate(" + (cx - 3) + "px," + (cy - 3) + "px)";
      ring.style.transform =
        "translate(" + (rx - 17) + "px," + (ry - 17) + "px)";
      requestAnimationFrame(loop);
    })();
    $$("a,button,.proj,.svc,input,textarea").forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("hot"));
      el.addEventListener("pointerleave", () => ring.classList.remove("hot"));
    });
  }

  /* =====================================================================
   7. Hero background — scales its own complexity to the device
   ===================================================================== */
  const cv = $("#bg");
  let palette = [];
  function paintPalette() {
    const light =
      root.getAttribute("data-theme") === "light" ||
      (root.getAttribute("data-theme") !== "dark" &&
        matchMedia("(prefers-color-scheme: light)").matches);
    palette = light
      ? [
          [91, 75, 255, 0.26],
          [139, 92, 246, 0.24],
          [244, 91, 196, 0.18],
          [56, 225, 218, 0.18],
        ]
      : [
          [91, 75, 255, 0.58],
          [139, 92, 246, 0.55],
          [244, 91, 196, 0.34],
          [56, 225, 218, 0.26],
        ];
  }
  paintPalette();

  if (reduced) {
    cv.remove(); /* static gradient fallback only */
  } else {
    const ctx = cv.getContext("2d", { alpha: true });
    const cores = navigator.hardwareConcurrency || 4;
    const small = innerWidth < 768;
    const weak = small || cores <= 4 || matchMedia("(hover:none)").matches;

    /* complexity budget: phones get roughly a third of the desktop workload */
    const TIER = {
      blobs: weak ? 3 : 5,
      motes: weak ? (small ? 14 : 22) : 50,
      lines: weak ? 0 : 4 /* ribbons are the expensive part */,
      dpr: weak ? 1.25 : 2,
      stepPx: weak ? 20 : 12,
    };

    let W = 0,
      H = 0,
      dpr = 1,
      raf = null,
      visible = true;
    const blobs = [],
      motes = [];
    for (let i = 0; i < TIER.blobs; i++)
      blobs.push({
        a: Math.random() * 6.283,
        sp: 0.00012 + Math.random() * 0.0002,
        rx: 0.18 + Math.random() * 0.26,
        ry: 0.13 + Math.random() * 0.22,
        ox: 0.2 + Math.random() * 0.6,
        oy: 0.15 + Math.random() * 0.6,
        r: 0.24 + Math.random() * 0.3,
        c: i % 4,
      });
    for (let i = 0; i < TIER.motes; i++)
      motes.push({
        x: Math.random(),
        y: Math.random(),
        s: 0.4 + Math.random() * 1.4,
        v: 0.00006 + Math.random() * 0.0002,
        ph: Math.random() * 6.3,
      });

    function size() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, TIER.dpr);
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      cv.width = W;
      cv.height = H;
    }
    size();

    /* only resize on width change — stops the iOS URL-bar height jitter */
    let lastW = innerWidth;
    addEventListener(
      "resize",
      () => {
        if (Math.abs(innerWidth - lastW) < 2) return;
        lastW = innerWidth;
        size();
      },
      { passive: true },
    );
    addEventListener("orientationchange", () => setTimeout(size, 250));

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const b of blobs) {
        const a = b.a + t * b.sp;
        const x = (b.ox + Math.cos(a) * b.rx) * W;
        const y = (b.oy + Math.sin(a * 1.23) * b.ry) * H;
        const rad = b.r * Math.max(W, H) * (0.9 + 0.12 * Math.sin(a * 2));
        const c = palette[b.c];
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(
          0,
          "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")",
        );
        g.addColorStop(
          0.55,
          "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] * 0.24 + ")",
        );
        g.addColorStop(1, "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 6.283);
        ctx.fill();
      }

      if (TIER.lines) {
        ctx.lineWidth = dpr;
        for (let l = 0; l < TIER.lines; l++) {
          ctx.beginPath();
          for (let px = 0; px <= W; px += TIER.stepPx * dpr) {
            const n = px / W;
            const y =
              H * (0.42 + l * 0.117) +
              Math.sin(n * 5.2 + t * 0.00022 + l) * H * 0.075 +
              Math.sin(n * 11.4 - t * 0.00034 + l * 2) * H * 0.028;
            px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
          }
          const c = palette[(l + 1) % palette.length];
          ctx.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",.2)";
          ctx.stroke();
        }
      }

      for (const m of motes) {
        const y = (((m.y - t * m.v) % 1) + 1) % 1;
        ctx.fillStyle =
          "rgba(255,255,255," +
          (0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.0012 + m.ph))) +
          ")";
        ctx.beginPath();
        ctx.arc(m.x * W, y * H, m.s * dpr, 0, 6.283);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (es) => {
          visible = es[0].isIntersecting && !document.hidden;
        },
        { threshold: 0 },
      ).observe($(".hero")); /* stops drawing once scrolled past */
    }
  }

  requestAnimationFrame(() => document.body.classList.add("loaded"));

  /* =====================================================================
   8. Contact form — real delivery, honest fallback
   ===================================================================== */
  const form = $("#form"),
    statusEl = $("#status"),
    sendBtn = $("#send"),
    sendLabel = $("#send-label");

  const RULES = {
    name: (v) => v.trim().length >= 2 || "Enter your name.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ||
      "Enter a valid email address.",
    phone: (v) =>
      v.replace(/\D/g, "").length >= 7 ||
      "Enter a phone number I can reach you on.",
    subject: (v) => v.trim().length >= 3 || "Add a short subject.",
    message: (v) =>
      v.trim().length >= 10 || "Tell me a little more — at least a sentence.",
  };
  function validateField(input) {
    const rule = RULES[input.name];
    if (!rule) return true;
    const res = rule(input.value),
      box = form.querySelector('[data-err="' + input.name + '"]');
    if (res === true) {
      input.removeAttribute("aria-invalid");
      box.textContent = "";
      return true;
    }
    input.setAttribute("aria-invalid", "true");
    box.textContent = res;
    return false;
  }
  $$("input,textarea", form).forEach((i) => {
    i.addEventListener("blur", () => {
      if (i.value) validateField(i);
    });
    i.addEventListener("input", () => {
      if (i.getAttribute("aria-invalid")) validateField(i);
    });
  });
  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "status" + (kind ? " " + kind : "");
  }
  function mailtoFallback(d) {
    const body =
      "Name: " +
      d.name +
      "\nEmail: " +
      d.email +
      "\nPhone: " +
      d.phone +
      "\n\n" +
      d.message;
    location.href =
      "mailto:" +
      CONFIG.EMAIL +
      "?subject=" +
      encodeURIComponent(d.subject) +
      "&body=" +
      encodeURIComponent(body);
  }
  async function deliver(d) {
    const key = CONFIG.FORM.WEB3FORMS_KEY,
      fid = CONFIG.FORM.FORMSPREE_ID;
    if (key && key !== "WEB3FORMS_ACCESS_KEY") {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          subject: "Portfolio enquiry: " + d.subject,
          from_name: d.name,
          name: d.name,
          email: d.email,
          phone: d.phone,
          message: d.message,
          botcheck: d.botcheck,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false)
        throw new Error(j.message || "Delivery failed");
      return;
    }
    if (fid && fid !== "FORMSPREE_FORM_ID") {
      const r = await fetch("https://formspree.io/f/" + fid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error("Delivery failed");
      return;
    }
    throw new Error("NOT_CONFIGURED");
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = $$("input,textarea", form).filter((i) => RULES[i.name]);
    if (!inputs.map(validateField).every(Boolean)) {
      setStatus("Check the highlighted fields and try again.", "bad");
      const bad = form.querySelector('[aria-invalid="true"]');
      if (bad) {
        bad.focus({ preventScroll: true });
        bad.scrollIntoView({
          block: "center",
          behavior: reduced ? "auto" : "smooth",
        });
      }
      return;
    }
    const d = Object.fromEntries(new FormData(form).entries());
    if (d.botcheck) return;
    sendBtn.disabled = true;
    sendLabel.textContent = "Sending…";
    setStatus("Sending your message…");
    try {
      await deliver(d);
      form.reset();
      setStatus(
        "Message sent. I'll reply to " + d.email + " within a day.",
        "ok",
      );
    } catch (err) {
      setStatus(
        err.message === "NOT_CONFIGURED"
          ? "Opening your email app instead — paste your form key into CONFIG to send from here."
          : "That didn't go through. Opening your email app so the message isn't lost — or message me on WhatsApp.",
        "bad",
      );
      mailtoFallback(d);
    } finally {
      sendBtn.disabled = false;
      sendLabel.textContent = "Send message";
    }
  });

  /* =====================================================================
   9. Placeholder project links
   ===================================================================== */
  $$("[data-project]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (a.getAttribute("href") === "#") {
        e.preventDefault();
        const html = a.innerHTML;
        a.textContent = "Add your project link in the HTML";
        setTimeout(() => (a.innerHTML = html), 2200);
      }
    }),
  );
})();
