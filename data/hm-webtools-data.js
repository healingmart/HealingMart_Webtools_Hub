/*
 * HealingMart Webtools Data v5.5.0
 *
 * 총 도구 수 = settings.baseToolCount + 공개된 독립 도구 수
 *
 * 기존 카테고리에 도구 추가:
 * - tools 배열에 도구 객체만 추가
 *
 * 새 카테고리 추가:
 * - categories 배열에 카테고리 객체 추가
 * - tools 배열의 category 값에 해당 카테고리 id 사용
 */
(function(window, document) {
  "use strict";

  var DATA = {
  "version": "5.5.0",
  "updatedAt": "2026-07-25",
  "site": {
    "brand": "힐링편의점",
    "title": "무료 웹도구 모음",
    "description": "계산기, 변환기, 이미지, 글쓰기와 생활 웹도구를 한곳에서 빠르게 찾아보세요.",
    "homeUrl": "https://www.healing-mart.com/",
    "qnaUrl": "https://www.healing-mart.com/p/qna.html"
  },
  "settings": {
    "latestLimit": 8,
    "recentLimit": 10,
    "autoplayInterval": 4000,
    "showUnavailableTools": false,
    "searchPlaceholder": "도구 이름이나 기능을 검색하세요",
    "emptyMessage": "조건에 맞는 도구를 찾지 못했습니다.",
    "baseToolCount": 1400
  },
  "categories": [
    {
      "id": "image",
      "name": "이미지",
      "description": "자르기, 배경 제거, 이미지 편집",
      "icon": "image",
      "tone": "violet",
      "order": 10
    },
    {
      "id": "writing",
      "name": "글쓰기",
      "description": "글자수, 바이트, 문서 분석",
      "icon": "writing",
      "tone": "blue",
      "order": 20
    },
    {
      "id": "life",
      "name": "생활",
      "description": "생활, 금융, 건강 계산기",
      "icon": "life",
      "tone": "green",
      "order": 30
    },
    {
      "id": "document",
      "name": "문서, 변환",
      "description": "파일, 단위, 형식 변환",
      "icon": "document",
      "tone": "orange",
      "order": 40
    },
    {
      "id": "data",
      "name": "데이터, 좌표",
      "description": "위경도, 주소, 좌표 변환",
      "icon": "data",
      "tone": "teal",
      "order": 50
    },
    {
      "id": "video",
      "name": "영상",
      "description": "영상 변환, 제작 보조",
      "icon": "video",
      "tone": "rose",
      "order": 60
    },
    {
      "id": "audio",
      "name": "오디오",
      "description": "음원, 음성, 자막",
      "icon": "audio",
      "tone": "pink",
      "order": 70
    },
    {
      "id": "developer",
      "name": "개발자",
      "description": "코드와 데이터 정리",
      "icon": "developer",
      "tone": "slate",
      "order": 80
    }
  ],
  "tools": [
    {
      "id": "calculator-hub",
      "name": "계산기 모음",
      "shortName": "계산기 모음",
      "category": "life",
      "description": "생활, 금융, 건강, 날짜, 단위와 수학 계산기를 한곳에서 이용합니다.",
      "keywords": [
        "계산기",
        "생활 계산기",
        "금융 계산기",
        "건강 계산기",
        "날짜 계산기",
        "단위 계산"
      ],
      "icon": "calculator",
      "url": "https://www.healing-mart.com/2026/07/calculator.html",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2026-07-20",
      "order": 10,
      "includedInBase": true
    },
    {
      "id": "converter-hub",
      "name": "컨버터 모음",
      "shortName": "변환도구 모음",
      "category": "document",
      "description": "파일, 문서, 이미지, 영상, 오디오와 단위 변환 기능을 한곳에서 이용합니다.",
      "keywords": [
        "컨버터",
        "변환기",
        "파일 변환",
        "문서 변환",
        "이미지 변환",
        "단위 변환"
      ],
      "icon": "convert",
      "url": "https://www.healing-mart.com/search/label/%EB%B3%80%ED%99%98%EB%8F%84%EA%B5%AC",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2026-07-23",
      "order": 20,
      "includedInBase": true
    },
    {
      "id": "text-counter",
      "name": "글자수, 바이트 분석기",
      "shortName": "글자수 세기",
      "category": "writing",
      "description": "공백 포함, 제외 글자수, 단어수, UTF-8 바이트와 문장 가독성을 확인합니다.",
      "keywords": [
        "글자수 세기",
        "글자수",
        "바이트",
        "단어수",
        "문장수",
        "자기소개서",
        "블로그 원고",
        "텍스트 분석"
      ],
      "icon": "writing",
      "url": "https://www.healing-mart.com/2025/02/the%20number%20of%20letters.html",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2025-02-10",
      "order": 30,
      "includedInBase": false
    },
    {
      "id": "background-remove",
      "name": "배경 제거, 누끼따기",
      "shortName": "배경 제거",
      "category": "image",
      "description": "이미지의 배경을 제거하고 투명 배경 결과를 만드는 웹도구입니다.",
      "keywords": [
        "배경 제거",
        "누끼따기",
        "누끼",
        "투명 배경",
        "투명 PNG",
        "이미지 배경"
      ],
      "icon": "cutout",
      "url": "https://www.healing-mart.com/2025/02/remove%20bg.html",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2025-02-11",
      "order": 40,
      "includedInBase": false
    },
    {
      "id": "multi-image-crop",
      "name": "이미지 멀티 자르기",
      "shortName": "도형 이미지 자르기",
      "category": "image",
      "description": "원형, 사각형, 삼각형, 다각형과 별 모양으로 이미지를 자릅니다.",
      "keywords": [
        "이미지 자르기",
        "도형 자르기",
        "원형 자르기",
        "사각형 자르기",
        "삼각형",
        "별 모양",
        "PNG"
      ],
      "icon": "crop",
      "url": "https://www.healing-mart.com/2025/03/multi-cutting-tool.html",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2025-03-10",
      "order": 50,
      "includedInBase": false
    },
    {
      "id": "circle-image-crop",
      "name": "원형, 타원형 이미지 자르기",
      "shortName": "원형 이미지 자르기",
      "category": "image",
      "description": "프로필과 썸네일 이미지를 원형 또는 타원형으로 잘라 투명 PNG로 저장합니다.",
      "keywords": [
        "원형 자르기",
        "타원형 자르기",
        "프로필 이미지",
        "썸네일",
        "투명 PNG"
      ],
      "icon": "crop",
      "url": "https://www.healing-mart.com/2025/02/a%20sentence%20translator.html",
      "available": true,
      "verified": true,
      "updatedAt": "2025-03-01",
      "order": 60,
      "includedInBase": false
    },
    {
      "id": "square-image-crop",
      "name": "정사각형, 직사각형 이미지 자르기",
      "shortName": "사각형 이미지 자르기",
      "category": "image",
      "description": "상품 사진, 배너와 썸네일을 정사각형 또는 직사각형으로 정교하게 자릅니다.",
      "keywords": [
        "정사각형 자르기",
        "직사각형 자르기",
        "상품 이미지",
        "배너",
        "썸네일",
        "PNG"
      ],
      "icon": "crop",
      "url": "https://www.healing-mart.com/2025/02/Cutting%20Image.html",
      "available": true,
      "verified": true,
      "updatedAt": "2025-02-10",
      "order": 70,
      "includedInBase": false
    },
    {
      "id": "coordinate-converter",
      "name": "위경도, 주소 좌표 변환기",
      "shortName": "위경도 변환기",
      "category": "data",
      "description": "주소를 위도, 경도로 찾고 좌표 형식을 변환해 지도에서 확인합니다.",
      "keywords": [
        "위경도 변환기",
        "주소 좌표",
        "위도",
        "경도",
        "GPS",
        "좌표 변환",
        "카카오맵"
      ],
      "icon": "pin",
      "url": "https://www.healing-mart.com/2026/07/latlng-converter.html",
      "available": true,
      "featured": true,
      "verified": true,
      "updatedAt": "2026-07-10",
      "order": 80,
      "includedInBase": false
    },
    {
      "id": "image-renamer",
      "name": "이미지 파일명 정리기",
      "shortName": "파일명 정리기",
      "category": "image",
      "description": "여러 이미지의 이름을 번호 규칙에 따라 일괄 정리합니다.",
      "keywords": [
        "파일명 변경",
        "이미지 이름",
        "일괄 이름 변경",
        "001",
        "ZIP"
      ],
      "icon": "rename",
      "url": "",
      "available": false,
      "verified": false,
      "status": "공개 주소 확인 대기",
      "updatedAt": "2026-07-24",
      "order": 90,
      "includedInBase": false
    },
    {
      "id": "image-watermark",
      "name": "이미지 워터마크 도구",
      "shortName": "워터마크",
      "category": "image",
      "description": "이미지에 글자 또는 로고 워터마크를 적용합니다.",
      "keywords": [
        "워터마크",
        "로고",
        "저작권",
        "이미지 워터마크"
      ],
      "icon": "watermark",
      "url": "",
      "available": false,
      "verified": false,
      "status": "공개 주소 확인 대기",
      "updatedAt": "2026-07-23",
      "order": 100,
      "includedInBase": false
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
