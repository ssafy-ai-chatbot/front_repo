<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ChatView from './components/ChatView.vue';
import MessageInput from './components/MessageInput.vue';

const isDarkMode = ref(false);

// updateTheme 함수는 다크 모드 상태가 변경될 때마다 실행됨.
const updateTheme = (event) => {
  isDarkMode.value = event.matches;
};

onMounted(() => {
  // 사용자의 시스템이 다크 모드인지 확인
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  isDarkMode.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', updateTheme);

  onUnmounted(() => {
    // 컴포넌트가 사라질 때 불필요한 메모리 사용을 막기 위해 추가했던 이벤트 리스너 제거
    mediaQuery.removeEventListener('change', updateTheme);
  });
});
</script>

<template>
  <div id="app-container" :class="{ 'dark-mode': isDarkMode }">
    <AppHeader />
    <ChatView />
    <MessageInput />
  </div>
</template>

<style>
/* 기본값: 라이트 모드 */
:root {
  --app-bg: #FFFFFF;
  --app-header-bg: #F5F5F5;
  --app-header-text: #1BC0DF;
  
  --chat-view-bg: #FFFFFF;
  --scrollbar-thumb-color: #E0E0E0;
  --scrollbar-thumb-hover-color: #CCCCCC;

  --bot-bubble-bg: #F0F0F0;
  --bot-bubble-text: #767676;
  --user-bubble-bg: #4ED7F1;
  --user-bubble-text: white;
  
  --card-divider-color: #E0E0E0;
  --card-text-color: #555;

  --option-button-bg: white;
  --option-button-text: #767676;
  --option-button-border: #E0E0E0;
  --option-button-hover-bg: #4ED7F1;
  --option-button-hover-text: white;

  --input-wrapper-bg: white;
  --input-wrapper-border: #E0E0E0;
  --text-input-bg: #F0F0F0;
  --text-input-color: #333;
  --voice-button-bg: #f5f5f5;
  --voice-button-stroke: #4ED7F1;
  --send-button-bg: #4ED7F1;
  --send-button-icon-color: white;
}

/* 다크 모드일 때 적용될 변수 값 */
.dark-mode {
  --app-bg: #121212;
  --app-header-bg: #1E1E1E;
  --app-header-text: #4ED7F1;

  --chat-view-bg: #121212;
  --scrollbar-thumb-color: #424242;
  --scrollbar-thumb-hover-color: #555555;
  
  --bot-bubble-bg: #2C2C2C;
  --bot-bubble-text: #E0E0E0;
  --user-bubble-bg: #007A8D;
  --user-bubble-text: #EAEAEA;

  --card-divider-color: #424242;
  --card-text-color: #E0E0E0;
  
  --option-button-bg: #333333;
  --option-button-text: #E0E0E0;
  --option-button-border: #424242;
  --option-button-hover-bg: #007A8D;
  --option-button-hover-text: #EAEAEA;

  --input-wrapper-bg: #1E1E1E;
  --input-wrapper-border: #424242;
  --text-input-bg: #333333;
  --text-input-color: #E0E0E0;
  --voice-button-bg: #333333;
  --voice-button-stroke: #4ED7F1;
  --send-button-bg: #007A8D;
  --send-button-icon-color: #EAEAEA;
}

/* 전역 스타일 */
body {
  margin: 0;
  font-family: 'Nunito', 'SF Pro Text', sans-serif;
  background-color: var(--app-bg);
  /* background-color: black; */
  transition: background-color 0.3s ease;
}
/*#F5F5F5*/

#app {
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
#app-container {
  width: 393px;
  height: 100vh; /* 화면 높이에 맞춤 */
  position: relative;
  background-color: var(--app-bg);
  /* background-color 속성이 변경될 때 전환 효과 */
  transition: background-color 0.3s ease; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>