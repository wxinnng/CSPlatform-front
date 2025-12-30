<template>
  <div class="welcome-page">
    <!-- 固定Header部分 -->
    <n-layout-header bordered class="fixed-header">
      <div class="header-content">
        <!-- 左侧Logo和标题 -->
        <div class="header-left">
          <n-avatar size="medium" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" class="avatar" />
          <n-gradient-text type="danger" size="24" class="title">
            Sing
          </n-gradient-text>
        </div>

        <!-- 右侧导航和按钮 -->
        <div class="header-right">
          <n-flex justify="end" align="center" :size="[20, 0]" :wrap="false" class="nav-buttons">
            <n-button quaternary :type="isDark ? 'default' : 'default'" focusable="false"
              @click="scrollTo('hero')">首页</n-button>
            <n-button quaternary :type="isDark ? 'info' : 'info'" focusable="false"
              @click="scrollTo('features')">服务</n-button>
            <n-button quaternary :type="isDark ? 'primary' : 'primary'" focusable="false"
              @click="scrollTo('projects')">项目</n-button>
            <n-button quaternary :type="isDark ? 'warning' : 'warning'" focusable="false"
              @click="scrollTo('about')">关于</n-button>

            <!-- 主题切换按钮 -->
            <n-button quaternary :type="isDark ? 'error' : 'error'" @click="toggleTheme" class="theme-toggle-btn">
              <template #icon>
                <n-icon>
                  <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor"
                      d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor"
                      d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                  </svg>
                </n-icon>
              </template>
              {{ isDark ? '浅色模式' : '深色模式' }}
            </n-button>

            <!-- GitHub链接 -->
            <n-button quaternary type="tertiary" class="github-btn">
              <a href="https://github.com/wxinnng/CSPlatform" target="_blank" rel="noopener noreferrer">GitHub</a>
            </n-button>
          </n-flex>
        </div>
      </div>
    </n-layout-header>

    <!-- 主要内容区域（可滚动） -->
    <div class="scrollable-content">
      <!-- Hero Section -->
      <section id="hero" class="hero-section">
        <!-- 装饰元素 - 背景形状 -->
        <div class="hero-background">
          <div class="shape shape-1" :class="{ 'dark': isDark }"></div>
          <div class="shape shape-2" :class="{ 'dark': isDark }"></div>
          <div class="shape shape-3" :class="{ 'dark': isDark }"></div>
          <div class="shape shape-4" :class="{ 'dark': isDark }"></div>
        </div>

        <!-- 装饰元素 - 漂浮图标 -->
        <div class="floating-elements">
          <div class="floating-icon icon-1" :class="{ 'dark': isDark }">
            <n-icon size="24">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </n-icon>
          </div>
          <div class="floating-icon icon-2" :class="{ 'dark': isDark }">
            <n-icon size="24">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </n-icon>
          </div>
          <div class="floating-icon icon-3" :class="{ 'dark': isDark }">
            <n-icon size="24">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </n-icon>
          </div>
        </div>

        <div class="hero-content">
          <!-- 装饰线条 -->
          <div class="hero-line left" :class="{ 'dark': isDark }"></div>
          <div class="hero-line right" :class="{ 'dark': isDark }"></div>

          <!-- 装饰点阵 -->
          <div class="dot-pattern" :class="{ 'dark': isDark }"></div>

          <!-- 主要内容 -->
          <div class="hero-main-content">
            <n-h1 :type="isDark ? 'info' : 'success'" class="hero-title">
              <span class="title-text">Welcome to My Platform</span>
              <span class="title-highlight" :class="{ 'dark': isDark }"></span>
            </n-h1>

            <n-h2 :type="isDark ? 'warning' : 'primary'" class="hero-subtitle">
              构建卓越的数字体验
            </n-h2>

            <n-p :type="isDark ? 'default' : 'default'" class="hero-description">
              这是一个基于Vue 3和Naive UI构建的现代Web应用平台。我们致力于提供优雅的用户界面和出色的用户体验。
            </n-p>

            <!-- 装饰性分隔符 -->
            <div class="hero-divider" :class="{ 'dark': isDark }">
              <div class="divider-line"></div>
              <div class="divider-icon">
                <n-icon size="20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                </n-icon>
              </div>
              <div class="divider-line"></div>
            </div>

            <n-space :size="20" class="hero-actions">
              <n-button type="primary" size="large" class="hero-btn" @click="scrollTo('features')">
                开始探索
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor"
                        d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>
                  </n-icon>
                </template>
              </n-button>
              <n-button secondary type="info" size="large" class="hero-btn" @click="openGitHub">
                查看项目
              </n-button>
            </n-space>

            <!-- 滚动提示 -->
            <div class="scroll-hint" :class="{ 'dark': isDark }" @click="scrollTo('features')">
              <span>向下滚动</span>
              <n-icon class="bounce">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </n-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section">
        <n-h2 prefix="bar" align-text :type="isDark ? 'info' : 'primary'"
          style="font-size: 2.5rem; margin-bottom: 3rem;">
          核心服务
        </n-h2>

        <div class="features-grid">
          <n-card v-for="feature in features" :key="feature.title" hoverable class="feature-card" :bordered="!isDark"
            :style="{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }">
            <template #cover>
              <n-image :src="feature.image" height="200" object-fit="cover" preview-disabled />
            </template>
            <n-h3 :type="feature.color">
              {{ feature.title }}
            </n-h3>
            <n-p>
              {{ feature.description }}
            </n-p>
            <template #action>
              <n-button quaternary :type="feature.color">
                了解更多
              </n-button>
            </template>
          </n-card>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="about-section">
        <n-h2 prefix="bar" align-text :type="isDark ? 'warning' : 'error'"
          style="font-size: 2.5rem; margin-bottom: 2rem;">
          关于我们
        </n-h2>

        <n-card :bordered="!isDark"
          :style="{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', maxWidth: '800px', margin: '0 auto' }">
          <n-space vertical :size="20">
            <n-p style="font-size: 1.1rem; line-height: 1.8;">
              我们是一支专注于Web技术的前端团队，致力于通过现代化的技术栈为用户提供卓越的数字体验。我们相信优秀的设计和代码能够创造价值。
            </n-p>

            <n-space :size="20">
              <n-statistic label="项目完成" :value="42">
                <template #suffix>
                  <n-text depth="3">个</n-text>
                </template>
              </n-statistic>
              <n-statistic label="团队成员" :value="8">
                <template #suffix>
                  <n-text depth="3">人</n-text>
                </template>
              </n-statistic>
              <n-statistic label="用户满意度" :value="98.7">
                <template #suffix>
                  <n-text depth="3">%</n-text>
                </template>
              </n-statistic>
            </n-space>

            <n-divider />

            <n-space justify="center" :size="30">
              <n-button v-for="(contact, index) in contacts" :key="index" :type="contact.type" quaternary
                :icon-placement="contact.icon" @click="contact.action">
                {{ contact.label }}
              </n-button>
            </n-space>
          </n-space>
        </n-card>
      </section>

      <!-- Footer -->
      <footer class="footer-section">
        <n-divider />
        <n-space vertical align="center" :size="20">
          <n-text depth="3">
            © 2026 Sing Platform. All rights reserved.
          </n-text>
          <n-space :size="20">
            <n-text depth="3">Built with Vue 3 & Naive UI</n-text>
            <n-text depth="3">Powered by WangXing</n-text>
          </n-space>
        </n-space>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  NLayoutHeader,
  NH1,
  NH2,
  NH3,
  NP,
  NButton,
  NSpace,
  NImage,
  NCard,
  NTag,
  NStatistic,
  NDivider,
  NText,
  NIcon,
  NAvatar,
  NGradientText,
  NFlex,
  useLoadingBar
} from 'naive-ui';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui'

