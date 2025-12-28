import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
interface AssessmentResult {
  id: string;
  timestamp: string;
  basicInfo: {
    nickname: string;
    age: number;
  };
  scores: {
    creative: number;
    analytical: number;
    caring: number;
    leadership: number;
    practical: number;
  };
  ibProfiles?: string[];
}

interface ReportRequest {
  childInfo: {
    nickname: string;
    age: number;
  };
  period: 'monthly' | 'quarterly' | 'yearly';
  assessmentComparison: {
    previous?: AssessmentResult;
    current: AssessmentResult;
  };
  activityStats: {
    totalMissionsCompleted: number;
    totalBadgesEarned: number;
    totalDiaryEntries: number;
    totalCheckIns: number;
    mostActiveIBProfile: string | null;
    consistencyScore: number;
  };
  parentObservations: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  creative: '창의·예술',
  analytical: '분석·연구',
  caring: '사람·돌봄',
  leadership: '리더·조직',
  practical: '실무·기술',
};

const IB_PROFILE_NAMES: Record<string, string> = {
  'Inquirer': '탐구하는 사람',
  'Knowledgeable': '지식이 풍부한 사람',
  'Thinker': '생각하는 사람',
  'Communicator': '소통하는 사람',
  'Principled': '원칙을 지키는 사람',
  'Open-minded': '열린 마음을 가진 사람',
  'Caring': '배려하는 사람',
  'Risk-taker': '도전하는 사람',
  'Balanced': '균형 잡힌 사람',
  'Reflective': '성찰하는 사람',
};

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const data: ReportRequest = await request.json();
    const { childInfo, period, assessmentComparison, activityStats, parentObservations } = data;

    // Calculate score changes if we have previous assessment
    let scoreChangesText = '';
    if (assessmentComparison.previous) {
      const changes = Object.entries(assessmentComparison.current.scores).map(([key, value]) => {
        const prevValue = assessmentComparison.previous!.scores[key as keyof typeof assessmentComparison.previous.scores];
        const change = value - prevValue;
        return `- ${CATEGORY_NAMES[key]}: ${prevValue}점 → ${value}점 (${change > 0 ? '+' : ''}${change})`;
      });
      scoreChangesText = changes.join('\n');
    }

    // Get top categories
    const topCategories = Object.entries(assessmentComparison.current.scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => CATEGORY_NAMES[key])
      .join(', ');

    // Get IB profiles
    const ibProfiles = assessmentComparison.current.ibProfiles
      ?.map(p => IB_PROFILE_NAMES[p] || p)
      .slice(0, 3)
      .join(', ') || '분석 중';

    // Period label
    const periodLabel = period === 'monthly' ? '지난 한 달' :
                        period === 'quarterly' ? '지난 세 달' : '지난 일 년';

    const prompt = `
당신은 아동 발달 전문가이자 IB(International Baccalaureate) 교육 전문가입니다.
아래 아이의 성장 데이터를 분석하여 따뜻하고 격려하는 톤으로 성장 리포트를 작성해주세요.

[아이 정보]
- 이름: ${childInfo.nickname}
- 나이: ${childInfo.age}세
- 분석 기간: ${periodLabel}

[검사 결과]
- 상위 직업군: ${topCategories}
- IB 학습자상: ${ibProfiles}
${scoreChangesText ? `\n[점수 변화]\n${scoreChangesText}` : ''}

[활동 기록]
- 완료한 미션: ${activityStats.totalMissionsCompleted}개
- 획득한 배지: ${activityStats.totalBadgesEarned}개
- 다이어리 기록: ${activityStats.totalDiaryEntries}개
- 주간 체크인: ${activityStats.totalCheckIns}회
- 가장 활발한 IB 학습자상: ${activityStats.mostActiveIBProfile ? IB_PROFILE_NAMES[activityStats.mostActiveIBProfile] || activityStats.mostActiveIBProfile : '없음'}
- 꾸준함 점수: ${activityStats.consistencyScore}점/100점

${parentObservations ? `[부모 관찰 메모]\n${parentObservations}` : ''}

위 데이터를 바탕으로 다음 JSON 형식으로 분석 리포트를 작성해주세요.
아이와 부모 모두 읽을 수 있게 따뜻하고 격려하는 톤으로 작성해주세요.
구체적인 활동과 수치를 언급하면서 의미 있는 분석을 제공해주세요.

{
  "summary": "전체 요약 (3-4문장으로 ${childInfo.nickname}님의 ${periodLabel} 성장을 요약)",
  "strengths": [
    "강점 1 (구체적인 관찰에 기반)",
    "강점 2",
    "강점 3"
  ],
  "growthAreas": [
    "성장한 영역 1 (점수 변화나 활동 기반)",
    "성장한 영역 2"
  ],
  "recommendations": [
    "다음 기간 추천 활동 1 (상위 직업군이나 IB 학습자상에 맞춤)",
    "추천 활동 2",
    "추천 활동 3"
  ],
  "parentTips": [
    "부모님을 위한 팁 1 (아이의 특성에 맞는 구체적인 조언)",
    "팁 2"
  ]
}

JSON 형식으로만 응답해주세요.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const report = JSON.parse(jsonMatch[0]);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report generation error:', error);

    // Return a fallback response
    return NextResponse.json(
      { error: '리포트 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
