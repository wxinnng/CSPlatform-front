import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router';
import pinia from './store/index';
import naive from 'naive-ui'
const app = createApp(App)

app.use(router).use(pinia).use(naive).mount("#app")

