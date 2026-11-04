/* ===========================================================
   gallery.js — data/gallery.json 을 그리드로 렌더 + 라이트박스
   =========================================================== */

(function () {
  "use strict";

  const { getJSON, el, showState } = window.App;

  let shots = [];
  let current = 0;
  let lastFocused = null;
  let lightbox = null;
  let lightboxImg = null;
  let lightboxCaption = null;

  /* ---------- 라이트박스 ---------- */

  function buildLightbox() {
    const box = el("div", "lightbox");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "사진 크게 보기");

    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="닫기">✕</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="이전 사진">‹</button>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="다음 사진">›</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>";

    document.body.appendChild(box);

    lightboxImg = box.querySelector(".lightbox__img");
    lightboxCaption = box.querySelector(".lightbox__caption");

    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__nav--prev").addEventListener("click", function () {
      step(-1);
    });
    box.querySelector(".lightbox__nav--next").addEventListener("click", function () {
      step(1);
    });

    // 사진·버튼 바깥(배경)을 누르면 닫습니다.
    box.addEventListener("click", function (event) {
      if (event.target === box) close();
    });

    return box;
  }

  function show(index) {
    if (!shots.length) return;
    current = (index + shots.length) % shots.length;
    const shot = shots[current];
    lightboxImg.src = shot.src;
    lightboxImg.alt = shot.alt || shot.caption || "";
    lightboxCaption.textContent = shot.caption || "";
  }

  function step(delta) {
    show(current + delta);
  }

  function open(index) {
    if (!lightbox) lightbox = buildLightbox();
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add("is-open");
    document.body.classList.add("is-locked");
    lightbox.querySelector(".lightbox__close").focus();
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  /* ---------- 그리드 ---------- */

  function buildShot(item, index) {
    const button = el("button", "shot");
    button.type = "button";
    button.setAttribute("aria-label", (item.caption || "사진") + " 크게 보기");

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.caption || "";
    img.loading = index < 3 ? "eager" : "lazy";
    img.decoding = "async";

    button.appendChild(img);

    if (item.caption) {
      button.appendChild(el("span", "shot__caption", "")).textContent = item.caption;
    }

    button.addEventListener("click", function () {
      open(index);
    });

    return button;
  }

  async function renderGallery() {
    const target = document.querySelector("[data-gallery]");
    if (!target) return;

    const items = await getJSON("data/gallery.json");
    if (!items || !items.length) {
      showState(
        target,
        "사진을 불러오지 못했습니다. 로컬에서는 간단한 웹 서버로 열어주세요. (data/gallery.json)"
      );
      return;
    }

    const limit = Number(target.dataset.limit) || items.length;
    shots = items.slice(0, limit);

    target.innerHTML = "";
    shots.forEach(function (item, index) {
      target.appendChild(buildShot(item, index));
    });
  }

  renderGallery();
})();