// 主题状态 - 与外部同步
const isDark = ref(false);
const loadingBar = useLoadingBar();

// 监听主题变化
const updateTheme = () => {
  const html = document.documentElement;
  const theme = localStorage.getItem('theme') || 'light';
  isDark.value = theme === 'dark';
  html.setAttribute('data-theme', theme);
};

// 切换主题函数
const toggleTheme = () => {
  isDark.value = !isDark.value;
  const theme = isDark.value ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  // 触发自定义事件，通知其他组件主题已变化
  window.dispatchEvent(new CustomEvent('theme-change'));
};

// 初始化时检查主题
onMounted(() => {
  updateTheme();

  // 监听存储变化以同步主题
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      updateTheme();
    }
  });

  // 监听自定义主题变化事件
  window.addEventListener('theme-change', updateTheme);
});

// 功能列表
const features = ref([
  {
    title: '现代化设计',
    description: '采用最新的设计语言，提供优雅的用户界面和流畅的交互体验',
    image: 'https://naive-ui.oss-accelerate.aliyuncs.com/carousel-img/carousel2.jpeg',
    color: 'info'
  },
  {
    title: '高性能架构',
    description: '基于Vue 3的组合式API，提供卓越的性能和开发体验',
    image: 'https://naive-ui.oss-accelerate.aliyuncs.com/carousel-img/carousel3.jpeg',
    color: 'success'
  },
  {
    title: '响应式布局',
    description: '完美适配各种设备，从桌面到移动端都能提供一致体验',
    image: 'https://naive-ui.oss-accelerate.aliyuncs.com/carousel-img/carousel4.jpeg',
    color: 'warning'
  }
]);

