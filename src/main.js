import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router';
import pinia from './store/index';
import naive from 'naive-ui'
// 1. 引入预览组件和样式
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
// 2. 引入主题（例如 vuepress 主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'


VMdPreview.use(vuepressTheme)

const app = createApp(App)

app.use(router).use(pinia).use(naive).use(VMdPreview).mount("#app")

