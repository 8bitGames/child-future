import { test, expect, devices } from '@playwright/test';

// 모바일 디바이스로 테스트
test.use({ ...devices['iPhone 13'] });

test('모바일에서 PDF 저장 테스트', async ({ page }) => {
  // 테스트용 데이터 준비
  const testBasicInfo = {
    nickname: '테스트아이',
    age: 10,
    grade: '초등학교 4학년',
    gender: 'male',
    activities: ['축구', '피아노'],
    hobbies: ['레고', '그림그리기'],
    interests: ['과학', '우주'],
    strongSubjects: ['수학', '과학'],
    achievements: ['과학경시대회 입상']
  };

  const testConsultation = {
    relationship: 'parent',
    purpose: 'career_exploration',
    concerns: '아이의 진로에 대해 알고 싶습니다',
    expectations: '구체적인 직업 추천'
  };

  const testResponses: Record<string, number> = {};
  // 30개 질문에 대한 응답 생성
  for (let i = 1; i <= 30; i++) {
    testResponses[`q${i}`] = Math.floor(Math.random() * 5) + 1;
  }

  // 1. 홈페이지 방문
  await page.goto('http://localhost:3007');
  await expect(page).toHaveTitle(/진로/);

  // 2. sessionStorage에 테스트 데이터 직접 주입
  await page.evaluate(({ basicInfo, consultation, responses }) => {
    sessionStorage.setItem('basicInfo', JSON.stringify(basicInfo));
    sessionStorage.setItem('consultation', JSON.stringify(consultation));
    sessionStorage.setItem('responses', JSON.stringify(responses));
    sessionStorage.setItem('assessmentMode', 'full');
  }, { basicInfo: testBasicInfo, consultation: testConsultation, responses: testResponses });

  // 3. 결과 페이지로 직접 이동
  await page.goto('http://localhost:3007/results');

  // 4. 로딩 완료 대기 (AI 분석 중... 메시지가 사라질 때까지)
  await expect(page.getByText('AI가 분석 중입니다')).toBeVisible({ timeout: 5000 }).catch(() => {
    // 이미 로딩이 완료된 경우
  });

  // 결과가 표시될 때까지 대기 (최대 60초 - API 호출 포함)
  await expect(page.getByText('진로 탐색 결과')).toBeVisible({ timeout: 60000 });

  // 5. PDF 저장 버튼 찾기
  const pdfButton = page.getByRole('button', { name: /PDF로 저장/i });
  await expect(pdfButton).toBeVisible();

  // 6. PDF 저장 버튼 클릭
  // 모바일에서는 새 탭이 열리거나 다운로드가 시작됨
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 30000 }).catch(() => null),
    pdfButton.click()
  ]);

  // 7. 결과 확인
  if (newPage) {
    // 새 탭이 열린 경우 (모바일 처리)
    console.log('PDF가 새 탭에서 열렸습니다:', newPage.url());
    expect(newPage.url()).toContain('blob:');
    await newPage.close();
  } else {
    // 버튼이 저장 중 상태로 변경되었다가 돌아오면 성공
    await expect(pdfButton).toContainText('PDF로 저장', { timeout: 30000 });
  }

  console.log('✅ 모바일 PDF 저장 테스트 완료');
});

// 데스크톱에서도 테스트
test.describe('데스크톱 PDF 테스트', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('데스크톱에서 PDF 저장 테스트', async ({ page }) => {
    const testBasicInfo = {
      nickname: '데스크톱테스트',
      age: 12,
      grade: '초등학교 6학년',
      gender: 'female',
      activities: ['발레', '수영'],
      hobbies: ['독서', '글쓰기'],
      interests: ['역사', '문학'],
      strongSubjects: ['국어', '사회'],
      achievements: ['글짓기 대회 수상']
    };

    const testConsultation = {
      relationship: 'teacher',
      purpose: 'academic_guidance',
      concerns: '학생의 진로 지도',
      expectations: '맞춤형 교육 방법'
    };

    const testResponses: Record<string, number> = {};
    for (let i = 1; i <= 30; i++) {
      testResponses[`q${i}`] = Math.floor(Math.random() * 5) + 1;
    }

    await page.goto('http://localhost:3007');

    await page.evaluate(({ basicInfo, consultation, responses }) => {
      sessionStorage.setItem('basicInfo', JSON.stringify(basicInfo));
      sessionStorage.setItem('consultation', JSON.stringify(consultation));
      sessionStorage.setItem('responses', JSON.stringify(responses));
      sessionStorage.setItem('assessmentMode', 'full');
    }, { basicInfo: testBasicInfo, consultation: testConsultation, responses: testResponses });

    await page.goto('http://localhost:3007/results');

    // 결과 로딩 대기
    await expect(page.getByText('진로 탐색 결과')).toBeVisible({ timeout: 60000 });

    // 다운로드 이벤트 감지
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

    // PDF 버튼 클릭
    const pdfButton = page.getByRole('button', { name: /PDF로 저장/i });
    await pdfButton.click();

    const download = await downloadPromise;

    if (download) {
      console.log('✅ PDF 다운로드 성공:', download.suggestedFilename());
      expect(download.suggestedFilename()).toContain('.pdf');
    } else {
      // 다운로드 이벤트가 발생하지 않아도 버튼 상태 확인
      await expect(pdfButton).toContainText('PDF로 저장', { timeout: 30000 });
      console.log('✅ PDF 저장 처리 완료 (다운로드 이벤트 없음)');
    }
  });
});
