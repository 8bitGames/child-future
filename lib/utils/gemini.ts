import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentData, CareerCategory, IBLearnerProfile } from '@/lib/types/assessment';
import { AssessmentResult, IBProfile } from '@/lib/types/result';
import { calculateScores, getTopCategories } from './scoring';
import { HOLLAND_TYPES, CATEGORY_TO_HOLLAND, THEORY_SOURCES } from '@/lib/data/theories';
import { IB_PROFILE_DATABASE, CATEGORY_TO_IB_MAPPING } from '@/lib/data/ib-profiles';
import type { ObservationFrequency } from '@/lib/types/ib-enhanced';

// 상황 질문 응답 타입
interface SituationResponseData {
  skipped?: boolean;
  responses: Array<{
    questionId: string;
    selectedOptionIndex: number;
    ibWeights: Partial<Record<IBLearnerProfile, number>>;
  }>;
}

// 관찰 체크리스트 응답 타입
interface ObservationResponseData {
  skipped?: boolean;
  observerType: 'parent' | 'teacher' | null;
  responses: Array<{
    itemId: string;
    frequency: ObservationFrequency;
  }>;
}

// 확장된 평가 데이터 타입
export interface EnhancedAssessmentData extends AssessmentData {
  situationResponses?: SituationResponseData;
  parentObservation?: ObservationResponseData;
}

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// IB 학습자상 점수 계산 (상황 질문 응답 기반)
function calculateIBScoresFromSituation(situationResponses?: SituationResponseData): Record<string, number> {
  const ibScores: Record<string, number> = {};

  if (!situationResponses || situationResponses.skipped || !situationResponses.responses?.length) {
    return ibScores;
  }

  situationResponses.responses.forEach(response => {
    if (response.ibWeights) {
      Object.entries(response.ibWeights).forEach(([profile, weight]) => {
        ibScores[profile] = (ibScores[profile] || 0) + (weight || 0);
      });
    }
  });

  return ibScores;
}

// 관찰 데이터 요약 생성
function summarizeObservation(observation?: ObservationResponseData): string {
  if (!observation || observation.skipped || !observation.responses?.length) {
    return '관찰 데이터 없음';
  }

  const frequencyMap: Record<ObservationFrequency, string> = {
    'always': '항상',
    'often': '자주',
    'sometimes': '가끔',
    'rarely': '거의 없음',
    'never': '없음'
  };

  const summary = observation.responses
    .filter(r => r.frequency === 'often' || r.frequency === 'always')
    .map(r => `${r.itemId}: ${frequencyMap[r.frequency]}`)
    .slice(0, 5)
    .join(', ');

  return summary || '특별한 관찰 패턴 없음';
}

