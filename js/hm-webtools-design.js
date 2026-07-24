/*
 * HealingMart Web Tools Hub UI v3.1.0
 * Calculator-style Blogger directory, quick search, recent tools and latest carousel.
 */
(function (window, document) {
  "use strict";

  var CURRENT_SCRIPT = document.currentScript;
  var BASE_URL = CURRENT_SCRIPT && CURRENT_SCRIPT.dataset.base
    ? String(CURRENT_SCRIPT.dataset.base).replace(/\/$/, "")
    : "https://healingmart.github.io/healingmart-webtools-hub";
  var DATA_URL = CURRENT_SCRIPT && CURRENT_SCRIPT.dataset.dataUrl
    ? String(CURRENT_SCRIPT.dataset.dataUrl)
    : BASE_URL + "/js/hm-webtools-data.js";

  var VERSION = "3.1.0";
  var STYLE_ID = "hmWebtoolsStyleV3";
  var PAGE_SELECTORS = "[data-hm-webtools-stage],[data-hm-webtools-page]";
  var SEARCH_SHEET_ID = "hmWebtoolsSearchSheet";
  var RECENT_SHEET_ID = "hmWebtoolsRecentSheet";
  var RECENT_KEY = "hm-webtools-recent-v3";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var toastTimer = 0;
  var bodyOverflow = "";
  var pageController = null;
  var searchSheetController = null;
  var recentSheetController = null;

  var ICONS = Object.freeze({
    search:[["circle",{cx:"11",cy:"11",r:"7"}],["path",{d:"m16.5 16.5 4 4"}]],
    close:[["path",{d:"M6 6l12 12"}],["path",{d:"M18 6 6 18"}]],
    home:[["path",{d:"M3 11.5 12 4l9 7.5"}],["path",{d:"M5.5 10.5V20h13v-9.5"}],["path",{d:"M9.5 20v-6h5v6"}]],
    recent:[["path",{d:"M3 12a9 9 0 1 0 3-6.7"}],["path",{d:"M3 4v5h5"}],["path",{d:"M12 7v5l3 2"}]],
    spark:[["path",{d:"m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"}],["path",{d:"m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"}]],
    categories:[["rect",{x:"4",y:"4",width:"6",height:"6",rx:"1"}],["rect",{x:"14",y:"4",width:"6",height:"6",rx:"1"}],["rect",{x:"4",y:"14",width:"6",height:"6",rx:"1"}],["rect",{x:"14",y:"14",width:"6",height:"6",rx:"1"}]],
    arrowLeft:[["path",{d:"m15 18-6-6 6-6"}]],
    arrowRight:[["path",{d:"m9 18 6-6-6-6"}]],
    external:[["path",{d:"M14 4h6v6"}],["path",{d:"m20 4-9 9"}],["path",{d:"M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"}]],
    image:[["rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}],["circle",{cx:"8.5",cy:"9",r:"1.5"}],["path",{d:"m21 15-5-5L5 20"}]],
    video:[["rect",{x:"3",y:"5",width:"13",height:"14",rx:"2"}],["path",{d:"m16 10 5-3v10l-5-3"}]],
    writing:[["path",{d:"M4 20h5"}],["path",{d:"m14.5 4.5 5 5L9 20H4v-5Z"}],["path",{d:"m13 6 5 5"}]],
    life:[["path",{d:"M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"}]],
    document:[["path",{d:"M6 3h8l4 4v14H6Z"}],["path",{d:"M14 3v5h5"}],["path",{d:"M9 13h6M9 17h6"}]],
    audio:[["path",{d:"M9 18V6l10-2v12"}],["circle",{cx:"6",cy:"18",r:"3"}],["circle",{cx:"16",cy:"16",r:"3"}]],
    data:[["ellipse",{cx:"12",cy:"5",rx:"7",ry:"3"}],["path",{d:"M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"}],["path",{d:"M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"}]],
    developer:[["path",{d:"m8 9-4 3 4 3"}],["path",{d:"m16 9 4 3-4 3"}],["path",{d:"m14 5-4 14"}]],
    calculator:[["rect",{x:"5",y:"2",width:"14",height:"20",rx:"2"}],["path",{d:"M8 6h8v4H8Z"}],["path",{d:"M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1M16 18h1"}]],
    convert:[["path",{d:"M7 7h11l-3-3"}],["path",{d:"m18 7-3 3"}],["path",{d:"M17 17H6l3 3"}],["path",{d:"m6 17 3-3"}]],
    rename:[["path",{d:"M4 6h10M4 12h7M4 18h5"}],["path",{d:"m14 17 5-5 2 2-5 5-3 1Z"}]],
    watermark:[["rect",{x:"3",y:"4",width:"18",height:"16",rx:"2"}],["path",{d:"M7 9l2 7 3-5 3 5 2-7"}]],
    crop:[["path",{d:"M6 2v16a2 2 0 0 0 2 2h14"}],["path",{d:"M2 6h14a2 2 0 0 1 2 2v14"}]],
    cutout:[["circle",{cx:"9",cy:"9",r:"3"}],["circle",{cx:"15",cy:"15",r:"3"}],["path",{d:"m11 11 2 2M20 4 4 20"}]],
    compress:[["path",{d:"M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"}],["path",{d:"m3 8 6-6M21 8l-6-6M3 16l6 6M21 16l-6 6"}]],
    clean:[["path",{d:"m4 18 7-7"}],["path",{d:"m10 4 10 10-6 6L4 10Z"}],["path",{d:"M14 20h7"}]],
    link:[["path",{d:"M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"}],["path",{d:"M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"}]],
    calendar:[["rect",{x:"3",y:"5",width:"18",height:"16",rx:"2"}],["path",{d:"M8 3v4M16 3v4M3 10h18"}],["path",{d:"M8 14h2M14 14h2M8 18h2M14 18h2"}]],
    qr:[["rect",{x:"3",y:"3",width:"7",height:"7"}],["rect",{x:"14",y:"3",width:"7",height:"7"}],["rect",{x:"3",y:"14",width:"7",height:"7"}],["path",{d:"M15 14h2v2h-2zM19 14h2v4h-2zM14 19h4v2h-4zM20 20h1v1h-1z"}]],
    subtitle:[["rect",{x:"3",y:"5",width:"18",height:"14",rx:"2"}],["path",{d:"M7 14h4M13 14h4M7 17h7"}]],
    pin:[["path",{d:"M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"}],["circle",{cx:"12",cy:"10",r:"2.5"}]]
  });

  var TONES = Object.freeze({
    violet:{soft:"#f1efff",soft2:"#f8f7ff",ink:"#6655d8",line:"#dcd7ff"},
    rose:{soft:"#fff0f4",soft2:"#fff8fa",ink:"#c44570",line:"#ffd5e2"},
    blue:{soft:"#eaf4ff",soft2:"#f6faff",ink:"#2d70c9",line:"#cee3ff"},
    green:{soft:"#eaf9f1",soft2:"#f6fcf8",ink:"#158259",line:"#cceedd"},
    orange:{soft:"#fff3e9",soft2:"#fffaf5",ink:"#d66b1f",line:"#ffddc2"},
    pink:{soft:"#fff0f8",soft2:"#fff8fc",ink:"#c84587",line:"#ffd5e9"},
    teal:{soft:"#e9f9f7",soft2:"#f5fcfb",ink:"#087f78",line:"#c8ece7"},
    slate:{soft:"#eef2f7",soft2:"#f8fafc",ink:"#526174",line:"#d8e0e9"}
  });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svg(name, className) {
    var node = document.createElementNS(SVG_NS, "svg");
    var definition = ICONS[name] || ICONS.image;
    node.setAttribute("viewBox", "0 0 24 24");
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("focusable", "false");
    if (className) node.setAttribute("class", className);
    definition.forEach(function (item) {
      var child = document.createElementNS(SVG_NS, item[0]);
      Object.keys(item[1]).forEach(function (key) { child.setAttribute(key, item[1][key]); });
      node.appendChild(child);
    });
    return node;
  }

  function safeStorageGet(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase("ko-KR")
      .replace(/[\s._/\\-]+/g, "").replace(/[^\p{L}\p{N}]/gu, "");
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ko-KR", {month:"short",day:"numeric"}).format(date);
  }

  function getCategoryMap(data) {
    var map = new Map();
    data.categories.forEach(function (item) { map.set(item.id, item); });
    return map;
  }

  function sortedTools(data) {
    return data.tools.filter(function (tool) {
      return data.settings.showUnavailableTools || tool.available;
    }).slice().sort(function (a,b) {
      return (Number(a.order)||9999)-(Number(b.order)||9999) || String(a.name).localeCompare(String(b.name),"ko");
    });
  }

  function latestTools(data, tools) {
    return tools.slice().sort(function (a,b) {
      return (Date.parse(b.updatedAt)||0)-(Date.parse(a.updatedAt)||0);
    }).slice(0, Math.max(1, Number(data.settings.latestLimit)||12));
  }

  function showToast(message) {
    var toast = document.getElementById("hmWebtoolsToastV2");
    if (!toast) {
      toast = el("div","hm-wt-toast");
      toast.id = "hmWebtoolsToastV2";
      toast.setAttribute("role","status");
      toast.setAttribute("aria-live","polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function(){ toast.classList.remove("is-visible"); },2400);
  }

  function rememberTool(tool, data) {
    if (!tool || !tool.id) return;
    var limit = Math.max(1, Number(data.settings.recentLimit)||12);
    var current = safeStorageGet(RECENT_KEY, []);
    current = current.filter(function (id) { return id !== tool.id; });
    current.unshift(tool.id);
    safeStorageSet(RECENT_KEY,current.slice(0,limit));
  }

  function resolveUrl(tool) {
    if (!tool || !tool.url) return "";
    try { return new URL(String(tool.url),window.location.href).href; } catch (error) { return ""; }
  }

  function openTool(tool, data) {
    var url = resolveUrl(tool);
    if (!tool.available || !url) {
      showToast("이 도구의 실제 주소를 data.js에 연결해 주세요.");
      return;
    }
    rememberTool(tool,data);
    window.location.href = url;
  }

  function appendCacheKey(url) {
    var separator = url.indexOf("?") >= 0 ? "&" : "?";
    var fiveMinuteKey = Math.floor(Date.now() / 300000);
    return url + separator + "hmcb=" + fiveMinuteKey;
  }

  function loadDataScript(url) {
    return new Promise(function(resolve,reject){
      var script = document.createElement("script");
      var settled = false;
      var timer = window.setTimeout(function(){
        if (settled) return;
        settled = true;
        script.remove();
        reject(new Error("웹도구 데이터 로딩 시간이 초과되었습니다."));
      },12000);

      script.src = appendCacheKey(url);
      script.async = true;
      script.onload = function(){
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        if (window.HM_WEBTOOLS_DATA) resolve(window.HM_WEBTOOLS_DATA);
        else reject(new Error("데이터 파일은 열렸지만 HM_WEBTOOLS_DATA가 등록되지 않았습니다."));
      };
      script.onerror = function(){
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        script.remove();
        reject(new Error("웹도구 데이터 파일을 불러오지 못했습니다."));
      };
      document.head.appendChild(script);
    });
  }

  function loadData() {
    if (window.HM_WEBTOOLS_DATA) return Promise.resolve(window.HM_WEBTOOLS_DATA);

    var candidates = [
      DATA_URL,
      BASE_URL + "/js/hm-webtools-data.js",
      BASE_URL + "/js/hm-webtools-data.v3.js",
      BASE_URL + "/js/hm-webtools-data.v2.js"
    ].filter(function(url,index,list){
      return url && list.indexOf(url) === index;
    });

    var lastError = null;
    return candidates.reduce(function(chain,url){
      return chain.catch(function(error){
        lastError = error;
        if (window.HM_WEBTOOLS_DATA) return window.HM_WEBTOOLS_DATA;
        return loadDataScript(url);
      });
    },Promise.reject(new Error("웹도구 데이터 로딩을 시작합니다."))).catch(function(error){
      throw lastError || error || new Error("웹도구 데이터를 불러오지 못했습니다.");
    });
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
.hm-wt-app,.hm-wt-app *,.hm-wt-sheet,.hm-wt-sheet *{box-sizing:border-box}
.hm-wt-app,.hm-wt-sheet{--ink:#10233b;--muted:#607087;--line:#dfe7f0;--blue:#2563eb;--violet:#6d5dfc;color:var(--ink);font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",Arial,sans-serif;line-height:1.55}
.hm-wt-app button,.hm-wt-app input,.hm-wt-sheet button,.hm-wt-sheet input{font:inherit}
.hm-wt-app{width:100%;max-width:1500px;margin:0 auto;padding:6px 8px 100px}
.hm-wt-hero{position:relative;overflow:hidden;padding:46px 34px 38px;border:1px solid #dce7f3;border-radius:28px;background:radial-gradient(circle at 10% 0,rgba(109,93,252,.15),transparent 31%),radial-gradient(circle at 90% 7%,rgba(31,184,194,.13),transparent 30%),linear-gradient(135deg,#fbfdff,#f4f8ff 56%,#fbffff);box-shadow:0 20px 54px rgba(42,68,104,.10);text-align:center}
.hm-wt-eyebrow{display:inline-flex;align-items:center;gap:7px;min-height:32px;padding:0 12px;border:1px solid #d8dcff;border-radius:999px;background:rgba(255,255,255,.86);color:#5b50d4;font-size:11px;font-weight:950}
.hm-wt-eyebrow svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-hero h1{max-width:980px;margin:14px auto 0;color:#0f1d2e;font-size:clamp(38px,5.2vw,68px);font-weight:950;letter-spacing:-.06em;line-height:1.08}
.hm-wt-hero p{max-width:760px;margin:15px auto 0;color:#50627a;font-size:16px;font-weight:700;line-height:1.7}
.hm-wt-main-search{max-width:900px;margin:26px auto 0;position:relative}
.hm-wt-main-search svg{position:absolute;left:18px;top:50%;width:23px;height:23px;transform:translateY(-50%);fill:none;stroke:#65758b;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
.hm-wt-search-input{width:100%;height:64px;padding:0 54px;border:1px solid #ccdaea;border-radius:18px;background:#fff;color:#10233b;outline:none;font-size:16px;font-weight:760;box-shadow:0 12px 32px rgba(30,65,105,.10)}
.hm-wt-search-input:focus{border-color:#5f72ee;box-shadow:0 0 0 5px rgba(78,101,232,.12),0 14px 34px rgba(30,65,105,.12)}
.hm-wt-search-clear{position:absolute;right:10px;top:50%;height:42px;padding:0 13px;transform:translateY(-50%);border:0;border-radius:12px;background:#edf3f9;color:#607087;font-size:11px;font-weight:900;cursor:pointer}
.hm-wt-search-clear[hidden]{display:none!important}
.hm-wt-stats{margin-top:18px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.hm-wt-stat{min-height:32px;padding:0 11px;display:inline-flex;align-items:center;border:1px solid rgba(47,124,246,.15);border-radius:999px;background:rgba(255,255,255,.78);color:#315f98;font-size:10px;font-weight:900}
.hm-wt-section{margin-top:18px;padding:24px;border:1px solid var(--line);border-radius:22px;background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.055);scroll-margin-top:14px}
.hm-wt-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:15px}
.hm-wt-section-title h2{margin:0;color:#10233b;font-size:26px;font-weight:950;letter-spacing:-.045em}
.hm-wt-section-title p{margin:4px 0 0;color:var(--muted);font-size:12px;font-weight:700}
.hm-wt-slider-actions{display:flex;gap:6px}
.hm-wt-slider-btn{width:42px;height:42px;display:grid;place-items:center;border:1px solid #d6e0eb;border-radius:12px;background:#fff;color:#526279;cursor:pointer;box-shadow:0 5px 15px rgba(15,23,42,.04)}
.hm-wt-slider-btn:hover{color:#245fd4;border-color:#b8d0ef;background:#f7faff}
.hm-wt-slider-btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-carousel-viewport{overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;touch-action:pan-x pan-y;padding:2px 1px 9px}
.hm-wt-carousel-viewport::-webkit-scrollbar{display:none}
.hm-wt-carousel-track{display:flex;gap:13px;width:max-content}
.hm-wt-latest-card{width:clamp(240px,25vw,330px);min-height:178px;padding:20px;position:relative;overflow:hidden;scroll-snap-align:start;display:flex;flex-direction:column;border:1px solid var(--tone-line,#dcd7ff);border-radius:20px;background:linear-gradient(145deg,var(--tone-soft,#f1efff),var(--tone-soft2,#f8f7ff));color:var(--tone-ink,#6655d8);box-shadow:0 11px 26px rgba(30,51,81,.08);cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
.hm-wt-latest-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px rgba(30,51,81,.12)}
.hm-wt-latest-card::after{content:"";position:absolute;right:-24px;bottom:-32px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.38);pointer-events:none}
.hm-wt-latest-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.hm-wt-latest-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:rgba(255,255,255,.72);box-shadow:inset 0 0 0 1px rgba(255,255,255,.85)}
.hm-wt-latest-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-new-badge{min-height:25px;padding:0 9px;display:inline-flex;align-items:center;border-radius:999px;background:rgba(255,255,255,.74);font-size:9px;font-weight:950}
.hm-wt-latest-card h3{margin:14px 0 0;color:#14243a;font-size:18px;font-weight:950;letter-spacing:-.035em}
.hm-wt-latest-card p{margin:6px 0 0;display:-webkit-box;overflow:hidden;color:#52647c;font-size:11px;font-weight:700;line-height:1.55;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.hm-wt-latest-meta{margin-top:auto;padding-top:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;color:#52647c;font-size:9px;font-weight:850}
.hm-wt-category-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.hm-wt-category-card{min-width:0;min-height:145px;padding:18px;display:flex;flex-direction:column;align-items:flex-start;border:1px solid var(--tone-line,#dcd7ff);border-radius:18px;background:linear-gradient(145deg,var(--tone-soft2,#fff),#fff);color:var(--tone-ink,#6655d8);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.hm-wt-category-card:hover,.hm-wt-category-card.is-active{transform:translateY(-2px);box-shadow:0 12px 28px rgba(30,51,81,.09)}
.hm-wt-category-card.is-active{outline:3px solid color-mix(in srgb,var(--tone-ink,#6655d8) 14%,transparent)}
.hm-wt-category-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--tone-soft,#f1efff)}
.hm-wt-category-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-category-card strong{margin-top:12px;color:#16283e;font-size:17px;font-weight:950}
.hm-wt-category-card span{margin-top:3px;color:#64748b;font-size:10px;font-weight:700;line-height:1.5}
.hm-wt-category-card b{margin-top:auto;padding-top:9px;font-size:10px;font-weight:900}
.hm-wt-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.hm-wt-result-title{font-size:25px;font-weight:950;letter-spacing:-.045em}
.hm-wt-result-side{display:flex;align-items:center;gap:7px}
.hm-wt-result-count{min-height:28px;padding:0 10px;display:inline-flex;align-items:center;border-radius:999px;background:#eef5ff;color:#2e68af;font-size:9px;font-weight:900}
.hm-wt-reset{min-height:34px;padding:0 11px;border:1px solid #d9e2ec;border-radius:10px;background:#fff;color:#526279;font-size:10px;font-weight:900;cursor:pointer}
.hm-wt-tools-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}
.hm-wt-tool-card{min-width:0;min-height:210px;padding:18px;display:flex;flex-direction:column;border:1px solid #dfe6ef;border-radius:18px;background:#fff;box-shadow:0 7px 22px rgba(15,23,42,.045);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.hm-wt-tool-card:hover{transform:translateY(-2px);border-color:#c9cdf9;box-shadow:0 14px 30px rgba(15,23,42,.085)}
.hm-wt-tool-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.hm-wt-tool-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--tone-soft,#f1efff);color:var(--tone-ink,#6655d8)}
.hm-wt-tool-icon svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-tool-chip{min-height:24px;padding:0 8px;display:inline-flex;align-items:center;border-radius:999px;background:var(--tone-soft,#f1efff);color:var(--tone-ink,#6655d8);font-size:8px;font-weight:900}
.hm-wt-tool-card h3{margin:13px 0 0;color:#14243a;font-size:16px;font-weight:950;letter-spacing:-.03em;line-height:1.35}
.hm-wt-tool-card p{margin:6px 0 0;display:-webkit-box;overflow:hidden;color:#65758a;font-size:10px;font-weight:700;line-height:1.55;-webkit-line-clamp:3;-webkit-box-orient:vertical}
.hm-wt-tool-meta{margin:10px 0 0;display:flex;gap:5px;flex-wrap:wrap}
.hm-wt-tool-meta span{min-height:22px;padding:0 7px;display:inline-flex;align-items:center;border-radius:999px;background:#f1f5f9;color:#526177;font-size:8px;font-weight:900}
.hm-wt-tool-button{width:100%;min-height:42px;margin-top:auto;padding:0 12px;display:flex;align-items:center;justify-content:center;gap:7px;border:0;border-radius:11px;background:linear-gradient(135deg,#6d5dfc,#2f7cf6);color:#fff;font-size:11px;font-weight:950;cursor:pointer;box-shadow:0 8px 18px rgba(83,88,235,.18)}
.hm-wt-tool-button.is-disabled{border:1px solid #e0e6ed;background:#f4f6f9;color:#8490a1;box-shadow:none}
.hm-wt-tool-button svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-empty{grid-column:1/-1;padding:42px 18px;border:1px dashed #cad7e5;border-radius:16px;background:#f8fafc;color:#64748b;font-size:13px;font-weight:800;text-align:center}
.hm-wt-sheet[hidden]{display:none!important}
.hm-wt-sheet{position:fixed;inset:0;z-index:2147483200;padding:14px;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.42);backdrop-filter:blur(6px)}
.hm-wt-sheet-panel{width:min(1080px,100%);max-height:min(84vh,860px);margin:0 auto 82px;overflow:auto;overscroll-behavior:contain;border:1px solid rgba(203,213,225,.95);border-radius:24px;background:#fff;box-shadow:0 26px 80px rgba(15,23,42,.28)}
.hm-wt-sheet-head{position:sticky;top:0;z-index:4;min-height:74px;padding:14px 17px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #e2e8f0;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}
.hm-wt-sheet-head h2{margin:0;font-size:21px;font-weight:950;letter-spacing:-.035em}.hm-wt-sheet-head p{margin:3px 0 0;color:#64748b;font-size:10px;font-weight:700}
.hm-wt-sheet-close{width:42px;height:42px;flex:none;display:grid;place-items:center;border:1px solid #dbe4ee;border-radius:12px;background:#fff;color:#475569;cursor:pointer}.hm-wt-sheet-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hm-wt-sheet-body{padding:17px}.hm-wt-sheet-search{position:relative}.hm-wt-sheet-search>svg{position:absolute;left:15px;top:50%;width:20px;height:20px;transform:translateY(-50%);fill:none;stroke:#64748b;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.hm-wt-sheet-search input{width:100%;height:52px;padding:0 45px;border:1px solid #d7e1ec;border-radius:14px;outline:none;font-size:13px;font-weight:760}.hm-wt-sheet-search input:focus{border-color:#5f72ee;box-shadow:0 0 0 4px rgba(78,101,232,.11)}
.hm-wt-chip-row{margin-top:11px;display:flex;gap:7px;overflow-x:auto;padding:2px 1px 6px;scrollbar-width:thin}.hm-wt-chip{min-height:37px;padding:0 11px;flex:none;border:1px solid #dbe4ee;border-radius:999px;background:#fff;color:#526279;font-size:10px;font-weight:900;white-space:nowrap;cursor:pointer}.hm-wt-chip.is-active{border-color:transparent;background:linear-gradient(135deg,#6d5dfc,#2f7cf6);color:#fff}.hm-wt-sheet-grid{margin-top:13px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.hm-wt-sheet-item{min-width:0;padding:13px;border:1px solid #e0e7ef;border-radius:13px;background:#fff;cursor:pointer}.hm-wt-sheet-item:hover{border-color:#c7cdf7;background:#fbfcff}.hm-wt-sheet-item strong{display:block;overflow:hidden;color:#17283d;font-size:12px;font-weight:950;text-overflow:ellipsis;white-space:nowrap}.hm-wt-sheet-item span{display:block;margin-top:3px;color:#718096;font-size:9px;font-weight:700}.hm-wt-sheet-item em{display:inline-flex;margin-top:8px;padding:3px 7px;border-radius:999px;background:#eef5ff;color:#2e68af;font-size:8px;font-style:normal;font-weight:900}
.hm-wt-toast{max-width:min(430px,calc(100% - 24px));min-height:44px;padding:11px 15px;position:fixed;left:50%;bottom:96px;z-index:2147483600;transform:translate(-50%,18px);border:1px solid rgba(203,213,225,.96);border-radius:13px;background:rgba(15,23,42,.94);color:#fff;font-size:11px;font-weight:850;text-align:center;box-shadow:0 14px 40px rgba(15,23,42,.24);opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}.hm-wt-toast.is-visible{transform:translate(-50%,0);opacity:1}
@media(max-width:1120px){.hm-wt-category-grid,.hm-wt-tools-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.hm-wt-app{padding:2px 2px 94px}.hm-wt-hero{padding:27px 10px 24px;border-radius:18px}.hm-wt-hero h1{font-size:34px}.hm-wt-hero p{padding:0 5px;font-size:12px;line-height:1.65}.hm-wt-main-search{margin-top:19px}.hm-wt-search-input{height:55px;padding-left:47px;font-size:13px;border-radius:15px}.hm-wt-main-search svg{left:15px;width:20px;height:20px}.hm-wt-stats{gap:5px}.hm-wt-stat{min-height:28px;padding:0 8px;font-size:8px}.hm-wt-section{margin-top:11px;padding:15px 9px;border-radius:17px}.hm-wt-section-title h2{font-size:21px}.hm-wt-section-title p{font-size:9px}.hm-wt-slider-btn{width:36px;height:36px}.hm-wt-latest-card{width:79vw;max-width:310px;min-height:164px;padding:16px;border-radius:17px}.hm-wt-category-grid,.hm-wt-tools-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.hm-wt-category-card{min-height:128px;padding:13px 10px;border-radius:14px}.hm-wt-category-icon,.hm-wt-tool-icon{width:42px;height:42px}.hm-wt-category-card strong{font-size:14px}.hm-wt-category-card span{font-size:8px}.hm-wt-result-title{font-size:20px}.hm-wt-tool-card{min-height:194px;padding:13px 10px;border-radius:14px}.hm-wt-tool-card h3{font-size:13px}.hm-wt-tool-card p{font-size:8px}.hm-wt-sheet{padding:8px 5px calc(8px + env(safe-area-inset-bottom))}.hm-wt-sheet-panel{max-height:78vh;margin-bottom:78px;border-radius:20px}.hm-wt-sheet-head{min-height:65px;padding:10px 11px}.hm-wt-sheet-head h2{font-size:17px}.hm-wt-sheet-body{padding:10px 7px 15px}.hm-wt-sheet-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}}
@media(max-width:390px){.hm-wt-category-grid,.hm-wt-tools-grid{grid-template-columns:1fr}.hm-wt-tool-card{min-height:180px}.hm-wt-sheet-grid{grid-template-columns:1fr}}
`;
    document.head.appendChild(style);
  }

  function applyTone(node, category) {
    var tone = TONES[(category && category.tone) || "violet"] || TONES.violet;
    node.style.setProperty("--tone-soft",tone.soft);
    node.style.setProperty("--tone-soft2",tone.soft2);
    node.style.setProperty("--tone-ink",tone.ink);
    node.style.setProperty("--tone-line",tone.line);
  }

  function createLatestCard(tool, category, data) {
    var card = el("article","hm-wt-latest-card");
    card.tabIndex = 0;
    card.setAttribute("role","button");
    applyTone(card,category);
    var top = el("div","hm-wt-latest-top");
    var icon = el("div","hm-wt-latest-icon"); icon.appendChild(svg(tool.icon || (category && category.icon) || "image"));
    var badge = el("span","hm-wt-new-badge","NEW");
    top.append(icon,badge);
    var title = el("h3","",tool.name);
    var desc = el("p","",tool.description);
    var meta = el("div","hm-wt-latest-meta");
    meta.append(el("span","",category ? category.name : "웹도구"),el("span","",formatDate(tool.updatedAt)));
    card.append(top,title,desc,meta);
    card.addEventListener("click",function(){ openTool(tool,data); });
    card.addEventListener("keydown",function(event){ if(event.key === "Enter" || event.key === " "){ event.preventDefault(); openTool(tool,data); } });
    return card;
  }

  function createToolCard(tool, category, data) {
    var card = el("article","hm-wt-tool-card"); applyTone(card,category);
    var top = el("div","hm-wt-tool-top");
    var icon = el("div","hm-wt-tool-icon"); icon.appendChild(svg(tool.icon || (category && category.icon) || "image"));
    var chip = el("span","hm-wt-tool-chip",category ? category.name : "웹도구");
    top.append(icon,chip);
    var title = el("h3","",tool.name);
    var desc = el("p","",tool.description);
    var meta = el("div","hm-wt-tool-meta");
    if (tool.collectionCount) meta.appendChild(el("span","",Number(tool.collectionCount).toLocaleString("ko-KR")+"개 모음"));
    if (tool.updatedAt) meta.appendChild(el("span","",formatDate(tool.updatedAt)+" 업데이트"));
    var button = el("button","hm-wt-tool-button"+(tool.available?"":" is-disabled"),tool.available?"바로 사용":"링크 등록 필요");
    button.type = "button";
    if (tool.available) button.appendChild(svg("external"));
    button.addEventListener("click",function(){ openTool(tool,data); });
    card.append(top,title,desc,meta,button);
    return card;
  }

  function createSheetItem(tool, category, data) {
    var item = el("button","hm-wt-sheet-item"); item.type="button";
    item.append(el("strong","",tool.name),el("span","",tool.description),el("em","",category?category.name:"웹도구"));
    item.addEventListener("click",function(){ openTool(tool,data); });
    return item;
  }

  function setupCarousel(viewport, track, previous, next, data) {
    var interval = Math.max(2500,Number(data.settings.autoplayInterval)||3600);
    var timer = 0;
    var paused = false;
    function distance(){ var first=track.firstElementChild; if(!first) return 280; var gap=parseFloat(window.getComputedStyle(track).gap)||13; return first.getBoundingClientRect().width+gap; }
    function move(direction){
      var max = viewport.scrollWidth-viewport.clientWidth;
      if(direction>0 && viewport.scrollLeft >= max-distance()*0.6) viewport.scrollTo({left:0,behavior:"smooth"});
      else if(direction<0 && viewport.scrollLeft <= distance()*0.4) viewport.scrollTo({left:max,behavior:"smooth"});
      else viewport.scrollBy({left:distance()*direction,behavior:"smooth"});
    }
    function stop(){ if(timer) window.clearInterval(timer); timer=0; }
    function start(){ stop(); if(!paused && track.children.length>1) timer=window.setInterval(function(){move(1);},interval); }
    previous.addEventListener("click",function(){ stop();move(-1);window.setTimeout(start,interval); });
    next.addEventListener("click",function(){ stop();move(1);window.setTimeout(start,interval); });
    viewport.addEventListener("pointerenter",function(){paused=true;stop();});
    viewport.addEventListener("pointerleave",function(){paused=false;start();});
    viewport.addEventListener("touchstart",function(){paused=true;stop();},{passive:true});
    viewport.addEventListener("touchend",function(){paused=false;window.setTimeout(start,interval);},{passive:true});
    document.addEventListener("visibilitychange",function(){ if(document.hidden) stop(); else start(); });
    start();
    return {next:function(){move(1);},previous:function(){move(-1);},start:start,stop:stop};
  }

  function createPage(stage,data) {
    stage.replaceChildren();
    var app = el("div","hm-wt-app");
    var categories = data.categories.slice().sort(function(a,b){return (a.order||0)-(b.order||0);});
    var categoryMap = getCategoryMap(data);
    var tools = sortedTools(data);
    var state = {query:"",category:"all"};

    var hero = el("section","hm-wt-hero");
    var eyebrow = el("span","hm-wt-eyebrow","HEALINGMART WEB TOOLS"); eyebrow.prepend(svg("spark"));
    var title = el("h1","",data.site.title);
    var desc = el("p","",data.site.description);
    var searchWrap = el("div","hm-wt-main-search");
    var searchInput = el("input","hm-wt-search-input"); searchInput.type="search";searchInput.autocomplete="off";searchInput.placeholder=data.settings.searchPlaceholder;searchInput.setAttribute("aria-label",data.settings.searchPlaceholder);
    var clear = el("button","hm-wt-search-clear","지우기");clear.type="button";clear.hidden=true;
    searchWrap.append(svg("search"),searchInput,clear);
    var stats = el("div","hm-wt-stats");
    var totalCollections = tools.reduce(function(sum,tool){return sum+(Number(tool.collectionCount)||0);},0);
    stats.append(el("span","hm-wt-stat",categories.length+"개 분야"),el("span","hm-wt-stat",tools.length+"개 대표 도구"),el("span","hm-wt-stat",totalCollections.toLocaleString("ko-KR")+"개 세부 기능"));
    hero.append(eyebrow,title,desc,searchWrap,stats);

    var latestSection = el("section","hm-wt-section"); latestSection.id="hm-webtools-latest";
    var latestHead=el("div","hm-wt-section-head"),latestCopy=el("div","hm-wt-section-title"),latestActions=el("div","hm-wt-slider-actions");
    latestCopy.append(el("h2","","새로 나온 웹도구"),el("p","","자동으로 이동하며 마우스와 손가락으로도 넘길 수 있습니다."));
    var prev=el("button","hm-wt-slider-btn"),next=el("button","hm-wt-slider-btn");prev.type=next.type="button";prev.setAttribute("aria-label","이전 신규 도구");next.setAttribute("aria-label","다음 신규 도구");prev.append(svg("arrowLeft"));next.append(svg("arrowRight"));latestActions.append(prev,next);latestHead.append(latestCopy,latestActions);
    var viewport=el("div","hm-wt-carousel-viewport"),track=el("div","hm-wt-carousel-track");viewport.appendChild(track);latestTools(data,tools).forEach(function(tool){track.appendChild(createLatestCard(tool,categoryMap.get(tool.category),data));});latestSection.append(latestHead,viewport);

    var categorySection=el("section","hm-wt-section");categorySection.id="hm-webtools-categories";
    var categoryHead=el("div","hm-wt-section-head"),categoryCopy=el("div","hm-wt-section-title");categoryCopy.append(el("h2","","분야별 웹도구"),el("p","","이미지, 영상, 글쓰기, 생활 등 필요한 분야를 선택하세요."));categoryHead.appendChild(categoryCopy);
    var categoryGrid=el("div","hm-wt-category-grid");categorySection.append(categoryHead,categoryGrid);

    var resultSection=el("section","hm-wt-section");resultSection.id="hm-webtools-results";
    var resultHead=el("div","hm-wt-result-head"),resultTitle=el("div","hm-wt-result-title","전체 웹도구"),resultSide=el("div","hm-wt-result-side"),resultCount=el("span","hm-wt-result-count"),reset=el("button","hm-wt-reset","전체 보기");reset.type="button";resultSide.append(resultCount,reset);resultHead.append(resultTitle,resultSide);
    var grid=el("div","hm-wt-tools-grid");resultSection.append(resultHead,grid);

    function categoryCount(id){return tools.filter(function(tool){return tool.category===id;}).length;}
    function renderCategories(){
      categoryGrid.replaceChildren();
      categories.forEach(function(category){
        var card=el("button","hm-wt-category-card"+(state.category===category.id?" is-active":""));card.type="button";applyTone(card,category);
        var icon=el("div","hm-wt-category-icon");icon.appendChild(svg(category.icon||"image"));
        card.append(icon,el("strong","",category.name),el("span","",category.description),el("b","",categoryCount(category.id)+"개 대표 도구"));
        card.addEventListener("click",function(){state.category=state.category===category.id?"all":category.id;render();resultSection.scrollIntoView({behavior:"smooth",block:"start"});});
        categoryGrid.appendChild(card);
      });
    }
    function filtered(){
      var q=normalize(state.query);
      return tools.filter(function(tool){
        if(state.category!=="all" && tool.category!==state.category) return false;
        if(!q) return true;
        var category=categoryMap.get(tool.category);
        return normalize([tool.name,tool.shortName,tool.description,(tool.keywords||[]).join(" "),category?category.name:""].join(" ")).includes(q);
      });
    }
    function render(){
      renderCategories();
      var list=filtered();grid.replaceChildren();
      var category=categoryMap.get(state.category);
      resultTitle.textContent=state.query?"검색 결과":(category?category.name+" 도구":"전체 웹도구");
      resultCount.textContent=list.length.toLocaleString("ko-KR")+"개";
      if(!list.length) grid.appendChild(el("div","hm-wt-empty",data.settings.emptyMessage));
      else list.forEach(function(tool){grid.appendChild(createToolCard(tool,categoryMap.get(tool.category),data));});
    }
    searchInput.addEventListener("input",function(){state.query=searchInput.value;clear.hidden=!state.query;render();});
    searchInput.addEventListener("keydown",function(event){if(event.key==="Enter"){event.preventDefault();resultSection.scrollIntoView({behavior:"smooth",block:"start"});}});
    clear.addEventListener("click",function(){searchInput.value="";state.query="";clear.hidden=true;render();searchInput.focus();});
    reset.addEventListener("click",function(){state.category="all";state.query="";searchInput.value="";clear.hidden=true;render();});

    app.append(hero,latestSection,categorySection,resultSection);stage.appendChild(app);render();
    var carousel=setupCarousel(viewport,track,prev,next,data);
    return {app:app,searchInput:searchInput,latestSection:latestSection,categorySection:categorySection,resultSection:resultSection,carousel:carousel,focusSearch:function(){searchInput.focus();},selectCategory:function(id){state.category=id||"all";render();}};
  }

  function createSearchSheet(data) {
    var old=document.getElementById(SEARCH_SHEET_ID);if(old)old.remove();
    var sheet=el("div","hm-wt-sheet");sheet.id=SEARCH_SHEET_ID;sheet.hidden=true;
    var panel=el("section","hm-wt-sheet-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");
    var head=el("header","hm-wt-sheet-head"),copy=el("div",""),title=el("h2","","웹도구 빠른찾기"),desc=el("p","","도구 이름이나 기능을 검색하세요."),close=el("button","hm-wt-sheet-close");close.type="button";close.setAttribute("aria-label","빠른찾기 닫기");close.appendChild(svg("close"));copy.append(title,desc);head.append(copy,close);
    var body=el("div","hm-wt-sheet-body"),search=el("div","hm-wt-sheet-search"),input=el("input","");input.type="search";input.placeholder=data.settings.searchPlaceholder;input.autocomplete="off";search.append(svg("search"),input);
    var chips=el("div","hm-wt-chip-row"),grid=el("div","hm-wt-sheet-grid");body.append(search,chips,grid);panel.append(head,body);sheet.appendChild(panel);document.body.appendChild(sheet);
    var tools=sortedTools(data),map=getCategoryMap(data),state={category:"all",query:""};
    function render(){
      chips.replaceChildren();
      [{id:"all",name:"전체"}].concat(data.categories).forEach(function(category){var button=el("button","hm-wt-chip"+(state.category===category.id?" is-active":""),category.name);button.type="button";button.addEventListener("click",function(){state.category=category.id;render();});chips.appendChild(button);});
      var q=normalize(state.query),list=tools.filter(function(tool){if(state.category!=="all"&&tool.category!==state.category)return false;if(!q)return true;var c=map.get(tool.category);return normalize([tool.name,tool.description,(tool.keywords||[]).join(" "),c?c.name:""].join(" ")).includes(q);});
      grid.replaceChildren();if(!list.length)grid.appendChild(el("div","hm-wt-empty",data.settings.emptyMessage));else list.forEach(function(tool){grid.appendChild(createSheetItem(tool,map.get(tool.category),data));});
    }
    input.addEventListener("input",function(){state.query=input.value;render();});
    function open(){bodyOverflow=document.body.style.overflow;document.body.style.overflow="hidden";sheet.hidden=false;window.setTimeout(function(){input.focus();},80);}
    function closeSheet(){sheet.hidden=true;document.body.style.overflow=bodyOverflow;}
    close.addEventListener("click",closeSheet);sheet.addEventListener("click",function(event){if(event.target===sheet)closeSheet();});document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!sheet.hidden)closeSheet();});render();
    return {open:open,close:closeSheet};
  }

  function createRecentSheet(data) {
    var old=document.getElementById(RECENT_SHEET_ID);if(old)old.remove();
    var sheet=el("div","hm-wt-sheet");sheet.id=RECENT_SHEET_ID;sheet.hidden=true;
    var panel=el("section","hm-wt-sheet-panel");panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");
    var head=el("header","hm-wt-sheet-head"),copy=el("div",""),title=el("h2","","최근 사용한 웹도구"),desc=el("p","","이 브라우저에서 최근 열어본 도구를 보여줍니다."),close=el("button","hm-wt-sheet-close");close.type="button";close.setAttribute("aria-label","최근사용 닫기");close.appendChild(svg("close"));copy.append(title,desc);head.append(copy,close);
    var body=el("div","hm-wt-sheet-body"),grid=el("div","hm-wt-sheet-grid");body.appendChild(grid);panel.append(head,body);sheet.appendChild(panel);document.body.appendChild(sheet);
    var tools=sortedTools(data),map=getCategoryMap(data);
    function render(){var ids=safeStorageGet(RECENT_KEY,[]),lookup=new Map(tools.map(function(tool){return[tool.id,tool];})),list=ids.map(function(id){return lookup.get(id);}).filter(Boolean);grid.replaceChildren();if(!list.length)grid.appendChild(el("div","hm-wt-empty","아직 사용한 웹도구가 없습니다."));else list.forEach(function(tool){grid.appendChild(createSheetItem(tool,map.get(tool.category),data));});}
    function open(){render();bodyOverflow=document.body.style.overflow;document.body.style.overflow="hidden";sheet.hidden=false;}
    function closeSheet(){sheet.hidden=true;document.body.style.overflow=bodyOverflow;}
    close.addEventListener("click",closeSheet);sheet.addEventListener("click",function(event){if(event.target===sheet)closeSheet();});document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!sheet.hidden)closeSheet();});
    return {open:open,close:closeSheet,render:render};
  }

  function bindNavigation(data) {
    document.addEventListener("click",function(event){
      var openSearch=event.target.closest("[data-hm-webtools-open]");
      if(openSearch){event.preventDefault();searchSheetController.open();return;}
      var nav=event.target.closest("[data-hm-webtools-nav]");if(!nav)return;
      event.preventDefault();var action=nav.dataset.hmWebtoolsNav;
      if(action==="search")searchSheetController.open();
      else if(action==="recent")recentSheetController.open();
      else if(action==="latest"&&pageController)pageController.latestSection.scrollIntoView({behavior:"smooth",block:"start"});
      else if(action==="categories"&&pageController)pageController.categorySection.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }

  function setupBottomNavigationBoundary() {
    var nav = document.querySelector(".hm-webtools-bottom-nav");
    var app = document.querySelector("[data-hm-webtools-app]");
    var boundary = document.querySelector("[data-hm-webtools-bottom-boundary]");
    if (!nav || !app || !boundary) return null;

    var scheduled = false;

    function update() {
      scheduled = false;
      var appRect = app.getBoundingClientRect();
      var boundaryRect = boundary.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      var appHasEntered = appRect.top < viewportHeight - 24;
      var appHasNotEnded = boundaryRect.top > viewportHeight + 8;
      var visible = appHasEntered && appHasNotEnded;

      nav.classList.toggle("hm-bottom-nav-outside", !visible);
      nav.setAttribute("aria-hidden", visible ? "false" : "true");
    }

    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", scheduleUpdate, {passive:true});
    window.addEventListener("resize", scheduleUpdate, {passive:true});

    if (window.ResizeObserver) {
      var observer = new ResizeObserver(scheduleUpdate);
      observer.observe(app);
      observer.observe(boundary);
    }

    update();
    return {update:update};
  }

  function showLoadError(error) {
    document.querySelectorAll(PAGE_SELECTORS).forEach(function(stage){stage.replaceChildren();var box=el("div","");box.style.cssText="max-width:780px;min-height:260px;margin:30px auto;padding:30px 20px;display:grid;place-items:center;border:1px solid #fecaca;border-radius:18px;color:#7f1d1d;background:#fff7f7;text-align:center;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";var inner=el("div","");var strong=el("strong","","웹도구를 불러오지 못했습니다.");strong.style.cssText="display:block;margin-bottom:8px;font-size:20px";var span=el("span","",error&&error.message?error.message:"GitHub Pages 파일 경로를 확인해 주세요.");span.style.cssText="font-size:13px;line-height:1.7";inner.append(strong,span);box.appendChild(inner);stage.appendChild(box);});
  }

  function initialize(data) {
    injectStyles();
    var stages=document.querySelectorAll(PAGE_SELECTORS);
    stages.forEach(function(stage,index){
      var controller=createPage(stage,data);
      if(index===0)pageController=controller;
      var host=stage.closest("[data-hm-webtools-app]");
      if(host)host.setAttribute("data-hm-webtools-mounted","true");
    });
    searchSheetController=createSearchSheet(data);
    recentSheetController=createRecentSheet(data);
    bindNavigation(data);
    var bottomNavigationController=setupBottomNavigationBoundary();
    window.HMWebTools=Object.freeze({
      version:VERSION,
      data:data,
      openSearch:searchSheetController.open,
      openRecent:recentSheetController.open,
      scrollLatest:function(){if(pageController)pageController.latestSection.scrollIntoView({behavior:"smooth"});},
      scrollCategories:function(){if(pageController)pageController.categorySection.scrollIntoView({behavior:"smooth"});},
      refreshBottomNavigation:function(){if(bottomNavigationController)bottomNavigationController.update();}
    });
    document.dispatchEvent(new CustomEvent("hm:webtools:ready",{detail:{version:VERSION}}));
  }

  function start(){loadData().then(initialize).catch(function(error){console.error("[HealingMart Webtools]",error);showLoadError(error);});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})(window,document);
