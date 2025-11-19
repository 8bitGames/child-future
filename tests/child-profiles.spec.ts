import { test, expect } from '@playwright/test';

// 테스트 시나리오별 아이 프로필
const childProfiles = [
  {
    name: '창의적-예술형',
    data: {
      nickname: '예술이',
      age: 10,
      gender: 'female',
      activities: ['미술학원', '피아노'],
      hobbies: ['그림 그리기', '만들기', '음악 감상'],
      interests: ['패션', '디자인', '색깔'],
      strongSubjects: ['미술', '음악'],
      achievements: ['미술대회 금상', '피아노 콩쿠르 은상'],
      schoolFeedback: '상상력이 풍부하고 표현력이 뛰어나요. 손재주가 좋아서 만들기 활동을 좋아합니다.',
      academyFeedback: '색감이 뛰어나고 자신만의 스타일이 있어요. 창의적인 작품을 많이 만들어요.',
      assessmentPattern: [5, 5, 5, 4, 5, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 2, 2, 3] // 창의성, 예술성 높음
    }
  },
  {
    name: '논리적-분석형',
    data: {
      nickname: '과학이',
      age: 12,
      gender: 'male',
      activities: ['수학학원', '과학실험교실', '코딩학원'],
      hobbies: ['책 읽기', '실험하기', '퍼즐'],
      interests: ['로봇', '우주', '과학', '수학'],
      strongSubjects: ['수학', '과학', '컴퓨터'],
      achievements: ['수학경시대회 동상', '과학탐구대회 은상'],
      schoolFeedback: '논리적 사고력이 뛰어나고 문제 해결 능력이 좋아요. 질문이 많고 탐구심이 강합니다.',
      academyFeedback: '어려운 문제도 포기하지 않고 끝까지 풀어요. 수학적 개념을 빠르게 이해합니다.',
      assessmentPattern: [2, 2, 3, 2, 2, 5, 5, 5, 5, 5, 3, 3, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 4, 4] // 논리성, 분석력 높음
    }
  },
  {
    name: '사교적-리더형',
    data: {
      nickname: '리더',
      age: 11,
      gender: 'male',
      activities: ['축구', '토론동아리', '학생회'],
      hobbies: ['운동', '친구들과 놀기', '게임'],
      interests: ['스포츠', '사람', '팀워크'],
      strongSubjects: ['체육', '사회', '국어'],
      achievements: ['학급회장', '축구대회 MVP'],
      schoolFeedback: '친구들을 잘 챙기고 리더십이 있어요. 팀 활동에서 중심 역할을 잘 합니다.',
      academyFeedback: '적극적이고 활발해요. 친구들과 협력하는 것을 좋아합니다.',
      assessmentPattern: [3, 3, 4, 3, 3, 2, 2, 3, 2, 2, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5, 3, 4, 3, 3] // 사교성, 리더십 높음
    }
  },
  {
    name: '실용적-기술형',
    data: {
      nickname: '메이커',
      age: 13,
      gender: 'female',
      activities: ['로봇코딩', '메이커교육', '3D프린팅'],
      hobbies: ['만들기', 'Lego', '코딩', '게임'],
      interests: ['로봇', '기계', '발명', '기술'],
      strongSubjects: ['실과', '과학', '수학'],
      achievements: ['로봇대회 최우수상', '발명대회 장려상'],
      schoolFeedback: '손재주가 뛰어나고 기계적인 것에 관심이 많아요. 실습 활동을 특히 좋아합니다.',
      academyFeedback: '코딩 능력이 뛰어나고 문제를 실용적으로 해결해요. 프로젝트 완성도가 높습니다.',
      assessmentPattern: [3, 3, 2, 2, 2, 3, 3, 4, 4, 4, 2, 2, 2, 2, 2, 3, 3, 2, 2, 3, 5, 5, 5, 5] // 실용성, 기술력 높음
    }
  },
  {
    name: '탐구적-학구형',
    data: {
      nickname: '탐구왕',
      age: 9,
      gender: 'female',
      activities: ['영어학원', '독서논술', '과학실험'],
      hobbies: ['책 읽기', '글쓰기', '역사 공부'],
      interests: ['책', '역사', '동물', '자연'],
      strongSubjects: ['국어', '사회', '과학'],
      achievements: ['독서왕', '글쓰기대회 우수상'],
      schoolFeedback: '호기심이 많고 배우려는 의욕이 강해요. 집중력이 뛰어나고 책을 많이 읽습니다.',
      academyFeedback: '질문이 많고 깊이 있게 생각해요. 이해력과 표현력이 뛰어납니다.',
      assessmentPattern: [4, 4, 5, 4, 4, 5, 5, 5, 5, 5, 4, 4, 5, 5, 4, 3, 3, 4, 3, 4, 4, 3, 4, 4] // 학습능력, 탐구심 높음
    }
  }
];

