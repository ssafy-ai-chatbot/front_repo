<script setup>
import { useChatStore } from '../stores/chat';
defineProps({
  message: {
    type: Object,
    required: true
  }
});

const chatStore = useChatStore();

// 버튼 클릭 시 Pinia 스토어의 액션을 호출
function handleButtonClick(optionText) {
  chatStore.handleOptionClick(optionText);
}
</script>

<template>
  <div v-if="message.author === 'bot'" class="message-wrapper bot-message">
    <div v-if="message.author === 'bot'" class="avatar bot-avatar bot-avatar-image"></div>
    <div class="bubble">
      <div v-if="message.type === 'text'" v-html="message.content.text"></div>

      <div v-if="message.type === 'initial_options'" class="message-content">
        <div v-html="message.content.text"></div>
        <button 
          v-for="option in message.content.options" 
          :key="option" 
          class="option-button"
          @click="handleButtonClick(option)"
        >
          {{ option }}
        </button>
      </div>
      
      <div v-if="message.type === 'recipe_response'" class="recipe-card">
        <h3>🥄 {{ message.content.title }}</h3>
        <div class="divider"></div>
        <h4>🛒 준비물</h4>
        <p class="ingredients" v-html="message.content.ingredients"></p>
        <div class="divider"></div>
        <h4>👨‍🍳 조리과정</h4>
        <div v-for="(step, i) in message.content.steps" :key="i" class="recipe-step">
          <p v-html="step.text"></p>
          <img v-if="step.image" :src="step.image" :alt="'step ' + (i+1)">
        </div>
        <div class="card-actions">
           <button 
             v-for="action in message.content.actions" :key="action"
             class="option-button" 
             @click="handleButtonClick(action)">
             {{ action }}
           </button>
        </div>
      </div>

      <div v-if="message.type === 'ingredients_guide'" v-html="message.content.text"></div>

      <div v-if="message.type === 'ingredients_response'" class="recipe-card">
        <h4>📋 {{ message.content.title }}</h4>
        <div class="divider"></div>
        <div v-for="(menu, i) in message.content.recommendation" :key="i" class="recipe-step">
          <p v-html="menu.menu"></p>
          <p>준비물 : <span v-html="menu.ingredients"></span></p>
        </div>
        <div class="divider"></div>
        <p v-html="message.content.text1" class="no-margin-text"></p>
        <div class="divider"></div>
        <p v-html="message.content.text2" class="no-margin-text"></p>
        <div class="card-actions">
           <button 
             v-for="action in message.content.actions" :key="action"
             class="option-button" 
             @click="handleButtonClick(action)">
             {{ action }}
           </button>
        </div>
      </div>

      <div v-if="message.type === 'nutrition_guide'" v-html="message.content.text"></div>

      <div v-if="message.type === 'nutrition_response'" class="nutrition-card">
        <h3>📊 {{ message.content.title }} 영양 정보</h3>
        <div class="divider"></div>
        <p v-if="message.content.text" class="no-margin-text">{{ message.content.text }}</p>
        <div v-if="message.content.text" class="divider"></div>
        <ul>
          <li v-for="item in message.content.info" :key="item.name">
            <strong>{{ item.name }}</strong> : {{ item.value }}
          </li>
        </ul>
        <div class="card-actions">
          <button 
            v-for="action in message.content.actions" :key="action"
            class="option-button" 
            @click="handleButtonClick(action)">
            {{ action }}
          </button>
        </div>
      </div>

      <div v-if="message.type === 'recipe_can_not_find'" class="nutrition-card">
        <div v-html="message.content.text"></div> 
        <template v-if="message.content.alternatives && message.content.alternatives.length > 0">
          <div class="divider"></div>
          <ul>
              <li>🍽️ 비슷한 레시피 추천</li>
              <li v-for="menu in message.content.alternatives" :key="menu.name">
                {{ menu.name }}
              </li>
            </ul>
          <!-- <div class="divider"></div> -->
        </template>
        <div class="card-actions">
           <button 
             v-for="action in message.content.actions" :key="action"
             class="option-button" 
             @click="handleButtonClick(action)">
             {{ action }}
           </button>
        </div>
      </div>

      <div v-if="message.type === 'can_not_find'" class="nutrition-card">
        <div v-html="message.content.text"></div> 
        <div class="divider"></div>
        <div class="card-actions">
           <button 
             v-for="action in message.content.actions" :key="action"
             class="option-button" 
             @click="handleButtonClick(action)">
             {{ action }}
           </button>
        </div>
      </div>
    </div>
    <div v-if="message.author === 'user'" class="avatar user-avatar user-avatar-image"></div>
  </div>
  

  <div v-if="message.author === 'user'" class="message-wrapper user-message">
    <div class="bubble">
      <div v-if="message.type === 'text'" v-html="message.content.text"></div>
    </div>
    <div v-if="message.author === 'user'" class="avatar user-avatar user-avatar-image"></div>
  </div>
</template>

<style scoped>
.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 90%;
}
.avatar {
  flex-shrink: 0;
}
.bot-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  /* margin-top: 4px; /* 위치 미세조정  */
.bubble {
  padding: 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  word-wrap: break-word;
  line-height: 1.5;

  box-sizing: border-box; /* padding도 포함 */
}

/* Bot-specific styles */
.bot-message {
  align-self: flex-start;
}
.bot-message .bubble {
  background: #F0F0F0;
  color: #767676;
  border-top-left-radius: 0;
  width: 220px;
}

/* User-specific styles */
.user-message {
  align-self: flex-end;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  max-width: 90%;
}
.user-message .bubble {
  background: #4ED7F1;
  color: white;
  border-top-right-radius: 0;
  max-width: 220px;
}

/* Content-specific styles */
.message-content, .recipe-card, .nutrition-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.divider {
  border-top: 1px solid #E0E0E0;
  margin: 0px 0;
}
h3, h4 { margin: 0; color: #555; }
h3 { font-size: 15px; }
h4 { font-size: 14px; }

.option-button {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  background: white; /* 기본 배경색은 흰색 */
  color: #767676;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; /* 호버 시 부드러운 전환 효과 */
}
.option-button:hover {
  background: #4ED7F1; /* 호버 시 연한 하늘색 (원하는 하늘색으로 변경 가능) */
  color: white; /* 호버 시 글자색은 흰색으로 변경 (대비율을 높이기 위함) */
  border-color: #4ED7F1; /* 호버 시 테두리 색상도 하늘색으로 변경 */
}
.option-button.primary {
  background: #4ED7F1;
  color: white;
  border: none;
}
.recipe-card .ingredients { 
  white-space: pre-line; 
  margin: 0;
}
.recipe-step p { /* recipe-step 클래스 내부의 p 태그에 적용 */
  margin: 5; /* 위/아래 마진을 0으로 설정 */
  /* 필요에 따라 line-height를 조절하여 줄 간격 조절. */
  /* line-height: 1.4; */
}
.recipe-step img { width: 100%; height: auto; border-radius: 10px; margin-top: 5px; }
.nutrition-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.card-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }


/* 새로 추가된 CSS 이미지 로딩 규칙 */
.bot-avatar-image {
  background-image: url('../assets/chatbot.png'); /* src/components에서 src/img로 상대 경로 */
  background-size: cover; /* 이미지가 div에 꽉 차도록 */
  background-position: center; /* 이미지를 중앙에 배치 */
}
.user-avatar-image {
  background-image: url('../assets/user.png'); /* src/components에서 src/img로 상대 경로 */
  background-size: cover;
  background-position: center;
}
.no-margin-text {
  margin: 0
}
</style>