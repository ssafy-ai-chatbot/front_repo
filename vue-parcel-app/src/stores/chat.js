import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- 모의 대화 데이터 ---
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
];

// 전체 모의 추천 목록 (8개 항목)
const fullMockRecommendations = [
  { menu: '1. 구운가지 닭가슴살 샐러드와 들깨소스', ingredients: '닭가슴살, 가지, 잎채소, 올리브유, 들깨 드레싱, 플레인요거트, 양파, 레몬즙, 꿀, 들깨가루' },
  { menu: '2. 닭가슴살 파프리카 볶음', ingredients: '닭가슴살, 양파, 파프리카, 부추, 굴소스, 간장, 올리고당, 다진 마늘, 식용유, 참기름, 통깨' },
  { menu: '3. 닭가슴살 카레', ingredients: '닭가슴살, 양파, 감자, 당근, 카레 가루, 물, 식용유, 소금, 후추' },
  { menu: '4. 맑은 닭국', ingredients: '닭가슴살, 양파, 다진 마늘, 국간장, 소금, 후추, 물, 대파' },
  { menu: '5. 닭가슴살 오야코동', ingredients: '닭가슴살, 양파, 계란, 간장, 맛술, 물, 설탕, 밥' },
  { menu: '6. 닭가슴살 양파 스테이크', ingredients: '닭가슴살, 양파, 빵가루, 달걀, 소금, 후추, 간장, 식용유, 스테이크 소스' },
  { menu: '7. 닭가슴살 타코', ingredients: '닭가슴살, 양파, 파프리카, 고추가루, 토르티야, 올리브오일, 소금, 치즈, 살사소스' },
  { menu: '8. 닭가슴살 유자청 볶음', ingredients: '닭가슴살, 양파, 유자청, 간장, 마늘, 식용유, 참기름, 청양고추' },
];


