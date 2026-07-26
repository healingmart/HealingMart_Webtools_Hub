/*
 * HealingMart Webtools Dock v3.0.0
 * 스크립트 한 줄로 개별 웹도구에 공통 메뉴를 생성합니다.
 *
 * PC: 오른쪽 세로 도크
 * 모바일: 하단 5칸 바
 *
 * 메뉴: 홈 · 초기화 · 현재 카테고리 · 전체 도구 · 공유
 */
(function(window, document){
  "use strict";

  if(window.HMWebtoolsDock && window.HMWebtoolsDock.version){
    return;
  }

  var VERSION = "3.0.0";
  var SCRIPT = document.currentScript;
  var STYLE_ID = "hmWebtoolsDockStyleV3";
  var DOCK_ID = "hmWebtoolsDockV3";
  var OVERLAY_ID = "hmWebtoolsDockOverlayV3";
  var DEFAULT_HOME_URL = "https://www.healing-mart.com/";
  var DEFAULT_HUB_URL = "https://www.healing-mart.com/2026/07/Webtools.html";
  var dataPromise = null;
  var dataCache = null;
  var currentTool = null;
  var currentCategory = null;
  var dockNode = null;
  var accentColor = "#334155";
  var accentSoft = "rgba(51,65,85,.12)";

  function create(tag, className, text){
    var node = document.createElement(tag);
    if(className) node.className = className;
    if(text !== undefined) node.textContent = String(text);
    return node;
  }

  function svg(name){
    var ns = "http://www.w3.org/2000/svg";
    var icon = document.createElementNS(ns, "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");

    var commands = {
      home: [
        ["path", {d:"M3 11.5 12 4l9 7.5"}],
        ["path", {d:"M5.5 10.5V20h13v-9.5"}],
        ["path", {d:"M9.5 20v-6h5v6"}]
      ],
      reset: [
        ["path", {d:"M4 4v6h6"}],
        ["path", {d:"M5.4 15a7.5 7.5 0 1 0 .2-6.4L4 10"}]
      ],
      category: [
        ["rect", {x:"4", y:"4", width:"6", height:"6", rx:"1"}],
        ["rect", {x:"14", y:"4", width:"6", height:"6", rx:"1"}],
        ["rect", {x:"4", y:"14", width:"6", height:"6", rx:"1"}],
        ["rect", {x:"14", y:"14", width:"6", height:"6", rx:"1"}]
      ],
      all: [
        ["path", {d:"M4 7.5h7v-3H4z"}],
        ["path", {d:"M13 4.5h7v7h-7z"}],
        ["path", {d:"M4 13.5h7v6H4z"}],
        ["path", {d:"M13 13.5h7v6h-7z"}]
      ],
      share: [
        ["circle", {cx:"18", cy:"5", r:"2.4"}],
        ["circle", {cx:"6", cy:"12", r:"2.4"}],
        ["circle", {cx:"18", cy:"19", r:"2.4"}],
        ["path", {d:"m8.1 10.8 7.8-4.5M8.1 13.2l7.8 4.5"}]
      ],
      close: [
        ["path", {d:"m6 6 12 12M18 6 6 18"}]
      ],
      arrow: [
        ["path", {d:"m9 18 6-6-6-6"}]
      ],
      search: [
        ["circle", {cx:"11", cy:"11", r:"7"}],
        ["path", {d:"m16.5 16.5 4 4"}]
      ]
    };

    (commands[name] || commands.all).forEach(function(item){
      var child = document.createElementNS(ns, item[0]);
      Object.keys(item[1]).forEach(function(key){
        child.setAttribute(key, item[1][key]);
      });
      icon.appendChild(child);
    });
    return icon;
  }

  function resolveDataUrl(){
    var explicit = SCRIPT && SCRIPT.getAttribute("data-data-url");
    if(explicit) return explicit;

    if(SCRIPT && SCRIPT.src){
      try{
        return new URL("../data/hm-webtools-data.js", SCRIPT.src).href;
      }catch(error){}
    }

    return "https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js";
  }

  var DATA_URL = resolveDataUrl();

  function normalizeUrl(value){
    try{
      var url = new URL(value, window.location.href);
      var path = decodeURIComponent(url.pathname)
        .replace(/\/+/g, "/")
        .replace(/\/$/, "")
        .toLowerCase();
      return url.hostname.toLowerCase() + path;
    }catch(error){
      return String(value || "").trim().toLowerCase();
    }
  }

  function availableTools(data){
    return (data && Array.isArray(data.tools) ? data.tools : []).filter(function(tool){
      return tool && tool.available === true && typeof tool.url === "string" && tool.url.trim();
    });
  }

  function categoryMap(data){
    var map = {};
    (data && Array.isArray(data.categories) ? data.categories : []).forEach(function(category){
      if(category && category.id) map[category.id] = category;
    });
    return map;
  }

  function detectCurrentTool(data){
    var forced = "";
    if(SCRIPT) forced = SCRIPT.getAttribute("data-current-tool") || "";
    forced = forced ||
      document.documentElement.getAttribute("data-current-tool") ||
      (document.body && document.body.getAttribute("data-current-tool")) ||
      "";

    var tools = availableTools(data);
    if(forced){
      return tools.find(function(tool){ return tool.id === forced; }) || null;
    }

    var current = normalizeUrl(window.location.href);
    return tools.find(function(tool){
      return normalizeUrl(tool.url) === current;
    }) || null;
  }

  function detectCurrentCategory(data, tool){
    var forced = "";
    if(SCRIPT) forced = SCRIPT.getAttribute("data-current-category") || "";
    forced = forced ||
      document.documentElement.getAttribute("data-current-category") ||
      (document.body && document.body.getAttribute("data-current-category")) ||
      "";

    var map = categoryMap(data);
    if(forced && map[forced]) return map[forced];
    if(tool && map[tool.category]) return map[tool.category];
    return null;
  }

  function loadData(){
    if(window.HM_WEBTOOLS_DATA){
      dataCache = window.HM_WEBTOOLS_DATA;
      return Promise.resolve(dataCache);
    }
    if(dataPromise) return dataPromise;

    dataPromise = new Promise(function(resolve, reject){
      var loader = document.createElement("script");
      var bucket = Math.floor(Date.now() / 900000);
      loader.src = DATA_URL + (DATA_URL.indexOf("?") === -1 ? "?" : "&") + "hmv=" + bucket;
      loader.async = true;
      loader.onload = function(){
        if(window.HM_WEBTOOLS_DATA){
          dataCache = window.HM_WEBTOOLS_DATA;
          resolve(dataCache);
        }else{
          reject(new Error("HM_WEBTOOLS_DATA가 없습니다."));
        }
      };
      loader.onerror = function(){
        reject(new Error("hm-webtools-data.js를 불러오지 못했습니다."));
      };
      document.head.appendChild(loader);
    });

    return dataPromise;
  }

  function parseColor(value){
    if(!value) return null;
    var text = String(value).trim().toLowerCase();
    if(!text || text === "transparent" || text === "rgba(0, 0, 0, 0)") return null;

    var hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if(hex){
      var raw = hex[1];
      if(raw.length === 3){
        raw = raw.charAt(0)+raw.charAt(0)+raw.charAt(1)+raw.charAt(1)+raw.charAt(2)+raw.charAt(2);
      }
      return {
        r: parseInt(raw.slice(0,2),16),
        g: parseInt(raw.slice(2,4),16),
        b: parseInt(raw.slice(4,6),16)
      };
    }

    var rgb = text.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if(rgb){
      return {
        r: Math.max(0, Math.min(255, Number(rgb[1]))),
        g: Math.max(0, Math.min(255, Number(rgb[2]))),
        b: Math.max(0, Math.min(255, Number(rgb[3])))
      };
    }

    return null;
  }

  function rgbToHex(color){
    function part(value){
      var text = Math.round(value).toString(16);
      return text.length === 1 ? "0" + text : text;
    }
    return "#" + part(color.r) + part(color.g) + part(color.b);
  }

  function colorStats(color){
    var max = Math.max(color.r, color.g, color.b);
    var min = Math.min(color.r, color.g, color.b);
    var saturation = max === 0 ? 0 : (max - min) / max;
    var luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    return {saturation:saturation, luminance:luminance};
  }

  function usableAccent(value){
    var color = parseColor(value);
    if(!color) return null;
    var stats = colorStats(color);

    if(stats.saturation < 0.13) return null;
    if(stats.luminance > 0.78){
      color.r *= 0.66;
      color.g *= 0.66;
      color.b *= 0.66;
    }
    if(stats.luminance < 0.12){
      color.r = Math.min(255, color.r + 40);
      color.g = Math.min(255, color.g + 40);
      color.b = Math.min(255, color.b + 40);
    }
    return color;
  }

  function detectAccent(){
    var explicit = SCRIPT && SCRIPT.getAttribute("data-accent");
    var explicitColor = usableAccent(explicit);
    if(explicitColor) return explicitColor;

    var roots = [
      document.documentElement,
      document.body,
      document.querySelector("[data-tool-app]"),
      document.querySelector("[data-app]"),
      document.querySelector("main"),
      document.querySelector(".app"),
      document.querySelector(".tool-app")
    ].filter(Boolean);

    var variables = [
      "--hm-tool-accent",
      "--hm-primary",
      "--primary",
      "--primary-color",
      "--accent",
      "--accent-color",
      "--brand",
      "--brand-color"
    ];

    for(var r = 0; r < roots.length; r += 1){
      var style = window.getComputedStyle(roots[r]);
      for(var v = 0; v < variables.length; v += 1){
        var fromVar = usableAccent(style.getPropertyValue(variables[v]));
        if(fromVar) return fromVar;
      }
    }

    var selectors = [
      "[data-primary]",
      ".btn-primary",
      ".button-primary",
      "button.primary",
      ".primary-button",
      "[class*='primary'][class*='btn']",
      "[class*='accent'][class*='button']"
    ];

    for(var s = 0; s < selectors.length; s += 1){
      var candidates = document.querySelectorAll(selectors[s]);
      for(var i = 0; i < candidates.length && i < 12; i += 1){
        var computed = window.getComputedStyle(candidates[i]);
        var fromBackground = usableAccent(computed.backgroundColor);
        if(fromBackground) return fromBackground;
        var fromColor = usableAccent(computed.color);
        if(fromColor) return fromColor;
      }
    }

    var buttons = document.querySelectorAll("button, .button, [role='button']");
    for(var b = 0; b < buttons.length && b < 24; b += 1){
      var buttonStyle = window.getComputedStyle(buttons[b]);
      var generic = usableAccent(buttonStyle.backgroundColor);
      if(generic) return generic;
    }

    return parseColor("#334155");
  }

  function applyAccent(color){
    accentColor = rgbToHex(color || parseColor("#334155"));
    accentSoft = "rgba(" +
      Math.round(color.r) + "," +
      Math.round(color.g) + "," +
      Math.round(color.b) + ",.12)";

    document.documentElement.style.setProperty("--hm-dock-accent", accentColor);
    document.documentElement.style.setProperty("--hm-dock-accent-soft", accentSoft);
  }

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".hm-dock-v3,.hm-dock-v3 *,.hm-dock-overlay-v3,.hm-dock-overlay-v3 *{box-sizing:border-box}" +
      ".hm-dock-v3{--hm-dock-accent:#334155;--hm-dock-accent-soft:rgba(51,65,85,.12);position:fixed;right:18px;top:50%;z-index:2147482000;width:106px;padding:8px;display:grid;gap:5px;transform:translateY(-50%);border:1px solid rgba(203,213,225,.95);border-radius:20px;background:rgba(255,255,255,.96);box-shadow:0 16px 42px rgba(15,23,42,.17);backdrop-filter:blur(16px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}" +
      ".hm-dock-v3 button{width:100%;min-height:48px;padding:7px 6px;border:0;border-radius:13px;display:flex;align-items:center;justify-content:flex-start;gap:8px;background:transparent;color:#475569;font:inherit;font-size:12px;font-weight:850;line-height:1.15;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
      ".hm-dock-v3 button:hover{background:#f1f5f9;color:#0f172a}" +
      ".hm-dock-v3 button[data-hm-dock-action='category']{background:var(--hm-dock-accent);color:#fff;box-shadow:0 7px 18px color-mix(in srgb,var(--hm-dock-accent) 28%,transparent)}" +
      ".hm-dock-v3 svg{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
      ".hm-dock-v3 span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      ".hm-dock-overlay-v3{position:fixed;inset:0;z-index:2147483000;padding:24px;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.48);backdrop-filter:blur(5px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}" +
      ".hm-dock-panel-v3{width:min(920px,100%);max-height:min(82vh,780px);overflow:auto;border:1px solid #d9e2ec;border-radius:24px;background:#fff;box-shadow:0 26px 76px rgba(15,23,42,.3)}" +
      ".hm-dock-head-v3{position:sticky;top:0;z-index:3;min-height:76px;padding:15px 18px;display:grid;grid-template-columns:minmax(0,1fr) 42px;align-items:center;gap:12px;border-bottom:1px solid #e5eaf0;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}" +
      ".hm-dock-head-v3 strong{display:block;color:#0f172a;font-size:20px;font-weight:950;letter-spacing:-.035em}" +
      ".hm-dock-head-v3 small{display:block;margin-top:4px;color:#64748b;font-size:11px;font-weight:750}" +
      ".hm-dock-close-v3{width:42px;height:42px;padding:0;display:grid;place-items:center;border:1px solid #dce4ec;border-radius:12px;background:#fff;color:#475569;cursor:pointer}" +
      ".hm-dock-close-v3 svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}" +
      ".hm-dock-body-v3{padding:18px}" +
      ".hm-dock-search-v3{margin-bottom:18px;display:grid;grid-template-columns:minmax(0,1fr) 54px;gap:8px}" +
      ".hm-dock-search-v3 input{width:100%;height:52px;padding:0 15px;border:2px solid #d2dce8;border-radius:14px;outline:0;color:#0f172a;background:#fff;font:inherit;font-size:14px;font-weight:800}" +
      ".hm-dock-search-v3 input:focus{border-color:var(--hm-dock-accent);box-shadow:0 0 0 4px var(--hm-dock-accent-soft)}" +
      ".hm-dock-search-v3 button{height:52px;padding:0;display:grid;place-items:center;border:0;border-radius:14px;background:var(--hm-dock-accent);color:#fff;cursor:pointer}" +
      ".hm-dock-search-v3 svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}" +
      ".hm-dock-section-v3{margin:0 0 12px;color:#0f172a;font-size:17px;font-weight:950;letter-spacing:-.025em}" +
      ".hm-dock-section-v3:not(:first-child){margin-top:24px;padding-top:22px;border-top:1px solid #e8edf3}" +
      ".hm-dock-category-grid-v3{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}" +
      ".hm-dock-tool-grid-v3{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}" +
      ".hm-dock-category-v3,.hm-dock-tool-v3{min-width:0;min-height:74px;padding:11px 12px;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:9px;border:1px solid #dfe6ee;border-radius:15px;background:#fff;color:#172238;text-align:left;cursor:pointer}" +
      ".hm-dock-category-v3:hover,.hm-dock-tool-v3:hover{border-color:var(--hm-dock-accent);background:var(--hm-dock-accent-soft)}" +
      ".hm-dock-icon-v3{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:var(--hm-dock-accent-soft);color:var(--hm-dock-accent);font-size:14px;font-weight:950}" +
      ".hm-dock-category-v3 strong,.hm-dock-tool-v3 strong{display:block;overflow:hidden;color:#0f172a;font-size:13px;font-weight:950;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}" +
      ".hm-dock-tool-v3 small{display:block;margin-top:4px;overflow:hidden;color:#64748b;font-size:10px;font-weight:700;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}" +
      ".hm-dock-count-v3{color:var(--hm-dock-accent);font-size:10px;font-weight:950;white-space:nowrap}" +
      ".hm-dock-arrow-v3{width:18px;height:18px;fill:none;stroke:#64748b;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
      ".hm-dock-empty-v3{grid-column:1/-1;min-height:110px;padding:20px;display:grid;place-items:center;border:1px dashed #ccd7e4;border-radius:15px;background:#f8fafc;color:#64748b;font-size:12px;font-weight:800;text-align:center}" +
      ".hm-dock-footer-v3{padding:0 18px 18px}" +
      ".hm-dock-hub-v3{width:100%;min-height:48px;border:0;border-radius:13px;background:var(--hm-dock-accent-soft);color:var(--hm-dock-accent);font-size:13px;font-weight:950;cursor:pointer}" +
      ".hm-dock-toast-v3{position:fixed;left:50%;bottom:24px;z-index:2147483600;max-width:calc(100% - 32px);padding:11px 16px;transform:translateX(-50%);border-radius:12px;background:#0f172a;color:#fff;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif;font-size:12px;font-weight:800;box-shadow:0 12px 30px rgba(15,23,42,.28)}" +
      "html.hm-dock-modal-open,html.hm-dock-modal-open body{overflow:hidden!important}" +
      "@media(max-width:760px){" +
        ".hm-dock-v3{right:auto;top:auto;left:50%;bottom:8px;width:calc(100% - 16px);max-width:560px;min-height:68px;padding:6px 7px calc(6px + env(safe-area-inset-bottom));grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;transform:translateX(-50%);border-radius:20px}" +
        ".hm-dock-v3 button{min-width:0;min-height:56px;padding:5px 2px;flex-direction:column;justify-content:center;gap:3px;border-radius:14px;font-size:10px;line-height:1.1}" +
        ".hm-dock-v3 svg{width:21px;height:21px}" +
        ".hm-dock-overlay-v3{padding:0 0 calc(82px + env(safe-area-inset-bottom));align-items:flex-end}" +
        ".hm-dock-panel-v3{width:100%;max-height:84vh;border-radius:22px 22px 0 0}" +
        ".hm-dock-head-v3{min-height:68px;padding:12px 14px}" +
        ".hm-dock-head-v3 strong{font-size:18px}" +
        ".hm-dock-body-v3{padding:14px 12px}" +
        ".hm-dock-category-grid-v3,.hm-dock-tool-grid-v3{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}" +
        ".hm-dock-category-v3,.hm-dock-tool-v3{min-height:70px;padding:9px;grid-template-columns:38px minmax(0,1fr) auto;gap:7px}" +
        ".hm-dock-icon-v3{width:38px;height:38px;font-size:12px}" +
        ".hm-dock-category-v3 strong,.hm-dock-tool-v3 strong{font-size:11px}" +
        ".hm-dock-tool-v3 small{font-size:9px}" +
        ".hm-dock-footer-v3{padding:0 12px 14px}" +
        ".hm-dock-toast-v3{bottom:92px}" +
      "}" +
      "@media(max-width:390px){" +
        ".hm-dock-v3 button{font-size:9px}" +
      "}";

    document.head.appendChild(style);
  }

  function iconText(item){
    var key = item && (item.icon || item.category) || "";
    var icons = {
      image:"IMG", video:"VID", writing:"TXT", life:"LIFE",
      document:"DOC", audio:"AUD", data:"DATA", developer:"DEV",
      calculator:"CAL", convert:"CVT", rename:"NAME", watermark:"WM",
      crop:"CROP", cutout:"CUT", compress:"ZIP", all:"ALL"
    };
    return icons[key] || String((item && (item.shortName || item.name || item.id)) || "TOOL").slice(0,4).toUpperCase();
  }

  function showToast(message){
    var old = document.querySelector(".hm-dock-toast-v3");
    if(old) old.remove();
    var toast = create("div", "hm-dock-toast-v3", message);
    document.body.appendChild(toast);
    window.setTimeout(function(){
      if(toast.parentNode) toast.remove();
    }, 1800);
  }

  function closeOverlay(){
    var overlay = document.getElementById(OVERLAY_ID);
    if(overlay) overlay.remove();
    document.documentElement.classList.remove("hm-dock-modal-open");
  }

  function goToTool(tool){
    if(!tool || !tool.url) return;
    window.location.href = tool.url;
  }

  function toolCard(tool){
    var button = create("button", "hm-dock-tool-v3");
    button.type = "button";

    var icon = create("span", "hm-dock-icon-v3", iconText(tool));
    var copy = create("span");
    copy.appendChild(create("strong", "", tool.shortName || tool.name || "웹도구"));
    copy.appendChild(create("small", "", tool.description || ""));
    var arrow = svg("arrow");
    arrow.setAttribute("class", "hm-dock-arrow-v3");

    button.appendChild(icon);
    button.appendChild(copy);
    button.appendChild(arrow);
    button.addEventListener("click", function(){ goToTool(tool); });
    return button;
  }

  function toolsForCategory(data, categoryId){
    return availableTools(data)
      .filter(function(tool){
        return tool.category === categoryId && (!currentTool || tool.id !== currentTool.id);
      })
      .sort(function(a,b){
        return (Number(a.order) || 9999) - (Number(b.order) || 9999);
      });
  }

  function searchTools(data, query){
    var q = String(query || "").trim().toLowerCase();
    if(!q) return [];
    return availableTools(data).filter(function(tool){
      if(currentTool && tool.id === currentTool.id) return false;
      var text = [
        tool.name,
        tool.shortName,
        tool.description,
        Array.isArray(tool.keywords) ? tool.keywords.join(" ") : ""
      ].join(" ").toLowerCase();
      return text.indexOf(q) !== -1;
    }).slice(0, 40);
  }

  function popularTools(data){
    return availableTools(data)
      .filter(function(tool){ return !currentTool || tool.id !== currentTool.id; })
      .sort(function(a,b){
        var av = Number(a.popularOrder || a.featuredOrder || a.order) || 9999;
        var bv = Number(b.popularOrder || b.featuredOrder || b.order) || 9999;
        return av - bv;
      })
      .slice(0, 8);
  }

  function renderToolGrid(container, tools, emptyMessage){
    container.replaceChildren();
    if(!tools.length){
      container.appendChild(create("div", "hm-dock-empty-v3", emptyMessage || "표시할 웹도구가 없습니다."));
      return;
    }
    tools.forEach(function(tool){
      container.appendChild(toolCard(tool));
    });
  }

  function openPanel(mode, categoryId){
    loadData().then(function(data){
      dataCache = data;
      currentTool = detectCurrentTool(data);
      currentCategory = detectCurrentCategory(data, currentTool);
      updateDockLabel();

      closeOverlay();

      var overlay = create("div", "hm-dock-overlay-v3");
      overlay.id = OVERLAY_ID;

      var panel = create("section", "hm-dock-panel-v3");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");

      var head = create("header", "hm-dock-head-v3");
      var heading = create("div");
      var title = create("strong", "", mode === "category" && currentCategory ? currentCategory.name + " 도구" : "전체 웹도구");
      var subtitle = create("small", "", mode === "category" ? "같은 카테고리의 다른 도구로 바로 이동합니다." : "카테고리 또는 검색으로 필요한 도구를 찾으세요.");
      heading.appendChild(title);
      heading.appendChild(subtitle);

      var close = create("button", "hm-dock-close-v3");
      close.type = "button";
      close.setAttribute("aria-label", "닫기");
      close.appendChild(svg("close"));
      close.addEventListener("click", closeOverlay);
      head.appendChild(heading);
      head.appendChild(close);

      var body = create("div", "hm-dock-body-v3");

      if(mode === "category"){
        var chosenId = categoryId || (currentCategory && currentCategory.id) || "";
        var map = categoryMap(data);
        var chosen = map[chosenId] || currentCategory;
        title.textContent = chosen ? chosen.name + " 도구" : "웹도구 카테고리";

        if(chosen){
          body.appendChild(create("h3", "hm-dock-section-v3", chosen.name + " 도구"));
          var grid = create("div", "hm-dock-tool-grid-v3");
          renderToolGrid(grid, toolsForCategory(data, chosen.id), "같은 카테고리에 연결된 다른 도구가 없습니다.");
          body.appendChild(grid);
        }else{
          body.appendChild(create("h3", "hm-dock-section-v3", "카테고리"));
          body.appendChild(buildCategoryGrid(data));
        }
      }else{
        var search = create("div", "hm-dock-search-v3");
        var input = create("input");
        input.type = "search";
        input.placeholder = data.settings && data.settings.searchPlaceholder || "웹도구 검색";
        input.setAttribute("aria-label", "웹도구 검색");
        var searchButton = create("button");
        searchButton.type = "button";
        searchButton.setAttribute("aria-label", "검색");
        searchButton.appendChild(svg("search"));
        search.appendChild(input);
        search.appendChild(searchButton);
        body.appendChild(search);

        body.appendChild(create("h3", "hm-dock-section-v3", "카테고리"));
        body.appendChild(buildCategoryGrid(data));

        body.appendChild(create("h3", "hm-dock-section-v3", "추천 웹도구"));
        var resultGrid = create("div", "hm-dock-tool-grid-v3");
        renderToolGrid(resultGrid, popularTools(data), "연결된 웹도구가 없습니다.");
        body.appendChild(resultGrid);

        function runSearch(){
          var q = input.value.trim();
          if(!q){
            renderToolGrid(resultGrid, popularTools(data), "연결된 웹도구가 없습니다.");
            return;
          }
          renderToolGrid(resultGrid, searchTools(data, q), "검색 결과가 없습니다.");
          var section = resultGrid.previousElementSibling;
          if(section) section.textContent = "검색 결과";
        }

        input.addEventListener("input", runSearch);
        input.addEventListener("keydown", function(event){
          if(event.key === "Enter") runSearch();
        });
        searchButton.addEventListener("click", runSearch);
      }

      var footer = create("footer", "hm-dock-footer-v3");
      var hub = create("button", "hm-dock-hub-v3", "전체 웹도구 페이지로 이동");
      hub.type = "button";
      hub.addEventListener("click", function(){
        window.location.href = data.site && data.site.hubUrl || DEFAULT_HUB_URL;
      });
      footer.appendChild(hub);

      panel.appendChild(head);
      panel.appendChild(body);
      panel.appendChild(footer);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      document.documentElement.classList.add("hm-dock-modal-open");

      overlay.addEventListener("click", function(event){
        if(event.target === overlay) closeOverlay();
      });

      function onEscape(event){
        if(event.key === "Escape"){
          document.removeEventListener("keydown", onEscape);
          closeOverlay();
        }
      }
      document.addEventListener("keydown", onEscape);

      if(mode !== "category"){
        window.setTimeout(function(){ input.focus(); }, 80);
      }
    }).catch(function(error){
      console.error("[HealingMart Dock]", error);
      showToast("웹도구 목록을 불러오지 못했습니다.");
      window.setTimeout(function(){
        window.location.href = DEFAULT_HUB_URL;
      }, 700);
    });
  }

  function buildCategoryGrid(data){
    var grid = create("div", "hm-dock-category-grid-v3");
    var categories = (Array.isArray(data.categories) ? data.categories.slice() : [])
      .sort(function(a,b){ return (Number(a.order)||9999) - (Number(b.order)||9999); });

    categories.forEach(function(category){
      var count = toolsForCategory(data, category.id).length;
      if(!count) return;

      var button = create("button", "hm-dock-category-v3");
      button.type = "button";
      var icon = create("span", "hm-dock-icon-v3", iconText(category));
      var copy = create("span");
      copy.appendChild(create("strong", "", category.name + " 도구"));
      var countNode = create("span", "hm-dock-count-v3", count + "개");
      button.appendChild(icon);
      button.appendChild(copy);
      button.appendChild(countNode);
      button.addEventListener("click", function(){
        openPanel("category", category.id);
      });
      grid.appendChild(button);
    });

    if(!grid.childNodes.length){
      grid.appendChild(create("div", "hm-dock-empty-v3", "연결된 카테고리가 없습니다."));
    }
    return grid;
  }

  function commonResetButton(){
    var selectors = [
      "[data-hm-tool-reset]",
      "[data-action='reset']",
      "[data-reset]",
      "#resetBtn",
      "#resetButton",
      "#reset",
      ".reset-button",
      ".btn-reset"
    ];

    for(var i = 0; i < selectors.length; i += 1){
      var node = document.querySelector(selectors[i]);
      if(node && !node.closest("#" + DOCK_ID)) return node;
    }

    var buttons = document.querySelectorAll("button");
    for(var b = 0; b < buttons.length; b += 1){
      if(buttons[b].closest("#" + DOCK_ID)) continue;
      var label = String(buttons[b].textContent || "").trim();
      if(label === "초기화" || label === "다시 시작" || label === "처음부터"){
        return buttons[b];
      }
    }
    return null;
  }

  function resetTool(){
    try{
      if(typeof window.HM_TOOL_RESET === "function"){
        window.HM_TOOL_RESET();
        showToast("초기화했습니다.");
        return;
      }

      var event = new CustomEvent("hm:tool:reset", {cancelable:true});
      var accepted = document.dispatchEvent(event);
      if(!accepted){
        showToast("초기화했습니다.");
        return;
      }

      var button = commonResetButton();
      if(button){
        button.click();
        showToast("초기화했습니다.");
        return;
      }
    }catch(error){
      console.error("[HealingMart Dock reset]", error);
    }

    window.location.reload();
  }

  function sharePage(){
    var data = {
      title: document.title,
      text: document.title,
      url: window.location.href
    };

    if(navigator.share){
      navigator.share(data).catch(function(error){
        if(error && error.name !== "AbortError") copyUrl();
      });
    }else{
      copyUrl();
    }
  }

  function copyUrl(){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(window.location.href)
        .then(function(){ showToast("링크를 복사했습니다."); })
        .catch(fallbackCopy);
    }else{
      fallbackCopy();
    }
  }

  function fallbackCopy(){
    var input = create("textarea");
    input.value = window.location.href;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    try{
      document.execCommand("copy");
      showToast("링크를 복사했습니다.");
    }catch(error){
      showToast("주소창의 링크를 복사해 주세요.");
    }
    input.remove();
  }

  function makeDockButton(action, label, iconName){
    var button = create("button");
    button.type = "button";
    button.setAttribute("data-hm-dock-action", action);
    button.setAttribute("aria-label", label);
    button.appendChild(svg(iconName));
    button.appendChild(create("span", "", label));
    return button;
  }

  function updateDockLabel(){
    if(!dockNode) return;
    var button = dockNode.querySelector("[data-hm-dock-action='category']");
    if(!button) return;
    var label = currentCategory ? currentCategory.name + " 도구" : "카테고리";
    button.setAttribute("aria-label", label);
    var span = button.querySelector("span");
    if(span) span.textContent = label;
  }

  function createDock(){
    var old = document.getElementById(DOCK_ID);
    if(old) return old;

    var dock = create("nav", "hm-dock-v3");
    dock.id = DOCK_ID;
    dock.setAttribute("aria-label", "웹도구 공통 메뉴");

    var home = makeDockButton("home", "홈", "home");
    var reset = makeDockButton("reset", "초기화", "reset");
    var category = makeDockButton("category", "카테고리", "category");
    var all = makeDockButton("all", "전체 도구", "all");
    var share = makeDockButton("share", "공유", "share");

    home.addEventListener("click", function(){
      window.location.href = dataCache && dataCache.site && dataCache.site.homeUrl || DEFAULT_HOME_URL;
    });
    reset.addEventListener("click", resetTool);
    category.addEventListener("click", function(){
      openPanel("category", currentCategory && currentCategory.id || "");
    });
    all.addEventListener("click", function(){ openPanel("all", ""); });
    share.addEventListener("click", sharePage);

    dock.appendChild(home);
    dock.appendChild(reset);
    dock.appendChild(category);
    dock.appendChild(all);
    dock.appendChild(share);
    document.body.appendChild(dock);
    return dock;
  }

  function start(){
    injectStyle();
    applyAccent(detectAccent());
    dockNode = createDock();

    loadData().then(function(data){
      dataCache = data;
      currentTool = detectCurrentTool(data);
      currentCategory = detectCurrentCategory(data, currentTool);
      updateDockLabel();

      document.dispatchEvent(new CustomEvent("hm:webtools:dock-ready", {
        detail: {
          version: VERSION,
          currentTool: currentTool && currentTool.id || "",
          currentCategory: currentCategory && currentCategory.id || "",
          accent: accentColor
        }
      }));
    }).catch(function(error){
      console.error("[HealingMart Dock]", error);
      document.dispatchEvent(new CustomEvent("hm:webtools:dock-error", {
        detail: {version:VERSION, message:error.message}
      }));
    });
  }

  window.HMWebtoolsDock = Object.freeze({
    version: VERSION,
    openCategory: function(categoryId){ openPanel("category", categoryId || ""); },
    openAll: function(){ openPanel("all", ""); },
    reset: resetTool,
    share: sharePage,
    refreshAccent: function(){
      applyAccent(detectAccent());
      return accentColor;
    }
  });

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start, {once:true});
  }else{
    start();
  }
})(window, document);
