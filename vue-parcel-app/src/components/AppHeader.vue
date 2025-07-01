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
  background: #F5F5F5;
  /* background: white; */
  /* background: #1BC0DF; */
  /* border-bottom: 1px solid #E0E0E0; */
}
.status-bar-div {
  width: 100%;
  height: 55px;
  background-image: url('../assets/smartphone_top_bar.png'); /* CSS로 이미지 로딩 */
  background-size: 100% 100%; 
  background-repeat: no-repeat;
  background-position: center; 
  background-color: white; 
  /* padding-top: 5px; /* 필요시 상단 여백 추가 */
  /* padding-bottom: 5px; /* 필요시 하단 여백 추가 */
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
  color: #1BC0DF;
  /* color: #5AB9D1; */
  /* color: #555555; */
  /* color: #333333; */
  font-size: 16px;
  font-family: 'Nunito', sans-serif;
  font-weight: 750;
  /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); */
}
</style>