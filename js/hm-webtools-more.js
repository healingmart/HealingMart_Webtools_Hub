/*
 * HealingMart Webtools More v1.1.0
 *
 * <button
 *   type="button"
 *   data-hm-webtools-more="image"
 *   data-current-tool="image-renamer"
 * >
 *   웹도구 더보기
 * </button>
 */
(function(window, document){
  "use strict";

  if(window.HMWebtoolsMore && window.HMWebtoolsMore.version){
    return;
  }

  var DATA_URL="https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js";
  var HUB_URL="https://www.healing-mart.com/search/label/%EC%9B%B9%EB%8F%84%EA%B5%AC";
  var STYLE_ID="hmWebtoolsMoreStyle";
  var loadingPromise=null;

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=String(text);
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
      ".hm-more-close{width:38px;height:38px;display:grid;place-items:center;border:1px solid #dce4ec;border-radius:11px;background:#fff;color:#536174;font-size:22px;line-height:1;cursor:pointer}"+
      ".hm-more-body{padding:12px}"+
      ".hm-more-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}"+
      ".hm-more-card{min-width:0;min-height:68px;padding:10px 11px;display:grid;grid-template-columns:38px minmax(0,1fr) 26px;align-items:center;gap:9px;border:1px solid #e1e7ee;border-radius:13px;background:#fff;color:#172238;text-align:left;cursor:pointer}"+
      ".hm-more-card:hover{border-color:#bdc9d5;background:#fbfcfe}"+
      ".hm-more-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:#f0f2f4;color:#606a76;font-size:16px;font-weight:900}"+
      ".hm-more-card strong{display:block;overflow:hidden;font-size:12px;font-weight:900;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-card span{display:block;margin-top:2px;overflow:hidden;color:#7a8798;font-size:8px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}"+
      ".hm-more-arrow{margin:0!important;color:#718095!important;font-size:17px!important}"+
      ".hm-more-footer{padding:2px 12px 13px}"+
      ".hm-more-all{width:100%;min-height:43px;border:1px solid #dfe4ea;border-radius:12px;background:#f4f5f7;color:#4f5967;font-size:11px;font-weight:900;cursor:pointer}"+
      ".hm-more-empty{grid-column:1/-1;padding:26px 12px;color:#718095;font-size:11px;font-weight:800;text-align:center}"+
      "@media(max-width:560px){.hm-more-overlay{padding:7px 5px calc(7px + env(safe-area-inset-bottom))}.hm-more-panel{max-height:78vh;margin-bottom:76px;border-radius:19px}.hm-more-grid{grid-template-columns:1fr}}";

    document.head.appendChild(style);
  }

  function loadData(){
    if(window.HM_WEBTOOLS_DATA){
      return Promise.resolve(window.HM_WEBTOOLS_DATA);
    }

    if(loadingPromise){
      return loadingPromise;
    }

    loadingPromise=new Promise(function(resolve,reject){
      var script=document.createElement("script");
      script.src=DATA_URL;
      script.async=true;

      script.onload=function(){
        if(window.HM_WEBTOOLS_DATA){
          resolve(window.HM_WEBTOOLS_DATA);
        }else{
          reject(new Error("data.js loaded without data"));
        }
      };

      script.onerror=function(){
        reject(new Error("data.js load failed"));
      };

      document.head.appendChild(script);
    });

    return loadingPromise;
  }

  function iconText(tool){
    var map={
      image:"▧",video:"▶",writing:"✎",life:"＋",document:"▤",
      audio:"♪",data:"◫",developer:"⌘",calculator:"＋",convert:"↔",
      rename:"Aa",watermark:"W",crop:"⌗",cutout:"✂",compress:"↘",
      clean:"◇",link:"↗",calendar:"□",qr:"▦",subtitle:"CC",pin:"⌖"
    };

    return map[tool.icon]||"◇";
  }

  function open(category,currentTool){
    injectStyle();

    loadData().then(function(data){
      var tools=(data.tools||[])
        .filter(function(tool){
          return tool.available &&
            tool.url &&
            (!category || category==="all" || tool.category===category) &&
            (!currentTool || tool.id!==currentTool);
        })
        .sort(function(a,b){
          return (Number(a.order)||9999)-(Number(b.order)||9999);
        })
        .slice(0,8);

      var overlay=el("div","hm-more-overlay");
      var panel=el("section","hm-more-panel");
      var head=el("header","hm-more-head");
      var copy=el("div");
      var title=el(
        "h2",
        "",
        category && category!=="all" ? "관련 웹도구 더보기" : "웹도구 더보기"
      );
      var description=el(
        "p",
        "",
        category && category!=="all"
          ? "같은 분야의 도구를 모았습니다."
          : "힐링편의점의 다른 웹도구입니다."
      );
      var close=el("button","hm-more-close","×");
      var body=el("div","hm-more-body");
      var grid=el("div","hm-more-grid");
      var footer=el("div","hm-more-footer");
      var all=el("button","hm-more-all","전체 웹도구 보기");

      close.type="button";
      close.setAttribute("aria-label","닫기");
      all.type="button";

      copy.append(title,description);
      head.append(copy,close);

      if(tools.length){
        tools.forEach(function(tool){
          var card=el("button","hm-more-card");
          var icon=el("div","hm-more-icon",iconText(tool));
          var text=el("div");
          var arrow=el("span","hm-more-arrow","›");

          card.type="button";
          text.append(
            el("strong","",tool.name),
            el("span","",tool.description||"")
          );

          card.append(icon,text,arrow);
          card.addEventListener("click",function(){
            window.location.href=tool.url;
          });

          grid.appendChild(card);
        });
      }else{
        grid.appendChild(
          el("div","hm-more-empty","현재 연결된 관련 도구가 없습니다.")
        );
      }

      all.addEventListener("click",function(){
        window.location.href=HUB_URL;
      });

      footer.appendChild(all);
      body.appendChild(grid);
      panel.append(head,body,footer);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      var oldOverflow=document.body.style.overflow;
      document.body.style.overflow="hidden";

      function remove(){
        document.body.style.overflow=oldOverflow;
        overlay.remove();
      }

      close.addEventListener("click",remove);

      overlay.addEventListener("click",function(event){
        if(event.target===overlay){
          remove();
        }
      });

      document.addEventListener("keydown",function escape(event){
        if(event.key==="Escape"){
          document.removeEventListener("keydown",escape);
          remove();
        }
      });
    }).catch(function(error){
      console.error("[HealingMart Webtools More]",error);
      window.location.href=HUB_URL;
    });
  }

  document.addEventListener("click",function(event){
    var button=event.target.closest("[data-hm-webtools-more]");
    if(!button)return;

    event.preventDefault();

    open(
      button.getAttribute("data-hm-webtools-more")||"all",
      button.getAttribute("data-current-tool")||""
    );
  });

  window.HMWebtoolsMore=Object.freeze({
    version:"1.1.0",
    open:open
  });
})(window,document);