// 联系方式
const contacts = ref([
  {
    label: '发送邮件',
    type: 'primary',
    icon: 'right',
    action: () => window.open('mailto:contact@example.com')
  },
  {
    label: '查看文档',
    type: 'info',
    icon: 'right',
    action: () => window.open('https://docs.example.com', '_blank')
  },
  {
    label: '加入社区',
    type: 'success',
    icon: 'right',
    action: () => window.open('https://discord.example.com', '_blank')
  }
]);

const message = useMessage()


// 检查登录状态
const isLoggedIn = () => {
  // 从 localStorage 检查
  const token = localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  // 如果有 token，还可以验证有效性
  if (token) {
    // 可选：验证 token 是否过期
    const tokenExpiry = localStorage.getItem('token_expiry')
    if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
      // token 已过期
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
      return false
    }
    return true
  }
  return false
}



// 正确：在 setup 顶部获取路由实例
const router = useRouter()

// 平滑滚动到指定部分
const scrollTo = async (sectionId) => {
  try {
    loadingBar.start()
    
    // 1. 执行平滑滚动
    const scrollPromise = new Promise((resolve) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const headerHeight = 60 // Header高度
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        
        // 等待滚动完成（约600ms）
        setTimeout(resolve, 600)
      } else {
        resolve() // 如果没有元素，直接继续
      }
    })
    
    await scrollPromise // 等待滚动完成
    
    // 2. 检查登录状态
    if (isLoggedIn()) {
      // 已登录
      message.success('已登录，跳转中...')
      await new Promise(resolve => setTimeout(resolve, 300)) // 短暂延迟显示消息
      router.push("/mainPage")
    } else {
      // 未登录
      message.warning('请先登录以继续操作')
      
      // 短暂延迟让用户看到消息
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 携带返回路径
      router.push({
        path: '/auth',
        query: { redirect: '/mainPage' }
      })
    }
    
  } catch (error) {
    console.error('跳转失败:', error)
    message.error('跳转失败，请重试')
  } finally {
    loadingBar.finish()
  }
}

// 打开GitHub
const openGitHub = () => {
  window.open('https://github.com/wxinnng/CSPlatform', '_blank');
};
</script>

<style scoped>
.welcome-page {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  position: relative;
}

/* 固定Header样式 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  transition: all 0.3s ease;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

/* Header内容容器 */
.header-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* 左侧Logo和标题 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.title {
  font-weight: bold;
  font-size: 20px;
  white-space: nowrap;
}

/* 右侧导航按钮 */
.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-buttons {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-buttons .n-button {
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 12px;
  white-space: nowrap;
}

.theme-toggle-btn {
  height: 36px;
  padding: 0 12px;
  min-width: auto;
}

.github-btn {
  height: 36px;
  padding: 0 12px;
}

.github-btn a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  height: 100%;
}

/* 可滚动内容区域 */
.scrollable-content {
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  background-color: var(--n-color-embedded);
  transition: background-color 0.3s ease;
  margin: 0;
  overflow-x: hidden;
  position: relative;
}

/* Hero Section 新样式 */
.hero-section {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0 20px;
}

