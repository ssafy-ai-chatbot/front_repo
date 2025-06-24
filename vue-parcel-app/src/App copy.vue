<!--
<template>
  <div id="chatbot-wrapper">
    <header>
      <h1>나만의 AI 요리 비서</h1>
    </header>
    <main class="chat-display">
      <div v-for="(msg, index) in chatStore.messages" :key="index" :class="['chat-message', msg.sender]">
        {{ msg.text }}
      </div>
    </main>
    <footer class="chat-input-area">
      <input
        v-model="currentInput"
        @keyup.enter="sendMessage"
        placeholder="레시피 또는 식재료를 입력하세요..."
      />
      <button @click="sendMessage">전송</button>
    </footer>
  </div>
</template>
-->

<template>
  <div id="app-container">
    <AppHeader />
    <ChatView />
    <MessageInput />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useChatStore } from './stores/chat'; // Pinia 스토어 임포트

const chatStore = useChatStore(); // 스토어 사용

// 'messages' ref는 이제 필요 없습니다. Pinia 스토어에서 관리됩니다.
// const messages = ref([
//   { text: '안녕하세요! 냉장고에 있는 재료나 궁금한 레시피를 알려주세요.', sender: 'bot' }
// ]);

const currentInput = ref(''); // 현재 사용자 입력 값

// 컴포넌트 마운트 시 초기 메시지를 스토어에 추가 (선택 사항)
// 이전에 로컬 messages에 있던 초기 메시지를 Pinia로 옮기려면 이 부분을 사용합니다.
// onMounted(() => {
//   if (chatStore.messages.length === 0) { // 스토어에 메시지가 없으면 초기 메시지 추가
//     chatStore.addMessage({ text: '안녕하세요! 냉장고에 있는 재료나 궁금한 레시피를 알려주세요.', sender: 'bot' });
//   }
// });


// 메시지 전송 함수
function sendMessage() {
  if (currentInput.value.trim()) {
    // 사용자 메시지를 Pinia 스토어의 액션을 통해 대화 목록에 추가
    chatStore.addMessage({ text: currentInput.value, sender: 'user' });
    console.log('사용자 메시지:', currentInput.value);

    // TODO: 여기에 백엔드 API 호출 로직 추가 (A팀과의 협업 필요)
    // axios 등을 사용하여 백엔드(FastAPI)로 사용자 질문을 보내고,
    // 응답을 받으면 chatStore.addMessage({ text: 'AI 답변', sender: 'bot' }); 와 같이 추가합니다.

    currentInput.value = ''; // 입력창 비우기
  }
}
</script>

<style scoped>
/* 기본적인 Chat UI 스타일 (이전과 동일) */
#chatbot-wrapper {
  width: 400px;
  height: 600px;
  margin: 50px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-family: 'Arial', sans-serif;
}

header {
  background-color: #f7f7f7;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
  color: #333;
}

.chat-display {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #e6f7ff; /* 연한 파란색 배경 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-message {
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 75%;
  word-wrap: break-word; /* 긴 텍스트 줄바꿈 */
}

.chat-message.user {
  align-self: flex-end; /* 사용자 메시지는 오른쪽 정렬 */
  background-color: #007bff; /* 파란색 배경 */
  color: white;
}

.chat-message.bot {
  align-self: flex-start; /* 봇 메시지는 왼쪽 정렬 */
  background-color: #ffffff; /* 흰색 배경 */
  border: 1px solid #cceeff; /* 연한 파란색 테두리 */
  color: #333;
}

.chat-input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: #fff;
  gap: 10px;
}

.chat-input-area input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
}

.chat-input-area button {
  padding: 12px 20px;
  background-color: #28a745; /* 녹색 배경 */
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.chat-input-area button:hover {
  background-color: #218838;
}
</style>