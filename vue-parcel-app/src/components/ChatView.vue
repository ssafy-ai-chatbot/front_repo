<script setup>
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '../stores/chat';
import MessageBubble from './MessageBubble.vue';

const chatStore = useChatStore();
const messages = chatStore.messages;

const chatViewRef = ref(null);

// 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
watch(messages, () => {
  nextTick(() => {
    const chatView = chatViewRef.value;
    if (chatView) {
      chatView.scrollTop = chatView.scrollHeight;
    }
  });
}, { deep: true });
</script>

<template>
  <main class="chat-view" ref="chatViewRef">
    <MessageBubble
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
  </main>
</template>

<style scoped>
.chat-view {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--chat-view-bg); 
  transition: background-color 0.3s ease;

  /* 스크롤바 디자인 */
  &::-webkit-scrollbar {
    width: 10px; /* 스크롤바의 너비 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* 스크롤바 트랙의 배경 (투명하게) */
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-color); /* 변수 사용 */
    border-radius: 10px; 
    border: 2px solid transparent; /* 스크롤바 썸 주위에 투명한 테두리 추가 (크기 유지) */
    background-clip: padding-box; /* border-box 모델에서 padding-box 기준으로 배경을 그림 */
  }

  /* 스크롤바 호버 시 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-hover-color);
  }
}

</style>