export const useChatStore = defineStore('chat', () => {
  const messages = ref(mockConversation);
  const lastRecipeTitle = ref(null); // 마지막으로 조회된 레시피의 제목을 저장할 변수

  // 추천 페이징을 위한 새로운 변수
  const allRecommendations = ref([]); // 백엔드에서 가져온 전체 추천 목록을 저장합니다.
  const currentRecommendationIndex = ref(0); // 추천 목록을 표시하기 위한 현재 시작 인덱스를 추적합니다.
  const recommendationsPerPage = 5; // 페이지당 표시할 추천 개수

  function addMessage(message) {
    messages.value.push(message);
  }

  // 페이지로 나뉜 추천을 가져오는 헬퍼 함수
  const getPaginatedRecommendations = () => {
    const startIndex = currentRecommendationIndex.value;
    const endIndex = Math.min(startIndex + recommendationsPerPage, allRecommendations.value.length);
    return allRecommendations.value.slice(startIndex, endIndex);
  };

  // 남은 추천에 따라 액션을 결정하는 함수
  const getRecommendationActions = () => {
    const actions = [];
    // 현재 인덱스가 전체 추천 목록 길이보다 작으면 (즉, 아직 보여줄 추천이 남아있다면) '추천 요리 더보기' 버튼을 추가합니다.
    if (currentRecommendationIndex.value < allRecommendations.value.length) {
      actions.push('추천 요리 더보기');
    }
    actions.push('처음으로');
    return actions;
  };

  // 봇 응답을 생성하는 헬퍼 함수
  const generateBotResponse = (inputText) => {
    let botResponse;

    // 추천 관련 요청이 아닌 경우 추천 컨텍스트를 지웁니다.
    if (!['닭가슴살, 양파', '추천 요리 더보기'].includes(inputText)) {
      allRecommendations.value = [];
      currentRecommendationIndex.value = 0;
    }

    if (inputText === '처음으로') {
      botResponse = {
        author: 'bot',
        type: 'initial_options',
        content: {
          text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
          options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
        }
      };
      lastRecipeTitle.value = null; // '처음으로' 시에도 컨텍스트 초기화
      allRecommendations.value = []; // 추천 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 인덱스 초기화
    }
    // '레시피 찾아보기' 또는 '다른 요리 레시피 찾아보기' 입력 처리
    else if (inputText === '레시피 찾아보기' || inputText === '다른 요리 레시피 찾아보기') {
      botResponse = {
        author: 'bot',
        type: 'text',
        content: {
          text: `원하는 요리명을 입력해주세요:<br/>📋 입력 예시:<br/>"김치찌개 레시피"<br/>"계란말이 만드는 법"<br/>"파스타"<br/>"된장국 레시피 알려줘"<br/>💡 TIP:<br/>간단한 요리명만 입력해도 돼요`
        }
      };
      lastRecipeTitle.value = null; // 다른 레시피를 찾을 때 초기화
    }
    // '냉장고 속 재료 활용하기' 입력 처리
    else if (inputText === '냉장고 속 재료 활용하기') {
      botResponse = {
        author: 'bot',
        type: 'ingredients_guide',
        content: {
          text: '활용하고 싶은 냉장고 속 재료를 입력해주세요.<br/>📝 입력 예시:<br/>"계란, 양파, 당근으로 뭘 만들 수 있을까?"</br>"두부, 김치, 대파"</br>"감자 3개랑 치즈가 있어"</br>💡 TIP:</br>재료명만 나열해도 좋고, 자연스럽게 문장으로 물어봐도 돼요',
          options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
        }
      };
      lastRecipeTitle.value = null; // 다른 기능을 사용할 때 초기화
    }
    // '영양성분 찾아보기' 또는 '다른 요리 영양 정보 찾기' 입력 처리
    else if (inputText === '영양성분 찾아보기' || inputText === '다른 요리 영양 정보 찾기' || inputText === '다른 음식 영양 정보 찾기') {
      botResponse = {
        author: 'bot',
        type: 'nutrition_guide',
        content: {
          text: '🔍 영양 정보 검색하기</br>영양 정보를 검색하고 싶은 음식명을 입력해주세요:<br/>📝 입력 예시:<br/>"김치찌개 영양 정보"</br>"계란말이 칼로리 알려줘"</br>"된장국 나트륨"</br>"된장국"</br>💡 TIP:</br>음식명만 입력하거나 "칼로리", "단백질" 등 특정 영양소를 함께 물어봐도 돼요',
        }
      };
      lastRecipeTitle.value = null; // 새로운 영양정보 검색 시작 시 초기화
    }
    // "선택한 메뉴 영양 정보 보기" 텍스트/버튼 입력 처리
    else if (inputText === '선택한 메뉴 영양 정보 보기') {
      if (lastRecipeTitle.value) {
        botResponse = {
          author: 'bot',
          type: 'nutrition_response',
          content: {
            title: lastRecipeTitle.value, // 저장된 레시피명 사용
            info: [
              { name: '열량', value: '330 kcal' }, // 예시 데이터
              { name: '탄수화물', value: '20 g' },
              { name: '단백질', value: '22 g' },
              { name: '지방', value: '18 g' },
              { name: '나트륨', value: '69 mg' },
            ],
            actions: ['다른 요리 레시피 찾아보기', '처음으로']
          }
        };
      } else {
        botResponse = {
          author: 'bot',
          type: 'can_not_find',
          content: {
            title: '선택한 메뉴 영양 정보 보기',
            text: '죄송합니다!<br/>요청하신 정보를 찾을 수 없어요.',
            actions: ['다른 음식 영양 정보 찾기', '처음으로']
          }
        };
        lastRecipeTitle.value = null; // 찾지 못했으므로 초기화
      }
    }
    // '해당 요리 레시피 보기' 텍스트/버튼 입력 처리
    else if (inputText === '해당 요리 레시피 보기') {
      if (lastRecipeTitle.value) {
        const recipeToFind = lastRecipeTitle.value;
        if (recipeToFind === '돼지고기 김치찌개') {
          botResponse = {
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
              actions: ['다른 레시피 찾아보기', '다른 요리 영양 정보 찾기', '처음으로']
            }
          };
        } else if (recipeToFind === '구운가지 닭가슴살 샐러드와 들깨소스') { // 레시피 조회 성공 시
          botResponse = {
            author: 'bot',
            type: 'recipe_response',
            content: {
              title: '구운가지 닭가슴살 샐러드와 들깨소스 레시피',
              ingredients: `닭가슴살 100g<br/>가지 100g (2/3개)<br/>잎채소 40g<br/>올리브유 30g (2큰술)<br/>플레인요거트 80g (1개)<br/>양파 20g (1/6개)<br/>레몬즙 20g (1⅓큰술)<br/>꿀 30g (2큰술)<br/>들깨가루 10g (2작은술)`,
              steps: [
                { text: '1. 양파는 잘게 다지고 다진 양파, 들깨가루, 플레인요거트, 꿀, 레몬즙을 섞어 들깨 드레싱을 만든다.' },
                { text: '2. 가지는 길게 길이를 살려 얇게 저민 후 달궈진 프라이팬에 올리브유를 두르고 센불에서 물기가 생기지 않게 굽는다.' },
              ],
              actions: ['선택한 메뉴 영양 정보 보기', '처음으로']
            }
          };
        } else if (recipeToFind === '된장국') {
          botResponse = {
            author: 'bot',
            type: 'recipe_can_not_find',
            content: {
              title: '된장국',
              text: '죄송합니다!<br/>된장국 레시피를 찾을 수 없어요.',
              alternatives: [],
              actions: ['다른 레시피 찾아보기', '다른 요리 영양 정보 찾기', '처음으로']
            }
          };
        } else {
          botResponse = {
            author: 'bot',
            type: 'recipe_can_not_find',
            content: {
              title: recipeToFind,
              text: `죄송합니다!<br/>${recipeToFind} 레시피를 찾을 수 없어요.`,
              alternatives: [],
              actions: ['다른 레시피 찾아보기', '다른 요리 영양 정보 찾기', '처음으로']
            }
          };
        }
        lastRecipeTitle.value = null; // 레시피 요청 후에는 초기화
      } else {
        botResponse = {
          author: 'bot',
          type: 'can_not_find',
          content: {
            title: '해당 요리 레시피 보기',
            text: '죄송합니다!<br/>어떤 요리의 레시피를 원하시는지 알 수 없어요. 먼저 영양 정보를 조회해주세요.',
            actions: ['영양성분 찾아보기', '처음으로']
          }
        };
        lastRecipeTitle.value = null;
      }
    }
    // 샘플 : 레시피 응답 (예: '구운가지 닭가슴살 샐러드와 들깨소스' 입력 처리)
    else if (inputText === '구운가지 닭가슴살 샐러드와 들깨소스') {
      botResponse = {
        author: 'bot',
        type: 'recipe_response',
        content: {
          title: '구운가지 닭가슴살 샐러드와 들깨소스 레시피',
          ingredients: `닭가슴살 100g<br/>가지 100g (2/3개)<br/>잎채소 40g<br/>올리브유 30g (2큰술)<br/>플레인요거트 80g (1개)<br/>양파 20g (1/6개)<br/>레몬즙 20g (1⅓큰술)<br/>꿀 30g (2큰술)<br/>들깨가루 10g (2작은술)`,
          steps: [
            { text: '1. 양파는 잘게 다지고 다진 양파, 들깨가루, 플레인요거트, 꿀, 레몬즙을 섞어 들깨 드레싱을 만든다.' },
            { text: '2. 가지는 길게 길이를 살려 얇게 저민 후 달궈진 프라이팬에 올리브유를 두르고 센불에서 물기가 생기지 않게 굽는다.' },
          ],
          actions: ['선택한 메뉴 영양 정보 보기', '처음으로']
        }
      };
      lastRecipeTitle.value = botResponse.content.title.replace(' 레시피', '');
    }
    // 샘플 : 특정 영양 정보 조회 (예: '돼지고기 김치찌개 영양 정보 알려줘')
    else if (inputText === '돼지고기 김치찌개 영양 정보 알려줘') {
      botResponse = {
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
            { name: '칼슘', value: '20 mg' },
            { name: '철분', value: '0.42 mg' },
            { name: '콜레스테롤', value: '7.54 mg' },
            { name: '비타민A', value: '8 μg RAE' },
            { name: '비타민C', value: '1.58 mg' },
            { name: '비타민D', value: '0.08 μg' },
            { name: '포화지방산', value: '0.43 g' },
            { name: '트랜스지방산', value: '0 g' },
          ],
          actions: ['해당 요리 레시피 보기', '다른 요리 영양 정보 찾기', '처음으로']
        }
      };
      lastRecipeTitle.value = botResponse.content.title;
    }
    // 샘플 : 레시피 조회 실패 응답 (예: '돼지고기 김치찌개 레시피 알려줘')
    else if (inputText === '돼지고기 김치찌개 레시피 알려줘') {
      botResponse = {
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
          actions: ['다른 레시피 찾아보기', '다른 요리 영양 정보 찾기', '처음으로']
        }
      };
      lastRecipeTitle.value = null; // 레시피를 찾지 못했으므로 초기화
    }
    // 샘플 : 된장국 레시피 알려줘 (수정된 부분)
    else if (inputText === '된장국 레시피 알려줘') {
      botResponse = {
        author: 'bot',
        type: 'recipe_can_not_find',
        content: {
          title: '된장국',
          text: '죄송합니다!<br/>된장국 레시피를 찾을 수 없어요.',
          alternatives: [],
          actions: ['다른 레시피 찾아보기', '다른 요리 영양 정보 찾기', '처음으로']
        }
      };
      lastRecipeTitle.value = null;
    }
    // 샘플 : 냉장고 속 재료 활용하기 (예: '닭가슴살, 양파')
    else if (inputText === '닭가슴살, 양파') {
      allRecommendations.value = [...fullMockRecommendations]; // 모든 추천을 저장
      currentRecommendationIndex.value = 0; // 새 검색을 위해 인덱스 초기화

      const displayedRecommendations = getPaginatedRecommendations();
      currentRecommendationIndex.value += displayedRecommendations.length;

      botResponse = {
        author: 'bot',
        type: 'ingredients_response',
        content: {
          title: '추천 요리 목록',
          recommendation: displayedRecommendations,
          text1: '🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요</br>📝 입력 예시:</br>"맑은 닭국 레시피 알려줘"</br>"닭가슴살 오야코동 만드는 법"</br>"맑은 닭국"</br></br>📊 궁금한 메뉴의 영양 정보를 살펴보세요</br>📝 입력 예시:</br>"맑은 닭국의 칼로리를 알려줘"</br>"닭가슴살 카레 영양 정보를 알려줘"',
          text2: '💭 마음에 드는 메뉴가 없으신가요?',
          actions: getRecommendationActions()
        }
      };
      lastRecipeTitle.value = null; // 재료 활용은 레시피 검색과 다른 플로우이므로 초기화
    }
    // 추천 요리 더보기 (예: '추천 요리 더보기')
    else if (inputText === '추천 요리 더보기') {
      const displayedRecommendations = getPaginatedRecommendations();
      currentRecommendationIndex.value += displayedRecommendations.length;

      if (displayedRecommendations.length > 0) {
        botResponse = {
          author: 'bot',
          type: 'ingredients_response',
          content: {
            title: '추천 요리 목록',
            recommendation: displayedRecommendations,
            text1: '🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요</br>📝 입력 예시:</br>"맑은 닭국 레시피 알려줘"</br>"닭가슴살 오야코동 만드는 법"</br>"맑은 닭국"</br>📊 궁금한 메뉴의 영양 정보를 살펴보세요</br>📝 입력 예시:</br>"맑은 닭국의 칼로리를 알려줘"</br>"닭가슴살 카레 영양 정보를 알려줘"',
            text2: '💭 마음에 드는 메뉴가 없으신가요?',
            actions: getRecommendationActions()
          }
        };
      } else {
        botResponse = {
          author: 'bot',
          type: 'can_not_find',
          content: {
            title: '추천 요리 더보기',
            text: '죄송합니다!<br/>더 이상 추천할 요리가 없어요.',
            actions: ['냉장고 속 재료 활용하기', '처음으로'] // 대체 액션 제공
          }
        };
        allRecommendations.value = []; // 모든 추천이 표시되었거나 남은 것이 없으므로 상태 초기화
        currentRecommendationIndex.value = 0;
      }
      lastRecipeTitle.value = null; // 추천 요리 더보기는 레시피 검색과 다른 플로우이므로 초기화
    }
    // 특정 영양성분 검색 (예: '된장국 나트륨')
    else if (inputText === '된장국 나트륨') {
      botResponse = {
        author: 'bot',
        type: 'nutrition_response',
        content: {
          title: '된장국',
          info: [
            { name: '나트륨', value: '260 mg' },
          ],
          actions: ['해당 요리 레시피 보기', '다른 요리 영양 정보 찾기', '처음으로']
        }
      };
      lastRecipeTitle.value = botResponse.content.title;
    }
    else {
      // 실제 백엔드 API 연동 시 이 부분을 백엔드 API 호출로 대체합니다.
      botResponse = {
        author: 'bot',
        type: 'text',
        content: { text: `시뮬레이션 응답입니다: '${inputText}'에 대해 처리 중...` }
      };
      lastRecipeTitle.value = null; // 기타 텍스트 입력 시 초기화
    }
    return botResponse;
  };

  // 사용자 메시지를 받아 처리하는 액션
  async function sendMessage(text) {
    addMessage({ author: 'user', type: 'text', content: { text } });
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      addMessage(botResponse);
    }, 1000);
  }

  // 버튼 클릭 처리 액션
  async function handleOptionClick(optionText) {
    addMessage({ author: 'user', type: 'text', content: { text: optionText } });
    setTimeout(() => {
      const botResponse = generateBotResponse(optionText);
      addMessage(botResponse);
    }, 1000);
  }

  return { messages, sendMessage, handleOptionClick };
});