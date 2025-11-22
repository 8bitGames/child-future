import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BasicInfo } from '@/lib/types/assessment';
import { ASSESSMENT_QUESTIONS, QUICK_QUESTION_IDS } from '@/lib/data/questions';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { basicInfo, mode } = await request.json() as {
      basicInfo: BasicInfo;
      mode: 'quick' | 'full' | 'extend';
    };

    // 모드에 따라 질문 필터링
    let baseQuestions = ASSESSMENT_QUESTIONS;
    if (mode === 'quick') {
      baseQuestions = ASSESSMENT_QUESTIONS.filter(q => QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'extend') {
      baseQuestions = ASSESSMENT_QUESTIONS.filter(q => !QUICK_QUESTION_IDS.includes(q.id));
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
당신은 아동 심리 전문가입니다. 아래 아이의 정보를 참고하여, 주어진 성향 검사 질문들을 아이에게 맞춤화해주세요.

## 아이 정보
- 애칭: ${basicInfo.nickname}
- 나이: ${basicInfo.age}세
- 활동(학원/방과후): ${basicInfo.activities.length > 0 ? basicInfo.activities.join(', ') : '없음'}
- 취미: ${basicInfo.hobbies.length > 0 ? basicInfo.hobbies.join(', ') : '없음'}
- 관심사: ${basicInfo.interests.length > 0 ? basicInfo.interests.join(', ') : '없음'}
- 잘하는 과목: ${basicInfo.strongSubjects.length > 0 ? basicInfo.strongSubjects.join(', ') : '없음'}

## 원본 질문들
${baseQuestions.map((q, i) => `${i + 1}. [${q.id}] ${q.text}`).join('\n')}

## 요청사항
각 질문을 아이의 활동/취미/관심사를 자연스럽게 반영하여 더 구체적이고 친근하게 바꿔주세요.

예시:
- 원본: "새로운 아이디어나 창작 활동을 할 때 시간 가는 줄 모른다"
- 아이가 레고를 좋아한다면: "레고로 새로운 것을 만들거나 창작할 때 시간 가는 줄 모른다"
- 아이가 그림을 좋아한다면: "그림을 그리거나 새로운 아이디어를 떠올릴 때 시간 가는 줄 모른다"

규칙:
1. 질문의 핵심 의미와 측정하려는 성향은 유지
2. 아이의 활동/취미가 해당 질문과 관련있으면 언급
3. 관련 정보가 없으면 원본 질문 유지
4. ${basicInfo.nickname}의 이름을 직접 언급하지 말 것
5. 문장을 너무 길게 만들지 말 것 (30자 이내 권장)

다음 JSON 형식으로 응답해주세요:
{
  "questions": [
    {"id": "q1", "text": "개인화된 질문 내용"},
    {"id": "q2", "text": "개인화된 질문 내용"},
    ...
  ]
}

반드시 모든 ${baseQuestions.length}개 질문에 대해 응답하고, 유효한 JSON 형식으로만 응답하세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.questions && Array.isArray(parsed.questions)) {
        // 원본 질문 데이터와 병합
        const personalizedQuestions = baseQuestions.map(original => {
          const personalized = parsed.questions.find(
            (p: { id: string; text: string }) => p.id === original.id
          );
          return {
            ...original,
            text: personalized?.text || original.text
          };
        });

        return NextResponse.json({ questions: personalizedQuestions });
      }
    }

    // 파싱 실패 시 원본 반환
    return NextResponse.json({ questions: baseQuestions });

  } catch (error) {
    console.error('Question generation error:', error);

    // 에러 시 원본 질문 반환
    const { mode } = await request.json().catch(() => ({ mode: 'full' }));
    let fallbackQuestions = ASSESSMENT_QUESTIONS;

    if (mode === 'quick') {
      fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'extend') {
      fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => !QUICK_QUESTION_IDS.includes(q.id));
    }

    return NextResponse.json({ questions: fallbackQuestions });
  }
}
