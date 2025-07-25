<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ChatView from './components/ChatView.vue';
import MessageInput from './components/MessageInput.vue';

const isDarkMode = ref(false);

// 다크 모드 상태를 토글하는 함수
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// 앱의 실제 높이를 설정하는 함수
const setAppHeight = () => {
  // CSS 변수에 실제 뷰포트 높이 저장
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

onMounted(() => {
  // 사용자의 시스템이 다크 모드인지 확인
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  isDarkMode.value = mediaQuery.matches;

  // 컴포넌트가 마운트될 때와 화면 크기가 변경될 때 높이를 다시 계산
  window.addEventListener('resize', setAppHeight);
  setAppHeight(); 
});

onUnmounted(() => {
  // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
  window.removeEventListener('resize', setAppHeight);
});
</script>

<template>
  <div id="app-container" :class="{ 'dark-mode': isDarkMode }">
    <AppHeader :is-dark-mode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
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

  /* 토글 버튼 */
  --toggle-bg-off: #E0E0E0;
  --toggle-bg-on: #4ED7F1;
  --toggle-thumb-color: white;
  --toggle-track-bg: #E0E0E0;     
  --toggle-handle-bg: #4ED7F1;    
  --toggle-icon-url: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3ccircle cx='12' cy='12' r='5'%3e%3c/circle%3e%3cline x1='12' y1='1' x2='12' y2='3'%3e%3c/line%3e%3cline x1='12' y1='21' x2='12' y2='23'%3e%3c/line%3e%3cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'%3e%3c/line%3e%3cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'%3e%3c/line%3e%3cline x1='1' y1='12' x2='3' y2='12'%3e%3c/line%3e%3cline x1='21' y1='12' x2='23' y2='12'%3e%3c/line%3e%3cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'%3e%3c/line%3e%3cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'%3e%3c/line%3e%3c/svg%3e");
  --toggle-bg-off-with-opacity: rgba(224, 224, 224, 0.5); 
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

  /* 토글 버튼 */
  --toggle-bg-off: #424242;
  --toggle-bg-on: #007A8D;
  --toggle-thumb-color: #EAEAEA;
  --toggle-track-bg: #2C2C2C;      
  --toggle-handle-bg: #007A8D;    
  --toggle-icon-url: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='white' stroke='white' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'%3e%3c/path%3e%3c/svg%3e");
}

/* 전역 스타일 */
body {
  margin: 0;
  font-family: 'Nunito', 'SF Pro Text', sans-serif;
  background-color: var(--app-bg);
  transition: background-color 0.3s ease;
}

#app {
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
#app-container {
  width: 393px;
  height: var(--app-height); /* JS에서 계산된 동적 높이 사용 */
  position: relative;
  background-color: var(--app-bg);
  transition: background-color 0.3s ease, height 0.1s ease; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>