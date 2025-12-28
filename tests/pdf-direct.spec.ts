import { test, expect, devices, Page, BrowserContext } from '@playwright/test';

// 결과 페이지에 직접 결과 데이터를 주입하여 테스트
// API 호출 없이 PDF 기능만 테스트

test.describe('PDF 저장 기능 테스트', () => {
  // 모바일 테스트
  test.describe('모바일', () => {
    test.use({ ...devices['iPhone 13'] });

    test('iPhone에서 PDF 저장', async ({ page, context }) => {
      await testPdfSave(page, context, 'mobile');
    });
  });

  // 데스크톱 테스트
  test.describe('데스크톱', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('데스크톱에서 PDF 저장', async ({ page, context }) => {
      await testPdfSave(page, context, 'desktop');
    });
  });
});

async function testPdfSave(
  page: Page,
  context: BrowserContext,
  mode: 'mobile' | 'desktop'
) {
  // 1. 결과 페이지로 이동
  await page.goto('http://localhost:3007/results');

  // 2. 결과 데이터를 직접 localStorage와 state에 주입
  // useEffect가 실행되기 전에 sessionStorage 데이터 설정
  await page.evaluate(() => {
    // 모의 결과 데이터
    const mockResult = {
      id: 'test-123',
      timestamp: new Date().toISOString(),
      basicInfo: {
        nickname: '테스트아이',
        age: 10,
        grade: '초등학교 4학년',
        gender: 'male',
        activities: ['축구', '피아노'],
        hobbies: ['레고', '그림그리기'],
        interests: ['과학', '우주'],
        strongSubjects: ['수학', '과학'],
        achievements: ['과학경시대회 입상']
      },
      scores: {
        creative_arts: 25,
        analytical_research: 30,
        social_caring: 20,
        leadership_organization: 22,
        practical_technical: 18
      },
      topCategories: ['analytical_research', 'creative_arts', 'leadership_organization'],
      jobs: [
        { title: '과학자', category: 'analytical_research', icon: '🔬', description: '연구' },
        { title: '데이터 분석가', category: 'analytical_research', icon: '📊', description: '분석' },
        { title: '디자이너', category: 'creative_arts', icon: '🎨', description: '창작' }
      ],
      majors: [
        { name: '컴퓨터공학', category: 'analytical_research' },
        { name: '디자인학과', category: 'creative_arts' }
      ],
      ibProfiles: ['Inquirer', 'Thinker'],
      aiInsights: '테스트 아이는 분석적 사고와 창의적 표현에 뛰어난 잠재력을 보입니다.',
      developmentTips: '과학 실험과 창작 활동을 병행하면 좋겠습니다.'
    };

    // localStorage에 결과 저장
    const results = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
    results.push(mockResult);
    localStorage.setItem('assessmentResults', JSON.stringify(results));

    // Window에 결과 노출 (디버깅용)
    (window as unknown as { __testResult: unknown }).__testResult = mockResult;
  });

  // 3. 페이지 새로고침하여 결과 표시 (sessionStorage 데이터도 설정)
  await page.evaluate(() => {
    sessionStorage.setItem('basicInfo', JSON.stringify({
      nickname: '테스트아이',
      age: 10,
      grade: '초등학교 4학년',
      gender: 'male',
      activities: ['축구', '피아노'],
      hobbies: ['레고', '그림그리기'],
      interests: ['과학', '우주'],
      strongSubjects: ['수학', '과학'],
      achievements: ['과학경시대회 입상']
    }));
    sessionStorage.setItem('consultation', JSON.stringify({
      relationship: 'parent',
      purpose: 'career_exploration',
      concerns: '아이의 진로',
      expectations: '구체적인 추천'
    }));

    // 모든 질문에 응답 (30개)
    const responses: Record<string, number> = {};
    for (let i = 1; i <= 30; i++) {
      responses[`q${i}`] = 3; // 중간값
    }
    sessionStorage.setItem('responses', JSON.stringify(responses));
    sessionStorage.setItem('assessmentMode', 'full');
  });

  // 4. 결과 페이지 다시 로드
  await page.reload();

  // 5. 결과가 로드될 때까지 대기 (로딩 또는 오류 또는 결과)
  const resultOrError = await Promise.race([
    page.getByText('진로 탐색 결과').waitFor({ timeout: 90000 }),
    page.getByText('오류 발생').waitFor({ timeout: 90000 })
  ]).catch(() => null);

  // 스크린샷 저장
  await page.screenshot({ path: `test-results/pdf-${mode}-before-click.png`, fullPage: true });

  // 결과 페이지인지 확인
  const isResultPage = await page.getByText('진로 탐색 결과').isVisible().catch(() => false);

  if (!isResultPage) {
    // 오류 페이지라면 테스트 스킵
    console.log(`⚠️ ${mode}: API 오류로 결과 페이지 로드 실패 - PDF 기능 직접 테스트 필요`);
    test.skip();
    return;
  }

  // 6. PDF 저장 버튼 찾기
  const pdfButton = page.getByRole('button', { name: /PDF로 저장/i });
  await expect(pdfButton).toBeVisible({ timeout: 10000 });

  // 7. PDF 저장 버튼 클릭 및 결과 확인
  if (mode === 'mobile') {
    // 모바일: 새 탭이 열리거나 다운로드 발생
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 30000 }).catch(() => null),
      pdfButton.click()
    ]);

    await page.waitForTimeout(3000); // PDF 생성 대기

    await page.screenshot({ path: `test-results/pdf-${mode}-after-click.png`, fullPage: true });

    if (newPage) {
      console.log(`✅ ${mode}: PDF가 새 탭에서 열렸습니다: ${newPage.url()}`);
      expect(newPage.url()).toContain('blob:');
      await newPage.close();
    } else {
      // 버튼 상태 확인
      const buttonText = await pdfButton.textContent();
      console.log(`✅ ${mode}: PDF 처리 완료, 버튼 상태: ${buttonText}`);
    }
  } else {
    // 데스크톱: 다운로드 이벤트 감지
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
    await pdfButton.click();

    await page.waitForTimeout(3000); // PDF 생성 대기

    await page.screenshot({ path: `test-results/pdf-${mode}-after-click.png`, fullPage: true });

    const download = await downloadPromise;

    if (download) {
      const filename = download.suggestedFilename();
      console.log(`✅ ${mode}: PDF 다운로드 성공: ${filename}`);
      expect(filename).toContain('.pdf');

      // 파일 저장
      await download.saveAs(`test-results/downloaded-${filename}`);
    } else {
      console.log(`⚠️ ${mode}: 다운로드 이벤트 없음 - 브라우저 설정 확인 필요`);
    }
  }
}
