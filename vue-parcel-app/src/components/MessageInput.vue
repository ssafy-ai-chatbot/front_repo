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
      />
      <button type="submit" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </form>
  </footer>
</template>

<style scoped>
.message-input-wrapper {
  padding: 10px 20px;
  background: white;
  border-top: 1px solid #E0E0E0;
}
.input-container {
  display: flex;
  align-items: center;
  background: #F0F0F0;
  border-radius: 18px;
  padding: 5px;
}
input {
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 8px 15px;
  font-size: 17px;
}
.send-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #4ED7F1;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
}
</style>