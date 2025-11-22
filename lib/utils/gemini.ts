import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentData, CareerCategory } from '@/lib/types/assessment';
import { AssessmentResult, IBProfile } from '@/lib/types/result';
import { calculateScores, getTopCategories } from './scoring';
import { HOLLAND_TYPES, CATEGORY_TO_HOLLAND, THEORY_SOURCES } from '@/lib/data/theories';
import { IB_PROFILE_DATABASE, CATEGORY_TO_IB_MAPPING } from '@/lib/data/ib-profiles';

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Gemini를 통한 아동 프로필 분석
export async function analyzeChildProfile(
  data: AssessmentData
): Promise<Partial<AssessmentResult>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const scores = calculateScores(data.responses);
    const topCategories = getTopCategories(scores, 2);

    // 상위 직업군에 해당하는 Holland 유형 정보 수집
    const relevantHollandCodes = new Set<string>();
    topCategories.forEach(category => {
      CATEGORY_TO_HOLLAND[category].forEach(code => relevantHollandCodes.add(code));
    });

    const hollandContext = HOLLAND_TYPES
      .filter(h => relevantHollandCodes.has(h.code))
      .map(h => `- ${h.nameKo}(${h.code}): ${h.description.substring(0, 150)}...`)
      .join('\n');

    // 관련 IB 학습자상 정보 수집
    const relevantIBProfiles = new Set<string>();
    topCategories.forEach(category => {
      CATEGORY_TO_IB_MAPPING[category].forEach(profile => relevantIBProfiles.add(profile));
    });

    const ibContext = IB_PROFILE_DATABASE
      .filter(p => relevantIBProfiles.has(p.id))
      .map(p => `- ${p.nameKo}(${p.id}): ${p.definition.substring(0, 100)}...`)
      .join('\n');

    const prompt = `
당신은 아동 진로 상담 전문가입니다. Holland 직업흥미이론(RIASEC)과 IB 학습자상을 기반으로 아이의 성향을 분석해주세요.

## 이론적 배경

### Holland 직업흥미이론 (출처: 커리어넷, 워크넷)
${hollandContext}

### IB 학습자상 (출처: International Baccalaureate Organization)
${ibContext}

## 아이 정보
- 애칭: ${data.basicInfo.nickname}
- 나이: ${data.basicInfo.age}세
${data.basicInfo.grade ? `- 학년: ${data.basicInfo.grade}` : ''}
${data.basicInfo.gender ? `- 성별: ${data.basicInfo.gender}` : ''}
- 활동: ${data.basicInfo.activities.length > 0 ? data.basicInfo.activities.join(', ') : '없음'}
- 취미: ${data.basicInfo.hobbies.length > 0 ? data.basicInfo.hobbies.join(', ') : '없음'}
- 관심사: ${data.basicInfo.interests.length > 0 ? data.basicInfo.interests.join(', ') : '없음'}
- 잘하는 과목: ${data.basicInfo.strongSubjects.length > 0 ? data.basicInfo.strongSubjects.join(', ') : '없음'}
- 특별한 경험: ${data.basicInfo.achievements.length > 0 ? data.basicInfo.achievements.join(', ') : '없음'}

## 아이의 생각 (참고용)
- 좋아하는 것: ${data.basicInfo.likes?.length ? data.basicInfo.likes.join(', ') : '없음'}
- 되고 싶은 것/꿈: ${data.basicInfo.dreamJob?.length ? data.basicInfo.dreamJob.join(', ') : '없음'}
- 싫어하는 것: ${data.basicInfo.dislikes?.length ? data.basicInfo.dislikes.join(', ') : '없음'}

## 상담 피드백
- 학교 상담: ${data.consultation.schoolFeedback || '없음'}
- 학원 상담: ${data.consultation.academyFeedback || '없음'}

## 성향 검사 점수 (5점 척도 기반)
- 창의·예술형: ${scores.creative}점
- 분석·연구형: ${scores.analytical}점
- 사람·돌봄형: ${scores.caring}점
- 리더·조직형: ${scores.leadership}점
- 실무·기술형: ${scores.practical}점

위 정보를 Holland 이론과 IB 학습자상을 참고하여 종합 분석하고, 다음 형식의 JSON으로 응답해주세요:

{
  "aiInsights": "Holland 유형과 연계하여 아이의 전반적인 성향과 강점에 대한 3-4문장 분석. 구체적인 활동이나 관심사를 언급하며 이론적 근거를 포함.",
  "ibProfiles": ["Inquirer", "Caring"],
  "developmentTips": "이 아이의 재능을 키우기 위한 구체적인 활동 제안 3가지. Holland 유형의 선호 활동과 IB 학습자상 발전을 고려하여 작성."
}

주의사항:
- aiInsights에는 해당 Holland 유형의 특성을 자연스럽게 언급
- ibProfiles는 분석 결과에 맞는 2-3개 선택: Inquirer, Knowledgeable, Thinker, Communicator, Principled, Open-minded, Caring, Risk-taker, Balanced, Reflective
- developmentTips는 이론에 기반한 구체적이고 실천 가능한 활동 제안
- "아이의 생각"은 참고만 하고, 성향 검사 결과를 우선하여 분석. 꿈과 적성이 일치하면 격려하고, 다르면 새로운 가능성도 함께 언급
- 반드시 유효한 JSON 형식으로 응답
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 추출 시도
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // 유효성 검증
      if (parsed.aiInsights && parsed.ibProfiles && parsed.developmentTips) {
        return {
          aiInsights: parsed.aiInsights,
          ibProfiles: parsed.ibProfiles as IBProfile[],
          developmentTips: parsed.developmentTips
        };
      }
    }

    // 파싱 실패 시 기본값 반환
    return {
      aiInsights: '아이의 다양한 재능과 관심사가 균형있게 발달하고 있습니다. 꾸준한 격려와 지원이 필요합니다.',
      ibProfiles: ['Balanced', 'Reflective'] as IBProfile[],
      developmentTips: '아이가 관심있어하는 활동을 지속적으로 경험할 수 있도록 도와주세요. 성공과 실패 모두에서 배울 수 있는 환경을 만들어주는 것이 중요합니다.'
    };

  } catch (error) {
    console.error('Gemini API error:', error);

    // 에러 시 기본값 반환
    return {
      aiInsights: '분석 중 오류가 발생했습니다. 입력하신 정보를 바탕으로 기본 결과를 제공합니다.',
      ibProfiles: ['Balanced'] as IBProfile[],
      developmentTips: '다양한 활동을 경험하며 아이의 관심사를 넓혀가세요.'
    };
  }
}

// 간소화 모드용 분석 함수
export async function analyzeChildProfileQuick(
  data: AssessmentData
): Promise<Partial<AssessmentResult>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const scores = calculateScores(data.responses);
    const topCategories = getTopCategories(scores, 2);

    const prompt = `
