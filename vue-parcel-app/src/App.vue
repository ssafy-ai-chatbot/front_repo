<script setup>
import AppHeader from './components/AppHeader.vue';
import ChatView from './components/ChatView.vue';
import MessageInput from './components/MessageInput.vue';
</script>

<template>
  <div id="app-container">
    <AppHeader />
    <ChatView />
    <MessageInput />
  </div>
</template>

<style>
/* 전역 스타일 */
body {
  margin: 0;
  font-family: 'Nunito', 'SF Pro Text', sans-serif;
  background-color: white;
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
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>