/* 背景形状装饰 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-background .shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(40px);
  transition: all 0.6s ease;
}

.hero-background .shape.dark {
  opacity: 0.15;
  filter: blur(30px);
}

.hero-background .shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #1890ff, #722ed1);
  top: 10%;
  left: 5%;
  animation: float 20s infinite ease-in-out;
}

.hero-background .shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #fa541c, #faad14);
  bottom: 20%;
  right: 10%;
  animation: float 25s infinite ease-in-out reverse;
}

.hero-background .shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #52c41a, #13c2c2);
  top: 50%;
  left: 85%;
  animation: float 18s infinite ease-in-out;
}

.hero-background .shape-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #eb2f96, #722ed1);
  bottom: 5%;
  left: 15%;
  animation: float 30s infinite ease-in-out reverse;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 漂浮图标装饰 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.floating-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.floating-icon.dark {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.floating-icon.icon-1 {
  top: 20%;
  left: 10%;
  animation: float-icon-1 15s infinite ease-in-out;
}

.floating-icon.icon-2 {
  top: 30%;
  right: 15%;
  animation: float-icon-2 20s infinite ease-in-out;
}

.floating-icon.icon-3 {
  bottom: 25%;
  left: 20%;
  animation: float-icon-3 18s infinite ease-in-out;
}

@keyframes float-icon-1 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(20px, -20px) rotate(90deg);
  }

  50% {
    transform: translate(0, -40px) rotate(180deg);
  }

  75% {
    transform: translate(-20px, -20px) rotate(270deg);
  }
}

@keyframes float-icon-2 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(-20px, 20px) rotate(-90deg);
  }

  50% {
    transform: translate(0, 40px) rotate(-180deg);
  }

  75% {
    transform: translate(20px, 20px) rotate(-270deg);
  }
}

@keyframes float-icon-3 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(10px, -10px) rotate(45deg);
  }

  50% {
    transform: translate(-10px, 10px) rotate(135deg);
  }

  75% {
    transform: translate(-10px, -10px) rotate(225deg);
  }
}

/* 主要内容区域 */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 装饰线条 */
.hero-line {
  position: absolute;
  top: 50%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1890ff, transparent);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.hero-line.dark {
  background: linear-gradient(90deg, transparent, #52c41a, transparent);
  opacity: 0.4;
}

.hero-line.left {
  left: calc(50% - 300px);
  transform: translateY(-50%);
}

.hero-line.right {
  right: calc(50% - 300px);
  transform: translateY(-50%);
}

/* 点阵背景 */
.dot-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.05;
  pointer-events: none;
  transition: all 0.3s ease;
}

.dot-pattern.dark {
  opacity: 0.1;
}

/* 主要内容 */
.hero-main-content {
  position: relative;
  z-index: 3;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.title-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #1890ff, #722ed1, #52c41a);
  opacity: 0.3;
  border-radius: 4px;
  z-index: -1;
  transition: all 0.3s ease;
}

.title-highlight.dark {
  background: linear-gradient(90deg, #52c41a, #13c2c2, #1890ff);
  opacity: 0.4;
}

.hero-subtitle {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
  opacity: 0.8;
}

/* 装饰性分隔符 */
.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 2.5rem auto;
  width: 100%;
  max-width: 400px;
}

.hero-divider .divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d9d9d9, transparent);
  transition: all 0.3s ease;
}

.hero-divider.dark .divider-line {
  background: linear-gradient(90deg, transparent, #434343, transparent);
}

.hero-divider .divider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.hero-divider.dark .divider-icon {
  color: #52c41a;
  opacity: 0.8;
}

/* 按钮区域 */
.hero-actions {
  margin-bottom: 3rem;
}

.hero-btn {
  padding: 0 32px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 滚动提示 */
.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-hint.dark {
  color: #a6a6a6;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-hint:hover {
  color: #1890ff;
  transform: translateY(-5px);
  background: rgba(24, 144, 255, 0.1);
  border-color: rgba(24, 144, 255, 0.3);
}

.scroll-hint.dark:hover {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
  border-color: rgba(82, 196, 26, 0.3);
}

.scroll-hint span {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}

/* Features Section */
.features-section {
  padding: 100px 20px;
  min-height: auto;
  position: relative;
  z-index: 1;
  background: var(--n-color-embedded);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin-top: 30px;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* About Section */
.about-section {
  padding: 100px 20px;
  min-height: auto;
  position: relative;
  z-index: 1;
  background: var(--n-color-embedded);
}

/* Footer Section */
.footer-section {
  padding: 60px 20px;
  text-align: center;
  background: var(--n-color-embedded);
  border-top: 1px solid var(--n-border-color);
  min-height: auto;
  position: relative;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fixed-header {
    height: 56px;
    padding: 0 12px;
  }

  .scrollable-content {
    padding-top: 56px;
    min-height: calc(100vh - 56px);
  }

  .hero-section {
    min-height: calc(100vh - 56px);
    padding: 0 12px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-background .shape-1,
  .hero-background .shape-2,
  .hero-background .shape-3,
  .hero-background .shape-4 {
    display: none;
  }

  .floating-icon {
    display: none;
  }

  .hero-line.left,
  .hero-line.right {
    display: none;
  }

  .features-section,
  .about-section {
    padding: 60px 12px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .nav-buttons .n-button:not(.theme-toggle-btn):not(.github-btn) {
    display: none;
  }

  .hero-btn {
    padding: 0 20px;
    height: 44px;
    font-size: 14px;
  }
}
</style>

<style>
/* 重置全局默认边距 */
body,
html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 确保根元素无滚动条 */
#app {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>