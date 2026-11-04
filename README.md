# GOanything

대학 클라이밍 동아리 웹사이트. 빌드 과정이 없는 정적 사이트로, GitHub Pages에
그대로 올려서 운영합니다.

## 구조

```
.
├── index.html          원페이지 메인 (소개 · 활동 · 초보 안내 · 일정 · 갤러리 · FAQ · 가입)
├── gallery.html        전체 사진 + 라이트박스
├── join.html           가입 안내 + 신청 폼 자리
├── assets/
│   ├── css/
│   │   ├── base.css    디자인 토큰(색·폰트·여백), 리셋, 버튼·배지 등 공용 요소
│   │   └── main.css    헤더, 섹션별 레이아웃, 갤러리, 푸터, 반응형
│   ├── js/
│   │   ├── main.js     공용 헬퍼, 헤더·모바일 메뉴, 동아리 정보 주입, FAQ 렌더
│   │   ├── schedule.js 일정 리스트 렌더
│   │   └── gallery.js  갤러리 그리드 + 라이트박스
│   └── img/            히어로 · 갤러리 이미지 (현재는 자리표시용 SVG)
└── data/               ← 내용 수정은 대부분 여기서만 하면 됩니다
    ├── club.json       동아리 기본 정보 (이름 · 암장 · 회비 · 모임 시간 · 연락처 · 모집)
    ├── schedule.json   일정
    ├── gallery.json    사진 목록
    └── faq.json        자주 묻는 질문
```

## 내용 수정하기

HTML을 건드리지 않고 `data/*.json`만 고치면 사이트 전체에 반영됩니다.

| 하고 싶은 일 | 고칠 파일 |
| --- | --- |
| 동아리 이름 · 학교 · 암장 · 회비 · 인스타 계정 변경 | `data/club.json` |
| 모집 중 / 마감 전환 | `data/club.json` → `recruit.open` |
| 가입 신청 폼 연결 | `data/club.json` → `recruit.formUrl` |
| 일정 추가 · 삭제 | `data/schedule.json` |
| 사진 추가 | `assets/img/gallery/` 에 넣고 `data/gallery.json` 에 한 줄 추가 |
| FAQ 추가 | `data/faq.json` |

HTML 안에는 기본값이 들어 있고 JSON 값이 그 위를 덮어씁니다. 그래서 JSON에 오타가
있거나 값을 비워 둬도 페이지가 깨지지 않습니다.

지난 일정은 자동으로 숨겨지고, 가장 가까운 일정에 "다음 모임" 배지가 붙습니다.

## 로컬에서 보기

`data/*.json`을 `fetch`로 읽기 때문에 **HTML 파일을 더블클릭해서 열면 일정·갤러리·FAQ가
비어 보입니다.** 간단한 웹 서버로 띄워주세요.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 배포 (GitHub Pages)

1. GitHub 저장소 → **Settings** → **Pages**
2. Source를 **Deploy from a branch**, 브랜치를 `main` / 폴더를 `/ (root)` 로 지정
3. 저장하면 `https://<사용자명>.github.io/GOanything/` 에 배포됩니다

빌드 도구가 없으니 `main`에 푸시하는 것만으로 배포가 끝납니다.

## 아직 채워야 하는 것

현재 내용은 **실제 정보가 아닌 자리표시용**입니다. 아래를 채우면 사이트가 완성됩니다.

- [ ] 동아리 이름 · 학교명 (`data/club.json`)
- [ ] 홈 암장 이름 · 주소 · 지도 링크
- [ ] 정기 모임 요일 · 시간
- [ ] 회비 금액과 포함 항목
- [ ] 인스타그램 계정 주소, 카카오 오픈채팅 링크
- [ ] 모집 기간 · 정원
- [ ] 가입 신청 폼 주소 (Google Forms 또는 Formspree)
- [ ] 실제 활동 사진 (현재는 자리표시용 SVG)
- [ ] 난이도 색 체계 — 암장마다 다르므로 홈 암장 기준으로 수정 (`index.html`)

## 메모

- 다크 테마 전용입니다. 클라이밍 사진이 어두운 배경에서 가장 잘 보입니다.
- 외부 라이브러리를 쓰지 않습니다. 폰트(Pretendard)만 CDN에서 불러옵니다.
- 헤더와 푸터는 세 페이지에 각각 들어 있습니다. 메뉴를 고칠 때는 세 파일을 모두
  수정해야 합니다. 페이지가 더 늘어나면 정적 사이트 생성기 도입을 고려하세요.
