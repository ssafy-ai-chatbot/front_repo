import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Mock Data: 실제 백엔드 연동 전 사용할 가짜 데이터 ---

const initialBotMessage = {
  author: 'bot',
  type: 'initial_options',
  content: {
    text: '안녕하세요! <br/>저는 여러분의 요리를 도와드리는 AI 요리 비서입니다.<br/>무엇을 도와드릴까요?',
    options: ['레시피 찾아보기', '냉장고 속 재료 활용하기', '영양성분 찾아보기']
  }
};

const recipeBotMessage = {
    author: 'bot',
    type: 'recipe',
    content: {
        title: '구운가지 닭가슴살 샐러드와 들깨소스 레시피',
        ingredients: `닭가슴살 100g<br/>가지 100g (2/3개)<br/>잎채소 40g<br/>올리브유 30g (2큰술)<br/>플레인요거트 80g (1개)<br/>양파 20g (1/6개)<br/>레몬즙 20g (1⅓큰술)<br/>꿀 30g (2큰술)<br/>들깨가루 10g (2작은술)`,
        steps: [
            { text: '1. 양파는 잘게 다지고 다진 양파, 들깨가루, 플레인요거트, 꿀, 레몬즙을 섞어 들깨 드레싱을 만든다.', image: 'https://placehold.co/176x116' },
            { text: '<br/>2. 가지는 길게 길이를 살려 얇게 저민 후 달궈진 프라이팬에 올리브유를 두르고 센불에서 물기가 생기지 않게 굽는다.', image: 'https://placehold.co/176x117' },
            { text: '<br/>3. 닭가슴살은 가지 길이에 맞춰 썰은 후 달궈진 프라이팬에 올리브유를 두르고 노릇하게 굽는다.', image: 'https://placehold.co/176x117' },
            { text: '<br/>4. 구운 가지위에 가슴살을 올려 풀어지지 않게 돌돌 말아 놓는다.<br/><br/>5. 잎채소는 찬물에 담가두었다가 물기를 제거한다.<br/><br/>6. 접시에 구운 가지와 닭가슴살 말이를 올리고 잎채소와 들깨 드레싱을 곁들인다.' }
        ]
    }
};

const nutritionBotMessage = {
    author: 'bot',
    type: 'nutrition',
    content: {
        title: '구운가지 닭가슴살 샐러드와 들깨소스',
        info: [
            { name: '열량(칼로리)', value: '330 kcal' },
            { name: '탄수화물', value: '20 g' },
            { name: '단백질', value: '22 g' },
            { name: '지방', value: '18 g' },
            { name: '나트륨', value: '69 mg' },
        ]
    }
};


export const useChatStore = defineStore('chat', () => {
  const messages = ref([initialBotMessage, recipeBotMessage, nutritionBotMessage]);

  function addMessage(message) {
    messages.value.push(message);
  }

  // 사용자 메시지를 받아 처리하는 액션
  async function sendMessage(text) {
    // 1. 사용자 메시지를 목록에 추가
    addMessage({ author: 'user', type: 'text', content: { text } });

    // 2. (향후) 백엔드 API에 요청 전송
    // const response = await fetch('/api/chat', { ... });
    // const botResponse = await response.json();

    // 3. (임시) 봇의 응답을 시뮬레이션하여 목록에 추가
    setTimeout(() => {
        const botResponse = {
            author: 'bot',
            type: 'text',
            content: { text: `'${text}'에 대한 답변입니다. (시뮬레이션)` }
        };
        addMessage(botResponse);
    }, 1000);
  }

  return { messages, addMessage, sendMessage };
});