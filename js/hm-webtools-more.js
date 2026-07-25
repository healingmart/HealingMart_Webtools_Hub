/*
 * HealingMart Webtools More v1.6.0
 * Robust bottom-sheet launcher for Blogger and calculator tools.
 */
(function(window, document){
  "use strict";

  var VERSION="1.6.0";
  var DATA_URLS=[
    "https://healingmart.github.io/healingmart-webtools-hub/data/hm-webtools-data.js?v=5.6.0",
    "https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js?v=5.6.0"
  ];
  var HUB_URL="https://www.healing-mart.com/search/label/%EC%9B%B9%EB%8F%84%EA%B5%AC";
  var STYLE_ID="hmWebtoolsMoreStyle";
  var loadingPromise=null;
  var activeOverlay=null;

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=String(text);
    return node;
  }

  function svg(name){
    var ns="http://www.w3.org/2000/svg";
    var node=document.createElementNS(ns,"svg");
    node.setAttribute("viewBox","0 0 24 24");
    node.setAttribute("aria-hidden","true");

    function add(tag,attrs){
      var child=document.createElementNS(ns,tag);
      Object.keys(attrs).forEach(function(key){child.setAttribute(key,attrs[key]);});
      node.appendChild(child);
    }

    var icons={
      close:function(){add("path",{d:"M6 6l12 12"});add("path",{d:"M18 6 6 18"});},
      arrow:function(){add("path",{d:"M9 6l6 6-6 6"});},
      image:function(){add("rect",{x:"4",y:"5",width:"16",height:"14",rx:"2"});add("circle",{cx:"9",cy:"10",r:"1.5"});add("path",{d:"m6 17 4-4 3 3 2-2 3 3"});},
      video:function(){add("rect",{x:"3",y:"6",width:"13",height:"12",rx:"2"});add("path",{d:"m16 10 5-3v10l-5-3"});},
      writing:function(){add("path",{d:"M4 20h4l10-10-4-4L4 16v4Z"});add("path",{d:"m12.5 7.5 4 4"});},
      life:function(){add("circle",{cx:"12",cy:"12",r:"8"});add("path",{d:"M12 8v8M8 12h8"});},
      document:function(){add("path",{d:"M6 3h8l4 4v14H6z"});add("path",{d:"M14 3v5h5M9 13h6M9 17h6"});},
      audio:function(){add("path",{d:"M9 18V6l9-2v12"});add("circle",{cx:"6",cy:"18",r:"3"});add("circle",{cx:"15",cy:"16",r:"3"});},
      data:function(){add("ellipse",{cx:"12",cy:"6",rx:"7",ry:"3"});add("path",{d:"M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"});add("path",{d:"M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"});},
      developer:function(){add("path",{d:"m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"});},
      calculator:function(){add("rect",{x:"5",y:"3",width:"14",height:"18",rx:"2"});add("path",{d:"M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"});},
      convert:function(){add("path",{d:"M7 7h12l-3-3M17 17H5l3 3"});add("path",{d:"m19 7-3 3M5 17l3-3"});},
      rename:function(){add("path",{d:"M4 18 10 6l6 12M6 14h8"});add("path",{d:"M17 7h3M18.5 5.5v3"});},
      watermark:function(){add("path",{d:"M4 7l3 10 5-7 5 7 3-10"});},
      crop:function(){add("path",{d:"M7 3v14a2 2 0 0 0 2 2h12M3 7h14a2 2 0 0 1 2 2v12"});},
      cutout:function(){add("circle",{cx:"6",cy:"7",r:"2"});add("circle",{cx:"6",cy:"17",r:"2"});add("path",{d:"m8 8 10 8M8 16 18 8"});},
      pin:function(){add("path",{d:"M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"});add("circle",{cx:"12",cy:"10",r:"2"});}
    };

    (icons[name]||icons.document)();
    return node;
  }

  function injectStyle(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=
      ".hm-more-overlay,.hm-more-overlay *{box-sizing:border-box}"+
      ".hm-more-overlay{position:fixed;inset:0;z-index:2147483500;padding:12px;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.42);backdrop-filter:blur(5px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}"+
      ".hm-more-panel{width:min(760px,100%);max-height:min(74vh,680px);margin:0 auto 78px;overflow:auto;border:1px solid #d8e0e9;border-radius:22px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.28)}"+
      ".hm-more-head{position:sticky;top:0;z-index:2;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #e5eaf0;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}"+
      ".hm-more-head h2{margin:0;color:#172238;font-size:18px;font-weight:900;letter-spacing:-.035em}"+
      ".hm-more-head p{margin:3px 0 0;color:#718095;font-size:10px;font-weight:700}"+
      ".hm-more-close{width:38px;height:38px;display:grid;place-items:center;border:1px solid #dce4ec;border-radius:11px;background:#fff;color:#536174;cursor:pointer}"+
      ".hm-more-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"+
      ".hm-more-body{padding:12px}"+
      ".hm-more-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}"+
      ".hm-more-card{min-width:0;min-height:68px;padding:10px 11px;display:grid;grid-template-columns:38px minmax(0,1fr) 26px;align-items:center;gap:9px;border:1px solid #e1e7ee;border-radius:13px;background:#fff;color:#172238;text-align:left;cursor:pointer}"+
      ".hm-more-card:hover{border-color:#bdc9d5;background:#fbfcfe}"+
      ".hm-more-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:#f0f2f4;color:#606a76}"+
      ".hm-more-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}"+
      ".hm-more-card strong{display:block;overflow:hidden;font-size:12px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-card span{display:block;margin-top:2px;overflow:hidden;color:#7a8798;font-size:8px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-arrow{width:24px;height:24px;display:grid!important;place-items:center;margin:0!important;color:#718095!important}"+
      ".hm-more-arrow svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"+
      ".hm-more-footer{padding:2px 12px 13px}"+
      ".hm-more-all{width:100%;min-height:43px;border:1px solid #dfe4ea;border-radius:12px;background:#f4f5f7;color:#4f5967;font-size:11px;font-weight:900;cursor:pointer}"+
      ".hm-more-status{grid-column:1/-1;padding:28px 12px;color:#718095;font-size:12px;font-weight:800;line-height:1.7;text-align:center}"+
      ".hm-more-status strong{display:block;margin-bottom:5px;color:#334155;font-size:14px}"+
      "@media(max-width:560px){.hm-more-overlay{padding:7px 5px calc(7px + env(safe-area-inset-bottom))}.hm-more-panel{max-height:78vh;margin-bottom:76px;border-radius:19px}.hm-more-grid{grid-template-columns:1fr}}";
    document.head.appendChild(style);
  }

  function loadScript(url){
    return new Promise(function(resolve,reject){
      var script=document.createElement("script");
      script.src=url;
      script.async=true;
      script.onload=function(){resolve(script);};
      script.onerror=function(){script.remove();reject(new Error("data load failed: "+url));};
      document.head.appendChild(script);
    });
  }

  function loadData(){
    if(window.HM_WEBTOOLS_DATA)return Promise.resolve(window.HM_WEBTOOLS_DATA);
    if(loadingPromise)return loadingPromise;

    loadingPromise=DATA_URLS.reduce(function(promise,url){
      return promise.catch(function(){
        return loadScript(url).then(function(){
          if(!window.HM_WEBTOOLS_DATA)throw new Error("HM_WEBTOOLS_DATA not registered");
          return window.HM_WEBTOOLS_DATA;
        });
      });
    },Promise.reject(new Error("start")));

    return loadingPromise.catch(function(error){
      loadingPromise=null;
      throw error;
    });
  }

  function closeActive(){
    if(activeOverlay && typeof activeOverlay.__hmRemove==="function")activeOverlay.__hmRemove();
  }

  function createSheet(category){
    injectStyle();
    closeActive();

    var overlay=el("div","hm-more-overlay");
    var panel=el("section","hm-more-panel");
    var head=el("header","hm-more-head");
    var copy=el("div");
    var title=el("h2","",category && category!=="all" ? "관련 웹도구 바로가기" : "웹도구 바로가기");
    var description=el("p","",category && category!=="all" ? "같은 분야의 연결된 도구를 모았습니다." : "힐링편의점의 다른 웹도구를 바로 열 수 있습니다.");
    var close=el("button","hm-more-close");
    var body=el("div","hm-more-body");
    var grid=el("div","hm-more-grid");
    var footer=el("div","hm-more-footer");
    var all=el("button","hm-more-all","전체 웹도구 보기");

    close.type="button";
    close.setAttribute("aria-label","웹도구 바로가기 닫기");
    close.appendChild(svg("close"));
    all.type="button";
    all.addEventListener("click",function(){window.location.href=HUB_URL;});

    copy.append(title,description);
    head.append(copy,close);
    grid.appendChild(el("div","hm-more-status","웹도구를 불러오는 중입니다."));
    footer.appendChild(all);
    body.appendChild(grid);
    panel.append(head,body,footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    activeOverlay=overlay;

    var oldOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";

    function remove(){
      document.body.style.overflow=oldOverflow;
      if(overlay.parentNode)overlay.remove();
      if(activeOverlay===overlay)activeOverlay=null;
      document.removeEventListener("keydown",escape);
    }
    function escape(event){if(event.key==="Escape")remove();}

    overlay.__hmRemove=remove;
    close.addEventListener("click",remove);
    overlay.addEventListener("click",function(event){if(event.target===overlay)remove();});
    document.addEventListener("keydown",escape);

    return {overlay:overlay,grid:grid};
  }

  function renderTools(grid,data,category,currentTool){
    while(grid.firstChild)grid.removeChild(grid.firstChild);

    var tools=(data.tools||[]).filter(function(tool){
      return tool.available && tool.url &&
        (!category || category==="all" || tool.category===category) &&
        (!currentTool || tool.id!==currentTool);
    }).sort(function(a,b){
      return (Number(a.order)||9999)-(Number(b.order)||9999);
    }).slice(0,8);

    if(!tools.length){
      var empty=el("div","hm-more-status");
      empty.appendChild(el("strong","","연결된 웹도구가 없습니다."));
      empty.appendChild(el("span","","data/hm-webtools-data.js의 URL과 공개 상태를 확인해 주세요."));
      grid.appendChild(empty);
      return;
    }

    tools.forEach(function(tool){
      var card=el("button","hm-more-card");
      var icon=el("div","hm-more-icon");
      var text=el("div");
      var arrow=el("span","hm-more-arrow");
      card.type="button";
      card.setAttribute("aria-label",tool.name+" 열기");
      icon.appendChild(svg(tool.icon||"document"));
      arrow.appendChild(svg("arrow"));
      text.append(el("strong","",tool.name),el("span","",tool.description||""));
      card.append(icon,text,arrow);
      card.addEventListener("click",function(){window.location.href=tool.url;});
      grid.appendChild(card);
    });
  }

  function renderError(grid,error){
    while(grid.firstChild)grid.removeChild(grid.firstChild);
    var status=el("div","hm-more-status");
    status.appendChild(el("strong","","웹도구 데이터를 불러오지 못했습니다."));
    status.appendChild(el("span","","GitHub Pages의 data/hm-webtools-data.js 경로와 배포 상태를 확인해 주세요."));
    grid.appendChild(status);
    console.error("[HealingMart Webtools More]",error);
  }

  function open(category,currentTool){
    var sheet=createSheet(category);
    loadData().then(function(data){
      if(!sheet.overlay.parentNode)return;
      renderTools(sheet.grid,data,category,currentTool);
    }).catch(function(error){
      if(!sheet.overlay.parentNode)return;
      renderError(sheet.grid,error);
    });
  }

  function closestTrigger(target){
    if(!target)return null;
    if(target.nodeType!==1)target=target.parentElement;
    return target && typeof target.closest==="function" ? target.closest("[data-hm-webtools-more]") : null;
  }

  function handleClick(event){
    var button=closestTrigger(event.target);
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    if(typeof event.stopImmediatePropagation==="function")event.stopImmediatePropagation();
    open(button.getAttribute("data-hm-webtools-more")||"all",button.getAttribute("data-current-tool")||"");
  }

  document.addEventListener("click",handleClick,true);

  window.HMWebtoolsMore=Object.freeze({version:VERSION,open:open,close:closeActive});
})(window,document);
