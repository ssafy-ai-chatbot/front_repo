<script setup>
import { ref } from 'vue';
import { useChatStore } from '../stores/chat';

const chatStore = useChatStore();
const inputText = ref('');

function handleSubmit() {
  if (inputText.value.trim() === '') return;
  chatStore.sendMessage(inputText.value);
  inputText.value = '';
}
</script>

<template>
  <footer class="message-input-wrapper">
    <form @submit.prevent="handleSubmit" class="input-container">
      <input 
        v-model="inputText"
        type="text" 
        placeholder="Aa" 
        class="text-input"
      />
      <button type="submit" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
      </button>
      <!-- <button type="submit" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button> -->
    </form>
  </footer>
</template>

<style scoped>
.message-input-wrapper {
  padding: 20px 15px 40px;
  background: white;
  border-top: 1px solid #E0E0E0;
}
.input-container {
  display: flex;
  align-items: center;
  /* background: #F0F0F0; */
  /* border-radius: 18px; */
  /* padding: 5px; */
  gap: 10px; /* 입력란과 버튼 사이 간격 */
}
.text-input { /* input 스타일 */
  flex-grow: 1;
  border: none;
  background: #F0F0F0; /* 배경색 유지 */
  border-radius: 18px; /* 둥근 모서리 유지 */
  outline: none;
  padding: 12px 15px;

  font-size: 15px; 
  font-family: 'SF Pro Text', 'Nunito', sans-serif; /* 앱 전체 폰트와 일관성 유지 */
  font-weight: 500; /* 조금 더 부드러운 굵기 (기존 600보다 연하게) */
  color: #333; /* 폰트 색상을 좀 더 진하게 하여 가독성 높임 */
  line-height: 1.4; /* 줄 간격 조절 */
}
/* input {
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 8px 15px;
  font-size: 17px;
} */
.send-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #4ED7F1;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
}
</style>