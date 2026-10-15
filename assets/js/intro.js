/* Home page intro: "leaf floats down".
   1. HOLISTICALLY HIP rises into view letter by letter.
   2. The leaf drifts down from above the screen, swaying like a falling leaf,
      and comes to rest in its place on the left. The line eases over to make room.
   3. The whole logo falls back into the header while the page fades in. */
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

  async function sequence() {
    const u = logo.getBoundingClientRect().width / W;
    const top = logo.getBoundingClientRect().top;

    // Centre the words alone; the line shifts over once the leaf arrives.
    const textCenter = (LETTERS[0][0] + LETTERS.at(-1)[0] + LETTERS.at(-1)[1]) / 2;
    const fullCenter = (LEAF.x + LETTERS.at(-1)[0] + LETTERS.at(-1)[1]) / 2;
    const shift = (fullCenter - textCenter) * u;
    play(track, [{ transform: `translateX(${shift}px)` }, { transform: `translateX(${shift}px)` }], { duration: 1 });
    play(leaf, [{ opacity: 0 }, { opacity: 0 }], { duration: 1 });
    logo.style.opacity = 1;

    // 1. Letters rise out of a mask, left to right.
    letters.forEach(({ img }, i) => {
      play(img, [
        { transform: "translateY(105%)" },
        { transform: "translateY(0)" },
      ], { duration: 560, delay: i * 22, easing: "cubic-bezier(.2,.75,.15,1)" });
    });

    // 2. The leaf falls from just above the screen, swinging side to side.
    const fallMs = 1100;
    const dropStart = 80;
    const startY = -(top + LEAF.y * u + LEAF.h * u + 40);
    const sway = (k) => k * u;
    play(leaf, [
      { transform: `translate(${sway(-50)}px, ${startY}px) rotate(-32deg)`, opacity: 0, easing: "ease-in-out" },
      { transform: `translate(${sway(70)}px, ${startY * 0.6}px) rotate(20deg)`, opacity: 1, offset: 0.36, easing: "ease-in-out" },
      { transform: `translate(${sway(-30)}px, ${startY * 0.22}px) rotate(-10deg)`, offset: 0.7, easing: "ease-in-out" },
      { transform: `translate(${sway(6)}px, ${sway(-3)}px) rotate(3deg)`, offset: 0.9, easing: "ease-out" },
      { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
    ], { duration: fallMs, delay: dropStart });

    // The words ease left to make room as the leaf comes in to land.
    const settle = play(track, [{ transform: `translateX(${shift}px)` }, { transform: "translateX(0)" }],
      { duration: 650, delay: dropStart + fallMs - 650, easing: "cubic-bezier(.45,0,.2,1)" });
    await settle.finished;
    await wait(60);

    await land();
  }

  // 3. Shared ending: drop the logo onto the header wordmark and reveal the page.
  async function land() {
    const target = document.querySelector(".site-header__logo img");
    const main = document.getElementById("main");
    const bg = intro.querySelector(".intro__bg");
    intro.querySelector(".intro__skip").remove();
    const from = logo.getBoundingClientRect();
    const to = target ? target.getBoundingClientRect() : null;
    const dur = 650;

    if (to && to.width) {
      const s = to.width / from.width;
      const dx = to.left - from.left, dy = to.top - from.top;
      play(logo, [
        { transform: "none" },
        { transform: "translateY(-4px) scale(1.01)", offset: 0.12 },
        { transform: `translate(${dx}px, ${dy}px) scale(${s})` },
      ], { duration: dur, easing: "cubic-bezier(.7,0,.2,1)" });
    } else {
      play(logo, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.5 });
    }
    play(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.75, delay: dur * 0.2, easing: "cubic-bezier(.4,0,.2,1)" });
    const reveal = main && play(main, [
      { transform: "translateY(20px) scale(1.01)", opacity: 0.6 },
      { transform: "none", opacity: 1 },
    ], { duration: dur, delay: dur * 0.2, easing: "cubic-bezier(.2,.7,.2,1)" });
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
      await wait(200);
      return land();
    }
    return sequence();
  }

  start().catch(finish);
})();