// Gemini를 통한 아동 프로필 분석 (강화된 버전)
export async function analyzeChildProfile(
  data: EnhancedAssessmentData
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

    // 상황 질문 기반 IB 점수 계산
    const ibScoresFromSituation = calculateIBScoresFromSituation(data.situationResponses);
    const hasSituationData = Object.keys(ibScoresFromSituation).length > 0;

    // 관찰 데이터 요약
    const observationSummary = summarizeObservation(data.parentObservation);
    const hasObservationData = data.parentObservation && !data.parentObservation.skipped;
    const observerType = data.parentObservation?.observerType === 'teacher' ? '선생님' : '부모님';

    // IB 점수 컨텍스트 생성
    const ibScoreContext = hasSituationData
      ? `\n## 상황 질문 기반 IB 학습자상 점수\n${Object.entries(ibScoresFromSituation)
          .sort((a, b) => b[1] - a[1])
          .map(([profile, score]) => `- ${profile}: ${score}점`)
          .join('\n')}`
      : '';

    // 관찰 컨텍스트 생성
    const observationContext = hasObservationData
      ? `\n## ${observerType} 관찰 체크리스트 (선택 데이터)\n- 관찰자: ${observerType}\n- 관찰 요약: ${observationSummary}`
      : '';

    const prompt = `
당신은 아동 진로 상담 전문가입니다. Holland 직업흥미이론(RIASEC)과 IB 학습자상을 기반으로 아이의 성향을 분석하고, 맞춤형 직업을 추천해주세요.

## 이론적 배경

### Holland 직업흥미이론 (출처: 커리어넷, 워크넷)
${hollandContext}

### IB 학습자상 (출처: International Baccalaureate Organization)
${ibContext}

### IB 학습자상별 적합 직업군 참고
- Inquirer(탐구): 과학자, 연구원, 기자, 탐정, 고고학자, 데이터분석가
- Knowledgeable(지식): 교수, 작가, 편집자, 큐레이터, 도서관사서, 전문컨설턴트
- Thinker(사고): 프로그래머, 수학자, 철학자, 전략기획자, 변호사, AI개발자
- Communicator(소통): 아나운서, 외교관, 통역사, 마케터, 상담사, 유튜버
- Principled(원칙): 판사, 공무원, 회계사, 윤리학자, 감사관, NGO활동가
- Open-minded(열린마음): 예술가, 여행작가, 문화인류학자, 디자이너, 국제기구직원
- Caring(배려): 의사, 간호사, 사회복지사, 교사, 수의사, 심리상담사
- Risk-taker(도전): 창업가, 투자자, 탐험가, 스턴트맨, 소방관, 스포츠선수
- Balanced(균형): 요가강사, 영양사, 라이프코치, 건축가, 조경사, 웰니스전문가
- Reflective(성찰): 철학자, 명상지도자, 저널리스트, 심리학자, 예술비평가, 작가

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
${ibScoreContext}
${observationContext}

위 정보를 Holland 이론과 IB 학습자상을 참고하여 종합 분석하고, 다음 형식의 JSON으로 응답해주세요:

{
  "aiInsights": "Holland 유형과 연계하여 아이의 전반적인 성향과 강점에 대한 3-4문장 분석. 구체적인 활동이나 관심사를 언급하며 이론적 근거를 포함.${hasSituationData ? ' 상황 질문 결과도 반영하여 분석.' : ''}${hasObservationData ? ` ${observerType}의 관찰 내용도 참고.` : ''}",
  "ibProfiles": ["Inquirer", "Caring"],
  "ibProfileAnalysis": "${hasSituationData ? 'IB 학습자상 점수를 기반으로 각 프로필이 선택된 구체적 이유를 1-2문장으로 설명' : '성향 검사 결과를 기반으로 IB 학습자상을 추론한 이유 설명'}",
  "developmentTips": "이 아이의 재능을 키우기 위한 구체적인 활동 제안 3가지. Holland 유형의 선호 활동과 IB 학습자상 발전을 고려하여 작성."
}

주의사항:
- aiInsights에는 해당 Holland 유형의 특성을 자연스럽게 언급
- ibProfiles는 분석 결과에 맞는 2-3개 선택: Inquirer, Knowledgeable, Thinker, Communicator, Principled, Open-minded, Caring, Risk-taker, Balanced, Reflective
${hasSituationData ? '- 상황 질문 기반 IB 점수가 있으면 이를 최우선으로 반영하여 ibProfiles 선택' : ''}
${hasObservationData ? `- ${observerType}의 관찰 데이터가 있으면 이를 참고하여 분석의 깊이를 더함` : ''}
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
          developmentTips: parsed.developmentTips,
          ibProfileAnalysis: parsed.ibProfileAnalysis || undefined
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

// AI 추천 직업 타입
export interface AIRecommendedJob {
  title: string;
  icon: string;
  reason: string;
  relatedIBProfile: string;
  futureOutlook?: string;
  requiredSkills?: string[];
  relatedActivities?: string[];
}

// 2단계 API: 분석 결과 기반 상세 직업 추천
export async function recommendJobsWithAI(
  basicInfo: {
    nickname: string;
    age: number;
    activities: string[];
    hobbies: string[];
    interests: string[];
    strongSubjects: string[];
    dreamJob?: string[];
  },
  analysisResult: {
    aiInsights: string;
    ibProfiles: string[];
    ibProfileAnalysis?: string;
    scores: {
      creative: number;
      analytical: number;
      caring: number;
      leadership: number;
      practical: number;
    };
  }
): Promise<AIRecommendedJob[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
당신은 아동 진로 상담 전문가입니다. 이미 분석된 아이의 성향 결과를 바탕으로 매우 상세하고 개인화된 직업 추천을 제공해주세요.

## 아이 기본 정보
- 애칭: ${basicInfo.nickname}
- 나이: ${basicInfo.age}세
- 활동(학원/방과후): ${basicInfo.activities.length > 0 ? basicInfo.activities.join(', ') : '없음'}
- 취미: ${basicInfo.hobbies.length > 0 ? basicInfo.hobbies.join(', ') : '없음'}
- 관심사: ${basicInfo.interests.length > 0 ? basicInfo.interests.join(', ') : '없음'}
- 잘하는 과목: ${basicInfo.strongSubjects.length > 0 ? basicInfo.strongSubjects.join(', ') : '없음'}
- 꿈/되고싶은것: ${basicInfo.dreamJob?.length ? basicInfo.dreamJob.join(', ') : '없음'}

## 1차 AI 분석 결과
### 종합 인사이트
${analysisResult.aiInsights}

### IB 학습자상 (선택된 프로필)
${analysisResult.ibProfiles.join(', ')}

### IB 학습자상 선택 이유
${analysisResult.ibProfileAnalysis || '분석 데이터 없음'}

### 성향 점수 (5점 만점)
- 창의·예술형: ${analysisResult.scores.creative}점
- 분석·연구형: ${analysisResult.scores.analytical}점
- 사람·돌봄형: ${analysisResult.scores.caring}점
- 리더·조직형: ${analysisResult.scores.leadership}점
- 실무·기술형: ${analysisResult.scores.practical}점

## IB 학습자상별 적합 직업 참고
- Inquirer(탐구): 과학자, 연구원, 기자, 탐정, 고고학자, 데이터분석가, 우주비행사, 해양생물학자
- Knowledgeable(지식): 교수, 작가, 편집자, 큐레이터, 도서관사서, 전문컨설턴트, 역사학자
- Thinker(사고): 프로그래머, 수학자, 철학자, 전략기획자, 변호사, AI개발자, 게임개발자
- Communicator(소통): 아나운서, 외교관, 통역사, 마케터, 상담사, 유튜버, 영화감독
- Principled(원칙): 판사, 공무원, 회계사, 윤리학자, 감사관, NGO활동가, 환경운동가
- Open-minded(열린마음): 예술가, 여행작가, 문화인류학자, 디자이너, 국제기구직원, 요리사
- Caring(배려): 의사, 간호사, 사회복지사, 교사, 수의사, 심리상담사, 소아과의사
- Risk-taker(도전): 창업가, 투자자, 탐험가, 스턴트맨, 소방관, 스포츠선수, 파일럿
- Balanced(균형): 요가강사, 영양사, 라이프코치, 건축가, 조경사, 웰니스전문가
- Reflective(성찰): 철학자, 명상지도자, 저널리스트, 심리학자, 예술비평가, 작가

## 요청사항
위 분석 결과와 아이의 특성을 종합하여, 이 아이에게 가장 적합한 직업 7-10개를 추천해주세요.

각 직업은 다음 정보를 포함해야 합니다:
1. 직업명: ${basicInfo.age}세 아이가 이해할 수 있는 친근한 표현
2. 아이콘: 직업을 대표하는 이모지 1개
3. 추천 이유: 아이의 구체적인 특성/활동/관심사와 연결하여 왜 이 직업이 적합한지 상세히 설명 (3-4문장)
4. 관련 IB 학습자상
5. 미래 전망: 이 직업의 미래 가능성 한 줄
6. 필요한 능력: 이 직업에 필요한 핵심 능력 2-3개
7. 관련 활동: 지금부터 해볼 수 있는 관련 활동 2-3개

다음 JSON 형식으로 응답해주세요:
{
  "recommendedJobs": [
    {
      "title": "직업명",
      "icon": "🎯",
      "reason": "이 아이에게 이 직업을 추천하는 상세한 이유. 아이의 [구체적 특성/활동/관심사]와 연결하여 설명. IB 학습자상 [프로필명]의 특성과도 잘 맞음.",
      "relatedIBProfile": "Inquirer",
      "futureOutlook": "이 직업의 미래 전망 한 줄",
      "requiredSkills": ["능력1", "능력2", "능력3"],
      "relatedActivities": ["지금 해볼 수 있는 활동1", "활동2"]
    }
  ]
}

중요:
- 아이의 현재 활동/취미/관심사를 구체적으로 언급하며 직업과 연결
- 선택된 IB 학습자상(${analysisResult.ibProfiles.join(', ')})을 우선 고려하여 직업 추천
- 아이의 꿈(${basicInfo.dreamJob?.join(', ') || '없음'})이 있다면, 적성과 맞는지도 언급
- ${basicInfo.age}세 아이가 이해하고 공감할 수 있는 표현 사용
- 미래 유망 직업도 포함하되, 아이가 이해할 수 있게 설명
- 반드시 유효한 JSON 형식으로 응답
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.recommendedJobs && Array.isArray(parsed.recommendedJobs)) {
        return parsed.recommendedJobs as AIRecommendedJob[];
      }
    }

    // 파싱 실패 시 빈 배열
    console.error('Failed to parse job recommendations');
    return [];

  } catch (error) {
    console.error('Job recommendation API error:', error);
    return [];
  }
}
