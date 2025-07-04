// chat.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // 로딩 처리 및 고유 ID 생성을 위해 uuid 임포트

export const useChatStore = defineStore('chat', () => {
  // 메시지 목록 상태. 초기 메시지는 봇의 환영 메시지와 옵션입니다.
  const messages = ref([
    {
      author: 'bot',
      type: 'initial_options',
      content: {
        text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
        options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
      }
    },
  ]);
  // 마지막으로 사용자에게 제공된 레시피/음식의 제목을 저장 (예: "김치찌개")
  const lastRecipeTitle = ref(null);

  // 추천 요리 관련 상태 (예: '냉장고 속 재료 활용하기' 시 제공되는 추천 목록)
  const allRecommendations = ref([]); // 백엔드에서 받은 모든 추천 목록
  const currentRecommendationIndex = ref(0); // 현재 보여주는 추천 목록의 시작 인덱스
  const recommendationsPerPage = 5; // 한 번에 보여줄 추천 요리 개수

  // 로딩 상태 (UI에서 활용할 수 있도록 추가)
  const isLoading = ref(false); 

  // 메시지를 메시지 목록에 추가하는 함수
  function addMessage(message) {
    messages.value.push(message);
  }

  // 페이지네이션된 추천 요리 목록을 가져오는 헬퍼 함수
  const getPaginatedRecommendations = () => {
    const startIndex = currentRecommendationIndex.value;
    const endIndex = Math.min(startIndex + recommendationsPerPage, allRecommendations.value.length);
    return allRecommendations.value.slice(startIndex, endIndex);
  };

  // 추천 요리에 대한 액션 버튼 (예: '추천 요리 더보기', '처음으로')을 결정하는 헬퍼 함수
  const getRecommendationActions = () => {
    const actions = [];
    if (currentRecommendationIndex.value < allRecommendations.value.length) {
      actions.push('추천 요리 더보기');
    }
    actions.push('처음으로');
    return actions;
  };

  // 백엔드로 메시지를 보내는 비동기 함수
  async function sendMessageToBackend(text) {
    try {
      // FastAPI 백엔드의 /ask 엔드포인트로 POST 요청 전송
      const baseUrl = process.env.VUE_APP_API_URL || 'http://127.0.0.1:8000';
      const apiUrl = `${baseUrl.replace(/\/$/, '')}/ask`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 데이터 전송을 알림
        },
        body: JSON.stringify({ question: text }), // 사용자의 질문을 JSON 본문에 담아 전송
      });

      // HTTP 응답이 성공적이지 않을 경우 (예: 4xx, 5xx 에러)
      if (!response.ok) {
        const errorData = await response.json(); // 에러 응답 본문 파싱
        throw new Error(errorData.detail || '백엔드로부터 응답을 가져오는 데 실패했습니다.');
      }

      // 성공적인 응답의 JSON 본문 파싱
      const data = await response.json();
      console.log(data)
      return data; // 백엔드로부터 받은 응답 데이터 반환
    } catch (error) {
      console.error('백엔드로 메시지 전송 중 오류 발생:', error);
      // 오류 발생 시 sendMessage 또는 handleOptionClick의 catch 블록에서 처리할 수 있도록 다시 throw
      throw error;
    }
  }

  // 봇 응답을 생성하는 비동기 함수 (이제 백엔드 데이터 사용)
  const generateBotResponse = async (inputText) => {
    // 특정 내부 명령어는 백엔드 호출 없이 직접 처리합니다.
    if (inputText === '처음으로') {
      lastRecipeTitle.value = null; // 마지막 레시피 제목 초기화
      allRecommendations.value = []; // 모든 추천 초기화
      currentRecommendationIndex.value = 0; // 추천 인덱스 초기화
      return {
        author: 'bot',
        type: 'initial_options',
        content: {
          text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
          options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
        }
      };
    } else if (inputText === '레시피 찾아보기' || inputText === '다른 요리 레시피 찾아보기') {
      lastRecipeTitle.value = null;
      allRecommendations.value = []; // 추천 관련 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      return {
        author: 'bot',
        type: 'text',
        content: {
          text: `원하는 요리명을 입력해주세요:<br/>📋 입력 예시:<br/>"새우두부계란찜 레시피"<br/>"일본식 계란말이 만드는 법"<br/>"참나물페스토 파스타"<br/>"된장국 레시피 알려줘"<br/>💡 TIP:<br/>간단한 요리명만 입력해도 돼요`
        }
      };
    } else if (inputText === '냉장고 속 재료 활용하기') {
      lastRecipeTitle.value = null;
      allRecommendations.value = []; // 추천 관련 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      return {
        author: 'bot',
        type: 'ingredients_guide',
        content: {
          text: '활용하고 싶은 냉장고 속 재료를 입력해주세요.<br/>📝 입력 예시:<br/>"당근, 양파로 뭘 만들 수 있을까?"</br>"연어, 양파"</br>"감자 3개랑 밀가루가 있어"</br>💡 TIP:</br>재료명만 나열해도 좋고, 자연스럽게 문장으로 물어봐도 돼요',
        }
      };
    } else if (inputText === '영양성분 찾아보기' || inputText === '다른 요리 영양 정보 찾기' || inputText === '다른 음식 영양 정보 찾기') {
      lastRecipeTitle.value = null;
      allRecommendations.value = []; // 추천 관련 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      return {
        author: 'bot',
        type: 'nutrition_guide',
        content: {
          text: '🔍 영양 정보 검색하기</br>영양 정보를 검색하고 싶은 음식명을 입력해주세요:<br/>📝 입력 예시:<br/>"돼지고기 김치찌개 영양 정보"</br>"햄버거스테이크 칼로리 알려줘"</br>"된장국 나트륨"</br>💡 TIP:</br>"음식명 영양정보"만 입력하거나 "칼로리", "단백질" 등 특정 영양소를 함께 물어봐도 돼요',
        }
      };
    } else if (inputText === '선택한 메뉴 영양 정보 보기' || inputText === '선택한 요리 영양 정보 보기') {
      allRecommendations.value = []; // 추천 관련 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      console.log(lastRecipeTitle.value)
      if (lastRecipeTitle.value) {
        // 저장된 레시피 제목이 있을 경우, 해당 제목의 영양 정보를 백엔드에 요청
        return await sendMessageToBackend(`${lastRecipeTitle.value} 영양 정보`);
      } else {
        return {
            author: 'bot',
            type: 'can_not_find',
            content: {
              title: '선택한 메뉴 영양 정보 보기',
              text: '죄송합니다!<br/>요청하신 정보를 찾을 수 없어요.',
              actions: ['다른 음식 영양 정보 찾기', '처음으로']
            }
          };
      }
    } else if (inputText === '해당 요리 레시피 보기') { // `&& lastRecipeTitle.value` 조건은 내부에서 처리
      allRecommendations.value = []; // 추천 관련 상태 초기화
      currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      console.log(lastRecipeTitle.value)
      if (lastRecipeTitle.value) { // 명시적으로 한 번 더 체크
          // 저장된 레시피 제목이 있을 경우, 해당 제목의 레시피를 백엔드에 요청
          return await sendMessageToBackend(`${lastRecipeTitle.value} 레시피 알려줘`);
      } else {
          return {
              author: 'bot',
              type: 'can_not_find',
              content: {
                  title: '해당 요리 레시피 보기',
                  text: '죄송합니다!<br/>요청하신 정보를 찾을 수 없어요.',
                  actions: ['레시피 찾아보기', '처음으로']
              }
          };
      }
    } else if (inputText === '추천 요리 더보기' && allRecommendations.value.length > 0) {
      // '추천 요리 더보기'를 클릭하고 추천 목록이 남아있을 경우
      const displayedRecommendations = getPaginatedRecommendations(); // 현재 페이지의 추천 목록 가져오기
      currentRecommendationIndex.value += displayedRecommendations.length; // 인덱스 업데이트

      if (displayedRecommendations.length > 0) {
        return {
          author: 'bot',
          type: 'ingredients_response',
          content: {
            title: '추천 요리 목록',
            recommendation: displayedRecommendations, // 현재 페이지의 추천 목록
            text1: '🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요</br>📝 입력 예시:</br>"맑은 닭국 레시피 알려줘"</br>"닭가슴살 오야코동 만드는 법"</br>"맑은 닭국"</br></br>📊 궁금한 메뉴의 영양 정보를 살펴보세요</br>📝 입력 예시:</br>"맑은 닭국의 칼로리를 알려줘"</br>"닭가슴살 카레 영양 정보를 알려줘"',
            text2: '💭 마음에 드는 메뉴가 없으신가요?',
            actions: getRecommendationActions() // '추천 요리 더보기' 또는 '처음으로' 액션
          }
        };
      } else {
        // 더 이상 추천할 요리가 없을 경우
        allRecommendations.value = []; // 모든 추천 초기화
        currentRecommendationIndex.value = 0; // 인덱스 초기화
        return {
          author: 'bot',
          type: 'can_not_find',
          content: {
            title: '추천 요리 더보기',
            text: '죄송합니다!<br/>더 이상 추천할 요리가 없어요.',
            actions: ['냉장고 속 재료 활용하기', '처음으로']
          }
        };
      }
    } else {
      // 위의 모든 조건에 해당하지 않는 경우 (대부분의 사용자 입력)
      // 백엔드로 메시지를 보내고 응답을 기다립니다.
      const botResponse = await sendMessageToBackend(inputText); // <-- sendMessageToBackend 호출

      // 백엔드 응답이 레시피 또는 영양 정보인 경우 lastRecipeTitle 업데이트
      if (botResponse.type === 'recipe_response' || botResponse.type === 'nutrition_response') {
        lastRecipeTitle.value = botResponse.content.title;
        allRecommendations.value = []; // 추천 관련 상태 초기화
        currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      } else if (botResponse.type === 'ingredients_response' && botResponse.content.recommendation) {
        // 백엔드에서 받은 전체 추천 목록을 저장
        allRecommendations.value = botResponse.content.recommendation;
        currentRecommendationIndex.value = 0; // 첫 페이지를 보여주기 위해 인덱스를 0으로 초기화

        // 현재 보여줄 페이지만 추출하여 응답에 반영
        const displayedRecommendations = getPaginatedRecommendations();
        botResponse.content.recommendation = displayedRecommendations;

        // 다음 페이지를 위해 인덱스 업데이트
        currentRecommendationIndex.value += displayedRecommendations.length;

        botResponse.content.actions = getRecommendationActions(); // 올바른 액션 버튼 설정
      } else {
        lastRecipeTitle.value = null; // 레시피/영양 응답이 아니면 lastRecipeTitle 초기화
        allRecommendations.value = []; // 추천 관련 상태 초기화
        currentRecommendationIndex.value = 0; // 추천 관련 상태 초기화
      }

      return botResponse; // 최종 봇 응답 반환
    }
  };

  // 사용자 메시지를 전송하고 봇 응답을 받는 비동기 함수
  async function sendMessage(text) {
    addMessage({ author: 'user', type: 'text', content: { text } }); // 사용자 메시지 추가

    // 로딩 메시지 추가
    isLoading.value = true; 
    const loadingMessageId = uuidv4(); // 고유 ID 생성
    addMessage({
      id: loadingMessageId, // 메시지에 ID 부여
      author: 'bot',
      type: 'loading', // 새로운 타입: 로딩 메시지
      content: { text: '답변을 생성 중입니다...' }
    });

    try {
      const botResponse = await generateBotResponse(text); // 봇 응답 생성 (백엔드 호출 포함)
      // 로딩 메시지를 실제 응답으로 교체
      const index = messages.value.findIndex(msg => msg.id === loadingMessageId);
      if (index !== -1) {
        messages.value[index] = { ...botResponse, id: loadingMessageId }; // 기존 ID를 유지하며 업데이트
      } else {
        addMessage(botResponse); // 만약 로딩 메시지를 찾지 못하면 그냥 추가
      }
    } catch (error) {
      // sendMessageToBackend에서 throw된 오류 처리 (네트워크 오류 등)
      console.error('메시지 전송 및 응답 처리 중 오류 발생:', error);
      const errorBotResponse = {
        author: 'bot',
        type: 'can_not_find',
        content: {
          title: '오류 발생',
          text: `죄송합니다!<br/>서버 통신 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
          actions: ['처음으로']
        }
      };
      // 로딩 메시지를 오류 메시지로 교체
      const index = messages.value.findIndex(msg => msg.id === loadingMessageId);
      if (index !== -1) {
        messages.value[index] = { ...errorBotResponse, id: loadingMessageId };
      } else {
        addMessage(errorBotResponse);
      }
    } finally {
      isLoading.value = false; // 로딩 완료 (성공/실패 무관)
    }
  }

  // 옵션 버튼 클릭을 처리하는 비동기 함수
  async function handleOptionClick(optionText) {
    addMessage({ author: 'user', type: 'text', content: { text: optionText } }); // 클릭된 옵션을 사용자 메시지로 추가

    // 로딩 메시지 추가
    isLoading.value = true; // 로딩 시작
    const loadingMessageId = uuidv4(); // 고유 ID 생성
    addMessage({
      id: loadingMessageId, // 메시지에 ID 부여
      author: 'bot',
      type: 'loading', // 새로운 타입: 로딩 메시지
      content: { text: '답변을 생성 중입니다...' }
    });

    try {
      const botResponse = await generateBotResponse(optionText); // 봇 응답 생성
      // 로딩 메시지를 실제 응답으로 교체
      const index = messages.value.findIndex(msg => msg.id === loadingMessageId);
      if (index !== -1) {
        messages.value[index] = { ...botResponse, id: loadingMessageId };
      } else {
        addMessage(botResponse);
      }
    } catch (error) {
      // sendMessageToBackend에서 throw된 오류 처리
      console.error('옵션 클릭 및 응답 처리 중 오류 발생:', error);
      const errorBotResponse = {
        author: 'bot',
        type: 'can_not_find',
        content: {
          title: '오류 발생',
          text: `죄송합니다!<br/>서버 통신 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
          actions: ['처음으로']
        }
      };
      // 로딩 메시지를 오류 메시지로 교체
      const index = messages.value.findIndex(msg => msg.id === loadingMessageId);
      if (index !== -1) {
        messages.value[index] = { ...errorBotResponse, id: loadingMessageId };
      } else {
        addMessage(errorBotResponse);
      }
    } finally {
      isLoading.value = false; // 로딩 완료 (성공/실패 무관)
    }
  }

  // Pinia 스토어의 상태와 액션을 반환 (isLoading 포함)
  return { messages, sendMessage, handleOptionClick, isLoading }; // <-- isLoading 상태도 반환
});