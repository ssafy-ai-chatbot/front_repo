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
}
</style>