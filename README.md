# HealingMart Webtools Hub

힐링편의점의 빠른찾기 바텀시트와 토탈 웹도구 페이지를 제공하는 공개 배포 저장소입니다.

## 파일 구조

```text
healingmart-webtools-hub/
├─ index.html
├─ blogger-snippet.html
├─ js/
│  ├─ hm-webtools-data.v1.js
│  └─ hm-webtools-design.v1.js
├─ .nojekyll
└─ README.md
```

## 역할

- `js/hm-webtools-data.v1.js`
  - 카테고리
  - 도구 이름과 설명
  - 검색 키워드
  - 게시물 URL
  - 업데이트 날짜
  - 최신 도구 슬라이더 데이터

- `js/hm-webtools-design.v1.js`
  - 빠른찾기 바텀시트
  - 실시간 검색
  - 카테고리 필터
  - 새로 나온 도구 슬라이더
  - 토탈 웹도구 페이지 UI

## GitHub Pages 설정

1. 저장소 이름을 `healingmart-webtools-hub`로 생성합니다.
2. 이 ZIP의 파일을 저장소 루트에 업로드합니다.
3. `Settings → Pages`로 이동합니다.
4. `Deploy from a branch`를 선택합니다.
5. `main`과 `/(root)`를 선택한 뒤 저장합니다.

배포 주소:

```text
https://healingmart.github.io/healingmart-webtools-hub/
```

## Blogger 연결

`blogger-snippet.html`의 코드를 사용합니다.

빠른찾기 버튼에는 다음 속성이 있어야 합니다.

```html
data-hm-webtools-open
```

토탈 웹도구 페이지에는 다음 요소를 넣습니다.

```html
<div data-hm-webtools-page></div>
```

## 도구 추가

`js/hm-webtools-data.v1.js`의 `tools` 배열에 도구 객체를 추가합니다.

실제 주소가 연결된 도구:

```javascript
url: "https://실제주소",
available: true
```

아직 준비 중인 도구:

```javascript
url: "",
available: false
```

## 캐시 갱신

JS를 수정한 뒤 Blogger의 URL 버전을 올립니다.

```html
?v=1.0.1
```
