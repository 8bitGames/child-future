import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithRetry } from '@/lib/utils/gemini';
import { AssessmentData, AssessmentMode } from '@/lib/types/assessment';

interface AnalyzeRequest {
  data: AssessmentData;
  mode?: AssessmentMode;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 이전 버전 호환성: data가 직접 전달된 경우
    const data: AssessmentData = body.data || body;
    const mode: AssessmentMode = body.mode || 'full';

    // 기본 데이터 검증
    if (!data.basicInfo) {
      return NextResponse.json(
        { error: 'Basic info is required' },
        { status: 400 }
      );
    }

    if (!data.responses || data.responses.length === 0) {
      return NextResponse.json(
        { error: 'Assessment responses are required' },
        { status: 400 }
      );
    }

    // Gemini API 호출 (재시도 로직 포함)
    const isQuickMode = mode === 'quick';
    const analysis = await analyzeWithRetry(data, 3, isQuickMode);

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Analysis API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
