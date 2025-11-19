import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentData } from '@/lib/types/assessment';
import { AssessmentResult, IBProfile } from '@/lib/types/result';
import { calculateScores } from './scoring';

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Gemini를 통한 아동 프로필 분석
export async function analyzeChildProfile(
  data: AssessmentData
): Promise<Partial<AssessmentResult>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const scores = calculateScores(data.responses);

    const prompt = `
당신은 아동 진로 상담 전문가입니다. 다음 정보를 바탕으로 아이의 성향과 추천 직업을 분석해주세요.

## 아이 정보
- 애칭: ${data.basicInfo.nickname}
- 나이: ${data.basicInfo.age}세
${data.basicInfo.grade ? `- 학년: ${data.basicInfo.grade}` : ''}
${data.basicInfo.gender ? `- 성별: ${data.basicInfo.gender}` : ''}
- 활동: ${data.basicInfo.activities.length > 0 ? data.basicInfo.activities.join(', ') : '없음'}
- 취미: ${data.basicInfo.hobbies.length > 0 ? data.basicInfo.hobbies.join(', ') : '없음'}
- 관심사: ${data.basicInfo.interests.length > 0 ? data.basicInfo.interests.join(', ') : '없음'}
- 잘하는 과목: ${data.basicInfo.strongSubjects.length > 0 ? data.basicInfo.strongSubjects.join(', ') : '없음'}
- 받은 상: ${data.basicInfo.achievements.length > 0 ? data.basicInfo.achievements.join(', ') : '없음'}

## 상담 피드백
- 학교 상담: ${data.consultation.schoolFeedback || '없음'}
- 학원 상담: ${data.consultation.academyFeedback || '없음'}

## 성향 검사 점수
- 창의·예술형: ${scores.creative}점
- 분석·연구형: ${scores.analytical}점
- 사람·돌봄형: ${scores.caring}점
- 리더·조직형: ${scores.leadership}점
- 실무·기술형: ${scores.practical}점

위 정보를 종합하여 다음 형식의 JSON으로 응답해주세요.
반드시 아래 형식을 정확히 지켜서 응답해주세요:

{
  "aiInsights": "아이의 전반적인 성향과 강점에 대한 2-3문장 요약",
  "ibProfiles": ["Inquirer", "Caring"],
  "developmentTips": "이 아이의 재능을 키우기 위한 구체적인 제안 2-3가지"
}

주의사항:
- aiInsights는 검사 점수와 입력 정보를 종합하여 작성
- ibProfiles는 다음 중에서만 선택: Inquirer, Knowledgeable, Thinker, Communicator, Principled, Open-minded, Caring, Risk-taker, Balanced, Reflective
- developmentTips는 구체적이고 실천 가능한 활동 제안
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

// 재시도 로직이 포함된 분석 함수
export async function analyzeWithRetry(
  data: AssessmentData,
  maxRetries: number = 3
): Promise<Partial<AssessmentResult>> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await analyzeChildProfile(data);
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
