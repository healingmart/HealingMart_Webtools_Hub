/*
 * HealingMart Webtools More v2.0.0
 *
 * 개별 웹도구 게시물의 기존 실행 JS 아래에 이 파일만 연결하면
 * 홈 · 빠른찾기 · 최근사용 · 카테고리 바텀이 자동 생성됩니다.
 *
 * 기존 data-hm-webtools-more 버튼 방식도 그대로 지원합니다.
 */
(function(window,document){
  "use strict";

  if(window.HMWebtoolsMore&&window.HMWebtoolsMore.version){
    return;
  }

  var SCRIPT=document.currentScript;
  var DATA_URL=(SCRIPT&&SCRIPT.getAttribute("data-data-url"))||
    "https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js";
  var DEFAULT_HUB_URL="https://www.healing-mart.com/2026/07/Webtools.html";
  var STYLE_ID="hmWebtoolsMoreStyleV2";
  var NAV_ID="hmWebtoolsBottomNav";
  var STORAGE_KEY="hmWebtoolsRecentV2";
  var MAX_RECENT=10;
  var loadingPromise=null;
  var currentTool=null;
  var dataCache=null;
  var boundary=null;
  var activeOverlay=null;

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=String(text);
    return node;
  }

  function svgIcon(name){
    var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","0 0 24 24");
    svg.setAttribute("aria-hidden","true");
    svg.setAttribute("focusable","false");

    var paths={
      home:['<path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-6h5v6"></path>'],
      search:['<circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path>'],
      recent:['<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path>'],
      categories:['<rect x="4" y="4" width="6" height="6" rx="1"></rect><rect x="14" y="4" width="6" height="6" rx="1"></rect><rect x="4" y="14" width="6" height="6" rx="1"></rect><rect x="14" y="14" width="6" height="6" rx="1"></rect>'],
      close:['<path d="m6 6 12 12M18 6 6 18"></path>'],
      arrow:['<path d="m9 18 6-6-6-6"></path>']
    };
    svg.innerHTML=(paths[name]||paths.arrow)[0];
    return svg;
  }

  function injectStyle(){
    if(document.getElementById(STYLE_ID))return;

    var style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=
      ".hm-webtools-bottom-nav,.hm-webtools-bottom-nav *,"+
      ".hm-more-overlay,.hm-more-overlay *{box-sizing:border-box}"+
      ".hm-webtools-bottom-nav{width:min(620px,calc(100% - 24px));min-height:62px;padding:6px 8px;position:fixed;left:50%;bottom:12px;z-index:2147483000;transform:translateX(-50%);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;border:1px solid rgba(203,213,225,.96);border-radius:19px;background:rgba(255,255,255,.97);box-shadow:0 14px 38px rgba(15,23,42,.19);backdrop-filter:blur(16px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif;transition:opacity .18s ease,visibility .18s ease,transform .18s ease}"+
      ".hm-webtools-bottom-nav.hm-bottom-nav-outside{opacity:0;visibility:hidden;pointer-events:none;transform:translate(-50%,calc(100% + 34px))}"+
      ".hm-webtools-bottom-nav button{min-width:0;min-height:48px;padding:6px 5px;border:0;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:7px;color:#40536b;background:transparent;font:inherit;font-size:14px;font-weight:900;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}"+
      ".hm-webtools-bottom-nav button:hover{color:#1769e8;background:#edf5ff}"+
      ".hm-webtools-bottom-nav button[data-hm-webtools-nav='search']{color:#fff;background:linear-gradient(135deg,#1769e8,#2d7af0);box-shadow:0 7px 18px rgba(23,105,232,.24)}"+
      ".hm-webtools-bottom-nav svg{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"+
      ".hm-more-overlay{position:fixed;inset:0;z-index:2147483500;padding:18px;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.48);backdrop-filter:blur(5px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}"+
      ".hm-more-panel{width:min(860px,100%);max-height:min(82vh,780px);margin:0 auto 78px;overflow:auto;border:1px solid #d8e1eb;border-radius:24px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.28)}"+
      ".hm-more-head{position:sticky;top:0;z-index:3;min-height:76px;padding:14px 18px;display:grid;grid-template-columns:minmax(0,1fr) 42px;align-items:center;gap:12px;border-bottom:1px solid #e5eaf0;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}"+
      ".hm-more-head strong{display:block;color:#10233b;font-size:20px;font-weight:950;letter-spacing:-.035em}"+
      ".hm-more-head small{display:block;margin-top:4px;color:#718095;font-size:11px;font-weight:750}"+
      ".hm-more-close{width:42px;height:42px;padding:0;display:grid;place-items:center;border:1px solid #dce4ec;border-radius:12px;background:#fff;color:#536174;cursor:pointer}"+
      ".hm-more-close svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}"+
      ".hm-more-body{padding:18px}"+
      ".hm-more-section-title{margin:0 0 12px;color:#10233b;font-size:18px;font-weight:950;letter-spacing:-.03em}"+
      ".hm-more-section-title:not(:first-child){margin-top:24px;padding-top:22px;border-top:1px solid #e7edf3}"+
      ".hm-more-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}"+
      ".hm-more-category-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}"+
      ".hm-more-card,.hm-more-category{min-width:0;min-height:82px;padding:12px 13px;display:grid;grid-template-columns:44px minmax(0,1fr) 22px;align-items:center;gap:10px;border:1px solid #dfe6ee;border-radius:15px;background:#fff;color:#172238;text-align:left;cursor:pointer}"+
      ".hm-more-category{grid-template-columns:42px minmax(0,1fr) auto}"+
      ".hm-more-card:hover,.hm-more-category:hover{border-color:#9fc0ed;background:#f8fbff;box-shadow:0 8px 18px rgba(39,77,124,.07)}"+
      ".hm-more-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;background:#eef4ff;color:#356ab3;font-size:17px;font-weight:950}"+
      ".hm-more-category .hm-more-icon{width:42px;height:42px}"+
      ".hm-more-card strong,.hm-more-category strong{display:block;overflow:hidden;color:#10233b;font-size:14px;font-weight:950;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-card small{display:block;margin-top:4px;overflow:hidden;color:#718095;font-size:10px;font-weight:750;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-count{color:#1769e8;font-size:10px;font-weight:950;white-space:nowrap}"+
      ".hm-more-arrow{width:19px;height:19px;fill:none;stroke:#718095;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"+
      ".hm-more-search{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 92px;gap:8px}"+
      ".hm-more-search input{width:100%;height:56px;padding:0 16px;border:2px solid #c8d8eb;border-radius:15px;outline:0;color:#10233b;background:#fff;font:inherit;font-size:14px;font-weight:800}"+
      ".hm-more-search input:focus{border-color:#6da3ea;box-shadow:0 0 0 4px rgba(55,125,228,.11)}"+
      ".hm-more-search button{height:56px;border:0;border-radius:14px;color:#fff;background:linear-gradient(135deg,#1769e8,#2d7af0);font:inherit;font-size:14px;font-weight:950;cursor:pointer}"+
      ".hm-more-empty{grid-column:1/-1;min-height:100px;padding:20px;display:grid;place-items:center;border:1px dashed #ccd9e8;border-radius:15px;background:#f8fbff;color:#718095;font-size:12px;font-weight:800;text-align:center}"+
      ".hm-more-footer{padding:0 18px 18px}"+
      ".hm-more-all{width:100%;min-height:48px;border:0;border-radius:13px;background:#edf5ff;color:#1769e8;font-size:13px;font-weight:950;cursor:pointer}"+
      "html.hm-more-open,html.hm-more-open body{overflow:hidden!important}"+
      "@media(max-width:760px){.hm-webtools-bottom-nav{width:calc(100% - 16px);max-width:540px;min-height:70px;padding:6px 7px calc(6px + env(safe-area-inset-bottom));bottom:8px;border-radius:20px;gap:4px}.hm-webtools-bottom-nav button{min-height:58px;padding:5px 3px;flex-direction:column;gap:3px;border-radius:14px;font-size:12px;line-height:1.15}.hm-webtools-bottom-nav svg{width:22px;height:22px}.hm-more-overlay{padding:0 0 calc(82px + env(safe-area-inset-bottom))}.hm-more-panel{width:100%;max-height:84vh;margin:0;border-radius:22px 22px 0 0}.hm-more-head{min-height:70px;padding:12px 14px}.hm-more-head strong{font-size:18px}.hm-more-head small{font-size:10px}.hm-more-body{padding:14px 12px}.hm-more-grid,.hm-more-category-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hm-more-card{min-height:76px;padding:10px;grid-template-columns:40px minmax(0,1fr) 18px;gap:8px}.hm-more-category{min-height:72px;padding:9px;grid-template-columns:38px minmax(0,1fr) auto;gap:7px}.hm-more-icon{width:40px;height:40px}.hm-more-category .hm-more-icon{width:38px;height:38px}.hm-more-card strong,.hm-more-category strong{font-size:12px}.hm-more-card small{font-size:9px}.hm-more-count{font-size:8px}.hm-more-search{grid-template-columns:minmax(0,1fr) 78px}.hm-more-search input,.hm-more-search button{height:52px}.hm-more-footer{padding:0 12px 14px}}";

    document.head.appendChild(style);
  }

  function loadData(){
    if(window.HM_WEBTOOLS_DATA){
      dataCache=window.HM_WEBTOOLS_DATA;
      return Promise.resolve(dataCache);
    }

    if(loadingPromise)return loadingPromise;

    loadingPromise=new Promise(function(resolve,reject){
      var script=document.createElement("script");
      var cacheBucket=Math.floor(Date.now()/300000);
      script.src=DATA_URL+(DATA_URL.indexOf("?")===-1?"?":"&")+"hmcb="+cacheBucket;
      script.async=true;
      script.onload=function(){
        if(window.HM_WEBTOOLS_DATA){
          dataCache=window.HM_WEBTOOLS_DATA;
          resolve(dataCache);
        }else{
          reject(new Error("data.js loaded without HM_WEBTOOLS_DATA"));
        }
      };
      script.onerror=function(){reject(new Error("data.js load failed"));};
      document.head.appendChild(script);
    });

    return loadingPromise;
  }

  function normalizeUrl(value){
    try{
      var url=new URL(value,window.location.href);
      var path=decodeURIComponent(url.pathname).replace(/\/+$/,"/").toLowerCase();
      return url.hostname.toLowerCase()+path;
    }catch(error){
      return String(value||"").toLowerCase();
    }
  }

  function availableTools(data){
    return (data.tools||[]).filter(function(tool){
      return tool&&tool.available&&tool.url;
    });
  }

  function detectCurrentTool(data){
    var forced=(SCRIPT&&SCRIPT.getAttribute("data-current-tool"))||
      document.documentElement.getAttribute("data-current-tool")||
      document.body&&document.body.getAttribute("data-current-tool")||"";
    var tools=availableTools(data);

    if(forced){
      return tools.find(function(tool){return tool.id===forced;})||null;
    }

    var current=normalizeUrl(window.location.href);
    return tools.find(function(tool){return normalizeUrl(tool.url)===current;})||null;
  }

  function categoryMap(data){
    var map={};
    (data.categories||[]).forEach(function(category){map[category.id]=category;});
    return map;
  }

  function iconText(item){
    var key=item&&item.icon||item&&item.category||"";
    var map={
      image:"▧",video:"▶",writing:"✎",life:"＋",document:"▤",
      audio:"♪",data:"◫",developer:"⌘",calculator:"＋",convert:"↔",
      rename:"Aa",watermark:"W",crop:"⌗",cutout:"✂",compress:"↘",
      clean:"◇",link:"↗",calendar:"□",qr:"▦",subtitle:"CC",pin:"⌖",
      all:"◇"
    };
    return map[key]||"◇";
  }

  function toolById(data,id){
    return availableTools(data).find(function(tool){return tool.id===id;})||null;
  }

  function readRecent(data){
    var ids=[];
    try{ids=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch(error){ids=[];}
    return ids.map(function(id){return toolById(data,id);}).filter(Boolean);
  }

  function saveRecent(tool){
    if(!tool||!tool.id)return;
    var ids=[];
    try{ids=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch(error){ids=[];}
    ids=[tool.id].concat(ids.filter(function(id){return id!==tool.id;})).slice(0,MAX_RECENT);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(ids));}catch(error){}
  }

  function popularTools(data,limit){
    return availableTools(data)
      .filter(function(tool){return !currentTool||tool.id!==currentTool.id;})
      .sort(function(a,b){
        return (Number(a.popularOrder||a.featuredOrder)||9999)-
          (Number(b.popularOrder||b.featuredOrder)||9999);
      })
      .slice(0,limit||6);
  }

  function searchTools(data,query){
    var q=String(query||"").trim().toLowerCase();
    if(!q)return [];
    return availableTools(data).filter(function(tool){
      if(currentTool&&tool.id===currentTool.id)return false;
      var text=[tool.name,tool.shortName,tool.description,(tool.keywords||[]).join(" ")].join(" ").toLowerCase();
      return text.indexOf(q)!==-1;
    });
  }

  function card(tool){
    var button=el("button","hm-more-card");
    var icon=el("span","hm-more-icon",iconText(tool));
    var copy=el("span");
    var arrow=svgIcon("arrow");
    button.type="button";
    copy.append(el("strong","",tool.shortName||tool.name),el("small","",tool.description||""));
    arrow.setAttribute("class","hm-more-arrow");
    button.append(icon,copy,arrow);
    button.addEventListener("click",function(){window.location.href=tool.url;});
    return button;
  }

  function categoryCard(data,category){
    var count=availableTools(data).filter(function(tool){return tool.category===category.id;}).length;
    var button=el("button","hm-more-category");
    button.type="button";
    button.append(
      el("span","hm-more-icon",iconText(category)),
      el("strong","",category.name),
      el("span","hm-more-count",count?count+"개":"준비중")
    );
    button.addEventListener("click",function(){openSheet("category",category.id);});
    return button;
  }

  function sectionTitle(text){return el("div","hm-more-section-title",text);}
  function grid(className){return el("div",className||"hm-more-grid");}

  function appendTools(target,tools,emptyMessage){
    var list=grid("hm-more-grid");
    if(!tools.length){
      list.appendChild(el("div","hm-more-empty",emptyMessage||"표시할 웹도구가 없습니다."));
    }else{
      tools.forEach(function(tool){list.appendChild(card(tool));});
    }
    target.appendChild(list);
  }

  function createSearchSection(data,body){
    var form=el("form","hm-more-search");
    var input=el("input");
    var submit=el("button","","검색");
    var resultTitle=sectionTitle("검색 결과");
    var resultHost=el("div");
    input.type="search";
    input.autocomplete="off";
    input.placeholder="도구 이름이나 기능을 검색하세요";
    submit.type="submit";
    resultTitle.hidden=true;
    resultHost.hidden=true;
    form.append(input,submit);

    function render(){
      var found=searchTools(data,input.value);
      if(!input.value.trim()){
        resultTitle.hidden=true;
        resultHost.hidden=true;
        resultHost.replaceChildren();
        return;
      }
      resultTitle.textContent="검색 결과 "+found.length+"개";
      resultTitle.hidden=false;
      resultHost.hidden=false;
      resultHost.replaceChildren();
      appendTools(resultHost,found,"조건에 맞는 도구가 없습니다.");
    }

    form.addEventListener("submit",function(event){event.preventDefault();render();});
    input.addEventListener("input",render);
    body.append(sectionTitle("웹도구 검색"),form,resultTitle,resultHost);
    return input;
  }

  function closeSheet(){
    if(!activeOverlay)return;
    activeOverlay.remove();
    activeOverlay=null;
    document.documentElement.classList.remove("hm-more-open");
  }

  function openSheet(type,categoryId){
    injectStyle();
    loadData().then(function(data){
      dataCache=data;
      currentTool=currentTool||detectCurrentTool(data);
      closeSheet();

      var overlay=el("div","hm-more-overlay");
      var panel=el("section","hm-more-panel");
      var head=el("header","hm-more-head");
      var copy=el("div");
      var title=el("strong");
      var subtitle=el("small");
      var close=el("button","hm-more-close");
      var body=el("div","hm-more-body");
      var footer=el("div","hm-more-footer");
      var all=el("button","hm-more-all","전체 웹도구 보기");
      var focusTarget=null;

      close.type="button";
      close.setAttribute("aria-label","닫기");
      close.appendChild(svgIcon("close"));
      all.type="button";

      if(type==="search"){
        title.textContent="웹도구 빠른찾기";
        subtitle.textContent="도구 이름이나 기능으로 바로 찾으세요.";
        focusTarget=createSearchSection(data,body);
        body.appendChild(sectionTitle("자주 찾는 웹도구"));
        appendTools(body,popularTools(data,6));
      }else if(type==="recent"){
        title.textContent="최근 사용한 웹도구";
        subtitle.textContent="최근 열어본 도구를 다시 이용하세요.";
        body.appendChild(sectionTitle("최근 사용"));
        appendTools(body,readRecent(data).filter(function(tool){return !currentTool||tool.id!==currentTool.id;}),"아직 사용 기록이 없습니다.");
      }else if(type==="category"){
        var category=(data.categories||[]).find(function(item){return item.id===categoryId;});
        title.textContent=category?category.name+" 웹도구":"웹도구 카테고리";
        subtitle.textContent=category?category.description||"같은 분야의 도구입니다.":"원하는 분야를 선택하세요.";
        if(category){
          var related=availableTools(data).filter(function(tool){
            return tool.category===category.id&&(!currentTool||tool.id!==currentTool.id);
          }).sort(function(a,b){return (Number(a.order)||9999)-(Number(b.order)||9999);});
          body.appendChild(sectionTitle(category.name+" 도구"));
          appendTools(body,related,"현재 연결된 도구가 없습니다.");
        }else{
          var categoryGrid=grid("hm-more-category-grid");
          (data.categories||[]).slice().sort(function(a,b){return (Number(a.order)||0)-(Number(b.order)||0);}).forEach(function(item){categoryGrid.appendChild(categoryCard(data,item));});
          body.append(sectionTitle("카테고리로 찾기"),categoryGrid,sectionTitle("자주 찾는 웹도구"));
          appendTools(body,popularTools(data,6));
        }
      }else{
        title.textContent="웹도구 더보기";
        subtitle.textContent="힐링편의점의 다른 웹도구입니다.";
        body.appendChild(sectionTitle("자주 찾는 웹도구"));
        appendTools(body,popularTools(data,8));
      }

      copy.append(title,subtitle);
      head.append(copy,close);
      all.addEventListener("click",function(){
        window.location.href=(data.site&&data.site.hubUrl)||DEFAULT_HUB_URL;
      });
      footer.appendChild(all);
      panel.append(head,body,footer);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      activeOverlay=overlay;
      document.documentElement.classList.add("hm-more-open");

      close.addEventListener("click",closeSheet);
      overlay.addEventListener("click",function(event){if(event.target===overlay)closeSheet();});
      document.addEventListener("keydown",function escape(event){
        if(event.key==="Escape"){
          document.removeEventListener("keydown",escape);
          closeSheet();
        }
      });
      if(focusTarget)window.setTimeout(function(){focusTarget.focus();},80);
    }).catch(function(error){
      console.error("[HealingMart Webtools More]",error);
      window.location.href=DEFAULT_HUB_URL;
    });
  }

  function makeNavButton(name,label){
    var button=el("button");
    button.type="button";
    button.setAttribute("data-hm-webtools-nav",name);
    button.setAttribute("aria-label",label);
    button.append(svgIcon(name),el("span","",label));
    return button;
  }

  function installBoundary(){
    boundary=el("span");
    boundary.setAttribute("data-hm-webtools-bottom-boundary","");
    boundary.setAttribute("aria-hidden","true");
    boundary.style.cssText="width:1px;height:1px;display:block;margin:0;padding:0;visibility:hidden;pointer-events:none";

    if(SCRIPT&&SCRIPT.parentNode){
      SCRIPT.parentNode.insertBefore(boundary,SCRIPT.nextSibling);
    }else{
      document.body.appendChild(boundary);
    }
  }

  function updateNavVisibility(nav){
    if(!boundary||!nav)return;
    var rect=boundary.getBoundingClientRect();
    var reached=rect.top<=window.innerHeight-20;
    nav.classList.toggle("hm-bottom-nav-outside",reached);
    nav.setAttribute("aria-hidden",reached?"true":"false");
  }

  function installNav(data){
    if(document.getElementById(NAV_ID))return;
    injectStyle();
    currentTool=detectCurrentTool(data);
    saveRecent(currentTool);

    var nav=el("nav","hm-webtools-bottom-nav");
    nav.id=NAV_ID;
    nav.setAttribute("aria-label","웹도구 빠른 메뉴");

    var home=makeNavButton("home","홈");
    var search=makeNavButton("search","빠른찾기");
    var recent=makeNavButton("recent","최근사용");
    var categories=makeNavButton("categories","카테고리");

    home.addEventListener("click",function(){window.location.href=(data.site&&data.site.homeUrl)||"https://www.healing-mart.com/";});
    search.addEventListener("click",function(){openSheet("search");});
    recent.addEventListener("click",function(){openSheet("recent");});
    categories.addEventListener("click",function(){openSheet("category","");});

    nav.append(home,search,recent,categories);
    document.body.appendChild(nav);
    installBoundary();

    var ticking=false;
    function requestUpdate(){
      if(ticking)return;
      ticking=true;
      window.requestAnimationFrame(function(){
        updateNavVisibility(nav);
        ticking=false;
      });
    }

    window.addEventListener("scroll",requestUpdate,{passive:true});
    window.addEventListener("resize",requestUpdate);
    window.addEventListener("pageshow",requestUpdate);
    requestUpdate();
  }

  document.addEventListener("click",function(event){
    var button=event.target.closest("[data-hm-webtools-more]");
    if(!button)return;
    event.preventDefault();
    var category=button.getAttribute("data-hm-webtools-more")||"";
    var forcedTool=button.getAttribute("data-current-tool")||"";
    loadData().then(function(data){
      if(forcedTool)currentTool=toolById(data,forcedTool)||currentTool;
      openSheet(category&&category!=="all"?"category":"all",category);
    });
  });

  function start(){
    if(SCRIPT&&SCRIPT.getAttribute("data-auto-nav")==="false")return;
    loadData().then(function(data){
      dataCache=data;
      installNav(data);
      document.dispatchEvent(new CustomEvent("hm:webtools:more-ready",{detail:{version:"2.0.0"}}));
    }).catch(function(error){
      console.error("[HealingMart Webtools More]",error);
    });
  }

  window.HMWebtoolsMore=Object.freeze({
    version:"2.0.0",
    open:function(category,currentToolId){
      loadData().then(function(data){
        if(currentToolId)currentTool=toolById(data,currentToolId)||currentTool;
        openSheet(category&&category!=="all"?"category":"all",category||"");
      });
    },
    openSearch:function(){openSheet("search");},
    openRecent:function(){openSheet("recent");},
    openCategories:function(){openSheet("category","");}
  });

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})(window,document);
