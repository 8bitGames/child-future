-- Test Data for Child Future Application
-- Run this SQL in Supabase SQL Editor after running 000_complete_schema.sql

-- ============================================
-- 1. TEST FAMILY (No owner - for testing only)
-- ============================================

-- First, allow families without owner_id for testing
ALTER TABLE families ALTER COLUMN owner_id DROP NOT NULL;

-- Insert test family with code: ABCD-1234
INSERT INTO families (id, family_code, name, owner_id)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'ABCD1234',
  '테스트 가족',
  NULL
) ON CONFLICT (family_code) DO NOTHING;

-- Insert another test family: TEST-5678
INSERT INTO families (id, family_code, name, owner_id)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  'TEST5678',
  '김씨 가족',
  NULL
) ON CONFLICT (family_code) DO NOTHING;

-- ============================================
-- 2. TEST CHILDREN
-- ============================================

-- Allow children without user_id for testing
ALTER TABLE children ALTER COLUMN user_id DROP NOT NULL;

-- Child 1: 민준 (ABCD1234 가족)
INSERT INTO children (
  id, user_id, family_id, nickname, age, grade, gender,
  activities, hobbies, interests, strong_subjects, dream_jobs, pin_hash
)
VALUES (
  'c47ac10b-58cc-4372-a567-0e02b2c3d001',
  NULL,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '민준',
  8,
  '초등학교 2학년',
  'male',
  ARRAY['축구', '수영', '태권도'],
  ARRAY['레고 조립', '그림 그리기'],
  ARRAY['공룡', '우주', '로봇'],
  ARRAY['수학', '체육'],
  ARRAY['과학자', '축구선수'],
  -- PIN: 1234 (hashed with simple base64 for demo)
  'MTIzNA=='
) ON CONFLICT (id) DO NOTHING;

-- Child 2: 서연 (ABCD1234 가족)
INSERT INTO children (
  id, user_id, family_id, nickname, age, grade, gender,
  activities, hobbies, interests, strong_subjects, dream_jobs, pin_hash
)
VALUES (
  'c47ac10b-58cc-4372-a567-0e02b2c3d002',
  NULL,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '서연',
  10,
  '초등학교 4학년',
  'female',
  ARRAY['피아노', '발레', '미술'],
  ARRAY['독서', '일기 쓰기'],
  ARRAY['동물', '음악', '패션'],
  ARRAY['국어', '음악', '미술'],
  ARRAY['수의사', '피아니스트', '작가'],
  -- PIN: 5678
  'NTY3OA=='
) ON CONFLICT (id) DO NOTHING;

