# HealingMart Webtools Hub v5.1.0

## 디자인

- 새로 나온 도구: 기존 파스텔 자동 슬라이더 유지
- 카테고리: 기존 큰 카테고리 카드 유지
- 전체 웹도구: 작은 목록형 카드로 단순화
- 주소가 없는 준비 중 도구는 숨김

## 평소 수정하는 파일

```text
data/hm-webtools-data.js
```

신규 도구 추가, 주소 변경, 분류 변경, 업데이트 날짜 변경은 이 파일만 수정합니다.

```javascript
{
  id: "image-renamer",
  name: "이미지 파일명 정리기",
  category: "image",
  description: "여러 이미지의 이름을 일괄 정리합니다.",
  keywords: ["이미지 이름", "파일명 변경"],
  icon: "rename",
  url: "실제 게시물 주소",
  available: true,
  updatedAt: "2026-07-24",
  order: 30
}
```

화면에 표시하려면 `available: true`와 실제 `url`이 모두 필요합니다.

## 개별 도구의 웹도구 더보기

공유 파일:

```text
js/hm-webtools-more.js
```

도구의 기존 하단 메뉴에 버튼을 추가합니다.

```html
<button
  type="button"
  data-hm-webtools-more="image"
  data-current-tool="image-renamer"
>
  웹도구 더보기
</button>
```

페이지 마지막에 공유 JS를 한 번 연결합니다.

```html
<script src="https://cdn.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/js/hm-webtools-more.js"></script>
```

버튼을 누르면 같은 카테고리의 연결된 도구만 바텀시트에 표시됩니다.

## 저장소 구조

```text
healingmart-webtools-hub/
├─ data/
│  └─ hm-webtools-data.js
├─ js/
│  └─ hm-webtools-more.js
├─ blogger-webtools-post-v5.1.html
├─ blogger-tool-more-snippet.html
├─ MORE-CATEGORY-GUIDE.txt
└─ README.md
```

## CDN 캐시 갱신

data.js를 수정한 뒤 바로 반영되지 않으면 아래 주소를 한 번 엽니다.

```text
https://purge.jsdelivr.net/gh/healingmart/healingmart-webtools-hub@main/data/hm-webtools-data.js
```
