/*
 * HealingMart Webtools Data v5.1.0
 *
 * 신규 도구 추가, URL 변경, 카테고리 변경은 이 파일만 수정합니다.
 */
(function(window, document) {
  "use strict";

  var DATA = {
  "version": "5.1.0",
  "updatedAt": "2026-07-24",
  "site": {
    "brand": "힐링편의점",
    "title": "무료 웹도구 모음",
    "description": "이미지, 영상, 글쓰기, 생활, 문서와 변환 도구를 한곳에서 빠르게 찾아보세요.",
    "homeUrl": "https://www.healing-mart.com/",
    "qnaUrl": "https://www.healing-mart.com/p/qna.html"
  },
  "settings": {
    "latestLimit": 10,
    "recentLimit": 10,
    "autoplayInterval": 4000,
    "showUnavailableTools": false,
    "searchPlaceholder": "도구 이름이나 기능을 검색하세요",
    "emptyMessage": "조건에 맞는 도구를 찾지 못했습니다."
  },
  "categories": [
    {
      "id": "image",
      "name": "이미지",
      "description": "이미지 편집·변환·정리",
      "icon": "image",
      "tone": "violet",
      "order": 10
    },
    {
      "id": "video",
      "name": "영상",
      "description": "영상 변환·제작 보조",
      "icon": "video",
      "tone": "rose",
      "order": 20
    },
    {
      "id": "writing",
      "name": "글쓰기",
      "description": "문장·글자·블로그 작성",
      "icon": "writing",
      "tone": "blue",
      "order": 30
    },
    {
      "id": "life",
      "name": "생활",
      "description": "계산기와 생활 편의도구",
      "icon": "life",
      "tone": "green",
      "order": 40
    },
    {
      "id": "document",
      "name": "문서·변환",
      "description": "PDF·문서·파일 변환",
      "icon": "document",
      "tone": "orange",
      "order": 50
    },
    {
      "id": "audio",
      "name": "오디오",
      "description": "음원·음성·자막",
      "icon": "audio",
      "tone": "pink",
      "order": 60
    },
    {
      "id": "data",
      "name": "데이터",
      "description": "좌표·표·데이터 정리",
      "icon": "data",
      "tone": "teal",
      "order": 70
    },
    {
      "id": "developer",
      "name": "개발자",
      "description": "코드와 웹 개발 보조",
      "icon": "developer",
      "tone": "slate",
      "order": 80
    }
  ],
  "tools": [
    {
      "id": "calculator-hub",
      "name": "계산기 500종 모음",
      "shortName": "계산기 모음",
      "category": "life",
      "description": "생활, 금융, 건강, 날짜 등 자주 쓰는 계산기를 한곳에서 이용합니다.",
      "keywords": [
        "계산기",
        "생활 계산",
        "금융",
        "건강",
        "날짜",
        "500개"
      ],
      "icon": "calculator",
      "url": "https://www.healing-mart.com/2026/07/calculator.html",
      "available": true,
      "collectionCount": 500,
      "featured": true,
      "updatedAt": "2026-07-24",
      "order": 10
    },
    {
      "id": "converter-hub",
      "name": "컨버터 900종 모음",
      "shortName": "컨버터 모음",
      "category": "document",
      "description": "PDF, 문서, 이미지, 영상, 오디오와 단위 변환 기능을 한곳에 모았습니다.",
      "keywords": [
        "컨버터",
        "파일 변환",
        "PDF",
        "단위 변환",
        "900개"
      ],
      "icon": "convert",
      "url": "https://www.healing-mart.com/search/label/%EB%B3%80%ED%99%98%EB%8F%84%EA%B5%AC",
      "available": true,
      "collectionCount": 900,
      "featured": true,
      "updatedAt": "2026-07-24",
      "order": 20
    },
    {
      "id": "image-renamer",
      "name": "이미지 파일명 정리기",
      "shortName": "파일명 정리기",
      "category": "image",
      "description": "여러 이미지의 이름을 001부터 일괄 정리하고 ZIP으로 저장합니다.",
      "keywords": [
        "이미지 이름",
        "파일명 변경",
        "일괄 이름 변경",
        "001",
        "ZIP"
      ],
      "icon": "rename",
      "url": "",
      "available": false,
      "featured": true,
      "updatedAt": "2026-07-24",
      "order": 30
    },
    {
      "id": "image-watermark",
      "name": "이미지 워터마크 도구",
      "shortName": "워터마크",
      "category": "image",
      "description": "여러 이미지에 글자 또는 로고 워터마크를 일괄 적용합니다.",
      "keywords": [
        "워터마크",
        "로고",
        "저작권",
        "이미지"
      ],
      "icon": "watermark",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-23",
      "order": 40
    },
    {
      "id": "image-format",
      "name": "이미지 형식 변환기",
      "shortName": "이미지 변환",
      "category": "image",
      "description": "JPG, PNG, WebP 등 이미지 형식을 브라우저에서 변환합니다.",
      "keywords": [
        "JPG",
        "PNG",
        "WebP",
        "이미지 변환"
      ],
      "icon": "image",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-22",
      "order": 50
    },
    {
      "id": "image-crop",
      "name": "이미지 자르기",
      "shortName": "이미지 자르기",
      "category": "image",
      "description": "사각형과 원형으로 이미지를 정확하게 자르고 저장합니다.",
      "keywords": [
        "크롭",
        "자르기",
        "원형",
        "정사각형"
      ],
      "icon": "crop",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-20",
      "order": 60
    },
    {
      "id": "background-remove",
      "name": "이미지 배경 제거",
      "shortName": "배경 제거",
      "category": "image",
      "description": "이미지 배경을 제거하고 투명 PNG로 저장합니다.",
      "keywords": [
        "누끼",
        "배경 제거",
        "투명 PNG"
      ],
      "icon": "cutout",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-18",
      "order": 70
    },
    {
      "id": "video-thumbnail",
      "name": "영상 썸네일 추출기",
      "shortName": "썸네일 추출",
      "category": "video",
      "description": "동영상의 원하는 시점을 이미지 썸네일로 저장합니다.",
      "keywords": [
        "동영상",
        "썸네일",
        "프레임",
        "이미지 추출"
      ],
      "icon": "video",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-17",
      "order": 80
    },
    {
      "id": "video-compress",
      "name": "동영상 용량 줄이기",
      "shortName": "영상 압축",
      "category": "video",
      "description": "동영상의 해상도와 품질을 조절해 용량을 줄입니다.",
      "keywords": [
        "동영상 압축",
        "용량 줄이기",
        "MP4"
      ],
      "icon": "compress",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-15",
      "order": 90
    },
    {
      "id": "text-counter",
      "name": "글자수 세기",
      "shortName": "글자수 세기",
      "category": "writing",
      "description": "공백 포함·제외 글자수와 단어수, 문장수를 실시간 확인합니다.",
      "keywords": [
        "글자수",
        "단어수",
        "문장수",
        "자소서",
        "블로그"
      ],
      "icon": "writing",
      "url": "https://www.healing-mart.com/2025/02/the%20number%20of%20letters.html",
      "available": true,
      "updatedAt": "2026-07-21",
      "order": 100
    },
    {
      "id": "text-cleaner",
      "name": "문장 정리 도구",
      "shortName": "문장 정리",
      "category": "writing",
      "description": "불필요한 공백과 줄바꿈을 정리해 문장을 깔끔하게 만듭니다.",
      "keywords": [
        "공백 제거",
        "줄바꿈",
        "문장 정리",
        "텍스트"
      ],
      "icon": "clean",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-16",
      "order": 110
    },
    {
      "id": "slug-maker",
      "name": "URL 슬러그 만들기",
      "shortName": "슬러그 만들기",
      "category": "writing",
      "description": "제목을 검색 친화적인 URL 형식으로 변환합니다.",
      "keywords": [
        "URL",
        "슬러그",
        "SEO",
        "블로그 제목"
      ],
      "icon": "link",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-14",
      "order": 120
    },
    {
      "id": "date-calculator",
      "name": "날짜 계산기",
      "shortName": "날짜 계산",
      "category": "life",
      "description": "두 날짜 사이의 기간과 며칠 후 날짜를 계산합니다.",
      "keywords": [
        "날짜",
        "기간",
        "D-day",
        "며칠 후"
      ],
      "icon": "calendar",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-19",
      "order": 130
    },
    {
      "id": "qr-maker",
      "name": "QR 코드 만들기",
      "shortName": "QR 만들기",
      "category": "life",
      "description": "주소와 문자를 QR 코드 이미지로 만들어 저장합니다.",
      "keywords": [
        "QR",
        "큐알",
        "링크",
        "주소"
      ],
      "icon": "qr",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-13",
      "order": 140
    },
    {
      "id": "pdf-toolkit",
      "name": "PDF 도구 모음",
      "shortName": "PDF 도구",
      "category": "document",
      "description": "PDF 합치기, 나누기, 이미지 변환 등 자주 쓰는 기능을 모았습니다.",
      "keywords": [
        "PDF",
        "합치기",
        "나누기",
        "변환"
      ],
      "icon": "document",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-12",
      "order": 150
    },
    {
      "id": "audio-format",
      "name": "오디오 형식 변환기",
      "shortName": "오디오 변환",
      "category": "audio",
      "description": "MP3, WAV, M4A 등 오디오 형식을 변환합니다.",
      "keywords": [
        "MP3",
        "WAV",
        "M4A",
        "오디오 변환"
      ],
      "icon": "audio",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-11",
      "order": 160
    },
    {
      "id": "subtitle-converter",
      "name": "자막 형식 변환기",
      "shortName": "자막 변환",
      "category": "audio",
      "description": "SRT와 VTT 등 자막 형식을 서로 변환합니다.",
      "keywords": [
        "자막",
        "SRT",
        "VTT",
        "영상"
      ],
      "icon": "subtitle",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-10",
      "order": 170
    },
    {
      "id": "coordinate-converter",
      "name": "위도·경도 변환기",
      "shortName": "좌표 변환",
      "category": "data",
      "description": "도·분·초 좌표와 십진수 좌표를 서로 변환합니다.",
      "keywords": [
        "위도",
        "경도",
        "좌표",
        "GPS"
      ],
      "icon": "pin",
      "url": "https://www.healing-mart.com/2026/07/latlng-converter.html",
      "available": true,
      "updatedAt": "2026-07-09",
      "order": 180
    },
    {
      "id": "json-formatter",
      "name": "JSON 정리·검사기",
      "shortName": "JSON 정리",
      "category": "developer",
      "description": "JSON 코드를 보기 좋게 정리하고 오류 위치를 확인합니다.",
      "keywords": [
        "JSON",
        "포맷",
        "검사",
        "개발자"
      ],
      "icon": "developer",
      "url": "",
      "available": false,
      "updatedAt": "2026-07-08",
      "order": 190
    }
  ]
};

  window.HM_WEBTOOLS_DATA = DATA;
  window.HM_WEBTOOLS_DATA_SOURCE = "data-js";

  try {
    document.dispatchEvent(new CustomEvent("hm:webtools:data-ready", {
      detail: { version: DATA.version }
    }));
  } catch (error) {}
})(window, document);
