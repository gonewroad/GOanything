/* ===========================================================
   schedule.js — data/schedule.json 을 일정 리스트로 렌더
   =========================================================== */

(function () {
  "use strict";

  const { getJSON, el, showState } = window.App;

  const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

  /** "2026-11-10" → 로컬 자정 Date. (new Date(str) 은 UTC 로 읽혀 날짜가 밀립니다) */
  function parseDate(iso) {
    const parts = String(iso).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function todayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function buildEvent(item, isNext) {
    const date = parseDate(item.date);

    const row = el("article", "event" + (isNext ? " is-next" : ""));

    /* 날짜 */
    const dateBox = el("div", "event__date");
    if (date) {
      dateBox.append(
        el("span", "event__month", date.getMonth() + 1 + "월"),
        el("span", "event__day", String(date.getDate())),
        el("span", "event__weekday", WEEKDAYS[date.getDay()] + "요일")
      );
    } else {
      dateBox.appendChild(el("span", "event__day", "–"));
    }

    /* 제목 + 장소/메모 */
    const body = el("div", "event__body");
    body.appendChild(el("h3", "event__title", "")).textContent = item.title || "";

    const subParts = [item.location, item.note].filter(Boolean);
    if (subParts.length) {
      const sub = el("p", "event__sub");
      subParts.forEach(function (text) {
        const span = document.createElement("span");
        span.textContent = text;
        sub.appendChild(span);
      });
      body.appendChild(sub);
    }

    /* 오른쪽 배지 */
    const aside = el("div", "event__aside");
    if (isNext) aside.appendChild(el("span", "badge", "다음 모임"));
    if (item.type) {
      aside.appendChild(el("span", "badge badge--neutral", "")).textContent =
        item.type;
    }

    row.append(dateBox, body, aside);
    return row;
  }

  async function renderSchedule() {
    const target = document.querySelector("[data-schedule]");
    if (!target) return;

    const items = await getJSON("data/schedule.json");
    if (!items || !items.length) {
      showState(
        target,
        "일정을 불러오지 못했습니다. 로컬에서는 간단한 웹 서버로 열어주세요. (data/schedule.json)"
      );
      return;
    }

    const limit = Number(target.dataset.limit) || items.length;
    const start = todayStart();

    const sorted = items.slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    });

    // 지난 일정은 숨기고, 남은 게 없으면 최근 일정이라도 보여줍니다.
    const upcoming = sorted.filter(function (item) {
      const date = parseDate(item.date);
      return !date || date >= start;
    });
    const list = (upcoming.length ? upcoming : sorted.slice(-limit)).slice(0, limit);

    target.innerHTML = "";
    list.forEach(function (item, index) {
      target.appendChild(buildEvent(item, upcoming.length > 0 && index === 0));
    });
  }

  renderSchedule();
})();
