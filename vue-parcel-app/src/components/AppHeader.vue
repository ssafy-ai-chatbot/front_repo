<script setup>
// 이 컴포넌트는 현재 로직이 필요 없습니다.
</script>

<template>
  <header class="app-header">
    <!-- <div class="status-bar-div"></div> -->
    <div class="title-bar">
      <h1>나만의 AI 요리 비서</h1>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  background: var(--app-header-bg);
  transition: background-color 0.3s ease;
  /* background: white; */
  /* background: #1BC0DF; */
  /* border-bottom: 1px solid #E0E0E0; */
}
.title-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
}
h1 {
  margin: 0;
  /* color: #F5F5F5; */
  color: var(--app-header-text);
  /* color: #5AB9D1; */
  /* color: #555555; */
  /* color: #333333; */
  font-size: 16px;
  font-family: 'Nunito', sans-serif;
  font-weight: 750;
  transition: color 0.3s ease;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); */
}
</style>