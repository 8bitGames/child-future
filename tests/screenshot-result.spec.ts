import { test, expect } from '@playwright/test';

test('전체 검사 완료 후 결과 스크린샷', async ({ page }) => {
  // 1. 메인 페이지에서 시작
  await page.goto('http://localhost:3007');
  await page.click('text=정밀 검사');

  // 2. 기본 정보 입력
  await page.fill('#nickname', '쭌이');
  await page.fill('#age', '10');
  await page.selectOption('#gender', 'male');

  // 활동 추가
  await page.fill('#activity-input', '수학학원');
  await page.click('#activity-input + button');
  await page.fill('#activity-input', '태권도');
  await page.click('#activity-input + button');

  // 취미 추가
  await page.fill('#hobby-input', '레고');
  await page.click('#hobby-input + button');
  await page.fill('#hobby-input', '게임');
  await page.click('#hobby-input + button');

  // 관심사 추가
  await page.fill('#interest-input', '공룡');
  await page.click('#interest-input + button');
  await page.fill('#interest-input', '우주');
  await page.click('#interest-input + button');

  // 잘하는 과목
  await page.fill('#subject-input', '수학');
  await page.click('#subject-input + button');
  await page.fill('#subject-input', '과학');
  await page.click('#subject-input + button');

  // 되고 싶은 것
  await page.fill('#dream-input', '과학자');
  await page.click('#dream-input + button');

  // 좋아하는 것
  await page.fill('#like-input', '실험하기');
  await page.click('#like-input + button');

  // 다음 버튼
  await page.click('button:has-text("다음")');

  // 3. 상담 내용 입력
  await page.waitForURL('**/consultation');

  // 학교 상담 피드백
  const schoolTextarea = page.locator('textarea').first();
  await schoolTextarea.fill('수학적 사고력이 뛰어나고 논리적인 문제 해결을 잘합니다.');

  // 학원 상담 피드백
  const academyTextarea = page.locator('textarea').last();
  await academyTextarea.fill('집중력이 좋고 어려운 문제도 끝까지 풀려고 노력합니다.');

  await page.click('button:has-text("다음")');

  // 4. 성향 테스트
  await page.waitForURL('**/assessment');

  // 질문이 로드될 때까지 대기
  await page.waitForSelector('input[type="radio"]', { timeout: 30000 });

  // 모든 질문에 응답 (최대 30개까지 처리)
  for (let i = 0; i < 30; i++) {
    // "매우 그렇다" 라디오 버튼 선택 - getByRole 사용
    await page.getByRole('radio', { name: '매우 그렇다' }).check();

    // 선택 확인을 위한 대기
    await page.waitForTimeout(300);

    // 다음 버튼이 활성화될 때까지 대기
    const nextButton = page.getByRole('button', { name: /다음/ });
    const resultButton = page.getByRole('button', { name: /결과/ });

    // 결과 버튼이 보이면 클릭하고 종료
    if (await resultButton.isVisible()) {
      await resultButton.click();
      break;
    }

    // 다음 버튼 클릭
    await nextButton.click();

    // 페이지 전환 대기
    await page.waitForTimeout(300);
  }

  // 5. 결과 페이지 대기 (AI 분석 시간)
  await page.waitForURL('**/results', { timeout: 60000 });

  // 로딩 완료 대기
  await page.waitForSelector('h1:has-text("진로 탐색 결과")', { timeout: 60000 });

  // 페이지 완전 로드 대기
  await page.waitForTimeout(2000);

  // 6. 전체 페이지 스크린샷
  await page.screenshot({
    path: 'claudedocs/result-screenshot.png',
    fullPage: true
  });

  console.log('스크린샷 저장 완료: claudedocs/result-screenshot.png');
});
