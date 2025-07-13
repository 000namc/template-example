# Claude 작업 가이드

## 프로젝트 구조 및 명령어

### 개발 환경
- **프레임워크**: React + TypeScript + Vite
- **스타일링**: Tailwind CSS + shadcn/ui
- **패키지 매니저**: npm

### 주요 명령어
```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run preview      # 빌드된 파일 미리보기
npm run deploy       # GitHub Pages 배포
```

### 테스트 및 린트 명령어
- 코드 작업 완료 후 반드시 `npm run lint` 실행하여 코드 품질 확인
- 타입 체크는 TypeScript 컴파일러를 통해 자동으로 수행됨

## 파일 생성 위치 규칙

### Artifacts 생성 시
- React 프로젝트에서는 **반드시 TSX 컴포넌트**로 생성할 것 (HTML 파일 안됨)
- 독립적인 웹 아티팩트는 `src/artifacts/` 디렉토리에 생성할 것
- 루트 디렉토리에 임시로 생성하지 말고 처음부터 올바른 위치에 생성하기
- shadcn/ui 컴포넌트와 Tailwind CSS 클래스 활용하기

### 컴포넌트 생성 시
- React 컴포넌트는 `src/components/` 디렉토리에 생성
- UI 컴포넌트는 `src/components/ui/` 디렉토리 활용 (shadcn/ui)
- 렌더러 컴포넌트는 `src/components/renderers/` 디렉토리

### 라이브러리 및 유틸리티
- 공통 유틸리티는 `src/lib/` 디렉토리에 생성
- 타입 정의는 `src/lib/types.ts`에 추가

## 기술 스택 및 의존성

### 주요 라이브러리
- **UI**: @radix-ui 컴포넌트 라이브러리 사용
- **폼**: react-hook-form + zod validation
- **라우팅**: react-router-dom
- **차트**: recharts
- **아이콘**: lucide-react
- **스타일링**: tailwindcss + class-variance-authority

### 코딩 규칙
- TypeScript 엄격 모드 사용
- ESLint 규칙 준수 필수
- 컴포넌트는 named export 사용
- shadcn/ui 컴포넌트 패턴 따르기

## 배포 및 환경설정

### GitHub Pages 배포
- `npm run deploy` 명령어로 자동 배포
- `package.json`의 homepage 필드 업데이트 필요
- GitHub repository URL 설정 필요

### 설정 파일들
- `TOYBOX_CONFIG.json`: TOYBOX 메타데이터 설정
- `components.json`: shadcn/ui 설정
- `vite.config.ts`: 빌드 설정
- `tailwind.config.mjs`: Tailwind CSS 설정

## 교훈 및 주의사항
- 사용자가 artifact를 요청할 때는 프로젝트 구조를 먼저 확인하고 적절한 위치에 파일을 생성해야 함
- `src/artifacts/` 폴더가 존재하는 경우 해당 위치를 우선 사용할 것
- 코드 작업 완료 후 반드시 lint 명령어 실행
- 새로운 의존성 추가 시 package.json 확인 후 기존 라이브러리 우선 활용