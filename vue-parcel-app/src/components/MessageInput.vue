<script setup>
import { ref } from 'vue';
import { useChatStore } from '../stores/chat';

const chatStore = useChatStore();
const inputText = ref('');
const recognizing = ref(false);
let recognition = null;

function handleSubmit() {
  if (!inputText.value.trim()) return;
  chatStore.sendMessage(inputText.value);
  inputText.value = '';
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    return;
  }

  if (recognizing.value && recognition) {
    // 녹음 중이면 중단
    recognition.stop();
    recognizing.value = false;
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;

  recognizing.value = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    handleSubmit();
    recognizing.value = false;
  };

  recognition.onerror = (event) => {
    console.error('음성인식 오류:', event.error);
    recognizing.value = false;
  };

  recognition.onend = () => {
    recognizing.value = false;
  };

  recognition.start();
}
</script>

<template>
  <footer class="message-input-wrapper">
    <form @submit.prevent="handleSubmit" class="input-container">
      
      <button 
        type="button" 
        class="voice-button" 
        @click="startVoiceRecognition"
        :title="recognizing ? '녹음 중지' : '음성 입력'"
      >
        <svg v-if="!recognizing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ED7F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" />
          <path d="M19 10V12C19 15.31 16.31 18 13 18H11C7.69 18 5 15.31 5 12V10" />
          <line x1="12" y1="23" x2="12" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ED7F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <input 
        v-model="inputText"
        :placeholder="recognizing ? '🎙️ 지금 말씀하시면 입력됩니다...' : 'Aa'" 
        class="text-input"
        type="text"
      />

      <button type="submit" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
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
  gap: 10px;
}

.text-input {
  flex-grow: 1;
  border: none;
  background: #F0F0F0;
  border-radius: 18px;
  outline: none;
  padding: 12px 15px;
  font-size: 15px;
  font-family: 'SF Pro Text', 'Nunito', sans-serif;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

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
  transition: background 0.2s;
}

.voice-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.voice-button:disabled {
  background: #ddd;
  cursor: not-allowed;
}
</style>