# Cloudflare Pages 배포

이 프로젝트는 정적 웹게임이다. 워드프레스와 별도 서버 없이 실행된다. 빌드는 배포 파일을 `dist/`에 복사하는 작업만 하며 외부 패키지를 설치하지 않는다.

Pages 프로젝트에서 이 저장소를 연결하고 프레임워크는 None, 빌드 명령은 `node scripts/build.cjs`, 출력 디렉터리는 `dist`로 설정한다. 원하는 배포 브랜치를 지정한다. 테스트 파일과 문서는 배포에서 제외되고 `_headers`, `ads.txt`, `assets`, `css`, `js`, `index.html`만 포함된다. [Cloudflare 공식 빌드 설정](https://developers.cloudflare.com/pages/configuration/build-configuration/)

배포 후 Pages의 Custom domains에서 사용할 하위도메인을 등록한다. 워드프레스 본 사이트의 도메인과 루트 DNS 레코드는 유지한다. 도메인이 Cloudflare에서 관리되지 않으면 Pages에서 안내하는 해당 하위도메인 DNS 레코드를 등록한다.

실제 하위도메인이 확정되면 Pages의 환경 변수 `SITE_URL`에 `https://실제게임주소`를 설정하고 다시 빌드한다. 빌드가 HTML의 `og:image`를 절대 URL로 치환한다. 미리보기에서는 `SITE_URL`이 없을 때 Cloudflare가 제공하는 `CF_PAGES_URL`을 사용한다. 로컬에서 빌드할 때 둘 다 없으면 상대 경로를 유지한다. 런타임 JavaScript 치환에 의존하지 않는다.

애드센스 광고는 시작·결과 화면의 별도 영역에만 둔다. 게임 캔버스, 이동 버튼, 조사 버튼, 대화 선택지 내부에는 두지 않는다. 사이트 등록·심사·광고 게재 상태는 AdSense 계정에서 확인한다. 개발 중에는 광고를 클릭하지 않는다.

최종 확인: HTTPS, 이미지와 JS 로딩, 모바일 이동/조사, 엔딩 수집, 공유 URL, 광고 영역, 실제 도메인의 ads.txt 응답. 이 문서는 배포 준비용이며 아직 배포를 수행하지 않았다.
