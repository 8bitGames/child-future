import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BasicInfo } from '@/lib/types/assessment';
import { ASSESSMENT_QUESTIONS, QUICK_QUESTION_IDS, SITUATION_QUESTIONS, FULL_ASSESSMENT_QUESTIONS } from '@/lib/data/questions';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { basicInfo, mode } = await request.json() as {
      basicInfo: BasicInfo;
      mode: 'quick' | 'full' | 'extend';
    };

    // 모드에 따라 질문 필터링
    let scaleQuestions = ASSESSMENT_QUESTIONS;
    let situationQuestions: typeof SITUATION_QUESTIONS = [];

    if (mode === 'quick') {
      scaleQuestions = ASSESSMENT_QUESTIONS.filter(q => QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'extend') {
      scaleQuestions = ASSESSMENT_QUESTIONS.filter(q => !QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'full') {
      // 정밀 검사: 모든 척도형 + 상황형 포함
      situationQuestions = SITUATION_QUESTIONS;
    }

    const baseQuestions = scaleQuestions;
    const hasSituationQuestions = situationQuestions.length > 0;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // 상황형 질문 포맷
    const situationQuestionsText = hasSituationQuestions
      ? `\n## 상황형 질문들 (개인화 우선)\n${situationQuestions.map((q, i) =>
          `${i + 1}. [${q.id}] ${q.text}\n   옵션: ${q.options?.map(o => `${o.label}) ${o.text}`).join(' / ')}`
        ).join('\n')}`
      : '';

    const prompt = `
당신은 아동 심리 전문가입니다. 아래 아이의 정보를 참고하여, 주어진 성향 검사 질문들을 아이에게 맞춤화해주세요.

## 아이 정보
- 애칭: ${basicInfo.nickname}
- 나이: ${basicInfo.age}세
- 활동(학원/방과후): ${basicInfo.activities.length > 0 ? basicInfo.activities.join(', ') : '없음'}
- 취미: ${basicInfo.hobbies.length > 0 ? basicInfo.hobbies.join(', ') : '없음'}
- 관심사: ${basicInfo.interests.length > 0 ? basicInfo.interests.join(', ') : '없음'}
- 잘하는 과목: ${basicInfo.strongSubjects.length > 0 ? basicInfo.strongSubjects.join(', ') : '없음'}

## 척도형 질문들
${baseQuestions.map((q, i) => `${i + 1}. [${q.id}] ${q.text}`).join('\n')}
${situationQuestionsText}

## 요청사항
각 질문을 아이의 활동/취미/관심사를 자연스럽게 반영하여 더 구체적이고 친근하게 바꿔주세요.

### 척도형 질문 예시:
- 원본: "새로운 방법을 생각해내는 게 재미있어? 같은 것도 다르게 해보려고 하는 편이야?"
- 아이가 레고를 좋아한다면: "레고로 새로운 걸 만들 때 재미있어? 같은 것도 다르게 만들어보려고 하는 편이야?"

### 상황형 질문 예시 (더 중요!):
- 원본: "학교 축제를 준비한대. 어떤 역할을 가장 하고 싶어?"
- 아이가 축구를 좋아한다면: "축구부 행사를 준비한대. 어떤 역할을 가장 하고 싶어?"
- 아이가 피아노를 배운다면: "피아노 발표회를 준비한대. 어떤 역할을 가장 하고 싶어?"
- 옵션도 상황에 맞게 조정 (예: "부스 디자인" → "무대 꾸미기")

규칙:
1. 질문의 핵심 의미와 측정하려는 성향은 유지
2. 상황형 질문은 아이의 실제 활동과 연결하여 더 몰입감 있게
3. 상황형 옵션도 상황에 맞게 자연스럽게 수정
4. 관련 정보가 없으면 원본 유지
5. ${basicInfo.nickname}의 이름을 직접 언급하지 말 것
6. 문장을 너무 길게 만들지 말 것

다음 JSON 형식으로 응답해주세요:
{
  "questions": [
    {"id": "q1", "text": "개인화된 질문 내용"},
    ...
  ]${hasSituationQuestions ? `,
  "situationQuestions": [
    {
      "id": "s1",
      "text": "개인화된 상황 질문",
      "options": [
        {"label": "A", "text": "개인화된 옵션"},
        {"label": "B", "text": "개인화된 옵션"},
        {"label": "C", "text": "개인화된 옵션"},
        {"label": "D", "text": "개인화된 옵션"}
      ]
    },
    ...
  ]` : ''}
}

반드시 모든 질문에 대해 응답하고, 유효한 JSON 형식으로만 응답하세요.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (parsed.questions && Array.isArray(parsed.questions)) {
        // 척도형 질문 개인화
        const personalizedQuestions = baseQuestions.map(original => {
          const personalized = parsed.questions.find(
            (p: { id: string; text: string }) => p.id === original.id
          );
          return {
            ...original,
            text: personalized?.text || original.text
          };
        });

        // 상황형 질문 개인화 (옵션 포함)
        let personalizedSituations = situationQuestions;
        if (parsed.situationQuestions && Array.isArray(parsed.situationQuestions)) {
          personalizedSituations = situationQuestions.map(original => {
            const personalized = parsed.situationQuestions.find(
              (p: { id: string; text: string; options?: Array<{ label: string; text: string }> }) =>
                p.id === original.id
            );
            if (personalized) {
              return {
                ...original,
                text: personalized.text || original.text,
                options: original.options?.map((opt, idx) => ({
                  ...opt,
                  text: personalized.options?.[idx]?.text || opt.text
                }))
              };
            }
            return original;
          });
        }

        // 척도형 + 상황형 합치기
        const allQuestions = [...personalizedQuestions, ...personalizedSituations];
        return NextResponse.json({ questions: allQuestions });
      }
    }

    // 파싱 실패 시 원본 반환
    const fallbackAll = [...baseQuestions, ...situationQuestions];
    return NextResponse.json({ questions: fallbackAll });

  } catch (error) {
    console.error('Question generation error:', error);

    // 에러 시 원본 질문 반환
    const { mode } = await request.json().catch(() => ({ mode: 'full' }));
    let fallbackQuestions = ASSESSMENT_QUESTIONS;
    let fallbackSituation: typeof SITUATION_QUESTIONS = [];

    if (mode === 'quick') {
      fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'extend') {
      fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => !QUICK_QUESTION_IDS.includes(q.id));
    } else if (mode === 'full') {
      fallbackSituation = SITUATION_QUESTIONS;
    }

    return NextResponse.json({ questions: [...fallbackQuestions, ...fallbackSituation] });
  }
}
