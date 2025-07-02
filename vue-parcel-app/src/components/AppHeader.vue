<script setup>
  defineProps({
    isDarkMode: Boolean
  });
  const emit = defineEmits(['toggle-dark-mode']);
</script>

<template>
  <header class="app-header">
    <div class="title-bar">
      <h1>나만의 AI 요리 비서</h1>
    </div>
    <!-- 다크모드 토글 버튼 -->
    <div class="toggle-container">
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          :checked="isDarkMode"
          @change="emit('toggle-dark-mode')"
        >
        <span class="slider"></span>
      </label>
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
  /* background: white; */
  /* background: #1BC0DF; */
  transition: background-color 0.3s ease;
  /* border-bottom: 1px solid #E0E0E0; */
  display: flex;
  justify-content: center; /* 자식 요소를 중앙 정렬 */
  align-items: center;
  height: 56px;
  padding: 0 15px; /* 좌우 패딩 추가 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
}
.title-bar {
  flex-grow: 1; /* 남은 공간 모두 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  /* 토글 버튼 너비만큼 왼쪽으로 마진을 줘서 제목이 완벽한 중앙에 오도록 함 */
  /* margin-left: 44px;  */
  margin-left: 50px; 
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
}

/* 토글 컨테이너 */
.toggle-container {
  /* width: 44px; 토글 스위치 너비와 동일하게 설정 */
  width: 50px; /* 토글 스위치 너비와 동일하게 설정 */
  flex-shrink: 0; /* 컨테이너 크기가 줄어들지 않도록 */
}

/* 토글 스위치 스타일 */
.toggle-switch {
  position: relative;
  display: inline-block;
  /* width: 44px; */
  /* height: 24px; */
  width: 50px;
  height: 28px;
}
/* 실제 체크박스는 숨김 */
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
/* 스위치 배경(슬라이더) */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--toggle-bg-off-with-opacity); 
  /* background-color: var(--toggle-bg-off);  */
  
  transition: background-color 0.3s ease;
  /* border-radius: 24px; */
  border-radius: 28px;
}
/* 스위치 핸들(동그라미) */
.slider:before {
  position: absolute;
  content: "";
  /* height: 20px; */
  height: 22px;
  /* width: 20px; */
  width: 22px;
  /* left: 2px; */
  left: 3px;
  /* bottom: 2px; */
  bottom: 3px;
  background-color: var(--toggle-handle-bg);
  background-image: var(--toggle-icon-url);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 14px;
  transition: transform 0.3s ease, background-color 0.3s ease, background-image 0.3s ease;
  border-radius: 50%;
}
/* 체크됐을 때(다크 모드일 때) 스타일 */
input:checked + .slider {
  background-color: var(--toggle-bg-on);
}
input:checked + .slider:before {
  /* transform: translateX(20px); */
  transform: translateX(22px);
}
</style>