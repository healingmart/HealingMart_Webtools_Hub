# HealingMart Webtools Hub v3.1.0

## 이번 수정

- Blogger 외부 스크립트에서 `crossorigin="anonymous"` 제거
- 동적 데이터 로더의 `script.crossOrigin` 제거
- GitHub Pages 실패 시 jsDelivr CDN을 자동으로 한 번 더 시도
- Blogger 페이지는 한 번만 설치하고 이후 `js/hm-webtools-data.js`만 갱신
- 하단 메뉴는 빠른찾기·최근사용·신규도구·카테고리 4개
- 웹도구 영역이 끝나면 하단 메뉴 자동 숨김

## 저장소 구조

```text
healingmart-webtools-hub/
├─ index.html
├─ blogger-webtools-page.html
├─ js/
│  ├─ hm-webtools-data.js
│  └─ hm-webtools-design.js
├─ README.md
└─ .nojekyll
```

## 반드시 확인할 주소

GitHub Pages 배포 후 다음 두 주소를 브라우저 주소창에서 직접 열었을 때
JavaScript 코드가 보여야 합니다.

```text
https://healingmart.github.io/healingmart-webtools-hub/js/hm-webtools-data.js
https://healingmart.github.io/healingmart-webtools-hub/js/hm-webtools-design.js
```

404 페이지가 보이면 저장소 안에 상위 폴더가 한 번 더 들어간 것입니다.
`js` 폴더가 저장소 최상단에 오도록 파일을 옮겨야 합니다.

## 적용 순서

1. ZIP 압축을 풉니다.
2. ZIP 안의 파일과 `js` 폴더를 저장소 최상단에 덮어씁니다.
3. GitHub Pages 배포가 완료될 때까지 기다립니다.
4. 위의 두 JS 주소를 직접 확인합니다.
5. Blogger `/p/webtools.html`의 HTML 전체를 `blogger-webtools-page.html` 내용으로 교체합니다.
6. 강력 새로고침을 실행합니다.

## 이후 도구 업데이트

Blogger 페이지는 수정하지 않습니다.

```text
js/hm-webtools-data.js
```

이 파일의 도구 목록만 수정합니다.