당신은 아동 진로 상담 전문가입니다. 간단한 분석을 제공해주세요.

## 아이 정보
- 애칭: ${data.basicInfo.nickname}
- 나이: ${data.basicInfo.age}세
- 활동: ${data.basicInfo.activities.length > 0 ? data.basicInfo.activities.join(', ') : '없음'}
- 취미: ${data.basicInfo.hobbies.length > 0 ? data.basicInfo.hobbies.join(', ') : '없음'}

## 성향 검사 점수
- 창의·예술형: ${scores.creative}점
- 분석·연구형: ${scores.analytical}점
- 사람·돌봄형: ${scores.caring}점
- 리더·조직형: ${scores.leadership}점
- 실무·기술형: ${scores.practical}점

다음 형식의 JSON으로 간단히 응답해주세요:

{
  "aiInsights": "아이의 강점에 대한 1-2문장 요약",
  "ibProfiles": ["가장 관련된 IB 학습자상 1개"]
}

ibProfiles 옵션: Inquirer, Thinker, Communicator, Caring, Risk-taker, Balanced
반드시 유효한 JSON 형식으로 응답하세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.aiInsights && parsed.ibProfiles) {
        return {
          aiInsights: parsed.aiInsights,
          ibProfiles: parsed.ibProfiles,
          developmentTips: ''
        };
      }
    }

    return {
      aiInsights: '아이의 다양한 재능이 균형있게 발달하고 있습니다.',
      ibProfiles: ['Balanced'],
      developmentTips: ''
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      aiInsights: '분석 결과를 확인해주세요.',
      ibProfiles: ['Balanced'],
      developmentTips: ''
    };
  }
}

// 재시도 로직이 포함된 분석 함수
export async function analyzeWithRetry(
  data: AssessmentData,
  maxRetries: number = 3,
  isQuickMode: boolean = false
): Promise<Partial<AssessmentResult>> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return isQuickMode
        ? await analyzeChildProfileQuick(data)
        : await analyzeChildProfile(data);
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  // 최종 실패 시 기본값
  return {
    aiInsights: '분석 서비스가 일시적으로 불가능합니다. 잠시 후 다시 시도해주세요.',
    ibProfiles: ['Balanced'] as IBProfile[],
    developmentTips: '결과는 저장되었으며, 나중에 AI 분석 내용을 확인할 수 있습니다.'
  };
}
