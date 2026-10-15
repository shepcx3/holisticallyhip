/* Home page intro: "leaf slides through".
   1. The wordmark pops up with the leaf sitting to the right of the words.
   2. The leaf glides back through the middle of HOLISTICALLY HIP; each letter
      lifts and softens as the leaf passes, and the line re-centres as it goes.
   3. The leaf settles into its place on the left.
   4. The whole logo falls back into the header while the page fades in. */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  if (!intro || !root.classList.contains("intro-on")) return;

  // Geometry of assets/img/wordmark-*.png, in source pixels.
  const W = 1071, H = 113;
  const LEAF = { x: 4, y: 4, w: 111, h: 105 };
  const TEXT = { y: 30, h: 68 };
  const LETTERS = [ // [x, width] for H O L I S T I C A L L Y   H I P
    [152, 74], [233, 68], [307, 55], [365, 31], [401, 50], [455, 60], [519, 30], [556, 62],
    [620, 70], [690, 55], [749, 54], [803, 65], [897, 74], [977, 30], [1012, 55],
  ];
  const GAP = 37; // leaf-to-text gap in the wordmark

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pct = (v, of) => `${(v / of) * 100}%`;
  const running = new Set();
  let speed = 1;

  function play(el, keyframes, opts) {
    const a = el.animate(keyframes, { fill: "both", ...opts, duration: opts.duration * speed, delay: (opts.delay || 0) * speed });
    running.add(a);
    a.finished.catch(() => {}).then(() => running.delete(a));
    return a;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms * speed));

  // Build the logo from pieces that line up exactly with the header wordmark.
  const logo = intro.querySelector("[data-intro-logo]");
  const track = document.createElement("div");
  track.className = "intro__track";
  logo.append(track);

  const letters = LETTERS.map(([x, w]) => {
    const box = document.createElement("span");
    box.className = "intro__piece intro__letter";
    Object.assign(box.style, { left: pct(x, W), top: pct(TEXT.y, H), width: pct(w, W), height: pct(TEXT.h, H) });
    const img = new Image();
    img.src = "assets/img/wordmark-text-dark.png";
    img.alt = "";
    Object.assign(img.style, { width: pct(W, w), left: pct(-x, w), top: pct(-TEXT.y, TEXT.h) });
    box.append(img);
    track.append(box);
    return { box, img, center: x + w / 2 };
  });

  const leaf = new Image();
  leaf.src = "assets/img/leaf-dark.png";
  leaf.alt = "";
  leaf.className = "intro__piece intro__leaf";
  Object.assign(leaf.style, { left: pct(LEAF.x, W), top: pct(LEAF.y, H), width: pct(LEAF.w, W), height: pct(LEAF.h, H) });
  track.append(leaf);

  const skip = document.createElement("span");
  skip.className = "intro__skip";
  skip.textContent = "Tap to skip";
  intro.append(skip);

  // Skipping finishes whatever is playing and runs the rest at high speed.
  const onSkip = () => {
    if (speed < 1) return;
    speed = 0.15;
    running.forEach((a) => a.finish());
  };
  intro.addEventListener("click", onSkip);
  window.addEventListener("keydown", onSkip, { once: true });

  // Solve a CSS cubic-bezier for the time at which its output reaches `y`.
  function bezierTimeFor(y, [x1, y1, x2, y2]) {
    const b = (t, a1, a2) => 3 * a1 * t * (1 - t) ** 2 + 3 * a2 * t ** 2 * (1 - t) + t ** 3;
    for (let t = 0; t <= 1; t += 0.002) if (b(t, y1, y2) >= y) return b(t, x1, x2);
    return 1;
  }

  async function sequence() {
    const unit = () => logo.getBoundingClientRect().width / W;

    // 1. Pop up, leaf on the right, line centred on what is visible.
    const travel = LETTERS.at(-1)[0] + LETTERS.at(-1)[1] + GAP - LEAF.x; // leaf start offset
    const startCenter = (LETTERS[0][0] + LEAF.x + travel + LEAF.w) / 2;
    const endCenter = (LEAF.x + LETTERS.at(-1)[0] + LETTERS.at(-1)[1]) / 2;
    const trackShift = endCenter - startCenter;
    const u = unit();

    play(track, [{ transform: `translateX(${trackShift * u}px)` }, { transform: `translateX(${trackShift * u}px)` }], { duration: 1 });
    play(leaf, [{ transform: `translateX(${travel * u}px)` }, { transform: `translateX(${travel * u}px)` }], { duration: 1 });
    await play(logo, [
      { opacity: 0, transform: "translateY(16px)", filter: "blur(6px)" },
      { opacity: 1, transform: "none", filter: "blur(0)" },
    ], { duration: 900, easing: "cubic-bezier(.2,.7,.2,1)" }).finished;
    await wait(250);

    // 2 + 3. Leaf glides right-to-left through the words and settles.
    const EASE = [0.62, 0, 0.3, 1];
    const travelMs = 1700;
    const dy = (TEXT.y + TEXT.h / 2 - (LEAF.y + LEAF.h / 2)) * u; // centre leaf on the text line
    play(track, [{ transform: `translateX(${trackShift * u}px)` }, { transform: "translateX(0)" }],
      { duration: travelMs, easing: `cubic-bezier(${EASE})` });
    const leafRun = play(leaf, [
      { transform: `translate(${travel * u}px, 0) scale(1) rotate(0deg)` },
      { transform: `translate(${travel * 0.9 * u}px, ${dy}px) scale(.6) rotate(-14deg)`, offset: 0.12 },
      { transform: `translate(${travel * 0.1 * u}px, ${dy}px) scale(.6) rotate(-14deg)`, offset: 0.86 },
      { transform: `translate(0, 0) scale(1.06) rotate(5deg)`, offset: 0.95 },
      { transform: "translate(0, 0) scale(1) rotate(0deg)" },
    ], { duration: travelMs, easing: `cubic-bezier(${EASE})` });

    // Each letter lifts and softens just as the leaf passes under it.
    const leafStart = LEAF.x + LEAF.w / 2 + travel;
    letters.forEach(({ box, center }) => {
      const progress = (leafStart - center) / travel; // eased progress at which leaf centre meets letter
      if (progress <= 0 || progress >= 1) return;
      const t = bezierTimeFor(progress, EASE) * travelMs;
      play(box, [
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(-30%)", opacity: 0.3, offset: 0.42 },
        { transform: "translateY(0)", opacity: 1 },
      ], { duration: 620, delay: Math.max(0, t - 240), easing: "cubic-bezier(.45,0,.25,1)", fill: "none" });
    });
    await leafRun.finished;
    await wait(450);

    await land();
  }

  // 4. Shared ending: drop the logo onto the header wordmark and reveal the page.
  async function land() {
    const target = document.querySelector(".site-header__logo img");
    const main = document.getElementById("main");
    const bg = intro.querySelector(".intro__bg");
    intro.querySelector(".intro__skip").remove();
    const from = logo.getBoundingClientRect();
    const to = target ? target.getBoundingClientRect() : null;
    const dur = 1150;

    if (to && to.width) {
      const s = to.width / from.width;
      const dx = to.left - from.left, dy = to.top - from.top;
      play(logo, [
        { transform: "none" },
        { transform: "translateY(-6px) scale(1.015)", offset: 0.14 },
        { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      ], { duration: dur, easing: "cubic-bezier(.7,0,.2,1)" });
    } else {
      play(logo, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.5 });
    }
    play(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.8, delay: dur * 0.3, easing: "cubic-bezier(.4,0,.2,1)" });
    const reveal = main && play(main, [
      { transform: "translateY(28px) scale(1.01)", opacity: 0.6 },
      { transform: "none", opacity: 1 },
    ], { duration: dur, delay: dur * 0.25, easing: "cubic-bezier(.2,.7,.2,1)" });
    await wait(dur);
    finish();
    if (reveal) reveal.finished.then(() => reveal.cancel()).catch(() => {});
  }

  function finish() {
    root.classList.remove("intro-on");
    intro.remove();
    window.removeEventListener("keydown", onSkip);
  }

  async function start() {
    window.scrollTo(0, 0);
    await Promise.all([...intro.querySelectorAll("img")].map((i) => i.decode().catch(() => {})));
    if (reduced) {
      logo.style.opacity = 1;
      await wait(500);
      return land();
    }
    return sequence();
  }

  start().catch(finish);
})();
