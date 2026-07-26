/*
 * HealingMart Webtools More v3.2.0
 * 공통 하단 메뉴 + 카테고리/전체도구 바텀시트
 *
 * 게시물에서는 현재 도구 정보만 data-* 속성으로 전달합니다.
 */
(function (window, document) {
  "use strict";

  if (window.HMWebtoolsMore && window.HMWebtoolsMore.version) return;

  var SCRIPT = document.currentScript;
  var VERSION = "3.2.0";
  var NAV_ID = "hmWebtoolsBottomNav";
  var OVERLAY_ID = "hmWebtoolsOverlay";
  var STYLE_ID = "hmWebtoolsMoreStyleV320";
  var DEFAULT_HOME_URL = "https://www.healing-mart.com/";
  var DEFAULT_HUB_URL = "https://www.healing-mart.com/2026/07/Webtools.html";
  var DEFAULT_DATA_URL = "https://healingmart.github.io/healingmart-webtools-hub/data/hm-webtools-data.js?v=5.7.0";

  var config = {
    toolId: attr("data-current-tool") || attr("data-tool-id") || "",
    categoryId: attr("data-current-category") || attr("data-category") || "",
    categoryLabel: attr("data-category-label") || "",
    resetSelector: attr("data-reset-selector") || "",
    dataUrl: attr("data-data-url") || DEFAULT_DATA_URL,
    homeUrl: attr("data-home-url") || DEFAULT_HOME_URL,
    hubUrl: attr("data-hub-url") || DEFAULT_HUB_URL,
    accent: attr("data-accent") || ""
  };

  var state = {
    data: null,
    currentTool: null,
    currentCategory: null,
    loading: null,
    nav: null,
    overlay: null,
    accent: "#334155",
    accentRgb: "51,65,85"
  };

  function attr(name) {
    return SCRIPT ? String(SCRIPT.getAttribute(name) || "").trim() : "";
  }

  function create(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svg(name) {
    var ns = "http://www.w3.org/2000/svg";
    var root = document.createElementNS(ns, "svg");
    root.setAttribute("viewBox", "0 0 24 24");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("focusable", "false");

    var defs = {
      home: [["path", { d: "M3 11.5 12 4l9 7.5" }], ["path", { d: "M5.5 10.5V20h13v-9.5" }], ["path", { d: "M9.5 20v-6h5v6" }]],
      reset: [["path", { d: "M4 4v6h6" }], ["path", { d: "M5.4 15a7.5 7.5 0 1 0 .2-6.4L4 10" }]],
      category: [["rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }], ["rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }], ["rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }], ["rect", { x: "14", y: "14", width: "6", height: "6", rx: "1" }]],
      all: [["path", { d: "M4 7.5h7v-3H4z" }], ["path", { d: "M13 4.5h7v7h-7z" }], ["path", { d: "M4 13.5h7v6H4z" }], ["path", { d: "M13 13.5h7v6h-7z" }]],
      share: [["circle", { cx: "18", cy: "5", r: "2.3" }], ["circle", { cx: "6", cy: "12", r: "2.3" }], ["circle", { cx: "18", cy: "19", r: "2.3" }], ["path", { d: "m8.1 10.8 7.8-4.5M8.1 13.2l7.8 4.5" }]],
      close: [["path", { d: "m6 6 12 12M18 6 6 18" }]],
      search: [["circle", { cx: "11", cy: "11", r: "7" }], ["path", { d: "m16.5 16.5 4 4" }]],
      arrow: [["path", { d: "m9 18 6-6-6-6" }]],
      image: [["rect", { x: "3.5", y: "4", width: "17", height: "16", rx: "2" }], ["circle", { cx: "8.5", cy: "9", r: "1.7" }], ["path", { d: "m5 17 4.3-4.2 3.2 3 2.1-2 4.4 3.2" }]],
      writing: [["path", { d: "M4 19.5h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 16.5l-1 3Z" }], ["path", { d: "m13.8 7.7 3 3" }]],
      life: [["path", { d: "M12 21s7-4.2 7-10.2A4.2 4.2 0 0 0 12 7.6a4.2 4.2 0 0 0-7 3.2C5 16.8 12 21 12 21Z" }]],
      document: [["path", { d: "M6 3h8l4 4v14H6z" }], ["path", { d: "M14 3v5h5" }], ["path", { d: "M9 13h6M9 17h6" }]],
      data: [["ellipse", { cx: "12", cy: "5.5", rx: "7", ry: "3" }], ["path", { d: "M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" }], ["path", { d: "M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" }]],
      video: [["rect", { x: "3", y: "5", width: "14", height: "14", rx: "2" }], ["path", { d: "m17 10 4-2v8l-4-2z" }]],
      audio: [["path", { d: "M9 18V6l9-2v12" }], ["circle", { cx: "6", cy: "18", r: "3" }], ["circle", { cx: "15", cy: "16", r: "3" }]],
      developer: [["path", { d: "m8 9-4 3 4 3" }], ["path", { d: "m16 9 4 3-4 3" }], ["path", { d: "m14 5-4 14" }]],
      crop: [["path", { d: "M7 3v14a2 2 0 0 0 2 2h12" }], ["path", { d: "M3 7h14a2 2 0 0 1 2 2v12" }]]
    };

    (defs[name] || defs.all).forEach(function (part) {
      var child = document.createElementNS(ns, part[0]);
      Object.keys(part[1]).forEach(function (key) {
        child.setAttribute(key, part[1][key]);
      });
      root.appendChild(child);
    });
    return root;
  }

  function parseColor(value) {
    var text = String(value || "").trim();
    var hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      var raw = hex[1];
      if (raw.length === 3) raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2];
      return { r: parseInt(raw.slice(0, 2), 16), g: parseInt(raw.slice(2, 4), 16), b: parseInt(raw.slice(4, 6), 16) };
    }
    var rgb = text.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)/i);
    if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
    return null;
  }

  function hex(color) {
    function part(v) { var s = Math.max(0, Math.min(255, Math.round(v))).toString(16); return s.length === 1 ? "0" + s : s; }
    return "#" + part(color.r) + part(color.g) + part(color.b);
  }

  function chooseAccent() {
    var candidates = [];
    if (config.accent) candidates.push(config.accent);

    var roots = [document.documentElement, document.body, document.querySelector("#healingMartMultiCutTool"), document.querySelector("main")].filter(Boolean);
    var vars = ["--primary", "--primary-color", "--hm-primary", "--accent", "--accent-color"];
    roots.forEach(function (root) {
      var style = window.getComputedStyle(root);
      vars.forEach(function (name) { candidates.push(style.getPropertyValue(name)); });
    });

    var primary = document.querySelector(".btn.primary,.btn-primary,.primary-button,button.primary");
    if (primary) candidates.push(window.getComputedStyle(primary).backgroundColor);

    for (var i = 0; i < candidates.length; i += 1) {
      var color = parseColor(candidates[i]);
      if (!color) continue;
      var max = Math.max(color.r, color.g, color.b);
      var min = Math.min(color.r, color.g, color.b);
      if (max - min < 22) continue;
      if ((color.r + color.g + color.b) / 3 > 225) continue;
      return color;
    }
    return { r: 51, g: 65, b: 85 };
  }

  function applyAccent() {
    var color = chooseAccent();
    state.accent = hex(color);
    state.accentRgb = [Math.round(color.r), Math.round(color.g), Math.round(color.b)].join(",");
    document.documentElement.style.setProperty("--hm-more-accent", state.accent);
    document.documentElement.style.setProperty("--hm-more-accent-rgb", state.accentRgb);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = create("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".hm-more-nav,.hm-more-nav *,.hm-more-layer,.hm-more-layer *{box-sizing:border-box}",
      ".hm-more-nav{position:fixed;left:50%;bottom:12px;z-index:2147483000;width:min(760px,calc(100% - 24px));min-height:66px;padding:7px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;transform:translateX(-50%);border:1px solid rgba(203,213,225,.96);border-radius:20px;background:rgba(255,255,255,.97);box-shadow:0 15px 42px rgba(15,23,42,.2);backdrop-filter:blur(16px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}",
      ".hm-more-nav button{min-width:0;min-height:50px;padding:6px 5px;border:0;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:7px;color:#475569;background:transparent;font:inherit;font-size:13px;font-weight:850;line-height:1.15;cursor:pointer;-webkit-tap-highlight-color:transparent}",
      ".hm-more-nav button:hover{color:var(--hm-more-accent);background:rgba(var(--hm-more-accent-rgb),.09)}",
      ".hm-more-nav button[data-action='category']{color:#fff;background:var(--hm-more-accent);box-shadow:0 8px 20px rgba(var(--hm-more-accent-rgb),.25)}",
      ".hm-more-nav svg{width:21px;height:21px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-nav span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-layer{position:fixed;inset:0;z-index:2147483500;padding:18px 18px 94px;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.5);backdrop-filter:blur(5px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}",
      ".hm-more-panel{width:min(920px,100%);max-height:min(82vh,800px);overflow:hidden;border:1px solid #d8e1eb;border-radius:24px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.3)}",
      ".hm-more-head{min-height:76px;padding:14px 18px;display:grid;grid-template-columns:minmax(0,1fr) 42px;align-items:center;gap:12px;border-bottom:1px solid #e5eaf0;background:#fff}",
      ".hm-more-head strong{display:block;color:#0f172a;font-size:20px;font-weight:950;letter-spacing:-.035em}",
      ".hm-more-head small{display:block;margin-top:4px;color:#64748b;font-size:11px;font-weight:750}",
      ".hm-more-close{width:42px;height:42px;padding:0;display:grid;place-items:center;border:1px solid #dce4ec;border-radius:12px;background:#fff;color:#475569;cursor:pointer}",
      ".hm-more-close svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-body{max-height:calc(min(82vh,800px) - 77px);padding:18px;overflow:auto}",
      ".hm-more-search{margin-bottom:18px;display:grid;grid-template-columns:minmax(0,1fr) 58px;gap:8px}",
      ".hm-more-search input{width:100%;height:52px;padding:0 15px;border:2px solid #d3dce7;border-radius:14px;outline:0;color:#0f172a;background:#fff;font:inherit;font-size:14px;font-weight:750}",
      ".hm-more-search input:focus{border-color:var(--hm-more-accent);box-shadow:0 0 0 4px rgba(var(--hm-more-accent-rgb),.12)}",
      ".hm-more-search button{height:52px;padding:0;display:grid;place-items:center;border:0;border-radius:14px;background:var(--hm-more-accent);color:#fff;cursor:pointer}",
      ".hm-more-search svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-title{margin:0 0 12px;color:#0f172a;font-size:17px;font-weight:950;letter-spacing:-.025em}",
      ".hm-more-title.is-separated{margin-top:24px;padding-top:22px;border-top:1px solid #e8edf3}",
      ".hm-more-category-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}",
      ".hm-more-tool-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}",
      ".hm-more-category,.hm-more-tool{min-width:0;min-height:76px;padding:11px 12px;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:9px;border:1px solid #dfe6ee;border-radius:15px;background:#fff;color:#172238;text-align:left;cursor:pointer}",
      ".hm-more-category:hover,.hm-more-tool:hover{border-color:var(--hm-more-accent);background:rgba(var(--hm-more-accent-rgb),.06)}",
      ".hm-more-card-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:rgba(var(--hm-more-accent-rgb),.11);color:var(--hm-more-accent)}",
      ".hm-more-card-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-category strong,.hm-more-tool strong{display:block;overflow:hidden;color:#0f172a;font-size:13px;font-weight:950;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-tool small{display:block;margin-top:4px;overflow:hidden;color:#64748b;font-size:10px;font-weight:700;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-count{color:var(--hm-more-accent);font-size:10px;font-weight:950;white-space:nowrap}",
      ".hm-more-arrow{width:18px;height:18px;fill:none;stroke:#64748b;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-empty{grid-column:1/-1;min-height:100px;padding:20px;display:grid;place-items:center;border:1px dashed #ccd7e4;border-radius:15px;background:#f8fafc;color:#64748b;font-size:12px;font-weight:800;text-align:center}",
      ".hm-more-toast{position:fixed;left:50%;bottom:94px;z-index:2147483900;max-width:calc(100% - 32px);padding:11px 16px;transform:translateX(-50%);border-radius:12px;background:#0f172a;color:#fff;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:800;box-shadow:0 12px 30px rgba(15,23,42,.28)}",
      "html.hm-more-open,html.hm-more-open body{overflow:hidden!important}",
      "@media(max-width:760px){.hm-more-nav{width:calc(100% - 12px);bottom:6px;min-height:72px;padding:6px 5px calc(6px + env(safe-area-inset-bottom));gap:3px;border-radius:19px}.hm-more-nav button{min-height:58px;padding:5px 2px;flex-direction:column;gap:3px;font-size:10px}.hm-more-nav svg{width:21px;height:21px}.hm-more-layer{padding:0 0 calc(82px + env(safe-area-inset-bottom));align-items:flex-end}.hm-more-panel{width:100%;max-height:84vh;border-radius:22px 22px 0 0}.hm-more-head{min-height:68px;padding:12px 14px}.hm-more-head strong{font-size:18px}.hm-more-body{max-height:calc(84vh - 69px);padding:14px 12px}.hm-more-category-grid,.hm-more-tool-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hm-more-category,.hm-more-tool{min-height:70px;padding:9px;grid-template-columns:38px minmax(0,1fr) auto;gap:7px}.hm-more-card-icon{width:38px;height:38px}.hm-more-category strong,.hm-more-tool strong{font-size:11px}.hm-more-tool small{font-size:9px}.hm-more-count{font-size:8px}.hm-more-toast{bottom:88px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function navButton(action, label, iconName) {
    var button = create("button");
    button.type = "button";
    button.setAttribute("data-action", action);
    button.setAttribute("aria-label", label);
    button.appendChild(svg(iconName));
    button.appendChild(create("span", "", label));
    return button;
  }

  function makeNav() {
    if (document.getElementById(NAV_ID)) return document.getElementById(NAV_ID);
    var nav = create("nav", "hm-more-nav");
    nav.id = NAV_ID;
    nav.setAttribute("aria-label", "웹도구 공통 메뉴");

    var home = navButton("home", "홈", "home");
    var reset = navButton("reset", "초기화", "reset");
    var category = navButton("category", config.categoryLabel || "카테고리", "category");
    var all = navButton("all", "전체 도구", "all");
    var share = navButton("share", "공유", "share");

    home.addEventListener("click", function () { window.location.href = getHomeUrl(); });
    reset.addEventListener("click", resetTool);
    category.addEventListener("click", function () { openCategory(); });
    all.addEventListener("click", function () { openAll(); });
    share.addEventListener("click", sharePage);

    nav.appendChild(home);
    nav.appendChild(reset);
    nav.appendChild(category);
    nav.appendChild(all);
    nav.appendChild(share);
    document.body.appendChild(nav);
    state.nav = nav;
    return nav;
  }

  function getHomeUrl() {
    return state.data && state.data.site && state.data.site.homeUrl || config.homeUrl;
  }

  function getHubUrl() {
    return state.data && state.data.site && state.data.site.hubUrl || config.hubUrl;
  }

  function loadData() {
    if (state.data) return Promise.resolve(state.data);
    if (window.HM_WEBTOOLS_DATA) {
      state.data = window.HM_WEBTOOLS_DATA;
      resolveCurrent();
      return Promise.resolve(state.data);
    }
    if (state.loading) return state.loading;

    state.loading = new Promise(function (resolve, reject) {
      var loader = document.createElement("script");
      loader.src = config.dataUrl;
      loader.async = true;
      loader.onload = function () {
        if (!window.HM_WEBTOOLS_DATA) {
          reject(new Error("HM_WEBTOOLS_DATA 없음"));
          return;
        }
        state.data = window.HM_WEBTOOLS_DATA;
        resolveCurrent();
        resolve(state.data);
      };
      loader.onerror = function () { reject(new Error("hm-webtools-data.js 로드 실패")); };
      document.head.appendChild(loader);
    });
    return state.loading;
  }

  function availableTools(data) {
    return ((data && data.tools) || []).filter(function (tool) {
      return tool && tool.available === true && tool.url;
    }).sort(function (a, b) { return (Number(a.order) || 9999) - (Number(b.order) || 9999); });
  }

  function categoryMap(data) {
    var map = {};
    ((data && data.categories) || []).forEach(function (category) { if (category && category.id) map[category.id] = category; });
    return map;
  }

  function normalizeUrl(value) {
    try {
      var url = new URL(value, window.location.href);
      return (url.hostname + decodeURIComponent(url.pathname)).replace(/\/+$/, "").toLowerCase();
    } catch (error) {
      return String(value || "").replace(/\/+$/, "").toLowerCase();
    }
  }

  function resolveCurrent() {
    if (!state.data) return;
    var tools = availableTools(state.data);
    var currentUrl = normalizeUrl(window.location.href);
    state.currentTool = tools.find(function (tool) { return config.toolId && tool.id === config.toolId; }) ||
      tools.find(function (tool) { return normalizeUrl(tool.url) === currentUrl; }) || null;

    var catId = config.categoryId || state.currentTool && state.currentTool.category || "";
    state.currentCategory = categoryMap(state.data)[catId] || null;
    updateCategoryLabel();
  }

  function updateCategoryLabel() {
    if (!state.nav) return;
    var button = state.nav.querySelector("[data-action='category'] span");
    if (!button) return;
    var label = config.categoryLabel || state.currentCategory && state.currentCategory.name + " 도구" || "카테고리";
    button.textContent = label;
    button.parentNode.setAttribute("aria-label", label);
  }

  function showToast(message) {
    var old = document.querySelector(".hm-more-toast");
    if (old) old.remove();
    var toast = create("div", "hm-more-toast", message);
    document.body.appendChild(toast);
    window.setTimeout(function () { if (toast.parentNode) toast.remove(); }, 1700);
  }

  function resetTool() {
    try {
      if (typeof window.HM_TOOL_RESET === "function") {
        window.HM_TOOL_RESET();
        showToast("초기화했습니다.");
        return;
      }

      if (config.resetSelector) {
        var declared = document.querySelector(config.resetSelector);
        if (declared) {
          declared.click();
          showToast("초기화했습니다.");
          return;
        }
      }

      var selectors = ["[data-hm-tool-reset]", "[data-action='reset']", "#resetButton", "#resetBtn", ".reset-button", ".btn-reset"];
      for (var i = 0; i < selectors.length; i += 1) {
        var node = document.querySelector(selectors[i]);
        if (node && !node.closest("#" + NAV_ID)) {
          node.click();
          showToast("초기화했습니다.");
          return;
        }
      }

      var event = new CustomEvent("hm:tool:reset", { cancelable: true });
      if (!document.dispatchEvent(event)) {
        showToast("초기화했습니다.");
        return;
      }
    } catch (error) {
      console.error("[HM More reset]", error);
    }
    window.location.reload();
  }

  function sharePage() {
    var payload = { title: document.title, text: document.title, url: window.location.href };
    if (navigator.share) {
      navigator.share(payload).catch(function (error) { if (!error || error.name !== "AbortError") copyUrl(); });
      return;
    }
    copyUrl();
  }

  function copyUrl() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).then(function () { showToast("링크를 복사했습니다."); }).catch(fallbackCopy);
    } else fallbackCopy();
  }

  function fallbackCopy() {
    var area = create("textarea");
    area.value = window.location.href;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); showToast("링크를 복사했습니다."); }
    catch (error) { showToast("주소창의 링크를 복사해 주세요."); }
    area.remove();
  }

  function closeLayer() {
    var layer = document.getElementById(OVERLAY_ID);
    if (layer) layer.remove();
    document.documentElement.classList.remove("hm-more-open");
    state.overlay = null;
  }

  function openShell(title, subtitle) {
    closeLayer();
    var layer = create("div", "hm-more-layer");
    layer.id = OVERLAY_ID;
    var panel = create("section", "hm-more-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    var head = create("header", "hm-more-head");
    var copy = create("div");
    copy.appendChild(create("strong", "", title));
    copy.appendChild(create("small", "", subtitle));
    var close = create("button", "hm-more-close");
    close.type = "button";
    close.setAttribute("aria-label", "닫기");
    close.appendChild(svg("close"));
    close.addEventListener("click", closeLayer);
    var body = create("div", "hm-more-body");
    head.appendChild(copy);
    head.appendChild(close);
    panel.appendChild(head);
    panel.appendChild(body);
    layer.appendChild(panel);
    layer.addEventListener("click", function (event) { if (event.target === layer) closeLayer(); });
    document.body.appendChild(layer);
    document.documentElement.classList.add("hm-more-open");
    state.overlay = layer;
    return body;
  }

  function openLoading(title) {
    var body = openShell(title, "웹도구 목록을 불러오는 중입니다.");
    body.appendChild(create("div", "hm-more-empty", "잠시만 기다려 주세요."));
  }

  function openCategory() {
    openLoading(config.categoryLabel || "카테고리 도구");
    loadData().then(function () {
      var cat = state.currentCategory;
      if (!cat && config.categoryId) cat = categoryMap(state.data)[config.categoryId] || null;
      if (!cat) {
        window.location.href = getHubUrl();
        return;
      }
      renderCategory(cat);
    }).catch(function (error) {
      console.error("[HM More category]", error);
      showToast("목록을 불러오지 못해 전체 도구로 이동합니다.");
      window.setTimeout(function () { window.location.href = getHubUrl() + "?category=" + encodeURIComponent(config.categoryId || "image"); }, 500);
    });
  }

  function renderCategory(category) {
    var body = openShell(category.name + " 도구", "현재 도구를 제외한 같은 카테고리 도구입니다.");
    body.appendChild(create("h3", "hm-more-title", category.name + " 도구"));
    var grid = create("div", "hm-more-tool-grid");
    var tools = availableTools(state.data).filter(function (tool) {
      return tool.category === category.id && (!state.currentTool || tool.id !== state.currentTool.id);
    });
    renderToolGrid(grid, tools, "같은 카테고리에 등록된 다른 도구가 없습니다.");
    body.appendChild(grid);
  }

  function openAll() {
    openLoading("전체 웹도구");
    loadData().then(renderAll).catch(function (error) {
      console.error("[HM More all]", error);
      showToast("목록을 불러오지 못해 전체 도구로 이동합니다.");
      window.setTimeout(function () { window.location.href = getHubUrl(); }, 500);
    });
  }

  function renderAll() {
    var body = openShell("전체 웹도구", "카테고리 또는 검색으로 필요한 도구를 찾으세요.");
    var search = create("div", "hm-more-search");
    var input = create("input");
    input.type = "search";
    input.placeholder = state.data.settings && state.data.settings.searchPlaceholder || "웹도구 검색";
    input.setAttribute("aria-label", "웹도구 검색");
    var searchButton = create("button");
    searchButton.type = "button";
    searchButton.setAttribute("aria-label", "검색");
    searchButton.appendChild(svg("search"));
    search.appendChild(input);
    search.appendChild(searchButton);
    body.appendChild(search);

    body.appendChild(create("h3", "hm-more-title", "카테고리"));
    var categoryGrid = create("div", "hm-more-category-grid");
    var categories = (state.data.categories || []).slice().sort(function (a, b) { return (Number(a.order) || 9999) - (Number(b.order) || 9999); });
    categories.forEach(function (category) {
      var count = availableTools(state.data).filter(function (tool) { return tool.category === category.id && (!state.currentTool || tool.id !== state.currentTool.id); }).length;
      if (!count) return;
      var button = create("button", "hm-more-category");
      button.type = "button";
      var icon = create("span", "hm-more-card-icon");
      icon.appendChild(svg(category.icon || "category"));
      button.appendChild(icon);
      button.appendChild(create("strong", "", category.name + " 도구"));
      button.appendChild(create("span", "hm-more-count", count + "개"));
      button.addEventListener("click", function () { renderCategory(category); });
      categoryGrid.appendChild(button);
    });
    body.appendChild(categoryGrid);

    var resultTitle = create("h3", "hm-more-title is-separated", "추천 웹도구");
    var resultGrid = create("div", "hm-more-tool-grid");
    body.appendChild(resultTitle);
    body.appendChild(resultGrid);
    var featured = availableTools(state.data).filter(function (tool) { return (!state.currentTool || tool.id !== state.currentTool.id) && tool.featured; }).slice(0, 10);
    if (!featured.length) featured = availableTools(state.data).filter(function (tool) { return !state.currentTool || tool.id !== state.currentTool.id; }).slice(0, 10);
    renderToolGrid(resultGrid, featured, "등록된 도구가 없습니다.");

    function runSearch() {
      var q = String(input.value || "").trim().toLowerCase();
      if (!q) {
        resultTitle.textContent = "추천 웹도구";
        renderToolGrid(resultGrid, featured, "등록된 도구가 없습니다.");
        return;
      }
      var matches = availableTools(state.data).filter(function (tool) {
        if (state.currentTool && tool.id === state.currentTool.id) return false;
        var text = [tool.name, tool.shortName, tool.description, Array.isArray(tool.keywords) ? tool.keywords.join(" ") : ""].join(" ").toLowerCase();
        return text.indexOf(q) !== -1;
      }).slice(0, 40);
      resultTitle.textContent = "검색 결과";
      renderToolGrid(resultGrid, matches, "검색 결과가 없습니다.");
    }

    input.addEventListener("input", runSearch);
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") runSearch(); });
    searchButton.addEventListener("click", runSearch);
    window.setTimeout(function () { input.focus(); }, 50);
  }

  function toolCard(tool) {
    var button = create("button", "hm-more-tool");
    button.type = "button";
    var icon = create("span", "hm-more-card-icon");
    icon.appendChild(svg(tool.icon || "all"));
    var copy = create("span");
    copy.appendChild(create("strong", "", tool.shortName || tool.name || "웹도구"));
    copy.appendChild(create("small", "", tool.description || ""));
    var arrow = svg("arrow");
    arrow.setAttribute("class", "hm-more-arrow");
    button.appendChild(icon);
    button.appendChild(copy);
    button.appendChild(arrow);
    button.addEventListener("click", function () { window.location.href = tool.url; });
    return button;
  }

  function renderToolGrid(grid, tools, emptyText) {
    grid.replaceChildren();
    if (!tools.length) {
      grid.appendChild(create("div", "hm-more-empty", emptyText));
      return;
    }
    tools.forEach(function (tool) { grid.appendChild(toolCard(tool)); });
  }

  function start() {
    injectStyle();
    applyAccent();
    makeNav();
    updateCategoryLabel();
    loadData().catch(function (error) {
      console.error("[HM More data]", error);
    });
    document.dispatchEvent(new CustomEvent("hm:webtools-more:ready", { detail: { version: VERSION } }));
  }

  window.HMWebtoolsMore = Object.freeze({
    version: VERSION,
    openCategory: openCategory,
    openAll: openAll,
    reset: resetTool,
    share: sharePage,
    close: closeLayer,
    refreshAccent: function () { applyAccent(); return state.accent; }
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})(window, document);
