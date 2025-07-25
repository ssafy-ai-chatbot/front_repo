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

      <div v-if="message.type === 'loading'" class="message-content loading-message">
        <div v-html="message.content.text"></div>
        <span class="loading-spinner"></span>
      </div>

      <div v-if="message.type === 'recipe_response'" class="recipe-card">
        <h3>🥄 {{ message.content.title }}</h3>
        <img v-if="message.image" :src="message.image" alt="레시피 이미지" class="recipe-main-image">
        <div class="divider"></div>
        <h4>🛒 준비물</h4>
        <p class="ingredients" v-html="message.content.ingredients"></p>
        <div class="divider"></div>
        <h4>👨‍🍳 조리과정</h4>
        <div v-for="(step, i) in message.content.steps" :key="i" class="recipe-step">
          <p>{{ i + 1 }}. {{ step.text }}</p>
          <img v-if="step.image" :src="step.image" :alt="'step ' + (i+1)">
        </div>
        <div class="card-actions">
          <button 
          class="option-button" 
          @click="handleButtonClick('선택한 메뉴 영양 정보 보기')">
          선택한 메뉴 영양 정보 보기
          </button>
          <button 
          class="option-button" 
          @click="handleButtonClick('처음으로')">
          처음으로
          </button>
        </div>
      </div>

      <div v-if="message.type === 'ingredients_guide'" v-html="message.content.text"></div>

      <div v-if="message.type === 'ingredients_response'" class="recipe-card">
        <h4>📋 {{ message.content.title }}</h4>
        <div class="divider"></div>
        <div v-for="(menu, i) in message.content.recommendation" :key="i" class="recipe-step">
          <p>{{ i + 1 }}. {{ menu.menu }}</p>
          <p>준비물 : <span v-html="menu.ingredients"></span></p>
        </div>
        <div class="divider"></div>
          <template v-if="message.content.recommendation.length > 0">
            🍽️ 마음에 드는 메뉴의 레시피를 찾아보세요<br/>
            📝 입력 예시:<br/>

            <template v-for="(exampleType, i) in [
              { section: 'recipe', suffix: ' 레시피 알려줘' },
              { section: 'recipe', suffix: ' 만드는 법' },
              { section: 'recipe', suffix: '' }, 
              { section: 'nutrition', suffix: '의 칼로리를 알려줘' },
              { section: 'nutrition', suffix: ' 영양 정보를 알려줘' }
            ]" :key="'dynamic-example-' + i">
              <template v-if="i === 3">
                <br/> 📊 궁금한 메뉴의 영양 정보를 살펴보세요<br/>
                📝 입력 예시:<br/>
              </template>

              "{{ message.content.recommendation[i % message.content.recommendation.length].menu }}{{ exampleType.suffix }}"<br/>
            </template>
          </template>
          <template v-else>
            죄송합니다. 추천 메뉴가 없어서 예시를 제공할 수 없습니다.
          </template>
        <div class="divider"></div>
        <p>💭 마음에 드는 메뉴가 없으신가요?</p>
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
            class="option-button"
            @click="handleButtonClick('해당 요리 레시피 보기')">
            해당 요리 레시피 보기
          </button>
          <button
            class="option-button"
            @click="handleButtonClick('다른 요리 영양 정보 찾기')">
            다른 요리 영양 정보 찾기
          </button>
          <button
            class="option-button"
            @click="handleButtonClick('처음으로')">
            처음으로
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
          </template>
        <div class="card-actions">
          <button
             class="option-button"
             @click="handleButtonClick('다른 요리 레시피 찾아보기')">
             다른 요리 레시피 찾아보기
           </button>
          <button
             class="option-button"
             @click="handleButtonClick('처음으로')">
             처음으로
           </button>
        </div>
      </div>

      <div v-if="message.type === 'can_not_find'" class="nutrition-card">
        <div>
          <p>죄송합니다!</p>
          <p>요청하신 정보를 찾을 수 없어요.</p>
        </div>
        <div class="divider"></div>
        <div class="card-actions">
           <button
             class="option-button"
             @click="handleButtonClick('처음으로')">
             처음으로
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
.bubble {
  padding: 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  word-wrap: break-word;
  line-height: 1.5;

  box-sizing: border-box; /* padding도 포함 */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.bot-message {
  align-self: flex-start;
}
.bot-message .bubble {
  background: var(--bot-bubble-bg);
  color: var(--bot-bubble-text);
  border-top-left-radius: 0;
  width: 220px;
}

.user-message {
  align-self: flex-end;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  max-width: 90%;
}
.user-message .bubble {
  background: var(--user-bubble-bg);
  color: var(--user-bubble-text);
  border-top-right-radius: 0;
  max-width: 220px;
}

.message-content, .recipe-card, .nutrition-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.divider {
  border-top: 1px solid var(--card-divider-color);
  margin: 0px 0;
}
h3, h4 { margin: 0; color: var(--card-text-color); }
h3 { font-size: 15px; }
h4 { font-size: 14px; }

.option-button {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--option-button-border);
  background: var(--option-button-bg);
  color: var(--option-button-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.option-button:hover {
  background: var(--option-button-hover-bg);
  color: var(--option-button-hover-text);
  border-color: var(--option-button-hover-bg);
}
.recipe-card .ingredients {
  white-space: pre-line;
  margin: 0;
}
.recipe-step p { /* recipe-step 클래스 내부의 p 태그에 적용 */
  margin: 5;
}
.nutrition-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.card-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }


/* 새로 추가된 CSS 이미지 로딩 규칙 */
.bot-avatar-image {
  background-image: url('../assets/chatbot.png'); /* src/components에서 상대 경로 */
  background-size: cover; /* 이미지가 div에 꽉 차도록 */
  background-position: center; /* 이미지를 중앙에 배치 */
}
.user-avatar-image {
  background-image: url('../assets/user.png'); /* src/components에서 상대 경로 */
  background-size: cover;
  background-position: center;
}
.no-margin-text {
  margin: 0
}

/* 로딩 스피너 스타일 */
.loading-message {
  display: flex;
  align-items: center;
  gap: 8px; /* 텍스트와 스피너 사이 간격 */
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db; 
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite; /* 스피너 애니메이션 */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>