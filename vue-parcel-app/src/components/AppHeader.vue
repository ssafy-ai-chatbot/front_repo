<script setup>
// 이 컴포넌트는 현재 로직이 필요 없습니다.
</script>

<template>
  <header class="app-header">
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
  background: #F5F5F5;
  border-bottom: 1px solid #E0E0E0;
}
.title-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
}
h1 {
  margin: 0;
  color: #1BC0DF;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
}
</style>