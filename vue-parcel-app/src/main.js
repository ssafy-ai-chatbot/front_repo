import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Pinia 임포트
import App from './App.vue'; // 메인 Vue 컴포넌트 불러오기

const app = createApp(App); // Vue 앱 인스턴스 생성

const pinia = createPinia(); // Pinia 인스턴스 생성

app.use(pinia); // Vue 앱에 Pinia 플러그인 연결

app.mount('#app'); // Vue 앱을 HTML에 마운트