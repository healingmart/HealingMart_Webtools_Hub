/*
 * HealingMart Webtools More v4.0.0
 * Bottom navigation only.
 * 기존 게시물 디자인과 도구 기능은 건드리지 않습니다.
 */
(function (window, document) {
  "use strict";

  if (window.HMWebtoolsMore && window.HMWebtoolsMore.version === "4.0.0") {
    return;
  }

  var SCRIPT = document.currentScript;
  var VERSION = "4.0.0";
  var DEFAULT_DATA_URL =
    "https://healingmart.github.io/healingmart-webtools-hub/data/hm-webtools-data.js";
  var DEFAULT_HOME_URL = "https://www.healing-mart.com/";
  var DEFAULT_HUB_URL =
    "https://www.healing-mart.com/2026/07/Webtools.html";

  var DATA_URL =
    (SCRIPT && SCRIPT.getAttribute("data-data-url")) || DEFAULT_DATA_URL;
  var TOOL_ID =
    (SCRIPT && SCRIPT.getAttribute("data-tool-id")) || "";
  var CATEGORY_ID =
    (SCRIPT && SCRIPT.getAttribute("data-category-id")) || "";
  var ROOT_SELECTOR =
    (SCRIPT && SCRIPT.getAttribute("data-root-selector")) || "";
  var COLOR =
    (SCRIPT && SCRIPT.getAttribute("data-color")) || "";

  var STYLE_ID = "hmMoreBottomOnlyStyleV4";
  var NAV_ID = "hmMoreBottomOnlyNav";
  var SHEET_ID = "hmMoreBottomOnlySheet";
  var BOUNDARY_ID = "hmMoreBottomOnlyBoundary";

  var state = {
    data: null,
    currentTool: null,
    currentCategory: null,
    root: null,
    nav: null,
    sheet: null,
    panelTitle: null,
    panelSubtitle: null,
    searchWrap: null,
    searchInput: null,
    grid: null,
    footerButton: null,
    mode: "",
    loading: null,
    frame: 0
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }
    return node;
  }

  function svgIcon(name) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var icons = {
      home: [
        ["path", { d: "M3 11.5 12 4l9 7.5" }],
        ["path", { d: "M5.5 10.5V20h13v-9.5" }],
        ["path", { d: "M9.5 20v-6h5v6" }]
      ],
      search: [
        ["circle", { cx: "11", cy: "11", r: "7" }],
        ["path", { d: "m16.5 16.5 4 4" }]
      ],
      image: [
        ["rect", { x: "3.5", y: "4", width: "17", height: "16", rx: "2" }],
        ["circle", { cx: "8.5", cy: "9", r: "1.7" }],
        ["path", { d: "m5 17 4.3-4.2 3.2 3 2.1-2 4.4 3.2" }]
      ],
      categories: [
        ["rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }],
        ["rect", { x: "14", y: "14", width: "6", height: "6", rx: "1" }]
      ],
      share: [
        ["circle", { cx: "18", cy: "5", r: "2.3" }],
        ["circle", { cx: "6", cy: "12", r: "2.3" }],
        ["circle", { cx: "18", cy: "19", r: "2.3" }],
        ["path", { d: "m8.1 10.8 7.8-4.5M8.1 13.2l7.8 4.5" }]
      ],
      close: [
        ["path", { d: "m6 6 12 12" }],
        ["path", { d: "M18 6 6 18" }]
      ],
      arrow: [["path", { d: "m9 5 7 7-7 7" }]],
      tool: [
        ["path", { d: "M12 3v4M12 17v4M3 12h4M17 12h4" }],
        ["circle", { cx: "12", cy: "12", r: "4" }]
      ]
    };

    (icons[name] || icons.tool).forEach(function (item) {
      var child = document.createElementNS(ns, item[0]);
      Object.keys(item[1]).forEach(function (key) {
        child.setAttribute(key, item[1][key]);
      });
      svg.appendChild(child);
    });

    return svg;
  }

  function normalizeUrl(value) {
    try {
      var url = new URL(value, window.location.href);
      return (
        url.hostname.toLowerCase() +
        decodeURIComponent(url.pathname).replace(/\/+$/, "").toLowerCase()
      );
    } catch (error) {
      return String(value || "").replace(/\/+$/, "").toLowerCase();
    }
  }

  function hexToRgb(value) {
    var color = String(value || "").trim();
    var match;

    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return [
        parseInt(color.charAt(1) + color.charAt(1), 16),
        parseInt(color.charAt(2) + color.charAt(2), 16),
        parseInt(color.charAt(3) + color.charAt(3), 16)
      ];
    }

    if (/^#[0-9a-f]{6}$/i.test(color)) {
      return [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)
      ];
    }

    match = color.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
    );
    if (match) {
      return [Number(match[1]), Number(match[2]), Number(match[3])];
    }

    return [108, 92, 231];
  }

  function detectRoot() {
    var selectors = [
      ROOT_SELECTOR,
      "#healingMartMultiCutTool",
      "#healingMartCalculatorApp",
      "[data-hm-tool-root]",
      "[data-tool-id]"
    ].filter(Boolean);

    for (var i = 0; i < selectors.length; i += 1) {
      try {
        var found = document.querySelector(selectors[i]);
        if (found) return found;
      } catch (error) {}
    }

    return document.querySelector("article.post, article, main") || document.body;
  }

  function detectColor() {
    if (COLOR) return COLOR;

    var candidates = [
      state.root,
      document.documentElement,
      document.body
    ].filter(Boolean);

    for (var i = 0; i < candidates.length; i += 1) {
      var style = window.getComputedStyle(candidates[i]);
      var value =
        style.getPropertyValue("--primary").trim() ||
        style.getPropertyValue("--hm-primary").trim();

      if (value) return value;
    }

    return "#6c5ce7";
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".hm-more-v4-nav,.hm-more-v4-nav *,.hm-more-v4-sheet,.hm-more-v4-sheet *{box-sizing:border-box}",
      ".hm-more-v4-boundary{width:1px;height:1px;display:block;margin:0;padding:0;visibility:hidden;pointer-events:none}",
      ".hm-more-v4-nav{width:min(760px,calc(100% - 24px));min-height:66px;padding:7px;position:fixed;left:50%;bottom:12px;z-index:2147483000;transform:translateX(-50%);display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;border:1px solid rgba(203,213,225,.96);border-radius:20px;background:rgba(255,255,255,.98);box-shadow:0 15px 42px rgba(15,23,42,.20);backdrop-filter:blur(16px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif;transition:opacity .18s ease,visibility .18s ease,transform .18s ease}",
      ".hm-more-v4-nav.is-hidden{opacity:0;visibility:hidden;pointer-events:none;transform:translate(-50%,calc(100% + 38px))}",
      ".hm-more-v4-nav button{min-width:0;min-height:50px;padding:6px 5px;border:0;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:7px;color:#475569;background:transparent;font:inherit;font-size:13px;font-weight:900;line-height:1.15;cursor:pointer;-webkit-tap-highlight-color:transparent}",
      ".hm-more-v4-nav button:hover{color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.09)}",
      ".hm-more-v4-nav button[data-hm-more-action='related']{color:#fff;background:var(--hm-more-accent);box-shadow:0 8px 20px rgba(var(--hm-more-rgb),.27)}",
      ".hm-more-v4-nav svg{width:21px;height:21px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-v4-nav span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-v4-sheet{position:fixed;inset:0;z-index:2147483500;display:none;align-items:flex-end;justify-content:center;padding:18px;background:rgba(15,23,42,.50);backdrop-filter:blur(6px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}",
      ".hm-more-v4-sheet.is-open{display:flex}",
      ".hm-more-v4-panel{width:min(940px,100%);max-height:min(84vh,800px);overflow:hidden;border:1px solid #d8e1eb;border-radius:25px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.30)}",
      ".hm-more-v4-head{min-height:80px;padding:14px 18px;display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:14px;border-bottom:1px solid #e5eaf0;background:#fff}",
      ".hm-more-v4-head strong{display:block;color:#10233b;font-size:22px;font-weight:950;letter-spacing:-.035em}",
      ".hm-more-v4-head small{display:block;margin-top:4px;color:#66778d;font-size:12px;font-weight:750}",
      ".hm-more-v4-close{width:44px;height:44px;padding:0;display:grid;place-items:center;border:1px solid #dce4ed;border-radius:13px;background:#fff;color:#52667e;cursor:pointer}",
      ".hm-more-v4-close svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}",
      ".hm-more-v4-scroll{max-height:calc(84vh - 81px);overflow:auto}",
      ".hm-more-v4-search-wrap{padding:18px 18px 0}",
      ".hm-more-v4-search{position:relative}",
      ".hm-more-v4-search svg{position:absolute;left:18px;top:50%;width:22px;height:22px;transform:translateY(-50%);fill:none;stroke:var(--hm-more-accent);stroke-width:2;stroke-linecap:round;pointer-events:none}",
      ".hm-more-v4-search input{width:100%;height:58px;padding:0 18px 0 50px;border:2px solid rgba(var(--hm-more-rgb),.34);border-radius:15px;outline:0;background:#fff;color:#10233b;font:inherit;font-size:15px;font-weight:800}",
      ".hm-more-v4-search input:focus{border-color:var(--hm-more-accent);box-shadow:0 0 0 5px rgba(var(--hm-more-rgb),.10)}",
      ".hm-more-v4-body{padding:18px}",
      ".hm-more-v4-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}",
      ".hm-more-v4-card{min-width:0;min-height:96px;padding:14px;display:grid;grid-template-columns:52px minmax(0,1fr) 18px;align-items:center;gap:12px;border:1px solid #dfe6ee;border-radius:17px;background:#fff;color:#10233b;text-align:left;cursor:pointer}",
      ".hm-more-v4-card:hover{border-color:rgba(var(--hm-more-rgb),.38);background:rgba(var(--hm-more-rgb),.035);box-shadow:0 10px 24px rgba(38,60,89,.07)}",
      ".hm-more-v4-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.10)}",
      ".hm-more-v4-icon svg,.hm-more-v4-arrow{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-v4-copy{min-width:0}",
      ".hm-more-v4-copy strong{display:block;overflow:hidden;color:#10233b;font-size:15px;font-weight:950;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-v4-copy small{display:-webkit-box;margin-top:5px;overflow:hidden;color:#66778d;font-size:11px;font-weight:700;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2}",
      ".hm-more-v4-arrow{width:18px;height:18px;color:#7c8ba0}",
      ".hm-more-v4-empty{grid-column:1/-1;min-height:130px;padding:22px;display:grid;place-items:center;border:1px dashed #cbd8e6;border-radius:17px;background:#f8fafc;color:#66778d;font-size:13px;font-weight:800;text-align:center}",
      ".hm-more-v4-footer{padding:0 18px 18px}",
      ".hm-more-v4-footer button{width:100%;min-height:52px;border:0;border-radius:14px;color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.10);font:inherit;font-size:14px;font-weight:950;cursor:pointer}",
      "html.hm-more-v4-open,html.hm-more-v4-open body{overflow:hidden!important}",
      "@media(max-width:760px){.hm-more-v4-nav{width:calc(100% - 12px);min-height:72px;bottom:6px;padding:6px 5px calc(6px + env(safe-area-inset-bottom));gap:3px;border-radius:19px}.hm-more-v4-nav button{min-height:58px;padding:5px 2px;flex-direction:column;gap:3px;font-size:10px}.hm-more-v4-nav svg{width:21px;height:21px}.hm-more-v4-sheet{padding:0}.hm-more-v4-panel{width:100%;max-height:88vh;border-radius:23px 23px 0 0}.hm-more-v4-head{min-height:72px;padding:12px 13px}.hm-more-v4-head strong{font-size:19px}.hm-more-v4-scroll{max-height:calc(88vh - 73px)}.hm-more-v4-search-wrap{padding:13px 11px 0}.hm-more-v4-search input{height:54px;font-size:14px}.hm-more-v4-body{padding:13px 11px}.hm-more-v4-grid{grid-template-columns:1fr;gap:8px}.hm-more-v4-card{min-height:84px;padding:11px;grid-template-columns:46px minmax(0,1fr) 16px;gap:10px}.hm-more-v4-icon{width:46px;height:46px;border-radius:14px}.hm-more-v4-copy strong{font-size:14px}.hm-more-v4-footer{padding:0 11px 13px}}"
    ].join("");

    document.head.appendChild(style);
  }

  function loadData() {
    if (window.HM_WEBTOOLS_DATA) {
      return Promise.resolve(window.HM_WEBTOOLS_DATA);
    }

    if (state.loading) return state.loading;

    state.loading = new Promise(function (resolve, reject) {
      var loader = document.createElement("script");
      var separator = DATA_URL.indexOf("?") === -1 ? "?" : "&";

      loader.src =
        DATA_URL +
        separator +
        "hmcb=" +
        Math.floor(Date.now() / 300000);
      loader.async = true;

      loader.onload = function () {
        if (window.HM_WEBTOOLS_DATA) {
          resolve(window.HM_WEBTOOLS_DATA);
        } else {
          reject(new Error("hm-webtools-data.js loaded without data"));
        }
      };

      loader.onerror = function () {
        reject(new Error("hm-webtools-data.js load failed"));
      };

      document.head.appendChild(loader);
    });

    return state.loading;
  }

  function availableTools(data) {
    return (data.tools || [])
      .filter(function (tool) {
        return (
          tool &&
          tool.available !== false &&
          typeof tool.url === "string" &&
          tool.url.trim()
        );
      })
      .sort(function (a, b) {
        return (Number(a.order) || 9999) - (Number(b.order) || 9999);
      });
  }

  function detectCurrentTool(data) {
    var tools = availableTools(data);

    if (TOOL_ID) {
      return (
        tools.find(function (tool) {
          return tool.id === TOOL_ID;
        }) || null
      );
    }

    var currentUrl = normalizeUrl(window.location.href);

    return (
      tools.find(function (tool) {
        return normalizeUrl(tool.url) === currentUrl;
      }) || null
    );
  }

  function detectCurrentCategory(data) {
    var id =
      CATEGORY_ID ||
      (state.currentTool && state.currentTool.category) ||
      "";

    return (
      (data.categories || []).find(function (category) {
        return category.id === id;
      }) || {
        id: id || "all",
        name: "관련 도구",
        icon: id === "image" ? "image" : "tool"
      }
    );
  }

  function categoryMap(data) {
    var map = {};
    (data.categories || []).forEach(function (category) {
      if (category && category.id) map[category.id] = category;
    });
    return map;
  }

  function toolLabel(category) {
    if (!category) return "관련 도구";

    if (category.id === "image") return "이미지 도구";
    if (category.name) return category.name + " 도구";

    return "관련 도구";
  }

  function buildButton(action, label, iconName) {
    var button = element("button");
    button.type = "button";
    button.setAttribute("data-hm-more-action", action);
    button.setAttribute("aria-label", label);
    button.appendChild(svgIcon(iconName));
    button.appendChild(element("span", "", label));
    return button;
  }

  function buildNav() {
    if (document.getElementById(NAV_ID)) {
      state.nav = document.getElementById(NAV_ID);
      return;
    }

    var color = detectColor();
    var rgb = hexToRgb(color);
    var nav = element("nav", "hm-more-v4-nav is-hidden");
    nav.id = NAV_ID;
    nav.setAttribute("aria-label", "웹도구 빠른 메뉴");
    nav.setAttribute("aria-hidden", "true");
    nav.style.setProperty("--hm-more-accent", color);
    nav.style.setProperty("--hm-more-rgb", rgb.join(","));

    nav.appendChild(buildButton("home", "블로그", "home"));
    nav.appendChild(buildButton("search", "도구 검색", "search"));
    nav.appendChild(
      buildButton(
        "related",
        toolLabel(state.currentCategory),
        state.currentCategory && state.currentCategory.id === "image"
          ? "image"
          : "tool"
      )
    );
    nav.appendChild(buildButton("categories", "카테고리", "categories"));
    nav.appendChild(buildButton("share", "공유", "share"));

    document.body.appendChild(nav);
    state.nav = nav;
  }

  function buildSheet() {
    if (document.getElementById(SHEET_ID)) {
      state.sheet = document.getElementById(SHEET_ID);
      return;
    }

    var color = detectColor();
    var rgb = hexToRgb(color);
    var sheet = element("div", "hm-more-v4-sheet");
    sheet.id = SHEET_ID;
    sheet.setAttribute("aria-hidden", "true");
    sheet.style.setProperty("--hm-more-accent", color);
    sheet.style.setProperty("--hm-more-rgb", rgb.join(","));

    var panel = element("section", "hm-more-v4-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    var head = element("header", "hm-more-v4-head");
    var headCopy = element("div");
    var title = element("strong", "", "웹도구");
    var subtitle = element(
      "small",
      "",
      "필요한 도구를 빠르게 찾습니다."
    );
    var close = element("button", "hm-more-v4-close");
    close.type = "button";
    close.setAttribute("aria-label", "닫기");
    close.appendChild(svgIcon("close"));

    headCopy.appendChild(title);
    headCopy.appendChild(subtitle);
    head.appendChild(headCopy);
    head.appendChild(close);

    var scroll = element("div", "hm-more-v4-scroll");
    var searchWrap = element("div", "hm-more-v4-search-wrap");
    var searchBox = element("label", "hm-more-v4-search");
    var searchInput = element("input");
    searchInput.type = "search";
    searchInput.placeholder = "도구 이름이나 기능을 검색하세요";
    searchInput.autocomplete = "off";
    searchBox.appendChild(svgIcon("search"));
    searchBox.appendChild(searchInput);
    searchWrap.appendChild(searchBox);

    var body = element("div", "hm-more-v4-body");
    var grid = element("div", "hm-more-v4-grid");
    body.appendChild(grid);

    var footer = element("footer", "hm-more-v4-footer");
    var footerButton = element("button", "", "전체 웹도구 보기");
    footerButton.type = "button";
    footer.appendChild(footerButton);

    scroll.appendChild(searchWrap);
    scroll.appendChild(body);
    scroll.appendChild(footer);
    panel.appendChild(head);
    panel.appendChild(scroll);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);

    state.sheet = sheet;
    state.panelTitle = title;
    state.panelSubtitle = subtitle;
    state.searchWrap = searchWrap;
    state.searchInput = searchInput;
    state.grid = grid;
    state.footerButton = footerButton;

    close.addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (event) {
      if (event.target === sheet) closeSheet();
    });
    searchInput.addEventListener("input", function () {
      if (state.mode === "search") {
        renderSearch(searchInput.value);
      }
    });
    footerButton.addEventListener("click", function () {
      var hub = getHubUrl();
      if (state.mode === "related" && state.currentCategory) {
        window.location.href =
          hub +
          "?category=" +
          encodeURIComponent(state.currentCategory.id) +
          "#hm-webtools-results";
        return;
      }
      window.location.href = hub;
    });
  }

  function insertBoundary() {
    var existing = document.getElementById(BOUNDARY_ID);
    if (existing) return existing;

    var boundary = element("span", "hm-more-v4-boundary");
    boundary.id = BOUNDARY_ID;
    boundary.setAttribute("aria-hidden", "true");

    if (state.root && state.root.parentNode) {
      state.root.parentNode.insertBefore(boundary, state.root.nextSibling);
    } else {
      document.body.appendChild(boundary);
    }

    return boundary;
  }

  function getHomeUrl() {
    return (
      (state.data && state.data.site && state.data.site.homeUrl) ||
      DEFAULT_HOME_URL
    );
  }

  function getHubUrl() {
    return (
      (state.data && state.data.site && state.data.site.hubUrl) ||
      DEFAULT_HUB_URL
    );
  }

  function setSheetText(mode) {
    if (mode === "search") {
      state.panelTitle.textContent = "웹도구 검색";
      state.panelSubtitle.textContent =
        "도구 이름과 기능으로 전체 웹도구를 검색합니다.";
      state.footerButton.textContent = "전체 웹도구 보기";
      state.searchWrap.hidden = false;
      return;
    }

    if (mode === "related") {
      state.panelTitle.textContent =
        toolLabel(state.currentCategory);
      state.panelSubtitle.textContent =
        "현재 도구를 제외한 같은 카테고리의 도구입니다.";
      state.footerButton.textContent =
        (state.currentCategory && state.currentCategory.name
          ? state.currentCategory.name
          : "현재") + " 카테고리 전체 보기";
      state.searchWrap.hidden = true;
      return;
    }

    state.panelTitle.textContent = "웹도구 카테고리";
    state.panelSubtitle.textContent =
      "필요한 분야를 선택해 웹도구 모음으로 이동합니다.";
    state.footerButton.textContent = "전체 웹도구 보기";
    state.searchWrap.hidden = true;
  }

  function renderEmpty(message) {
    state.grid.replaceChildren();
    state.grid.appendChild(
      element("div", "hm-more-v4-empty", message)
    );
  }

  function createToolCard(tool) {
    var categories = categoryMap(state.data);
    var category = categories[tool.category] || {};
    var button = element("button", "hm-more-v4-card");
    button.type = "button";

    var icon = element("span", "hm-more-v4-icon");
    icon.appendChild(
      svgIcon(tool.category === "image" ? "image" : "tool")
    );

    var copy = element("span", "hm-more-v4-copy");
    copy.appendChild(
      element(
        "strong",
        "",
        tool.shortName || tool.name || "웹도구"
      )
    );
    copy.appendChild(
      element(
        "small",
        "",
        tool.description || category.name || "무료 웹도구"
      )
    );

    var arrow = svgIcon("arrow");
    arrow.setAttribute("class", "hm-more-v4-arrow");

    button.appendChild(icon);
    button.appendChild(copy);
    button.appendChild(arrow);
    button.addEventListener("click", function () {
      window.location.href = tool.url;
    });

    return button;
  }

  function renderTools(tools, emptyMessage) {
    state.grid.replaceChildren();

    if (!tools.length) {
      renderEmpty(emptyMessage);
      return;
    }

    tools.forEach(function (tool) {
      state.grid.appendChild(createToolCard(tool));
    });
  }

  function renderRelated() {
    var currentId =
      (state.currentTool && state.currentTool.id) || TOOL_ID;
    var categoryId =
      state.currentCategory && state.currentCategory.id;

    var tools = availableTools(state.data).filter(function (tool) {
      return (
        tool.category === categoryId &&
        tool.id !== currentId
      );
    });

    renderTools(tools, "현재 연결된 다른 관련 도구가 없습니다.");
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderSearch(query) {
    var term = normalize(query);
    var tools = availableTools(state.data).filter(function (tool) {
      return (
        !state.currentTool ||
        tool.id !== state.currentTool.id
      );
    });

    if (term) {
      tools = tools.filter(function (tool) {
        var keywords = Array.isArray(tool.keywords)
          ? tool.keywords.join(" ")
          : "";
        var haystack = normalize(
          [
            tool.name,
            tool.shortName,
            tool.description,
            keywords
          ].join(" ")
        );
        return haystack.indexOf(term) !== -1;
      });
    } else {
      tools = tools.slice(0, 12);
    }

    renderTools(
      tools,
      term ? "검색 결과가 없습니다." : "등록된 웹도구가 없습니다."
    );
  }

  function renderCategories() {
    var tools = availableTools(state.data);
    var counts = {};

    tools.forEach(function (tool) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });

    var categories = (state.data.categories || [])
      .filter(function (category) {
        return category && category.id && counts[category.id];
      })
      .sort(function (a, b) {
        return (Number(a.order) || 9999) - (Number(b.order) || 9999);
      });

    state.grid.replaceChildren();

    if (!categories.length) {
      renderEmpty("등록된 웹도구 카테고리가 없습니다.");
      return;
    }

    categories.forEach(function (category) {
      var button = element("button", "hm-more-v4-card");
      button.type = "button";

      var icon = element("span", "hm-more-v4-icon");
      icon.appendChild(
        svgIcon(category.id === "image" ? "image" : "categories")
      );

      var copy = element("span", "hm-more-v4-copy");
      copy.appendChild(
        element("strong", "", category.name || "웹도구")
      );
      copy.appendChild(
        element(
          "small",
          "",
          String(counts[category.id]) + "개 도구 보기"
        )
      );

      var arrow = svgIcon("arrow");
      arrow.setAttribute("class", "hm-more-v4-arrow");

      button.appendChild(icon);
      button.appendChild(copy);
      button.appendChild(arrow);
      button.addEventListener("click", function () {
        window.location.href =
          getHubUrl() +
          "?category=" +
          encodeURIComponent(category.id) +
          "#hm-webtools-results";
      });

      state.grid.appendChild(button);
    });
  }

  function openSheet(mode) {
    state.mode = mode;
    setSheetText(mode);
    state.sheet.classList.add("is-open");
    state.sheet.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("hm-more-v4-open");

    if (mode === "search") {
      renderSearch(state.searchInput.value);
      window.setTimeout(function () {
        state.searchInput.focus();
      }, 50);
      return;
    }

    if (mode === "related") {
      renderRelated();
      return;
    }

    renderCategories();
  }

  function closeSheet() {
    if (!state.sheet) return;
    state.sheet.classList.remove("is-open");
    state.sheet.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("hm-more-v4-open");
  }

  function toast(message) {
    var old = document.getElementById("hmMoreBottomOnlyToast");
    if (old) old.remove();

    var node = element("div", "", message);
    node.id = "hmMoreBottomOnlyToast";
    node.style.position = "fixed";
    node.style.left = "50%";
    node.style.bottom = "92px";
    node.style.zIndex = "2147483600";
    node.style.transform = "translateX(-50%)";
    node.style.padding = "12px 17px";
    node.style.borderRadius = "999px";
    node.style.background = "#10233b";
    node.style.color = "#fff";
    node.style.fontFamily =
      "Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
    node.style.fontSize = "13px";
    node.style.fontWeight = "850";
    document.body.appendChild(node);

    window.setTimeout(function () {
      node.remove();
    }, 1700);
  }

  function copyAddress() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(function () {
          toast("링크를 복사했습니다.");
        })
        .catch(fallbackCopy);
      return;
    }

    fallbackCopy();
  }

  function fallbackCopy() {
    var textarea = document.createElement("textarea");
    textarea.value = window.location.href;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      toast("링크를 복사했습니다.");
    } catch (error) {
      toast("주소창의 링크를 복사해 주세요.");
    }

    textarea.remove();
  }

  function sharePage() {
    var payload = {
      title: document.title,
      text:
        (state.currentTool && state.currentTool.name) ||
        "힐링편의점 웹도구",
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(payload).catch(function (error) {
        if (error && error.name !== "AbortError") copyAddress();
      });
      return;
    }

    copyAddress();
  }

  function bindNav() {
    state.nav.addEventListener("click", function (event) {
      var button = event.target.closest("[data-hm-more-action]");
      if (!button) return;

      var action = button.getAttribute("data-hm-more-action");

      if (action === "home") {
        window.location.href = getHomeUrl();
        return;
      }

      if (action === "search") {
        openSheet("search");
        return;
      }

      if (action === "related") {
        openSheet("related");
        return;
      }

      if (action === "categories") {
        openSheet("categories");
        return;
      }

      if (action === "share") {
        sharePage();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeSheet();
    });
  }

  function updateVisibility() {
    state.frame = 0;

    var boundary = document.getElementById(BOUNDARY_ID);
    if (!state.root || !boundary || !state.nav) return;

    var rootRect = state.root.getBoundingClientRect();
    var boundaryRect = boundary.getBoundingClientRect();
    var inside =
      rootRect.top < window.innerHeight - 24 &&
      rootRect.bottom > 90;
    var reachedEnd = boundaryRect.top <= window.innerHeight - 8;
    var show = inside && !reachedEnd;

    state.nav.classList.toggle("is-hidden", !show);
    state.nav.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function queueVisibility() {
    if (state.frame) return;
    state.frame = window.requestAnimationFrame(updateVisibility);
  }

  function init() {
    if (document.getElementById(NAV_ID)) return;

    state.root = detectRoot();
    injectStyle();

    loadData()
      .then(function (data) {
        state.data = data;
        state.currentTool = detectCurrentTool(data);
        state.currentCategory = detectCurrentCategory(data);

        buildNav();
        buildSheet();
        insertBoundary();
        bindNav();
        queueVisibility();

        window.addEventListener("scroll", queueVisibility, {
          passive: true
        });
        window.addEventListener("resize", queueVisibility);
        window.addEventListener("pageshow", queueVisibility);

        window.HMWebtoolsMore = {
          version: VERSION,
          openSearch: function () {
            openSheet("search");
          },
          openRelated: function () {
            openSheet("related");
          },
          openCategories: function () {
            openSheet("categories");
          },
          close: closeSheet
        };
      })
      .catch(function (error) {
        console.error("[HealingMart More v4]", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(window, document);
