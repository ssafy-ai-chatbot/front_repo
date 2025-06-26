import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Mock Conversation Data ---
const mockConversation = [
  // 1. 초기 인사 및 옵션 제공
  {
    author: 'bot',
    type: 'initial_options',
    content: {
      text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
      options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
    }
  },
  // 2. 사용자 응답
  {
    author: 'user',
    type: 'text',
    content: { text: '레시피 찾아보기' }
  },
  // 3. 봇의 다음 질문 : 레시피 작성 가이드
  {
    author: 'bot',
    type: 'text',
    content: {
      text: `원하는 요리명을 입력해주세요:<br/>📋 입력 예시:<br/>"김치찌개 레시피"<br/>"계란말이 만드는 법"<br/>"파스타"<br/>"된장국 레시피 알려줘"<br/>💡 TIP:<br/>간단한 요리명만 입력해도 돼요`
    }
  },
  // 4. 사용자 응답
  {
    author: 'user',
    type: 'text',
    content: { text: '구운가지 닭가슴살 샐러드와 들깨소스' }
  },
  // 5. 봇의 레시피 답변
  {
    author: 'bot',
    type: 'recipe',
    content: {
        title: '구운가지 닭가슴살 샐러드와 들깨소스 레시피',
        ingredients: `닭가슴살 100g<br/>가지 100g (2/3개)<br/>잎채소 40g<br/>올리브유 30g (2큰술)<br/>플레인요거트 80g (1개)<br/>양파 20g (1/6개)<br/>레몬즙 20g (1⅓큰술)<br/>꿀 30g (2큰술)<br/>들깨가루 10g (2작은술)`,
        steps: [
            { text: '1. 양파는 잘게 다지고 다진 양파, 들깨가루, 플레인요거트, 꿀, 레몬즙을 섞어 들깨 드레싱을 만든다.', image: 'https://placehold.co/176x116' },
            { text: '2. 가지는 길게 길이를 살려 얇게 저민 후 달궈진 프라이팬에 올리브유를 두르고 센불에서 물기가 생기지 않게 굽는다.', image: 'https://placehold.co/176x117' },
        ],
        actions: ['선택한 메뉴 영양 정보 보기', '처음으로']
    }
  },
   // 6. 사용자 응답
  {
    author: 'user',
    type: 'text',
    content: { text: '선택한 메뉴 영양 정보 보기' }
  },
  // 7. 봇의 영양정보 답변
  {
    author: 'bot',
    type: 'nutrition_response',
    content: {
        title: '구운가지 닭가슴살 샐러드와 들깨소스',
        info: [
            { name: '열량', value: '330 kcal' },
            { name: '탄수화물', value: '20 g' },
            { name: '단백질', value: '22 g' },
            { name: '지방', value: '18 g' },
            { name: '나트륨', value: '69 mg' },
        ],
        actions: ['다른 요리 레시피 찾아보기', '처음으로'] // 다른 요리 레시피 찾아보기 버튼을 클릭하면 레시피 작성 가이드 출력
    }
  },
   // 8. 사용자 응답
   {
    author: 'user',
    type: 'text',
    content: { text: '처음으로' }
  },
  // 9. 초기 인사 및 옵션 제공
  {
    author: 'bot',
    type: 'initial_options',
    content: {
      text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
      options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
    }
  },
  // 10. 사용자 응답
  {
    author: 'user',
    type: 'text',
    content: { text: '냉장고 속 재료 활용하기' }
  },
  // 9. 냉장고 속 재료 활용하기 안내
  {
    author: 'bot',
    type: 'ingredients_guide',
    content: {
      text: '활용하고 싶은 냉장고 속 재료를 입력해주세요.<br/>📝 입력 예시:<br/>"계란, 양파, 당근으로 뭘 만들 수 있을까?"</br>"두부, 김치, 대파"</br>"감자 3개랑 치즈가 있어"</br>💡 TIP:</br>재료명만 나열해도 좋고, 자연스럽게 문장으로 물어봐도 돼요',
      options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
    }
  },
  // 10. 사용자 응답 : 냉장고 속 재료 활용하기 요청
  {
    author: 'user',
    type: 'text',
    content: { text: '닭가슴살, 양파' }
  },
  // 11. 봇의 냉장고 속 재료 활용하기 답변
  {
    author: 'bot',
    type: 'ingredients_response',
    content: {
        title: '추천 요리 목록', // 검색해서 조회에 성공했다면 출력, 최대 5개까지 한 번에 출력
        recommendation: [
            { menu: '1. 구운가지 닭가슴살 샐러드와 들깨소스', ingredients: '닭가슴살, 가지, 잎채소, 올리브유, 들깨 드레싱, 플레인요거트, 양파, 레몬즙, 꿀, 들깨가루' },
            { menu: '2. 닭가슴살 파프리카 볶음', ingredients: '닭가슴살, 양파, 파프리카, 부추, 굴소스, 간장, 올리고당, 다진 마늘, 식용유, 참기름, 통깨' },
            { menu: '3. 닭가슴살 카레', ingredients: '닭가슴살, 양파, 감자, 당근, 카레 가루, 물, 식용유, 소금, 후추' },
            { menu: '4. 맑은 닭국', ingredients: '닭가슴살, 양파, 다진 마늘, 국간장, 소금, 후추, 물, 대파' },
            { menu: '5. 닭가슴살 오야코동', ingredients: '닭가슴살, 양파, 계란, 간장, 맛술, 물, 설탕, 밥' },
        ],
        text1 : '🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요</br>📝 입력 예시:</br>"맑은 닭국 레시피 알려줘"</br>"닭가슴살 오야코동 만드는 법"</br>"맑은 닭국"</br>📊 궁금한 메뉴의 영양 정보를 살펴보세요</br>📝 입력 예시:</br>"맑은 닭국의 칼로리를 알려줘"</br>"닭가슴살 카레 영양 정보를 알려줘"',
        text2 : '💭 마음에 드는 메뉴가 없으신가요?',
        actions: ['추천 요리 더보기', '처음으로']
    }
  },
  // 12. 사용자 응답 : 추천 요리 더보기
  {
    author: 'user',
    type: 'text',
    content: { text: '추천 요리 더보기' }
  },
  // 13. 봇의 냉장고 속 재료 활용하기 답변
  {
    author: 'bot',
    type: 'ingredients_response',
    content: {
        title: '추천 요리 목록', // 검색해서 조회에 성공했다면 출력, 최대 5개까지 한 번에 출력
        recommendation: [
            { menu: '1. 닭가슴살 양파 스테이크', ingredients: '닭가슴살, 양파, 빵가루, 달걀, 소금, 후추, 간장, 식용유, 스테이크 소스' },
            { menu: '2. 닭가슴살 타코', ingredients: '닭가슴살, 양파, 파프리카, 고추가루, 토르티야, 올리브오일, 소금, 치즈, 살사소스' },
            { menu: '3. 닭가슴살 유자청 볶음', ingredients: '닭가슴살, 양파, 유자청, 간장, 마늘, 식용유, 참기름, 청양고추' },
        ],
        text1 : '🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요</br>📝 입력 예시:</br>"맑은 닭국 레시피 알려줘"</br>"닭가슴살 오야코동 만드는 법"</br>"맑은 닭국"</br>📊 궁금한 메뉴의 영양 정보를 살펴보세요</br>📝 입력 예시:</br>"맑은 닭국의 칼로리를 알려줘"</br>"닭가슴살 카레 영양 정보를 알려줘"',
        text2 : '💭 마음에 드는 메뉴가 없으신가요?',
        actions: ['처음으로'] // 가져온 추천 메뉴 목록 아이템이 5개 미만이거나, 5번째로 가져온 메뉴 정보가 추천 메뉴 전체 리스트의 마지막 아이템일 때
        // 즉 추천 요리 더보기 버튼을 클릭했을 때 더 가져올 정보가 없다면, 버튼을 출력하지 않아야 함
    }
  },
  // 14. 사용자 요청 : 초기 화면(초기 인사 및 옵션 제공) 요청
  {
    author: 'user',
    type: 'text',
    content: { text: '처음으로' }
  },
  // 15. 초기 인사 및 옵션 제공
  {
    author: 'bot',
    type: 'initial_options',
    content: {
      text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
      options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
    }
  },
  // 16. 사용자 요청 : 영양성분 찾아보기
  {
    author: 'user',
    type: 'text',
    content: { text: '영양성분 찾아보기' }
  },
  // 17. 봇 응답 : 영양성분 찾아보기 작성 가이드 응답
  {
    author: 'bot',
    type: 'nutrition_guide',
    content: {
      text: '🔍 영양 정보 검색하기</br>영양 정보를 검색하고 싶은 음식명을 입력해주세요:<br/>📝 입력 예시:<br/>"김치찌개 영양 정보"</br>"계란말이 칼로리 알려줘"</br>"된장국 나트륨"</br>"된장국"</br>💡 TIP:</br>음식명만 입력하거나 "칼로리", "단백질" 등 특정 영양소를 함께 물어봐도 돼요',
    }
  },
  // 18. 사용자 요청 : 특정 메뉴 영양 정보 요청
  {
    author: 'user',
    type: 'text',
    content: { text: '돼지고기 김치찌개 영양 정보 알려줘' }
  },
  // 19. 봇의 응답 : 백엔드에서 가져온 영양 정보 응답

  // 백엔드에 요청 문구를 전달하면 백엔드에서 db 탐색해 정보 조회하고 프론트엔드로 전달

  {
    author: 'bot',
    type: 'nutrition_response',
    content: {
        title: '돼지고기 김치찌개',
        text: '🍽️ 100ml 기준',
        info: [
            { name: '열량', value: '330 kcal' },
            { name: '탄수화물', value: '20 g' },
            { name: '단백질', value: '22 g' },
            { name: '지방', value: '18 g' },
            { name: '나트륨', value: '69 mg' },
            { name: '칼슘', value: '20 mg'},
            { name: '철분', value: '0.42 mg'},
            { name: '콜레스테롤', value: '7.54 mg'},
            { name: '비타민A', value: '8 μg RAE'},
            { name: '비타민C', value: '1.58 mg'},
            { name: '비타민D', value: '0.08 μg'},
            { name: '포화지방산', value: '0.43 g'},
            { name: '트랜스지방산', value: '0 g'},
        ],
        actions: ['해당 요리 레시피 보기', '다른 요리 영양 정보 찾기', '처음으로'] // 다른 요리 영양 정보 찾기 버튼을 클릭하면 영양성분 찾아보기 작성 가이드 출력
    }
  },
  // 20. 사용자 요청 : "해당 요리 레시피 보기" 버튼 클릭 또는 직접 "메뉴명 영양 정보 알려줘" 입력
  {
    author: 'user',
    type: 'text',
    content: { text: '돼지고기 김치찌개 레시피 알려줘' }
  },
  // 21. 봇 응답 : 조회 실패 응답
  {
    author: 'bot',
    type: 'recipe_can_not_find',
    content: {
      title: '돼지고기 김치찌개',
      text: '죄송합니다!<br/>돼지고기 김치찌개 레시피를 찾을 수 없어요.',
      alternatives: [
        { name: '김치볶음밥' },
        { name: '김치찌개' },
        { name: '돼지고기 볶음' },
        { name: '된장찌개' },
      ],
      // 돼지고기, 김치, 찌개 키워드가 들어간 레시피명이 있으면 추천
      actions: ['레시피 찾아보기', '다른 음식 영양 정보 찾기', '처음으로']
    }
  },
  // 22. 사용자 요청 : "다른 음식 영양 정보 찾기" 버튼 클릭 또는 직접 "다른 음식 영양 정보 찾기" 입력
  {
    author: 'user',
    type: 'text',
    content: { text: '영양성분 찾아보기' }
  },
  // 23. 봇 응답 : 영양성분 찾아보기 작성 가이드 응답
  {
    author: 'bot',
    type: 'nutrition_guide',
    content: {
      text: '🔍 영양 정보 검색하기</br>영양 정보를 검색하고 싶은 음식명을 입력해주세요:<br/>📝 입력 예시:<br/>"김치찌개 영양 정보"</br>"계란말이 칼로리 알려줘"</br>"된장국 나트륨"</br>"된장국"</br>💡 TIP:</br>음식명만 입력하거나 "칼로리", "단백질" 등 특정 영양소를 함께 물어봐도 돼요',
    }
  },
  // 24. 사용자 요청 : 요리의 특정 영양성분 검색
  {
    author: 'user',
    type: 'text',
    content: { text: '된장국 나트륨' }
  },
  // 25. 봇 응답 : 요리의 특정 영양성분 찾아보기 작성 가이드 응답
  {
    author: 'bot',
    type: 'nutrition_response',
    content: {
        title: '된장국',
        info: [
            { name: '나트륨', value: '260 mg' },
        ],
        actions: ['해당 요리 레시피 보기', '다른 요리 영양 정보 찾기', '처음으로'] 
    }
  },
];


export const useChatStore = defineStore('chat', () => {
  const messages = ref(mockConversation);

  function addMessage(message) {
    messages.value.push(message);
  }

  // 사용자 메시지를 받아 처리하는 액션
  async function sendMessage(text) {
    addMessage({ author: 'user', type: 'text', content: { text } });

    // (향후) 백엔드 API 연동
    setTimeout(() => {
        const botResponse = {
            author: 'bot',
            type: 'text',
            content: { text: `시뮬레이션 응답입니다: '${text}'에 대해 처리 중...` }
        };
        addMessage(botResponse);
    }, 1000);
  }

  // 버튼 클릭 처리 액션
  async function handleOptionClick(optionText) {
    addMessage({ author: 'user', type: 'text', content: { text: optionText } });

    // (향후) 백엔드 API 연동
     setTimeout(() => {
        const botResponse = {
            author: 'bot',
            type: 'text',
            content: { text: `시뮬레이션 응답입니다: '${optionText}'을 선택하셨습니다.` }
        };
        addMessage(botResponse);
    }, 1000);
  }


  return { messages, sendMessage, handleOptionClick };
});