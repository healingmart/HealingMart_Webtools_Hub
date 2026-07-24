# HealingMart Webtools Hub v3.0.0

## 핵심 운영 방식

Blogger의 `/p/webtools.html` 코드는 한 번만 등록합니다. 이후 신규 도구와 URL은 `js/hm-webtools-data.js`만 수정합니다.

## 업로드 구조

```text
healingmart-webtools-hub/
├─ index.html
├─ blogger-webtools-page.html
├─ js/
│  ├─ hm-webtools-data.js
│  └─ hm-webtools-design.js
├─ .nojekyll
└─ README.md
```

## 적용 순서

1. ZIP을 풉니다.
2. 저장소 루트에 모든 파일을 덮어씁니다.
3. GitHub Pages가 `main / root`를 배포하도록 설정합니다.
4. Blogger `/p/webtools.html`을 HTML 보기로 열고 `blogger-webtools-page.html` 전체 코드를 붙입니다.

## 이후 업데이트

- 신규 도구 추가: `js/hm-webtools-data.js`만 수정
- 디자인 변경: `js/hm-webtools-design.js` 수정
- Blogger 페이지 HTML은 수정하지 않음

## 하단 메뉴

빠른찾기 / 최근사용 / 신규도구 / 카테고리

웹도구 앱의 실제 끝 지점이 화면에 들어오면 하단 메뉴가 자동으로 내려가 숨겨집니다.