test.describe('아이 성향 진로 탐색 E2E 테스트', () => {
  childProfiles.forEach((profile) => {
    test(`${profile.name} - 전체 플로우 테스트`, async ({ page }) => {
      const screenshotDir = `tests/screenshots/${profile.name}`;

      // 1. 메인 페이지
      await page.goto('http://localhost:3007');
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${screenshotDir}/01-main.png`,
        fullPage: true
      });

      // "검사 시작하기" 버튼 클릭
      await page.click('text=검사 시작하기');
      await page.waitForLoadState('networkidle');

      // 2. 기본정보 입력 페이지
      await page.screenshot({
        path: `${screenshotDir}/02-basic-info-empty.png`,
        fullPage: true
      });

      // 애칭 입력
      await page.fill('input[placeholder*="제이"]', profile.data.nickname);

      // 나이 입력
      await page.fill('input[type="number"]', profile.data.age.toString());

      // 성별 선택
      if (profile.data.gender) {
        const genderValue = profile.data.gender === 'male' ? 'male' : 'female';
        await page.selectOption('select', genderValue);
      }

      // 활동 추가
      for (const activity of profile.data.activities) {
        await page.fill('input[placeholder*="수학학원"]', activity);
        await page.click('button:has-text("추가")');
        await page.waitForTimeout(200);
      }

      // 취미 추가
      const hobbyInputs = await page.locator('input[placeholder*="게임"]');
      for (const hobby of profile.data.hobbies) {
        await hobbyInputs.first().fill(hobby);
        await page.locator('button:has-text("추가")').nth(1).click();
        await page.waitForTimeout(200);
      }

      // 관심사 추가
      const interestInputs = await page.locator('input[placeholder*="공룡"]');
      for (const interest of profile.data.interests) {
        await interestInputs.first().fill(interest);
        await page.locator('button:has-text("추가")').nth(2).click();
        await page.waitForTimeout(200);
      }

      // 잘하는 과목 추가
      const subjectInputs = await page.locator('input[placeholder*="수학, 과학"]');
      for (const subject of profile.data.strongSubjects) {
        await subjectInputs.first().fill(subject);
        await page.locator('button:has-text("추가")').nth(3).click();
        await page.waitForTimeout(200);
      }

      // 상 추가
      const achievementInputs = await page.locator('input[placeholder*="수학 경시대회"]');
      for (const achievement of profile.data.achievements) {
        await achievementInputs.first().fill(achievement);
        await page.locator('button:has-text("추가")').nth(4).click();
        await page.waitForTimeout(200);
      }

      // 입력 완료 스크린샷
      await page.screenshot({
        path: `${screenshotDir}/03-basic-info-filled.png`,
        fullPage: true
      });

      // 다음 단계로
      await page.click('button:has-text("다음 단계로")');
      await page.waitForLoadState('networkidle');

      // 3. 상담내용 입력 페이지
      await page.screenshot({
        path: `${screenshotDir}/04-consultation-empty.png`,
        fullPage: true
      });

      // 학교 피드백 입력
      const schoolTextarea = await page.locator('textarea').first();
      await schoolTextarea.fill(profile.data.schoolFeedback);

      // 학원 피드백 입력
      const academyTextarea = await page.locator('textarea').nth(1);
      await academyTextarea.fill(profile.data.academyFeedback);

      // 입력 완료 스크린샷
      await page.screenshot({
        path: `${screenshotDir}/05-consultation-filled.png`,
        fullPage: true
      });

      // 다음 단계로
      await page.click('button:has-text("다음 단계로")');
      await page.waitForLoadState('networkidle');

      // 4. 성향 테스트 페이지
      // 각 질문에 답변
      for (let i = 0; i < profile.data.assessmentPattern.length; i++) {
        const answer = profile.data.assessmentPattern[i];

        // 첫 질문 스크린샷
        if (i === 0) {
          await page.screenshot({
            path: `${screenshotDir}/06-assessment-q1.png`,
            fullPage: true
          });
        }

        // 중간 질문 스크린샷 (8번째)
        if (i === 7) {
          await page.screenshot({
            path: `${screenshotDir}/07-assessment-q8.png`,
            fullPage: true
          });
        }

        // 마지막 질문 스크린샷
        if (i === profile.data.assessmentPattern.length - 1) {
          await page.screenshot({
            path: `${screenshotDir}/08-assessment-last.png`,
            fullPage: true
          });
        }

        // 라디오 버튼 선택
        await page.click(`input[type="radio"][value="${answer}"]`);
        await page.waitForTimeout(300);

        // 다음 버튼 클릭
        const isLastQuestion = i === profile.data.assessmentPattern.length - 1;
        if (isLastQuestion) {
          await page.click('button:has-text("결과 보기")');
        } else {
          await page.click('button:has-text("다음")');
        }
        await page.waitForTimeout(500);
      }

      // 5. 결과 페이지 대기
      await page.waitForTimeout(2000);

      // 결과 페이지 초기 화면
      await page.screenshot({
        path: `${screenshotDir}/09-results-initial.png`,
        fullPage: true
      });

      // AI 분석 대기 (최대 90초)
      console.log(`${profile.name}: AI 분석 대기 중...`);
      const maxWait = 90000; // 90초
      const startTime = Date.now();
      let analysisComplete = false;

      while (Date.now() - startTime < maxWait && !analysisComplete) {
        await page.waitForTimeout(5000); // 5초마다 확인

        // 페이지에 내용이 로드되었는지 확인 (로딩 스피너가 없는지)
        const hasContent = await page.locator('h2, h3').count() > 1;
        const hasLoading = await page.locator('text=분석 중').count() > 0;

        if (hasContent && !hasLoading) {
          analysisComplete = true;
          console.log(`${profile.name}: AI 분석 완료 (${(Date.now() - startTime) / 1000}초 소요)`);
        }
      }

      // 최종 결과 스크린샷
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: `${screenshotDir}/10-results-full.png`,
        fullPage: true
      });

      console.log(`✓ ${profile.name} 테스트 완료`);
    });
  });
});
