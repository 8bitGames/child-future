import { test, expect } from '@playwright/test';

// PDF 다운로드 문제 진단을 위한 디버깅 테스트
test('PDF 다운로드 디버깅', async ({ page }) => {
  const consoleLogs: string[] = [];
  const consoleErrors: string[] = [];

  // 콘솔 로그 캡처
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // 페이지 오류 캡처
  page.on('pageerror', (error) => {
    consoleErrors.push(`[PAGE ERROR] ${error.message}`);
  });

  // 1. 홈페이지 방문 및 데이터 설정
  await page.goto('http://localhost:3007');

  // 2. 테스트 데이터 설정 (객체가 아닌 배열 형식으로)
  await page.evaluate(() => {
    const basicInfo = {
      nickname: 'PDF테스트',
      age: 10,
      grade: '초등학교 4학년',
      gender: 'male',
      activities: ['축구', '피아노'],
      hobbies: ['레고', '그림그리기'],
      interests: ['과학', '우주'],
      strongSubjects: ['수학', '과학'],
      achievements: ['과학경시대회 입상'],
      dreamJob: ['과학자']
    };

    const consultation = {
      relationship: 'parent',
      purpose: 'career_exploration',
      concerns: '아이의 진로',
      expectations: '구체적인 추천',
      schoolFeedback: '논리적 사고가 뛰어남',
      academyFeedback: '수학을 잘함'
    };

    // responses를 배열이 아닌 객체로 저장 (기존 테스트와 동일)
    const responses: Record<string, number> = {};
    for (let i = 1; i <= 30; i++) {
      responses[`q${i}`] = 3;
    }

    sessionStorage.setItem('basicInfo', JSON.stringify(basicInfo));
    sessionStorage.setItem('consultation', JSON.stringify(consultation));
    sessionStorage.setItem('responses', JSON.stringify(responses));
    sessionStorage.setItem('assessmentMode', 'full');
  });

  // 3. 결과 페이지로 이동
  await page.goto('http://localhost:3007/results');

  // 4. 결과 로딩 대기 (최대 120초)
  console.log('결과 페이지 로딩 대기 중...');

  // 로딩 또는 결과 또는 오류 대기
  const startTime = Date.now();
  let resultLoaded = false;
  let errorOccurred = false;

  while (Date.now() - startTime < 120000) {
    const hasResult = await page.getByText('진로 탐색 결과').isVisible().catch(() => false);
    const hasError = await page.getByText('오류 발생').isVisible().catch(() => false);
    const hasLoading = await page.getByText('AI가 분석 중입니다').isVisible().catch(() => false);

    if (hasResult) {
      resultLoaded = true;
      console.log('결과 페이지 로딩 완료');
      break;
    }
    if (hasError) {
      errorOccurred = true;
      console.log('오류 발생 - 결과 분석 실패');
      break;
    }
    if (hasLoading) {
      console.log('아직 로딩 중...');
    }
    await page.waitForTimeout(3000);
  }

  // 스크린샷 저장
  await page.screenshot({ path: 'test-results/pdf-debug-page.png', fullPage: true });

  // 오류 발생 시 분석
  if (errorOccurred) {
    console.log('\n=== API 오류 발생 ===');
    console.log('콘솔 오류:', consoleErrors);

    // API 응답 확인을 위해 직접 호출
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              basicInfo: JSON.parse(sessionStorage.getItem('basicInfo') || '{}'),
              consultation: JSON.parse(sessionStorage.getItem('consultation') || '{}'),
              responses: JSON.parse(sessionStorage.getItem('responses') || '{}'),
              timestamp: new Date().toISOString()
            },
            mode: 'full'
          })
        });
        const data = await response.json();
        return { status: response.status, data };
      } catch (e) {
        return { error: String(e) };
      }
    });
    console.log('API 응답:', JSON.stringify(apiResponse, null, 2));

    // 테스트 종료 - PDF 테스트 불가
    console.log('\n결과 페이지 로딩 실패로 PDF 테스트 불가');
    return;
  }

  if (!resultLoaded) {
    console.log('타임아웃 - 결과 페이지 로딩 실패');
    return;
  }

  // 4.5. AI 맞춤 직업 추천 로딩 완료 대기
  console.log('AI 맞춤 직업 추천 로딩 대기 중...');

  const aiStartTime = Date.now();
  while (Date.now() - aiStartTime < 60000) {
    // AI 추천 로딩 중인지 확인
    const isAiLoading = await page.getByText('AI가 맞춤 직업을 분석하고 있습니다').isVisible().catch(() => false);

    if (!isAiLoading) {
      // 로딩이 끝났는지 확인 (실제 추천 직업이 표시되었거나 오류 메시지가 표시됨)
      const hasAiJobs = await page.locator('[data-pdf-section]:last-child').isVisible().catch(() => false);
      if (hasAiJobs) {
        console.log('AI 맞춤 직업 추천 로딩 완료');
        break;
      }
    } else {
      console.log('AI 추천 직업 로딩 중...');
    }
    await page.waitForTimeout(2000);
  }

  // 페이지 끝까지 스크롤하여 모든 콘텐츠 렌더링 확인
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // 5. PDF 버튼 찾기
  const pdfButton = page.getByRole('button', { name: /PDF로 저장/i });
  const isButtonVisible = await pdfButton.isVisible().catch(() => false);

  if (!isButtonVisible) {
    console.log('PDF 버튼이 보이지 않음');
    console.log('콘솔 로그:', consoleLogs.slice(-20));
    return;
  }

  console.log('PDF 버튼 발견, 클릭 시도...');

  // 6. 다운로드 이벤트 감지 준비
  const downloadPromise = page.waitForEvent('download', { timeout: 60000 }).catch((e) => {
    console.log('다운로드 이벤트 없음:', e.message);
    return null;
  });

  // 7. PDF 버튼 클릭
  await pdfButton.click();
  console.log('PDF 버튼 클릭됨');

  // 8. PDF 생성 대기
  await page.waitForTimeout(5000);

  // 스크린샷
  await page.screenshot({ path: 'test-results/pdf-debug-after-click.png', fullPage: true });

  // 9. 다운로드 확인
  const download = await downloadPromise;

  if (download) {
    console.log('✅ PDF 다운로드 성공:', download.suggestedFilename());
    await download.saveAs(`test-results/${download.suggestedFilename()}`);
  } else {
    console.log('❌ PDF 다운로드 실패');
    console.log('\n=== 콘솔 오류 ===');
    consoleErrors.forEach(err => console.log(err));
    console.log('\n=== 최근 콘솔 로그 ===');
    consoleLogs.slice(-30).forEach(log => console.log(log));
  }

  // 버튼 상태 확인
  const buttonText = await pdfButton.textContent();
  console.log('버튼 상태:', buttonText);
});
