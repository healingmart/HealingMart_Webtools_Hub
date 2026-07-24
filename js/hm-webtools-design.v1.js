/*
 * HealingMart Web Tools UI v1.0.0
 * - 빠른찾기 바텀시트
 * - 토탈 웹도구 전체 페이지
 * - 검색, 카테고리 필터, 최신 업데이트 슬라이더
 *
 * 사용법
 * 1. 빠른찾기 버튼: <button type="button" data-hm-webtools-open>빠른찾기</button>
 * 2. 전체 페이지: <div data-hm-webtools-page></div>
 * 3. 직접 열기: window.HMWebTools.open()
 */
(function (window, document) {
  "use strict";

  const APP_ID = "hmWebToolsApp";
  const STYLE_ID = "hmWebToolsStyle";
  const SHEET_ID = "hmWebToolsSheet";
  const PAGE_SELECTOR = "[data-hm-webtools-page]";
  const OPEN_SELECTOR = "[data-hm-webtools-open]";
  const SVG_NS = "http://www.w3.org/2000/svg";

  const ICONS = Object.freeze({
    search: [
      ["circle", { cx: "11", cy: "11", r: "6" }],
      ["path", { d: "m16 16 4 4" }]
    ],
    close: [
      ["path", { d: "M6 6l12 12" }],
      ["path", { d: "M18 6 6 18" }]
    ],
    arrowLeft: [
      ["path", { d: "m15 18-6-6 6-6" }]
    ],
    arrowRight: [
      ["path", { d: "m9 18 6-6-6-6" }]
    ],
    external: [
      ["path", { d: "M14 4h6v6" }],
      ["path", { d: "m20 4-9 9" }],
      ["path", { d: "M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" }]
    ],
    image: [
      ["rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }],
      ["circle", { cx: "8.5", cy: "9", r: "1.5" }],
      ["path", { d: "m21 15-5-5L5 20" }]
    ],
    video: [
      ["rect", { x: "3", y: "5", width: "13", height: "14", rx: "2" }],
      ["path", { d: "m16 10 5-3v10l-5-3" }]
    ],
    writing: [
      ["path", { d: "M4 20h5" }],
      ["path", { d: "m14.5 4.5 5 5L9 20H4v-5Z" }],
      ["path", { d: "m13 6 5 5" }]
    ],
    life: [
      ["path", { d: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" }]
    ],
    document: [
      ["path", { d: "M6 3h8l4 4v14H6Z" }],
      ["path", { d: "M14 3v5h5" }],
      ["path", { d: "M9 13h6M9 17h6" }]
    ],
    audio: [
      ["path", { d: "M9 18V6l10-2v12" }],
      ["circle", { cx: "6", cy: "18", r: "3" }],
      ["circle", { cx: "16", cy: "16", r: "3" }]
    ],
    data: [
      ["ellipse", { cx: "12", cy: "5", rx: "7", ry: "3" }],
      ["path", { d: "M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" }],
      ["path", { d: "M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" }]
    ],
    developer: [
      ["path", { d: "m8 9-4 3 4 3" }],
      ["path", { d: "m16 9 4 3-4 3" }],
      ["path", { d: "m14 5-4 14" }]
    ],
    calculator: [
      ["rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }],
      ["path", { d: "M8 6h8v4H8Z" }],
      ["path", { d: "M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1M16 18h1" }]
    ],
    convert: [
      ["path", { d: "M7 7h11l-3-3" }],
      ["path", { d: "m18 7-3 3" }],
      ["path", { d: "M17 17H6l3 3" }],
      ["path", { d: "m6 17 3-3" }]
    ],
    rename: [
      ["path", { d: "M4 6h10M4 12h7M4 18h5" }],
      ["path", { d: "m14 17 5-5 2 2-5 5-3 1Z" }]
    ],
    watermark: [
      ["rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }],
      ["path", { d: "M7 9l2 7 3-5 3 5 2-7" }]
    ],
    crop: [
      ["path", { d: "M6 2v16a2 2 0 0 0 2 2h14" }],
      ["path", { d: "M2 6h14a2 2 0 0 1 2 2v14" }]
    ],
    cutout: [
      ["circle", { cx: "9", cy: "9", r: "3" }],
      ["circle", { cx: "15", cy: "15", r: "3" }],
      ["path", { d: "m11 11 2 2M20 4 4 20" }]
    ],
    compress: [
      ["path", { d: "M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" }],
      ["path", { d: "m3 8 6-6M21 8l-6-6M3 16l6 6M21 16l-6 6" }]
    ],
    clean: [
      ["path", { d: "m4 18 7-7" }],
      ["path", { d: "m10 4 10 10-6 6L4 10Z" }],
      ["path", { d: "M14 20h7" }]
    ],
    link: [
      ["path", { d: "M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" }],
      ["path", { d: "M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" }]
    ],
    calendar: [
      ["rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }],
      ["path", { d: "M8 3v4M16 3v4M3 10h18" }],
      ["path", { d: "M8 14h2M14 14h2M8 18h2M14 18h2" }]
    ],
    qr: [
      ["rect", { x: "3", y: "3", width: "7", height: "7" }],
      ["rect", { x: "14", y: "3", width: "7", height: "7" }],
      ["rect", { x: "3", y: "14", width: "7", height: "7" }],
      ["path", { d: "M15 14h2v2h-2zM19 14h2v4h-2zM14 19h4v2h-4zM20 20h1v1h-1z" }]
    ],
    subtitle: [
      ["rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }],
      ["path", { d: "M7 14h4M13 14h4M7 17h7" }]
    ],
    pin: [
      ["path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }],
      ["circle", { cx: "12", cy: "10", r: "2.5" }]
    ],
    home: [
      ["path", { d: "M3 11.5 12 4l9 7.5" }],
      ["path", { d: "M5.5 10.5V20h13v-9.5" }]
    ]
  });

  let sheetController = null;
  let toastTimer = 0;
  let bodyOverflowBeforeOpen = "";

  function waitForData() {
    return new Promise(function (resolve, reject) {
      const startedAt = Date.now();

      function check() {
        if (window.HM_WEBTOOLS_DATA) {
          resolve(window.HM_WEBTOOLS_DATA);
          return;
        }

        if (Date.now() - startedAt > 5000) {
          reject(new Error("HM_WEBTOOLS_DATA를 찾지 못했습니다."));
          return;
        }

        window.setTimeout(check, 50);
      }

      check();
    });
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = String(text);
    }

    return element;
  }

  function createSvg(iconName, className) {
    const svg = document.createElementNS(SVG_NS, "svg");
    const icon = ICONS[iconName] || ICONS.image;

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    if (className) {
      svg.setAttribute("class", className);
    }

    icon.forEach(function (definition) {
      const node = document.createElementNS(SVG_NS, definition[0]);
      Object.keys(definition[1]).forEach(function (name) {
        node.setAttribute(name, definition[1][name]);
      });
      svg.appendChild(node);
    });

    return svg;
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLocaleLowerCase("ko-KR")
      .replace(/[\s._/\\-]+/g, "")
      .replace(/[^\p{L}\p{N}]/gu, "");
  }

  function getCategoryMap(data) {
    const map = new Map();

    data.categories.forEach(function (category) {
      map.set(category.id, category);
    });

    return map;
  }

  function getPublishedTools(data) {
    const tools = data.tools.filter(function (tool) {
      return data.settings.showUnavailableTools || tool.available;
    });

    return tools.slice().sort(function (a, b) {
      const orderA = Number.isFinite(a.order) ? a.order : 9999;
      const orderB = Number.isFinite(b.order) ? b.order : 9999;
      return orderA - orderB || String(a.name).localeCompare(String(b.name), "ko");
    });
  }

  function getLatestTools(tools, limit) {
    return tools
      .slice()
      .sort(function (a, b) {
        const timeA = Date.parse(a.updatedAt || "1970-01-01") || 0;
        const timeB = Date.parse(b.updatedAt || "1970-01-01") || 0;
        return timeB - timeA;
      })
      .slice(0, Math.max(1, Number(limit) || 10));
  }

  function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function showToast(message) {
    let toast = document.getElementById("hmWebToolsToast");

    if (!toast) {
      toast = createElement("div", "hm-wt-toast");
      toast.id = "hmWebToolsToast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function resolveToolUrl(tool) {
    const rawUrl = String(tool.url || "").trim();

    if (!rawUrl) {
      return "";
    }

    try {
      return new URL(rawUrl, window.location.href).href;
    } catch (error) {
      return "";
    }
  }

  function openTool(tool) {
    const url = resolveToolUrl(tool);

    if (!tool.available || !url) {
      showToast("이 도구의 주소를 data.js에 연결해 주세요.");
      return;
    }

    window.location.href = url;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
.hm-wt-root,
.hm-wt-root *,
.hm-wt-sheet,
.hm-wt-sheet *{
  box-sizing:border-box;
}
.hm-wt-root,
.hm-wt-sheet{
  --hm-wt-ink:#111827;
  --hm-wt-muted:#64748b;
  --hm-wt-line:#dfe7f0;
  --hm-wt-soft:#f7f9fd;
  --hm-wt-blue:#2f7cf6;
  --hm-wt-violet:#6d5dfc;
  --hm-wt-cyan:#19a8c5;
  color:var(--hm-wt-ink);
  font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",Arial,sans-serif;
  line-height:1.55;
}
.hm-wt-root button,
.hm-wt-root input,
.hm-wt-sheet button,
.hm-wt-sheet input{
  font:inherit;
}
.hm-wt-page{
  width:100%;
  max-width:1200px;
  margin:0 auto;
  padding:22px;
}
.hm-wt-page-hero{
  position:relative;
  overflow:hidden;
  padding:34px 28px;
  border:1px solid #dbe6f1;
  border-radius:24px;
  background:
    radial-gradient(circle at 10% 0,rgba(109,93,252,.14),transparent 30%),
    radial-gradient(circle at 92% 8%,rgba(25,168,197,.12),transparent 28%),
    linear-gradient(135deg,#fbfdff,#f4f8ff 56%,#fbffff);
  box-shadow:0 18px 44px rgba(38,62,94,.08);
  text-align:center;
}
.hm-wt-page-hero h1{
  margin:0;
  font-size:clamp(30px,5vw,50px);
  font-weight:950;
  letter-spacing:-.055em;
  line-height:1.12;
}
.hm-wt-page-hero p{
  max-width:720px;
  margin:10px auto 0;
  color:var(--hm-wt-muted);
  font-size:14px;
  font-weight:700;
}
.hm-wt-page-stats{
  display:flex;
  justify-content:center;
  gap:8px;
  flex-wrap:wrap;
  margin-top:16px;
}
.hm-wt-page-stat{
  min-height:32px;
  padding:0 11px;
  display:inline-flex;
  align-items:center;
  border:1px solid rgba(47,124,246,.16);
  border-radius:999px;
  background:rgba(255,255,255,.8);
  color:#315f98;
  font-size:11px;
  font-weight:900;
}
.hm-wt-surface{
  margin-top:16px;
  padding:20px;
  border:1px solid var(--hm-wt-line);
  border-radius:21px;
  background:#fff;
  box-shadow:0 10px 30px rgba(15,23,42,.055);
}
.hm-wt-sheet[hidden]{
  display:none!important;
}
.hm-wt-sheet{
  position:fixed;
  inset:0;
  z-index:2147483200;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  padding:14px;
  background:rgba(15,23,42,.42);
  backdrop-filter:blur(6px);
}
.hm-wt-sheet-panel{
  width:min(1040px,100%);
  max-height:min(86vh,850px);
  margin:0 auto 80px;
  overflow:auto;
  overscroll-behavior:contain;
  border:1px solid rgba(203,213,225,.95);
  border-radius:24px;
  background:#fff;
  box-shadow:0 26px 80px rgba(15,23,42,.28);
}
.hm-wt-sheet-head{
  position:sticky;
  top:0;
  z-index:5;
  min-height:72px;
  padding:14px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid var(--hm-wt-line);
  background:rgba(255,255,255,.97);
  backdrop-filter:blur(12px);
}
.hm-wt-sheet-title{
  min-width:0;
}
.hm-wt-sheet-title h2{
  margin:0;
  font-size:20px;
  font-weight:950;
  letter-spacing:-.035em;
}
.hm-wt-sheet-title p{
  margin:3px 0 0;
  color:var(--hm-wt-muted);
  font-size:11px;
  font-weight:700;
}
.hm-wt-close{
  width:40px;
  height:40px;
  flex:none;
  display:grid;
  place-items:center;
  border:1px solid #dbe4ee;
  border-radius:12px;
  background:#fff;
  color:#475569;
  cursor:pointer;
}
.hm-wt-close:hover{
  color:#245fd4;
  background:#f3f7ff;
}
.hm-wt-close svg{
  width:20px;
  height:20px;
  fill:none;
  stroke:currentColor;
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.hm-wt-sheet-body{
  padding:16px;
}
.hm-wt-search-wrap{
  position:relative;
}
.hm-wt-search-icon{
  position:absolute;
  left:14px;
  top:50%;
  width:20px;
  height:20px;
  transform:translateY(-50%);
  fill:none;
  stroke:#64748b;
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
  pointer-events:none;
}
.hm-wt-search{
  width:100%;
  height:52px;
  padding:0 44px;
  border:1px solid #d7e1ec;
  border-radius:14px;
  background:#fff;
  color:var(--hm-wt-ink);
  outline:none;
  font-size:14px;
  font-weight:750;
  box-shadow:0 6px 18px rgba(15,23,42,.035);
}
.hm-wt-search:focus{
  border-color:var(--hm-wt-blue);
  box-shadow:0 0 0 4px rgba(47,124,246,.11);
}
.hm-wt-clear{
  position:absolute;
  right:8px;
  top:50%;
  min-width:34px;
  height:34px;
  padding:0 8px;
  transform:translateY(-50%);
  border:0;
  border-radius:9px;
  background:#eef3f8;
  color:#64748b;
  font-size:11px;
  font-weight:900;
  cursor:pointer;
}
.hm-wt-clear[hidden]{
  display:none!important;
}
.hm-wt-categories{
  margin-top:12px;
  display:flex;
  gap:7px;
  overflow-x:auto;
  padding:2px 1px 5px;
  scrollbar-width:thin;
}
.hm-wt-category{
  min-height:38px;
  padding:0 12px;
  flex:none;
  display:inline-flex;
  align-items:center;
  gap:7px;
  border:1px solid #dbe4ee;
  border-radius:999px;
  background:#fff;
  color:#475569;
  font-size:11px;
  font-weight:900;
  white-space:nowrap;
  cursor:pointer;
}
.hm-wt-category:hover{
  border-color:#b9cff0;
  background:#f7faff;
}
.hm-wt-category.is-active{
  border-color:transparent;
  background:linear-gradient(135deg,var(--hm-wt-violet),var(--hm-wt-blue));
  color:#fff;
  box-shadow:0 7px 18px rgba(60,93,230,.2);
}
.hm-wt-category svg{
  width:17px;
  height:17px;
  fill:none;
  stroke:currentColor;
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.hm-wt-section{
  margin-top:20px;
}
.hm-wt-section-head{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:12px;
  margin-bottom:11px;
}
.hm-wt-section-copy h3{
  margin:0;
  font-size:18px;
  font-weight:950;
  letter-spacing:-.035em;
}
.hm-wt-section-copy p{
  margin:3px 0 0;
  color:var(--hm-wt-muted);
  font-size:10px;
  font-weight:700;
}
.hm-wt-slider-actions{
  display:flex;
  gap:5px;
}
.hm-wt-slider-btn{
  width:36px;
  height:36px;
  display:grid;
  place-items:center;
  border:1px solid #dbe4ee;
  border-radius:10px;
  background:#fff;
  color:#475569;
  cursor:pointer;
}
.hm-wt-slider-btn:hover{
  border-color:#bfd3ef;
  color:#245fd4;
  background:#f7faff;
}
.hm-wt-slider-btn svg{
  width:18px;
  height:18px;
  fill:none;
  stroke:currentColor;
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.hm-wt-latest-track{
  display:grid;
  grid-auto-flow:column;
  grid-auto-columns:minmax(238px,31%);
  gap:10px;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  scroll-behavior:smooth;
  padding:2px 1px 8px;
  scrollbar-width:thin;
}
.hm-wt-latest-card{
  min-width:0;
  min-height:126px;
  padding:14px;
  scroll-snap-align:start;
  display:flex;
  flex-direction:column;
  border:1px solid #dfe6ef;
  border-radius:16px;
  background:linear-gradient(180deg,#fff,#fbfcff);
  box-shadow:0 7px 20px rgba(15,23,42,.045);
  cursor:pointer;
}
.hm-wt-latest-card:hover{
  border-color:#c6cdfa;
  transform:translateY(-1px);
}
.hm-wt-latest-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}
.hm-wt-latest-date{
  color:#64748b;
  font-size:9px;
  font-weight:850;
}
.hm-wt-new-badge{
  min-height:23px;
  padding:0 8px;
  display:inline-flex;
  align-items:center;
  border-radius:999px;
  background:#ecfdf5;
  color:#08775b;
  font-size:8px;
  font-weight:950;
}
.hm-wt-latest-card strong{
  display:block;
  margin-top:9px;
  overflow:hidden;
  color:#172033;
  font-size:14px;
  font-weight:950;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.hm-wt-latest-card p{
  margin:4px 0 0;
  display:-webkit-box;
  overflow:hidden;
  color:#64748b;
  font-size:10px;
  font-weight:700;
  line-height:1.5;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
}
.hm-wt-result-bar{
  margin-top:20px;
  min-height:38px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.hm-wt-result-title{
  font-size:17px;
  font-weight:950;
  letter-spacing:-.03em;
}
.hm-wt-result-count{
  padding:5px 9px;
  border-radius:999px;
  background:#eef5ff;
  color:#2b66ad;
  font-size:9px;
  font-weight:900;
}
.hm-wt-grid{
  margin-top:10px;
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:9px;
}
.hm-wt-card{
  min-width:0;
  min-height:174px;
  padding:15px;
  position:relative;
  display:flex;
  flex-direction:column;
  border:1px solid #dfe6ef;
  border-radius:16px;
  background:#fff;
  box-shadow:0 6px 18px rgba(15,23,42,.04);
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease;
}
.hm-wt-card:hover{
  transform:translateY(-2px);
  border-color:#c6cdfa;
  box-shadow:0 12px 28px rgba(15,23,42,.08);
}
.hm-wt-card-icon{
  width:44px;
  height:44px;
  display:grid;
  place-items:center;
  border-radius:13px;
  background:linear-gradient(135deg,#f1efff,#eaf4ff);
  color:#5c5be7;
}
.hm-wt-card-icon svg{
  width:23px;
  height:23px;
  fill:none;
  stroke:currentColor;
  stroke-width:1.9;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.hm-wt-card h4{
  margin:11px 0 0;
  overflow:hidden;
  color:#162236;
  font-size:14px;
  font-weight:950;
  line-height:1.35;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.hm-wt-card p{
  margin:5px 0 0;
  display:-webkit-box;
  overflow:hidden;
  color:#66758b;
  font-size:10px;
  font-weight:700;
  line-height:1.55;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
}
.hm-wt-card-meta{
  margin-top:10px;
  display:flex;
  align-items:center;
  gap:5px;
  flex-wrap:wrap;
}
.hm-wt-card-chip{
  min-height:22px;
  padding:0 7px;
  display:inline-flex;
  align-items:center;
  border-radius:999px;
  background:#f1f5f9;
  color:#526177;
  font-size:8px;
  font-weight:900;
}
.hm-wt-card-chip.is-count{
  background:#eef5ff;
  color:#2d67ae;
}
.hm-wt-card-action{
  width:100%;
  min-height:38px;
  margin-top:auto;
  padding:0 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  border:0;
  border-radius:10px;
  background:linear-gradient(135deg,var(--hm-wt-violet),var(--hm-wt-blue));
  color:#fff;
  font-size:10px;
  font-weight:950;
  cursor:pointer;
}
.hm-wt-card-action:hover{
  filter:brightness(.97);
}
.hm-wt-card-action.is-disabled{
  border:1px solid #e0e6ed;
  background:#f4f6f9;
  color:#8490a1;
  box-shadow:none;
}
.hm-wt-card-action svg{
  width:15px;
  height:15px;
  fill:none;
  stroke:currentColor;
  stroke-width:2;
  stroke-linecap:round;
  stroke-linejoin:round;
}
.hm-wt-empty{
  grid-column:1/-1;
  padding:34px 16px;
  border:1px dashed #cbd7e4;
  border-radius:14px;
  background:#f8fafc;
  color:#64748b;
  font-size:12px;
  font-weight:800;
  text-align:center;
}
.hm-wt-toast{
  max-width:min(420px,calc(100% - 24px));
  min-height:44px;
  padding:11px 15px;
  position:fixed;
  left:50%;
  bottom:96px;
  z-index:2147483600;
  transform:translate(-50%,18px);
  border:1px solid rgba(203,213,225,.96);
  border-radius:13px;
  background:rgba(15,23,42,.94);
  color:#fff;
  font-size:11px;
  font-weight:850;
  text-align:center;
  box-shadow:0 14px 40px rgba(15,23,42,.24);
  opacity:0;
  pointer-events:none;
  transition:opacity .18s ease,transform .18s ease;
}
.hm-wt-toast.is-visible{
  transform:translate(-50%,0);
  opacity:1;
}
@media(max-width:980px){
  .hm-wt-grid{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
  .hm-wt-latest-track{
    grid-auto-columns:minmax(230px,44%);
  }
}
@media(max-width:700px){
  .hm-wt-page{
    padding:7px 5px 90px;
  }
  .hm-wt-page-hero{
    padding:24px 13px;
    border-radius:18px;
  }
  .hm-wt-page-hero h1{
    font-size:31px;
  }
  .hm-wt-page-hero p{
    font-size:11px;
  }
  .hm-wt-surface{
    margin-top:10px;
    padding:12px 8px;
    border-radius:16px;
  }
  .hm-wt-sheet{
    padding:8px 5px calc(8px + env(safe-area-inset-bottom));
  }
  .hm-wt-sheet-panel{
    max-height:80vh;
    margin-bottom:76px;
    border-radius:20px;
  }
  .hm-wt-sheet-head{
    min-height:64px;
    padding:10px 11px;
  }
  .hm-wt-sheet-title h2{
    font-size:17px;
  }
  .hm-wt-sheet-title p{
    font-size:9px;
  }
  .hm-wt-sheet-body{
    padding:10px 7px 15px;
  }
  .hm-wt-search{
    height:48px;
    font-size:12px;
  }
  .hm-wt-category{
    min-height:35px;
    padding:0 10px;
    font-size:9px;
  }
  .hm-wt-latest-track{
    grid-auto-columns:82%;
    gap:7px;
  }
  .hm-wt-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:7px;
  }
  .hm-wt-card{
    min-height:168px;
    padding:12px 9px;
    border-radius:13px;
  }
  .hm-wt-card-icon{
    width:39px;
    height:39px;
  }
  .hm-wt-card h4{
    font-size:12px;
  }
  .hm-wt-card p{
    font-size:8px;
  }
  .hm-wt-card-action{
    min-height:36px;
    font-size:9px;
  }
}
@media(max-width:390px){
  .hm-wt-grid{
    grid-template-columns:1fr;
  }
  .hm-wt-card{
    min-height:150px;
  }
}
`;

    document.head.appendChild(style);
  }

  function buildCategoryButtons(container, data, categoryMap, state, refresh) {
    container.replaceChildren();

    const allCategory = {
      id: "all",
      name: "전체",
      icon: "search"
    };

    [allCategory].concat(
      data.categories.slice().sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      })
    ).forEach(function (category) {
      const button = createElement("button", "hm-wt-category");
      button.type = "button";
      button.dataset.category = category.id;

      if (state.category === category.id) {
        button.classList.add("is-active");
      }

      button.appendChild(createSvg(category.icon || "image"));
      button.appendChild(createElement("span", "", category.name));

      button.addEventListener("click", function () {
        state.category = category.id;
        refresh();
      });

      container.appendChild(button);
    });
  }

  function buildLatestSlider(container, tools, categoryMap) {
    container.replaceChildren();

    tools.forEach(function (tool) {
      const category = categoryMap.get(tool.category);
      const card = createElement("article", "hm-wt-latest-card");
      card.tabIndex = 0;
      card.setAttribute("role", "button");

      const top = createElement("div", "hm-wt-latest-top");
      const date = createElement("span", "hm-wt-latest-date", formatDate(tool.updatedAt));
      const badge = createElement("span", "hm-wt-new-badge", "NEW");
      top.append(date, badge);

      const title = createElement("strong", "", tool.name);
      const description = createElement("p", "", tool.description);

      card.append(top, title, description);

      if (category) {
        card.setAttribute("aria-label", category.name + " " + tool.name);
      }

      card.addEventListener("click", function () {
        openTool(tool);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openTool(tool);
        }
      });

      container.appendChild(card);
    });
  }

  function createToolCard(tool, category) {
    const card = createElement("article", "hm-wt-card");

    const iconWrap = createElement("div", "hm-wt-card-icon");
    iconWrap.appendChild(createSvg(tool.icon || (category && category.icon) || "image"));

    const title = createElement("h4", "", tool.name);
    const description = createElement("p", "", tool.description);
    const meta = createElement("div", "hm-wt-card-meta");

    if (category) {
      meta.appendChild(createElement("span", "hm-wt-card-chip", category.name));
    }

    if (tool.collectionCount) {
      meta.appendChild(
        createElement("span", "hm-wt-card-chip is-count", Number(tool.collectionCount).toLocaleString("ko-KR") + "개")
      );
    }

    const action = createElement(
      "button",
      "hm-wt-card-action" + (tool.available ? "" : " is-disabled"),
      tool.available ? "바로 사용" : "링크 등록 필요"
    );
    action.type = "button";

    if (tool.available) {
      action.appendChild(createSvg("external"));
    }

    action.addEventListener("click", function () {
      openTool(tool);
    });

    card.append(iconWrap, title, description, meta, action);
    return card;
  }

  function createCore(data, options) {
    const mode = options.mode;
    const root = createElement("div", "hm-wt-root");
    const categoryMap = getCategoryMap(data);
    const allTools = getPublishedTools(data);
    const latestTools = getLatestTools(allTools, data.settings.latestLimit);
    const state = {
      category: "all",
      query: ""
    };

    const searchWrap = createElement("div", "hm-wt-search-wrap");
    const searchIcon = createSvg("search", "hm-wt-search-icon");
    const searchInput = createElement("input", "hm-wt-search");
    const clearButton = createElement("button", "hm-wt-clear", "지우기");

    searchInput.type = "search";
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;
    searchInput.placeholder = data.settings.searchPlaceholder;
    searchInput.setAttribute("aria-label", data.settings.searchPlaceholder);

    clearButton.type = "button";
    clearButton.hidden = true;

    searchWrap.append(searchIcon, searchInput, clearButton);

    const categories = createElement("div", "hm-wt-categories");
    categories.setAttribute("aria-label", "웹도구 카테고리");

    const latestSection = createElement("section", "hm-wt-section");
    const latestHead = createElement("div", "hm-wt-section-head");
    const latestCopy = createElement("div", "hm-wt-section-copy");
    const latestTitle = createElement("h3", "", "새로 나온 도구");
    const latestDescription = createElement("p", "", "최근 업데이트된 도구를 옆으로 넘겨 확인하세요.");
    const sliderActions = createElement("div", "hm-wt-slider-actions");
    const previousButton = createElement("button", "hm-wt-slider-btn");
    const nextButton = createElement("button", "hm-wt-slider-btn");
    const latestTrack = createElement("div", "hm-wt-latest-track");

    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "이전 도구");
    previousButton.appendChild(createSvg("arrowLeft"));

    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "다음 도구");
    nextButton.appendChild(createSvg("arrowRight"));

    sliderActions.append(previousButton, nextButton);
    latestCopy.append(latestTitle, latestDescription);
    latestHead.append(latestCopy, sliderActions);
    latestSection.append(latestHead, latestTrack);

    const resultBar = createElement("div", "hm-wt-result-bar");
    const resultTitle = createElement("div", "hm-wt-result-title", "전체 웹도구");
    const resultCount = createElement("div", "hm-wt-result-count");
    resultBar.append(resultTitle, resultCount);

    const grid = createElement("div", "hm-wt-grid");

    function getFilteredTools() {
      const query = normalizeText(state.query);

      return allTools.filter(function (tool) {
        if (state.category !== "all" && tool.category !== state.category) {
          return false;
        }

        if (!query) {
          return true;
        }

        const category = categoryMap.get(tool.category);
        const searchable = [
          tool.name,
          tool.shortName,
          tool.description,
          Array.isArray(tool.keywords) ? tool.keywords.join(" ") : "",
          category ? category.name : ""
        ].join(" ");

        return normalizeText(searchable).includes(query);
      });
    }

    function refresh() {
      buildCategoryButtons(categories, data, categoryMap, state, refresh);

      const filteredTools = getFilteredTools();
      grid.replaceChildren();

      if (state.category === "all") {
        resultTitle.textContent = state.query ? "검색 결과" : "전체 웹도구";
      } else {
        const category = categoryMap.get(state.category);
        resultTitle.textContent = category ? category.name + " 도구" : "웹도구";
      }

      resultCount.textContent = filteredTools.length.toLocaleString("ko-KR") + "개";

      if (filteredTools.length === 0) {
        grid.appendChild(createElement("div", "hm-wt-empty", data.settings.emptyMessage));
        return;
      }

      filteredTools.forEach(function (tool) {
        grid.appendChild(createToolCard(tool, categoryMap.get(tool.category)));
      });
    }

    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      clearButton.hidden = !state.query;
      refresh();
    });

    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      state.query = "";
      clearButton.hidden = true;
      refresh();
      searchInput.focus();
    });

    previousButton.addEventListener("click", function () {
      latestTrack.scrollBy({
        left: -Math.max(250, latestTrack.clientWidth * 0.8),
        behavior: "smooth"
      });
    });

    nextButton.addEventListener("click", function () {
      latestTrack.scrollBy({
        left: Math.max(250, latestTrack.clientWidth * 0.8),
        behavior: "smooth"
      });
    });

    buildLatestSlider(latestTrack, latestTools, categoryMap);
    refresh();

    root.append(searchWrap, categories, latestSection, resultBar, grid);

    return {
      root: root,
      searchInput: searchInput,
      refresh: refresh,
      focusSearch: function () {
        window.setTimeout(function () {
          searchInput.focus();
        }, mode === "sheet" ? 90 : 0);
      }
    };
  }

  function createFullPage(rootElement, data) {
    rootElement.replaceChildren();
    rootElement.classList.add("hm-wt-page");

    const hero = createElement("section", "hm-wt-page-hero");
    const title = createElement("h1", "", data.site.title);
    const description = createElement("p", "", data.site.description);
    const stats = createElement("div", "hm-wt-page-stats");
    const availableCount = data.tools.filter(function (tool) {
      return tool.available;
    }).length;
    const collectionCount = data.tools.reduce(function (sum, tool) {
      return sum + (Number(tool.collectionCount) || 0);
    }, 0);

    stats.append(
      createElement("span", "hm-wt-page-stat", data.categories.length + "개 분야"),
      createElement("span", "hm-wt-page-stat", data.tools.length + "개 대표 도구"),
      createElement("span", "hm-wt-page-stat", collectionCount.toLocaleString("ko-KR") + "개 세부 기능"),
      createElement("span", "hm-wt-page-stat", availableCount + "개 연결 완료")
    );

    hero.append(title, description, stats);

    const surface = createElement("section", "hm-wt-surface");
    const core = createCore(data, { mode: "page" });
    surface.appendChild(core.root);

    rootElement.append(hero, surface);
  }

  function createSheet(data) {
    let sheet = document.getElementById(SHEET_ID);

    if (sheet) {
      return sheetController;
    }

    sheet = createElement("div", "hm-wt-sheet");
    sheet.id = SHEET_ID;
    sheet.hidden = true;

    const panel = createElement("section", "hm-wt-sheet-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "hmWebToolsSheetTitle");

    const head = createElement("header", "hm-wt-sheet-head");
    const titleWrap = createElement("div", "hm-wt-sheet-title");
    const title = createElement("h2", "", "힐링편의점 웹도구 빠른찾기");
    title.id = "hmWebToolsSheetTitle";
    const description = createElement("p", "", "검색하거나 분야를 선택해 필요한 도구로 이동하세요.");
    const closeButton = createElement("button", "hm-wt-close");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "빠른찾기 닫기");
    closeButton.appendChild(createSvg("close"));

    titleWrap.append(title, description);
    head.append(titleWrap, closeButton);

    const body = createElement("div", "hm-wt-sheet-body");
    const core = createCore(data, { mode: "sheet" });
    body.appendChild(core.root);
    panel.append(head, body);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);

    let lastFocusedElement = null;

    function open() {
      if (!sheet.hidden) {
        core.focusSearch();
        return;
      }

      lastFocusedElement = document.activeElement;
      bodyOverflowBeforeOpen = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      sheet.hidden = false;
      core.focusSearch();
    }

    function close() {
      if (sheet.hidden) {
        return;
      }

      sheet.hidden = true;
      document.body.style.overflow = bodyOverflowBeforeOpen;

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    closeButton.addEventListener("click", close);

    sheet.addEventListener("click", function (event) {
      if (event.target === sheet) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !sheet.hidden) {
        close();
      }
    });

    sheetController = {
      element: sheet,
      open: open,
      close: close,
      focusSearch: core.focusSearch
    };

    return sheetController;
  }

  function bindOpenButtons(controller) {
    document.addEventListener("click", function (event) {
      const target = event.target.closest(OPEN_SELECTOR);

      if (!target) {
        return;
      }

      event.preventDefault();
      controller.open();
    });
  }

  function initialize(data) {
    injectStyles();

    const controller = createSheet(data);
    bindOpenButtons(controller);

    document.querySelectorAll(PAGE_SELECTOR).forEach(function (rootElement) {
      createFullPage(rootElement, data);
    });

    window.HMWebTools = Object.freeze({
      version: "1.0.0",
      open: controller.open,
      close: controller.close,
      focusSearch: controller.focusSearch,
      data: data
    });

    document.dispatchEvent(
      new CustomEvent("hm:webtools:ready", {
        detail: {
          version: "1.0.0"
        }
      })
    );
  }

  function start() {
    waitForData()
      .then(initialize)
      .catch(function (error) {
        console.error("[HealingMart WebTools]", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})(window, document);
