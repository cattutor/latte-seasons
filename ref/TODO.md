# TODO

## 실행/검증 루틴 정리 (현재 기준)

### 실행 방식 판단
- 현재 프로젝트는 `index.html` + `style.css` + `script.js` 정적 참조 구조이며, 번들러/패키지 설정 파일(`package.json`, `vite.config.*`)이 없음.
- 코드 내 `fetch`, `import module`, `serviceWorker` 의존이 없어 **기본 실행은 `index.html` 더블클릭(file://)으로 가능**.
- 다만 브라우저별 정책 차이(오디오 autoplay/보안 정책)와 검증 일관성을 위해 **권장 실행은 로컬 서버**.

### 로컬 서버 실행(권장 순서)
1. `python -m http.server 8000`
   - 브라우저에서 `http://localhost:8000`
2. `npx serve .`
   - 출력된 로컬 주소 접속
3. `vite` 도입
   - 현재는 불필요(정적 파일 프로젝트). 향후 모듈화/빌드 체인이 필요해질 때만 도입 검토

### 기본 체크리스트
- [ ] 페이지 로드 정상 (`index.html` 진입 후 UI 렌더링 확인)
- [ ] 콘솔 에러 0 (DevTools Console 기준)
- [ ] 입력 동작 정상
  - [ ] 마우스 클릭/홀드 선택지 동작
  - [ ] 키보드 입력/포커스 이동 시 치명적 오류 없음
