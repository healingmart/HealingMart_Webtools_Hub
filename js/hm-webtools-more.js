/*
 * HealingMart Webtools More v4.2.0
 * Bottom navigation only.
 * 게시물의 기존 디자인과 도구 기능은 수정하지 않습니다.
 * 데이터는 이 파일 안에 내장되어 있으므로 별도 data.js 로딩 실패로 메뉴가 사라지지 않습니다.
 */
(function(window, document){
  "use strict";

  var VERSION="4.2.0";
  window.HMWebtoolsMoreLoaded=VERSION;
  var SCRIPT=document.currentScript;
  var TOOL_ID=SCRIPT&&SCRIPT.getAttribute("data-tool-id")||"";
  var CATEGORY_ID=SCRIPT&&SCRIPT.getAttribute("data-category-id")||"";
  var ROOT_SELECTOR=SCRIPT&&SCRIPT.getAttribute("data-root-selector")||"";
  var EXPLICIT_COLOR=SCRIPT&&SCRIPT.getAttribute("data-color")||"";
  var HOME_URL=SCRIPT&&SCRIPT.getAttribute("data-home-url")||"https://www.healing-mart.com/";
  var HUB_URL=SCRIPT&&SCRIPT.getAttribute("data-hub-url")||"https://www.healing-mart.com/2026/07/Webtools.html";

  var EMBEDDED_DATA={"version":"5.7.0","updatedAt":"2026-07-25","site":{"brand":"힐링편의점","title":"무료 웹도구 모음","description":"계산기, 변환기, 이미지, 글쓰기와 생활 웹도구를 한곳에서 빠르게 찾아보세요.","homeUrl":"https://www.healing-mart.com/","qnaUrl":"https://www.healing-mart.com/p/qna.html","hubUrl":"https://www.healing-mart.com/2026/07/Webtools.html"},"settings":{"latestLimit":8,"recentLimit":10,"autoplayInterval":4000,"showUnavailableTools":false,"searchPlaceholder":"도구 이름이나 기능을 검색하세요","emptyMessage":"조건에 맞는 도구를 찾지 못했습니다.","baseToolCount":1400,"calculatorCollectionCount":500,"converterCollectionCount":900,"featuredLimit":4,"moreFeaturedLimit":4,"categoryParam":"category"},"categories":[{"id":"image","name":"이미지","description":"자르기, 배경 제거, 이미지 편집","icon":"image","tone":"violet","order":10},{"id":"writing","name":"글쓰기","description":"글자수, 바이트, 문서 분석","icon":"writing","tone":"blue","order":20},{"id":"life","name":"생활","description":"생활, 금융, 건강 계산기","icon":"life","tone":"green","order":30},{"id":"document","name":"문서, 변환","description":"파일, 단위, 형식 변환","icon":"document","tone":"orange","order":40},{"id":"data","name":"데이터, 좌표","description":"위경도, 주소, 좌표 변환","icon":"data","tone":"teal","order":50},{"id":"video","name":"영상","description":"영상 변환, 제작 보조","icon":"video","tone":"rose","order":60},{"id":"audio","name":"오디오","description":"음원, 음성, 자막","icon":"audio","tone":"pink","order":70},{"id":"developer","name":"개발자","description":"코드와 데이터 정리","icon":"developer","tone":"slate","order":80}],"tools":[{"id":"calculator-hub","name":"계산기 500종 모음","shortName":"계산기 500종","category":"life","description":"생활, 금융, 건강, 날짜, 단위와 수학 계산기 500종을 한곳에서 이용합니다.","keywords":["계산기","계산기 500종","생활 계산기","금융 계산기","건강 계산기","날짜 계산기","단위 계산"],"icon":"calculator","url":"https://www.healing-mart.com/2026/07/calculator.html","available":true,"featured":true,"verified":true,"updatedAt":"2026-07-20","order":10,"includedInBase":true,"collectionCount":500,"featuredOrder":10},{"id":"converter-hub","name":"컨버터 900종 모음","shortName":"컨버터 900종","category":"document","description":"파일, 문서, 이미지, 영상, 오디오와 단위 변환기 900종을 한곳에서 이용합니다.","keywords":["컨버터","컨버터 900종","변환기 900종","파일 변환","문서 변환","이미지 변환","단위 변환"],"icon":"convert","url":"https://www.healing-mart.com/2026/07/converter.html","available":true,"featured":true,"verified":true,"updatedAt":"2026-07-23","order":20,"includedInBase":true,"collectionCount":900,"featuredOrder":20},{"id":"image-watermark","name":"이미지 자동 워터마크","shortName":"자동 워터마크","category":"image","description":"여러 이미지에 글자나 로고 워터마크를 빠르게 적용하고 저장하는 웹도구입니다.","keywords":["이미지 워터마크","자동 워터마크","워터마크 만들기","로고 워터마크","저작권 표시","Watermark Maker"],"icon":"watermark","url":"https://www.healing-mart.com/2026/07/Watermark-Maker.html","available":true,"featured":true,"verified":true,"updatedAt":"2026-07-25","order":25,"includedInBase":false,"featuredOrder":40},{"id":"text-counter","name":"글자수, 바이트 분석기","shortName":"글자수 세기","category":"writing","description":"공백 포함, 제외 글자수, 단어수, UTF-8 바이트와 문장 가독성을 확인합니다.","keywords":["글자수 세기","글자수","바이트","단어수","문장수","자기소개서","블로그 원고","텍스트 분석"],"icon":"writing","url":"https://www.healing-mart.com/2025/02/the%20number%20of%20letters.html","available":true,"featured":true,"verified":true,"updatedAt":"2025-02-10","order":30,"includedInBase":false,"featuredOrder":30},{"id":"background-remove","name":"배경 제거, 누끼따기","shortName":"배경 제거","category":"image","description":"이미지의 배경을 제거하고 투명 배경 결과를 만드는 웹도구입니다.","keywords":["배경 제거","누끼따기","누끼","투명 배경","투명 PNG","이미지 배경"],"icon":"cutout","url":"https://www.healing-mart.com/2025/02/remove%20bg.html","available":true,"featured":true,"verified":true,"updatedAt":"2025-02-11","order":40,"includedInBase":false,"featuredOrder":50},{"id":"multi-image-crop","name":"이미지 멀티 자르기","shortName":"도형 이미지 자르기","category":"image","description":"원형, 사각형, 삼각형, 다각형과 별 모양으로 이미지를 자릅니다.","keywords":["이미지 자르기","도형 자르기","원형 자르기","사각형 자르기","삼각형","별 모양","PNG"],"icon":"crop","url":"https://www.healing-mart.com/2025/03/multi-cutting-tool.html","available":true,"featured":true,"verified":true,"updatedAt":"2025-03-10","order":50,"includedInBase":false,"featuredOrder":60},{"id":"circle-image-crop","name":"원형, 타원형 이미지 자르기","shortName":"원형 이미지 자르기","category":"image","description":"프로필과 썸네일 이미지를 원형 또는 타원형으로 잘라 투명 PNG로 저장합니다.","keywords":["원형 자르기","타원형 자르기","프로필 이미지","썸네일","투명 PNG"],"icon":"crop","url":"https://www.healing-mart.com/2025/02/a%20sentence%20translator.html","available":true,"verified":true,"updatedAt":"2025-03-01","order":60,"includedInBase":false},{"id":"square-image-crop","name":"정사각형, 직사각형 이미지 자르기","shortName":"사각형 이미지 자르기","category":"image","description":"상품 사진, 배너와 썸네일을 정사각형 또는 직사각형으로 정교하게 자릅니다.","keywords":["정사각형 자르기","직사각형 자르기","상품 이미지","배너","썸네일","PNG"],"icon":"crop","url":"https://www.healing-mart.com/2025/02/Cutting%20Image.html","available":true,"verified":true,"updatedAt":"2025-02-10","order":70,"includedInBase":false},{"id":"coordinate-converter","name":"위경도, 주소 좌표 변환기","shortName":"위경도 변환기","category":"data","description":"주소를 위도, 경도로 찾고 좌표 형식을 변환해 지도에서 확인합니다.","keywords":["위경도 변환기","주소 좌표","위도","경도","GPS","좌표 변환","카카오맵"],"icon":"pin","url":"https://www.healing-mart.com/2026/07/latlng-converter.html","available":true,"featured":true,"verified":true,"updatedAt":"2026-07-10","order":80,"includedInBase":false,"featuredOrder":70},{"id":"image-renamer","name":"이미지 파일명 정리기","shortName":"파일명 정리기","category":"image","description":"여러 이미지의 이름을 번호 규칙에 따라 일괄 정리합니다.","keywords":["파일명 변경","이미지 이름","일괄 이름 변경","001","ZIP"],"icon":"rename","url":"","available":false,"verified":false,"status":"공개 주소 확인 대기","updatedAt":"2026-07-24","order":90,"includedInBase":false}]};

  var STYLE_ID="hmMoreBottomOnlyStyleV420";
  var NAV_ID="hmMoreBottomOnlyNav";
  var SHEET_ID="hmMoreBottomOnlySheet";
  var TOAST_ID="hmMoreBottomOnlyToast";

  if(document.getElementById(NAV_ID))return;

  var state={
    data:window.HM_WEBTOOLS_DATA||EMBEDDED_DATA,
    currentTool:null,
    currentCategory:null,
    root:null,
    nav:null,
    sheet:null,
    title:null,
    subtitle:null,
    searchWrap:null,
    searchInput:null,
    grid:null,
    footer:null,
    mode:"",
    frame:0
  };

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined&&text!==null)node.textContent=String(text);
    return node;
  }

  function svg(name){
    var ns="http://www.w3.org/2000/svg";
    var icon=document.createElementNS(ns,"svg");
    icon.setAttribute("viewBox","0 0 24 24");
    icon.setAttribute("aria-hidden","true");
    icon.setAttribute("focusable","false");

    var defs={
      home:[
        ["path",{d:"M3 11.5 12 4l9 7.5"}],
        ["path",{d:"M5.5 10.5V20h13v-9.5"}],
        ["path",{d:"M9.5 20v-6h5v6"}]
      ],
      search:[
        ["circle",{cx:"11",cy:"11",r:"7"}],
        ["path",{d:"m16.5 16.5 4 4"}]
      ],
      image:[
        ["rect",{x:"3.5",y:"4",width:"17",height:"16",rx:"2"}],
        ["circle",{cx:"8.5",cy:"9",r:"1.7"}],
        ["path",{d:"m5 17 4.3-4.2 3.2 3 2.1-2 4.4 3.2"}]
      ],
      categories:[
        ["rect",{x:"4",y:"4",width:"6",height:"6",rx:"1"}],
        ["rect",{x:"14",y:"4",width:"6",height:"6",rx:"1"}],
        ["rect",{x:"4",y:"14",width:"6",height:"6",rx:"1"}],
        ["rect",{x:"14",y:"14",width:"6",height:"6",rx:"1"}]
      ],
      share:[
        ["circle",{cx:"18",cy:"5",r:"2.3"}],
        ["circle",{cx:"6",cy:"12",r:"2.3"}],
        ["circle",{cx:"18",cy:"19",r:"2.3"}],
        ["path",{d:"m8.1 10.8 7.8-4.5M8.1 13.2l7.8 4.5"}]
      ],
      close:[
        ["path",{d:"m6 6 12 12"}],
        ["path",{d:"M18 6 6 18"}]
      ],
      arrow:[["path",{d:"m9 5 7 7-7 7"}]],
      tool:[
        ["path",{d:"M12 3v4M12 17v4M3 12h4M17 12h4"}],
        ["circle",{cx:"12",cy:"12",r:"4"}]
      ]
    };

    (defs[name]||defs.tool).forEach(function(part){
      var child=document.createElementNS(ns,part[0]);
      Object.keys(part[1]).forEach(function(key){
        child.setAttribute(key,part[1][key]);
      });
      icon.appendChild(child);
    });
    return icon;
  }

  function normalizeUrl(value){
    try{
      var url=new URL(value,window.location.href);
      return (url.hostname+decodeURIComponent(url.pathname))
        .replace(/\/+$/,"")
        .toLowerCase();
    }catch(error){
      return String(value||"").replace(/\/+$/,"").toLowerCase();
    }
  }

  function hexToRgb(value){
    var color=String(value||"").trim();
    var match;
    if(/^#[0-9a-f]{3}$/i.test(color)){
      return [
        parseInt(color.charAt(1)+color.charAt(1),16),
        parseInt(color.charAt(2)+color.charAt(2),16),
        parseInt(color.charAt(3)+color.charAt(3),16)
      ];
    }
    if(/^#[0-9a-f]{6}$/i.test(color)){
      return [
        parseInt(color.slice(1,3),16),
        parseInt(color.slice(3,5),16),
        parseInt(color.slice(5,7),16)
      ];
    }
    match=color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if(match)return [Number(match[1]),Number(match[2]),Number(match[3])];
    return [108,92,231];
  }

  function detectRoot(){
    var selectors=[
      ROOT_SELECTOR,
      "#healingMartMultiCutTool",
      "#healingMartCalculatorApp",
      "[data-hm-tool-root]"
    ].filter(Boolean);

    for(var i=0;i<selectors.length;i+=1){
      try{
        var found=document.querySelector(selectors[i]);
        if(found)return found;
      }catch(error){}
    }
    return null;
  }

  function detectColor(){
    if(EXPLICIT_COLOR)return EXPLICIT_COLOR;
    var candidates=[state.root,document.documentElement,document.body].filter(Boolean);
    for(var i=0;i<candidates.length;i+=1){
      var style=window.getComputedStyle(candidates[i]);
      var value=style.getPropertyValue("--primary").trim()||
        style.getPropertyValue("--hm-primary").trim();
      if(value)return value;
    }
    return "#6c5ce7";
  }

  function availableTools(){
    return (state.data.tools||[]).filter(function(tool){
      return tool&&tool.available!==false&&tool.url;
    }).sort(function(a,b){
      return (Number(a.order)||9999)-(Number(b.order)||9999);
    });
  }

  function findCurrentTool(){
    var tools=availableTools();
    if(TOOL_ID){
      return tools.find(function(tool){return tool.id===TOOL_ID;})||null;
    }
    var current=normalizeUrl(window.location.href);
    return tools.find(function(tool){
      return normalizeUrl(tool.url)===current;
    })||null;
  }

  function findCurrentCategory(){
    var id=CATEGORY_ID||(state.currentTool&&state.currentTool.category)||"";
    return (state.data.categories||[]).find(function(category){
      return category.id===id;
    })||{id:id||"all",name:"관련",icon:"tool"};
  }

  function categoryMap(){
    var map={};
    (state.data.categories||[]).forEach(function(category){
      if(category&&category.id)map[category.id]=category;
    });
    return map;
  }

  function relatedLabel(){
    if(state.currentCategory&&state.currentCategory.id==="image")return "이미지 도구";
    if(state.currentCategory&&state.currentCategory.name)return state.currentCategory.name+" 도구";
    return "관련 도구";
  }

  function injectStyle(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=[
      ".hm-more-v420-nav,.hm-more-v420-nav *,.hm-more-v420-sheet,.hm-more-v420-sheet *{box-sizing:border-box}",      ".hm-more-v420-nav{width:min(760px,calc(100% - 24px))!important;min-height:66px!important;padding:7px!important;position:fixed!important;left:50%!important;right:auto!important;top:auto!important;bottom:12px!important;z-index:2147483000!important;transform:translateX(-50%)!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;border:1px solid rgba(203,213,225,.96);border-radius:20px;background:rgba(255,255,255,.98);box-shadow:0 15px 42px rgba(15,23,42,.20);backdrop-filter:blur(16px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif;transition:opacity .18s ease,visibility .18s ease,transform .18s ease}",
      ".hm-more-v420-nav.is-hidden{opacity:0;visibility:hidden;pointer-events:none;transform:translate(-50%,calc(100% + 38px))}",
      ".hm-more-v420-nav button{all:unset!important;box-sizing:border-box!important;min-width:0!important;min-height:50px!important;padding:6px 5px!important;border:0!important;border-radius:13px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;color:#475569!important;background:transparent!important;font:inherit!important;font-size:13px!important;font-weight:900!important;line-height:1.15!important;text-align:center!important;cursor:pointer!important;-webkit-tap-highlight-color:transparent}",
      ".hm-more-v420-nav button:hover{color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.09)}",
      ".hm-more-v420-nav button[data-hm-more-action='related']{color:#fff;background:var(--hm-more-accent);box-shadow:0 8px 20px rgba(var(--hm-more-rgb),.27)}",
      ".hm-more-v420-nav svg{width:21px;height:21px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-v420-nav span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-v420-sheet{position:fixed;inset:0;z-index:2147483500;display:none;align-items:flex-end;justify-content:center;padding:18px;background:rgba(15,23,42,.50);backdrop-filter:blur(6px);font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans KR',Arial,sans-serif}",
      ".hm-more-v420-sheet.is-open{display:flex}",
      ".hm-more-v420-panel{width:min(940px,100%);max-height:min(84vh,800px);overflow:hidden;border:1px solid #d8e1eb;border-radius:25px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.30)}",
      ".hm-more-v420-head{min-height:80px;padding:14px 18px;display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:14px;border-bottom:1px solid #e5eaf0;background:#fff}",
      ".hm-more-v420-head strong{display:block;color:#10233b;font-size:22px;font-weight:950;letter-spacing:-.035em}",
      ".hm-more-v420-head small{display:block;margin-top:4px;color:#66778d;font-size:12px;font-weight:750}",
      ".hm-more-v420-close{width:44px;height:44px;padding:0;display:grid;place-items:center;border:1px solid #dce4ed;border-radius:13px;background:#fff;color:#52667e;cursor:pointer}",
      ".hm-more-v420-close svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}",
      ".hm-more-v420-scroll{max-height:calc(84vh - 81px);overflow:auto}",
      ".hm-more-v420-search-wrap{padding:18px 18px 0}",
      ".hm-more-v420-search{position:relative}",
      ".hm-more-v420-search svg{position:absolute;left:18px;top:50%;width:22px;height:22px;transform:translateY(-50%);fill:none;stroke:var(--hm-more-accent);stroke-width:2;stroke-linecap:round;pointer-events:none}",
      ".hm-more-v420-search input{width:100%;height:58px;padding:0 18px 0 50px;border:2px solid rgba(var(--hm-more-rgb),.34);border-radius:15px;outline:0;background:#fff;color:#10233b;font:inherit;font-size:15px;font-weight:800}",
      ".hm-more-v420-search input:focus{border-color:var(--hm-more-accent);box-shadow:0 0 0 5px rgba(var(--hm-more-rgb),.10)}",
      ".hm-more-v420-body{padding:18px}",
      ".hm-more-v420-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}",
      ".hm-more-v420-card{min-width:0;min-height:96px;padding:14px;display:grid;grid-template-columns:52px minmax(0,1fr) 18px;align-items:center;gap:12px;border:1px solid #dfe6ee;border-radius:17px;background:#fff;color:#10233b;text-align:left;cursor:pointer}",
      ".hm-more-v420-card:hover{border-color:rgba(var(--hm-more-rgb),.38);background:rgba(var(--hm-more-rgb),.035);box-shadow:0 10px 24px rgba(38,60,89,.07)}",
      ".hm-more-v420-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:15px;color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.10)}",
      ".hm-more-v420-icon svg,.hm-more-v420-arrow{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}",
      ".hm-more-v420-copy{min-width:0}",
      ".hm-more-v420-copy strong{display:block;overflow:hidden;color:#10233b;font-size:15px;font-weight:950;text-overflow:ellipsis;white-space:nowrap}",
      ".hm-more-v420-copy small{display:-webkit-box;margin-top:5px;overflow:hidden;color:#66778d;font-size:11px;font-weight:700;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2}",
      ".hm-more-v420-arrow{width:18px;height:18px;color:#7c8ba0}",
      ".hm-more-v420-empty{grid-column:1/-1;min-height:130px;padding:22px;display:grid;place-items:center;border:1px dashed #cbd8e6;border-radius:17px;background:#f8fafc;color:#66778d;font-size:13px;font-weight:800;text-align:center}",
      ".hm-more-v420-footer{padding:0 18px 18px}",
      ".hm-more-v420-footer button{width:100%;min-height:52px;border:0;border-radius:14px;color:var(--hm-more-accent);background:rgba(var(--hm-more-rgb),.10);font:inherit;font-size:14px;font-weight:950;cursor:pointer}",
      "html.hm-more-v420-open,html.hm-more-v420-open body{overflow:hidden!important}",
      "@media(max-width:760px){.hm-more-v420-nav{width:calc(100% - 12px);min-height:72px;bottom:6px;padding:6px 5px calc(6px + env(safe-area-inset-bottom));gap:3px;border-radius:19px}.hm-more-v420-nav button{min-height:58px;padding:5px 2px;flex-direction:column;gap:3px;font-size:10px}.hm-more-v420-nav svg{width:21px;height:21px}.hm-more-v420-sheet{padding:0}.hm-more-v420-panel{width:100%;max-height:88vh;border-radius:23px 23px 0 0}.hm-more-v420-head{min-height:72px;padding:12px 13px}.hm-more-v420-head strong{font-size:19px}.hm-more-v420-scroll{max-height:calc(88vh - 73px)}.hm-more-v420-search-wrap{padding:13px 11px 0}.hm-more-v420-search input{height:54px;font-size:14px}.hm-more-v420-body{padding:13px 11px}.hm-more-v420-grid{grid-template-columns:1fr;gap:8px}.hm-more-v420-card{min-height:84px;padding:11px;grid-template-columns:46px minmax(0,1fr) 16px;gap:10px}.hm-more-v420-icon{width:46px;height:46px;border-radius:14px}.hm-more-v420-copy strong{font-size:14px}.hm-more-v420-footer{padding:0 11px 13px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function button(action,label,iconName){
    var node=el("button");
    node.type="button";
    node.setAttribute("data-hm-more-action",action);
    node.setAttribute("aria-label",label);
    node.appendChild(svg(iconName));
    node.appendChild(el("span","",label));
    return node;
  }

  function buildNav(){
    var color=detectColor();
    var rgb=hexToRgb(color);
    var nav=el("nav","hm-more-v420-nav is-hidden");
    nav.id=NAV_ID;
    nav.setAttribute("aria-label","웹도구 빠른 메뉴");
    nav.setAttribute("aria-hidden","true");
    nav.style.setProperty("--hm-more-accent",color);
    nav.style.setProperty("--hm-more-rgb",rgb.join(","));

    nav.appendChild(button("home","블로그","home"));
    nav.appendChild(button("search","도구 검색","search"));
    nav.appendChild(button("related",relatedLabel(),state.currentCategory.id==="image"?"image":"tool"));
    nav.appendChild(button("categories","카테고리","categories"));
    nav.appendChild(button("share","공유","share"));

    document.body.appendChild(nav);
    state.nav=nav;
  }

  function buildSheet(){
    var color=detectColor();
    var rgb=hexToRgb(color);
    var sheet=el("div","hm-more-v420-sheet");
    sheet.id=SHEET_ID;
    sheet.setAttribute("aria-hidden","true");
    sheet.style.setProperty("--hm-more-accent",color);
    sheet.style.setProperty("--hm-more-rgb",rgb.join(","));

    var panel=el("section","hm-more-v420-panel");
    panel.setAttribute("role","dialog");
    panel.setAttribute("aria-modal","true");

    var head=el("header","hm-more-v420-head");
    var copy=el("div");
    var title=el("strong","","웹도구");
    var subtitle=el("small","","필요한 도구를 빠르게 찾습니다.");
    var close=el("button","hm-more-v420-close");
    close.type="button";
    close.setAttribute("aria-label","닫기");
    close.appendChild(svg("close"));
    copy.appendChild(title);
    copy.appendChild(subtitle);
    head.appendChild(copy);
    head.appendChild(close);

    var scroll=el("div","hm-more-v420-scroll");
    var searchWrap=el("div","hm-more-v420-search-wrap");
    var searchBox=el("label","hm-more-v420-search");
    var input=el("input");
    input.type="search";
    input.placeholder="도구 이름이나 기능을 검색하세요";
    input.autocomplete="off";
    searchBox.appendChild(svg("search"));
    searchBox.appendChild(input);
    searchWrap.appendChild(searchBox);

    var body=el("div","hm-more-v420-body");
    var grid=el("div","hm-more-v420-grid");
    body.appendChild(grid);

    var footerWrap=el("footer","hm-more-v420-footer");
    var footer=el("button","","전체 웹도구 보기");
    footer.type="button";
    footerWrap.appendChild(footer);

    scroll.appendChild(searchWrap);
    scroll.appendChild(body);
    scroll.appendChild(footerWrap);
    panel.appendChild(head);
    panel.appendChild(scroll);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);

    state.sheet=sheet;
    state.title=title;
    state.subtitle=subtitle;
    state.searchWrap=searchWrap;
    state.searchInput=input;
    state.grid=grid;
    state.footer=footer;

    close.addEventListener("click",closeSheet);
    sheet.addEventListener("click",function(event){if(event.target===sheet)closeSheet();});
    input.addEventListener("input",function(){if(state.mode==="search")renderSearch(input.value);});
    footer.addEventListener("click",function(){
      if(state.mode==="related"){
        window.location.href=HUB_URL+"?category="+encodeURIComponent(state.currentCategory.id)+"#hm-webtools-results";
        return;
      }
      window.location.href=HUB_URL;
    });
  }

  function setMode(mode){
    state.mode=mode;
    state.searchWrap.hidden=mode!=="search";
    if(mode==="search"){
      state.title.textContent="웹도구 검색";
      state.subtitle.textContent="도구 이름과 기능으로 전체 웹도구를 검색합니다.";
      state.footer.textContent="전체 웹도구 보기";
    }else if(mode==="related"){
      state.title.textContent=relatedLabel();
      state.subtitle.textContent="현재 도구를 제외한 같은 카테고리의 도구입니다.";
      state.footer.textContent=state.currentCategory.name+" 카테고리 전체 보기";
    }else{
      state.title.textContent="웹도구 카테고리";
      state.subtitle.textContent="필요한 분야를 선택해 웹도구 모음으로 이동합니다.";
      state.footer.textContent="전체 웹도구 보기";
    }
  }

  function empty(message){
    state.grid.replaceChildren();
    state.grid.appendChild(el("div","hm-more-v420-empty",message));
  }

  function toolCard(tool){
    var categories=categoryMap();
    var category=categories[tool.category]||{};
    var card=el("button","hm-more-v420-card");
    card.type="button";

    var icon=el("span","hm-more-v420-icon");
    icon.appendChild(svg(tool.category==="image"?"image":"tool"));

    var copy=el("span","hm-more-v420-copy");
    copy.appendChild(el("strong","",tool.shortName||tool.name||"웹도구"));
    copy.appendChild(el("small","",tool.description||category.name||"무료 웹도구"));

    var arrow=svg("arrow");
    arrow.setAttribute("class","hm-more-v420-arrow");

    card.appendChild(icon);
    card.appendChild(copy);
    card.appendChild(arrow);
    card.addEventListener("click",function(){window.location.href=tool.url;});
    return card;
  }

  function renderTools(tools,message){
    state.grid.replaceChildren();
    if(!tools.length){empty(message);return;}
    tools.forEach(function(tool){state.grid.appendChild(toolCard(tool));});
  }

  function renderRelated(){
    var currentId=state.currentTool&&state.currentTool.id||TOOL_ID;
    var categoryId=state.currentCategory.id;
    var tools=availableTools().filter(function(tool){
      return tool.category===categoryId&&tool.id!==currentId;
    });
    renderTools(tools,"현재 연결된 다른 관련 도구가 없습니다.");
  }

  function normalize(value){
    return String(value||"").toLowerCase().replace(/\s+/g," ").trim();
  }

  function renderSearch(query){
    var currentId=state.currentTool&&state.currentTool.id||TOOL_ID;
    var term=normalize(query);
    var tools=availableTools().filter(function(tool){return tool.id!==currentId;});
    if(term){
      tools=tools.filter(function(tool){
        var keywords=Array.isArray(tool.keywords)?tool.keywords.join(" "):"";
        var haystack=normalize([tool.name,tool.shortName,tool.description,keywords].join(" "));
        return haystack.indexOf(term)!==-1;
      });
    }else{
      tools=tools.slice(0,12);
    }
    renderTools(tools,term?"검색 결과가 없습니다.":"등록된 웹도구가 없습니다.");
  }

  function renderCategories(){
    var counts={};
    availableTools().forEach(function(tool){
      counts[tool.category]=(counts[tool.category]||0)+1;
    });

    var categories=(state.data.categories||[]).filter(function(category){
      return category&&category.id&&counts[category.id];
    }).sort(function(a,b){
      return (Number(a.order)||9999)-(Number(b.order)||9999);
    });

    state.grid.replaceChildren();
    if(!categories.length){empty("등록된 웹도구 카테고리가 없습니다.");return;}

    categories.forEach(function(category){
      var card=el("button","hm-more-v420-card");
      card.type="button";

      var icon=el("span","hm-more-v420-icon");
      icon.appendChild(svg(category.id==="image"?"image":"categories"));

      var copy=el("span","hm-more-v420-copy");
      copy.appendChild(el("strong","",category.name||"웹도구"));
      copy.appendChild(el("small","",String(counts[category.id])+"개 도구 보기"));

      var arrow=svg("arrow");
      arrow.setAttribute("class","hm-more-v420-arrow");

      card.appendChild(icon);
      card.appendChild(copy);
      card.appendChild(arrow);
      card.addEventListener("click",function(){
        window.location.href=HUB_URL+"?category="+encodeURIComponent(category.id)+"#hm-webtools-results";
      });
      state.grid.appendChild(card);
    });
  }

  function openSheet(mode){
    setMode(mode);
    state.sheet.classList.add("is-open");
    state.sheet.setAttribute("aria-hidden","false");
    document.documentElement.classList.add("hm-more-v420-open");

    if(mode==="search"){
      renderSearch(state.searchInput.value);
      window.setTimeout(function(){state.searchInput.focus();},40);
    }else if(mode==="related"){
      renderRelated();
    }else{
      renderCategories();
    }
  }

  function closeSheet(){
    if(!state.sheet)return;
    state.sheet.classList.remove("is-open");
    state.sheet.setAttribute("aria-hidden","true");
    document.documentElement.classList.remove("hm-more-v420-open");
  }

  function toast(message){
    var old=document.getElementById(TOAST_ID);
    if(old)old.remove();
    var node=el("div","",message);
    node.id=TOAST_ID;
    node.style.cssText="position:fixed;left:50%;bottom:92px;z-index:2147483600;transform:translateX(-50%);padding:12px 17px;border-radius:999px;background:#10233b;color:#fff;font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:850";
    document.body.appendChild(node);
    window.setTimeout(function(){node.remove();},1700);
  }

  function copyAddress(){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(window.location.href).then(function(){
        toast("링크를 복사했습니다.");
      }).catch(fallbackCopy);
      return;
    }
    fallbackCopy();
  }

  function fallbackCopy(){
    var textarea=document.createElement("textarea");
    textarea.value=window.location.href;
    textarea.style.position="fixed";
    textarea.style.opacity="0";
    document.body.appendChild(textarea);
    textarea.select();
    try{document.execCommand("copy");toast("링크를 복사했습니다.");}
    catch(error){toast("주소창의 링크를 복사해 주세요.");}
    textarea.remove();
  }

  function sharePage(){
    var payload={
      title:document.title,
      text:state.currentTool&&state.currentTool.name||"힐링편의점 웹도구",
      url:window.location.href
    };
    if(navigator.share){
      navigator.share(payload).catch(function(error){
        if(error&&error.name!=="AbortError")copyAddress();
      });
      return;
    }
    copyAddress();
  }

  function bind(){
    state.nav.addEventListener("click",function(event){
      var target=event.target.closest("[data-hm-more-action]");
      if(!target)return;
      var action=target.getAttribute("data-hm-more-action");
      if(action==="home"){window.location.href=HOME_URL;return;}
      if(action==="search"){openSheet("search");return;}
      if(action==="related"){openSheet("related");return;}
      if(action==="categories"){openSheet("categories");return;}
      if(action==="share")sharePage();
    });
    document.addEventListener("keydown",function(event){if(event.key==="Escape")closeSheet();});
  }

  function updateVisibility(){
    state.frame=0;
    if(!state.root||!state.nav)return;

    var rootRect=state.root.getBoundingClientRect();
    var navHeight=Math.max(state.nav.offsetHeight||0,72);
    var navTop=window.innerHeight-navHeight-12;

    /*
     * 하단 메뉴는 지정된 도구 루트 안에서만 표시합니다.
     * 도구 루트의 실제 bottom이 메뉴 상단을 지나면 즉시 숨습니다.
     * 별도의 경계 요소를 게시물 끝에 삽입하지 않으므로 Blogger 푸터까지
     * 메뉴 영역이 이어질 수 없습니다.
     */
    var entered=rootRect.top<window.innerHeight-24;
    var notPassed=rootRect.bottom>navTop;
    var show=entered&&notPassed;

    state.nav.classList.toggle("is-hidden",!show);
    state.nav.setAttribute("aria-hidden",show?"false":"true");
  }

  function queueVisibility(){
    if(state.frame)return;
    state.frame=window.requestAnimationFrame(updateVisibility);
  }

  function init(){
    state.root=detectRoot();
    if(!state.root){
      console.error("[HealingMart More v4.2.0] data-root-selector에 해당하는 도구 루트를 찾지 못했습니다:",ROOT_SELECTOR);
      return;
    }
    state.currentTool=findCurrentTool();
    state.currentCategory=findCurrentCategory();

    injectStyle();
    buildNav();
    buildSheet();
    bind();
    queueVisibility();

    window.addEventListener("scroll",queueVisibility,{passive:true});
    window.addEventListener("resize",queueVisibility);
    window.addEventListener("pageshow",queueVisibility);

    window.HMWebtoolsMore={
      version:VERSION,
      openSearch:function(){openSheet("search");},
      openRelated:function(){openSheet("related");},
      openCategories:function(){openSheet("categories");},
      close:closeSheet
    };
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})(window,document);
