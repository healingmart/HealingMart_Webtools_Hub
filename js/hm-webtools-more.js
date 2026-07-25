/*
 * HealingMart Webtools More v2.0.0
 * 추천 도구 + 웹도구 카테고리 공통 바텀시트
 */
(function (window, document) {
  "use strict";

  var VERSION = "2.0.0";
  var DATA_URL = "https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js";
  var DEFAULT_HUB_URL = "https://www.healing-mart.com/2026/07/Webtools.html";
  var STYLE_ID = "hmWebtoolsMoreStyleV2";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var currentSheet = null;
  var loadingPromise = null;
  var toastTimer = 0;

  var ICONS = Object.freeze({
    close: [
      ["path", { d: "M6 6l12 12" }],
      ["path", { d: "M18 6 6 18" }]
    ],
    categories: [
      ["rect", { x: "4", y: "4", width: "6", height: "6", rx: "1" }],
      ["rect", { x: "14", y: "4", width: "6", height: "6", rx: "1" }],
      ["rect", { x: "4", y: "14", width: "6", height: "6", rx: "1" }],
      ["rect", { x: "14", y: "14", width: "6", height: "6", rx: "1" }]
    ],
    external: [
      ["path", { d: "M14 4h6v6" }],
      ["path", { d: "m20 4-9 9" }],
      ["path", { d: "M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" }]
    ],
    spark: [
      ["path", { d: "m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" }],
      ["path", { d: "m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" }]
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
    pin: [
      ["path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }],
      ["circle", { cx: "12", cy: "10", r: "2.5" }]
    ]
  });

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function icon(name, className) {
    var svg = document.createElementNS(SVG_NS, "svg");
    var definition = ICONS[name] || ICONS.categories;

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (className) svg.setAttribute("class", className);

    definition.forEach(function (item) {
      var child = document.createElementNS(SVG_NS, item[0]);
      Object.keys(item[1]).forEach(function (key) {
        child.setAttribute(key, item[1][key]);
      });
      svg.appendChild(child);
    });

    return svg;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".hm-more-overlay,.hm-more-overlay *{box-sizing:border-box}",
      ".hm-more-overlay{position:fixed;inset:0;z-index:2147483600;padding:12px;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.48);backdrop-filter:blur(6px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Noto Sans KR\",Arial,sans-serif}",
      ".hm-more-panel{width:min(760px,100%);max-height:min(84vh,780px);margin:0 auto 10px;overflow:auto;border:1px solid #d6dee8;border-radius:24px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.3)}",
      ".hm-more-head{position:sticky;top:0;z-index:3;min-height:70px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #e6ebf1;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}",
      ".hm-more-head strong{display:block;color:#172238;font-size:20px;font-weight:950;letter-spacing:-.035em}",
      ".hm-more-head span{display:block;margin-top:3px;color:#6b788a;font-size:11px;font-weight:750}",
      ".hm-more-close{width:40px;height:40px;flex:none;display:grid;place-items:center;border:1px solid #dce4ed;border-radius:12px;background:#fff;color:#4f5d70;cursor:pointer}",
      ".hm-more-close svg,.hm-more-icon svg,.hm-more-arrow svg,.hm-more-all svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-body{padding:16px}",
      ".hm-more-section+.hm-more-section{margin-top:18px;padding-top:18px;border-top:1px solid #edf0f4}",
      ".hm-more-title{margin:0 0 10px;color:#23344b;font-size:14px;font-weight:950}",
      ".hm-more-featured{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}",
      ".hm-more-tool{min-width:0;min-height:74px;padding:10px;display:grid;grid-template-columns:42px minmax(0,1fr) 26px;align-items:center;gap:9px;border:1px solid #e0e6ed;border-radius:14px;background:#fff;color:#25364c;text-align:left;cursor:pointer}",
      ".hm-more-tool:hover{border-color:#bcc8d5;background:#fafbfd}",
      ".hm-more-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#f0f3f7;color:#596779}",
      ".hm-more-tool-copy{min-width:0}",
      ".hm-more-tool-copy strong{display:block;overflow:hidden;color:#1b2b40;font-size:13px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-tool-copy span{display:block;margin-top:3px;overflow:hidden;color:#738094;font-size:9px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-arrow{width:26px;height:26px;display:grid;place-items:center;color:#6a7788}",
      ".hm-more-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}",
      ".hm-more-category{min-width:0;min-height:66px;padding:9px 11px;display:flex;align-items:center;gap:10px;border:1px solid #e1e7ee;border-radius:14px;background:#fafbfd;color:#2c3d53;text-align:left;cursor:pointer}",
      ".hm-more-category:hover,.hm-more-category.is-current{border-color:#8296c8;background:#f3f6ff}",
      ".hm-more-category .hm-more-icon{width:39px;height:39px;flex:none}",
      ".hm-more-category-copy{min-width:0;flex:1}",
      ".hm-more-category-copy strong{display:block;font-size:13px;font-weight:900}",
      ".hm-more-category-copy span{display:block;margin-top:2px;color:#768296;font-size:9px;font-weight:750}",
      ".hm-more-count{min-width:26px;height:24px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#edf1f6;color:#657286;font-size:9px;font-weight:900}",
      ".hm-more-all{width:100%;min-height:52px;margin-top:16px;padding:0 15px;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;background:linear-gradient(135deg,#2563eb,#5869dc);color:#fff;font-size:13px;font-weight:950;cursor:pointer;box-shadow:0 9px 22px rgba(37,99,235,.24)}",
      ".hm-more-toast{max-width:min(420px,calc(100% - 24px));min-height:44px;padding:11px 15px;position:fixed;left:50%;bottom:92px;z-index:2147483700;transform:translate(-50%,18px);border-radius:13px;background:rgba(15,23,42,.94);color:#fff;font-family:Pretendard,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Noto Sans KR\",Arial,sans-serif;font-size:11px;font-weight:850;text-align:center;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}",
      ".hm-more-toast.is-visible{transform:translate(-50%,0);opacity:1}",
      "@media(max-width:560px){.hm-more-overlay{padding:8px 5px calc(8px + env(safe-area-inset-bottom))}.hm-more-panel{margin-bottom:calc(72px + env(safe-area-inset-bottom));border-radius:20px}.hm-more-head{min-height:64px;padding:11px}.hm-more-head strong{font-size:17px}.hm-more-body{padding:11px 8px 14px}.hm-more-featured,.hm-more-categories{grid-template-columns:1fr}.hm-more-tool{min-height:70px}.hm-more-category{min-height:62px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function showToast(message) {
    var toast = document.getElementById("hmWebtoolsMoreToast");

    if (!toast) {
      toast = element("div", "hm-more-toast");
      toast.id = "hmWebtoolsMoreToast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function ensureData() {
    if (window.HM_WEBTOOLS_DATA) {
      return Promise.resolve(window.HM_WEBTOOLS_DATA);
    }

    if (loadingPromise) return loadingPromise;

    loadingPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector("script[data-hm-webtools-data-loader]");

      function finish() {
        if (window.HM_WEBTOOLS_DATA) {
          resolve(window.HM_WEBTOOLS_DATA);
        } else {
          reject(new Error("웹도구 데이터가 없습니다."));
        }
      }

      if (existing) {
        document.addEventListener("hm:webtools:data-ready", finish, { once: true });
        window.setTimeout(finish, 4000);
        return;
      }

      var script = document.createElement("script");
      script.dataset.hmWebtoolsDataLoader = "true";
      script.src = DATA_URL + "?hmcb=" + Math.floor(Date.now() / 300000);
      script.async = true;
      script.onload = finish;
      script.onerror = function () {
        reject(new Error("웹도구 데이터를 불러오지 못했습니다."));
      };
      document.head.appendChild(script);
    });

    return loadingPromise;
  }

  function availableTools(data) {
    return data.tools
      .filter(function (tool) {
        return tool.available === true && String(tool.url || "").trim();
      })
      .slice()
      .sort(function (a, b) {
        return (Number(a.order) || 9999) - (Number(b.order) || 9999);
      });
  }

  function hubUrl(data) {
    return String(data.site && data.site.hubUrl || DEFAULT_HUB_URL);
  }

  function categoryUrl(data, categoryId) {
    var url = new URL(hubUrl(data), window.location.href);
    url.searchParams.set(
      String(data.settings && data.settings.categoryParam || "category"),
      categoryId
    );
    url.hash = "hm-webtools-results";
    return url.toString();
  }

  function openTool(tool) {
    var url = String(tool && tool.url || "").trim();
    if (!url) {
      showToast("아직 주소가 연결되지 않은 도구입니다.");
      return;
    }
    window.location.href = url;
  }

  function closeCurrent() {
    if (currentSheet && typeof currentSheet.close === "function") {
      currentSheet.close();
    }
  }

  function renderSheet(data, options) {
    closeCurrent();
    injectStyles();

    options = options || {};

    var tools = availableTools(data);
    var categories = data.categories
      .filter(function (category) {
        return tools.some(function (tool) {
          return tool.category === category.id;
        });
      })
      .slice()
      .sort(function (a, b) {
        return (Number(a.order) || 9999) - (Number(b.order) || 9999);
      });

    var currentToolId = String(options.currentToolId || "");
    var currentCategory = String(options.currentCategory || "");
    var featuredLimit = Math.max(
      1,
      Number(data.settings && data.settings.moreFeaturedLimit) || 4
    );

    var featured = tools
      .filter(function (tool) {
        return tool.featured === true && tool.id !== currentToolId;
      })
      .slice()
      .sort(function (a, b) {
        return (Number(a.featuredOrder) || Number(a.order) || 9999)
          - (Number(b.featuredOrder) || Number(b.order) || 9999);
      })
      .slice(0, featuredLimit);

    var oldOverflow = document.body.style.overflow;
    var overlay = element("div", "hm-more-overlay");
    var panel = element("section", "hm-more-panel");
    var head = element("header", "hm-more-head");
    var headCopy = element("div");
    var close = element("button", "hm-more-close");
    var body = element("div", "hm-more-body");

    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "웹도구 빠른 메뉴");

    headCopy.append(
      element("strong", "", "웹도구 빠른 메뉴"),
      element("span", "", "추천 도구를 열거나 분야별 웹도구를 확인하세요.")
    );

    close.type = "button";
    close.setAttribute("aria-label", "웹도구 빠른 메뉴 닫기");
    close.appendChild(icon("close"));
    head.append(headCopy, close);

    if (featured.length) {
      var featuredSection = element("section", "hm-more-section");
      var featuredGrid = element("div", "hm-more-featured");
      featuredSection.appendChild(element("h2", "hm-more-title", "추천 도구"));

      featured.forEach(function (tool) {
        var category = categories.find(function (item) {
          return item.id === tool.category;
        });
        var button = element("button", "hm-more-tool");
        var iconWrap = element("span", "hm-more-icon");
        var copy = element("span", "hm-more-tool-copy");
        var arrow = element("span", "hm-more-arrow");

        button.type = "button";
        iconWrap.appendChild(icon(tool.icon || (category && category.icon)));
        copy.append(
          element("strong", "", tool.shortName || tool.name),
          element("span", "", tool.description)
        );
        arrow.appendChild(icon("external"));
        button.append(iconWrap, copy, arrow);
        button.addEventListener("click", function () {
          openTool(tool);
        });
        featuredGrid.appendChild(button);
      });

      featuredSection.appendChild(featuredGrid);
      body.appendChild(featuredSection);
    }

    var categorySection = element("section", "hm-more-section");
    var categoryGrid = element("div", "hm-more-categories");
    categorySection.appendChild(element("h2", "hm-more-title", "웹도구 카테고리"));

    categories.forEach(function (category) {
      var count = tools.filter(function (tool) {
        return tool.category === category.id;
      }).length;
      var button = element("button", "hm-more-category");
      var iconWrap = element("span", "hm-more-icon");
      var copy = element("span", "hm-more-category-copy");

      button.type = "button";
      if (category.id === currentCategory) {
        button.classList.add("is-current");
      }

      iconWrap.appendChild(icon(category.icon));
      copy.append(
        element("strong", "", category.name),
        element("span", "", category.description)
      );

      button.append(
        iconWrap,
        copy,
        element("span", "hm-more-count", count.toLocaleString("ko-KR"))
      );

      button.addEventListener("click", function () {
        window.location.href = categoryUrl(data, category.id);
      });

      categoryGrid.appendChild(button);
    });

    categorySection.appendChild(categoryGrid);
    body.appendChild(categorySection);

    var all = element("button", "hm-more-all");
    all.type = "button";
    all.append(
      icon("categories"),
      element("span", "", "전체 웹도구 보기"),
      icon("external")
    );
    all.addEventListener("click", function () {
      window.location.href = hubUrl(data);
    });
    body.appendChild(all);

    panel.append(head, body);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function closeSheet() {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKey);
      overlay.remove();
      currentSheet = null;
    }

    function onKey(event) {
      if (event.key === "Escape") {
        closeSheet();
      }
    }

    close.addEventListener("click", closeSheet);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeSheet();
      }
    });
    document.addEventListener("keydown", onKey);

    currentSheet = {
      close: closeSheet
    };
  }

  function open(options) {
    ensureData()
      .then(function (data) {
        renderSheet(data, options || {});
      })
      .catch(function () {
        showToast("웹도구 메뉴를 불러오지 못했습니다.");
      });
  }

  function triggerOptions(trigger) {
    var value = String(trigger.getAttribute("data-hm-webtools-more") || "").trim();

    return {
      currentToolId: String(
        trigger.getAttribute("data-current-tool")
        || trigger.getAttribute("data-tool-id")
        || ""
      ).trim(),
      currentCategory: String(
        trigger.getAttribute("data-current-category")
        || (value !== "all" ? value : "")
        || ""
      ).trim()
    };
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-hm-webtools-more]");
    if (!trigger) return;

    event.preventDefault();
    open(triggerOptions(trigger));
  });

  window.HMWebToolsMore = Object.freeze({
    version: VERSION,
    open: open,
    close: closeCurrent
  });

  document.dispatchEvent(new CustomEvent("hm:webtools-more:ready", {
    detail: { version: VERSION }
  }));
})(window, document);