-- Child 3: 지호 (TEST5678 가족)
INSERT INTO children (
  id, user_id, family_id, nickname, age, grade, gender,
  activities, hobbies, interests, strong_subjects, dream_jobs, pin_hash
)
VALUES (
  'c47ac10b-58cc-4372-a567-0e02b2c3d003',
  NULL,
  'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  '지호',
  12,
  '초등학교 6학년',
  'male',
  ARRAY['코딩', '로봇 만들기', '바둑'],
  ARRAY['게임', '유튜브 보기'],
  ARRAY['컴퓨터', '인공지능', '게임 개발'],
  ARRAY['수학', '과학', '정보'],
  ARRAY['프로그래머', '게임 개발자', 'AI 연구원'],
  -- PIN: 0000
  'MDAwMA=='
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. SAMPLE MISSION TEMPLATES
-- ============================================

INSERT INTO mission_templates (id, title, description, target_ib_profile, target_category, difficulty, estimated_time, badge_name, badge_icon, badge_tier, age_min, age_max)
VALUES
  ('m001', '호기심 탐험가', '오늘 궁금한 것 3가지를 찾아서 부모님께 질문해보세요!', 'Inquirer', 'analytical', 'easy', '30분', '질문왕', '❓', 'bronze', 5, 12),
  ('m002', '작은 과학자', '집에서 간단한 실험을 해보고 결과를 기록해보세요', 'Thinker', 'analytical', 'medium', '1시간', '실험 박사', '🔬', 'silver', 7, 15),
  ('m003', '친절한 도우미', '가족이나 친구를 도와주는 일을 3가지 해보세요', 'Caring', 'caring', 'easy', '하루', '따뜻한 마음', '💝', 'bronze', 5, 15),
  ('m004', '용감한 도전자', '평소 무서워하던 것에 도전해보세요', 'Risk-taker', 'leadership', 'hard', '1주일', '용기 뱃지', '🦁', 'gold', 8, 15),
  ('m005', '창작 예술가', '나만의 작품을 만들어보세요 (그림, 공예, 글쓰기 등)', 'Open-minded', 'creative', 'medium', '2시간', '예술가', '🎨', 'silver', 5, 15),
  ('m006', '소통의 달인', '새로운 친구에게 먼저 말을 걸어보세요', 'Communicator', 'leadership', 'medium', '1일', '친구 만들기', '🤝', 'silver', 6, 15),
  ('m007', '균형 잡기 챔피언', '공부, 놀이, 휴식 시간을 골고루 보내보세요', 'Balanced', 'practical', 'easy', '1일', '균형 마스터', '⚖️', 'bronze', 7, 15),
  ('m008', '성찰 일기', '오늘 하루를 돌아보며 배운 점을 일기로 써보세요', 'Reflective', 'analytical', 'easy', '20분', '생각쟁이', '📔', 'bronze', 6, 15)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. SAMPLE CONVERSATION CARDS
-- ============================================

INSERT INTO conversation_cards (id, question, situation, target_ib_profile, follow_up_tips, age_min, age_max, category)
VALUES
  ('cc001', '오늘 가장 재미있었던 일은 뭐야?', 'meal', 'Communicator', ARRAY['왜 그게 재미있었어?', '다음에도 해보고 싶어?'], 5, 15, 'question'),
  ('cc002', '만약 마법 능력이 생긴다면 뭘 하고 싶어?', 'bedtime', 'Open-minded', ARRAY['그 능력으로 누구를 도와주고 싶어?', '어떤 모험을 떠나고 싶어?'], 5, 12, 'question'),
  ('cc003', '학교에서 제일 친한 친구는 누구야? 왜 좋아해?', 'travel', 'Caring', ARRAY['그 친구랑 뭘 할 때 제일 좋아?', '친구가 힘들 때 어떻게 도와줘?'], 6, 15, 'question'),
  ('cc004', '요즘 제일 궁금한 게 뭐야?', 'anytime', 'Inquirer', ARRAY['그걸 어떻게 알아볼 수 있을까?', '같이 찾아볼까?'], 5, 15, 'question'),
  ('cc005', '어려운 문제를 만나면 어떻게 해?', 'meal', 'Thinker', ARRAY['포기하고 싶을 때는 어떻게 해?', '도움을 요청하는 건 어때?'], 7, 15, 'reflection'),
  ('cc006', '요즘 도전해보고 싶은 게 있어?', 'play', 'Risk-taker', ARRAY['그걸 하려면 뭐가 필요해?', '무서운 점도 있어?'], 6, 15, 'question'),
  ('cc007', '내가 잘하는 것 3가지를 말해볼래?', 'bedtime', 'Reflective', ARRAY['어떻게 그렇게 잘하게 됐어?', '더 잘하고 싶은 것도 있어?'], 6, 15, 'reflection'),
  ('cc008', '함께 간단한 요리를 만들어볼까?', 'anytime', 'Balanced', ARRAY['어떤 음식을 만들고 싶어?', '재료를 준비하는 것도 도와줄래?'], 5, 15, 'activity')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Check inserted data
SELECT 'families' as table_name, COUNT(*) as count FROM families
UNION ALL
SELECT 'children', COUNT(*) FROM children
UNION ALL
SELECT 'mission_templates', COUNT(*) FROM mission_templates
UNION ALL
SELECT 'conversation_cards', COUNT(*) FROM conversation_cards;

-- Show test families
SELECT family_code, name FROM families;

-- Show test children with their family
SELECT c.nickname, c.age, c.grade, f.family_code, f.name as family_name
FROM children c
JOIN families f ON c.family_id = f.id;

-- ============================================
-- TEST LOGIN INFO
-- ============================================
--
-- 가족 코드 1: ABCD1234 (테스트 가족)
--   - 민준 (8세, PIN: 1234)
--   - 서연 (10세, PIN: 5678)
--
-- 가족 코드 2: TEST5678 (김씨 가족)
--   - 지호 (12세, PIN: 0000)
--
-- ============================================
