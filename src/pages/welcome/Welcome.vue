<template>
  <div class="welcome-page">
    <!-- 固定Header部分 -->
    <n-layout-header bordered class="fixed-header">
      <div class="header-content">
        <!-- 左侧Logo和标题 -->
        <div class="header-left">
          <n-avatar 
            size="medium" 
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
            class="avatar"
          />
          <n-gradient-text type="danger" size="24" class="title">
            Sing
          </n-gradient-text>
        </div>
        
        <!-- 右侧导航和按钮 -->
        <div class="header-right">
          <n-flex justify="end" align="center" :size="[20, 0]" :wrap="false" class="nav-buttons">
            <n-button quaternary :type="isDark ? 'default' : 'default'" focusable="false" @click="scrollTo('hero')">首页</n-button>
            <n-button quaternary :type="isDark ? 'info' : 'info'" focusable="false" @click="scrollTo('features')">服务</n-button>
            <n-button quaternary :type="isDark ? 'primary' : 'primary'" focusable="false" @click="scrollTo('projects')">项目</n-button>
            <n-button quaternary :type="isDark ? 'warning' : 'warning'" focusable="false" @click="scrollTo('about')">关于</n-button>
            
            <!-- 主题切换按钮 -->
            <n-button 
              quaternary 
              :type="isDark ? 'error' : 'error'" 
              @click="toggleTheme" 
              class="theme-toggle-btn"
            >
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
        <div class="hero-content">
          <n-h1 :type="isDark ? 'info' : 'success'" style="font-size: 3.5rem; margin-bottom: 1.5rem;">
            Welcome to My Platform
          </n-h1>
          <n-h2 :type="isDark ? 'warning' : 'primary'" style="font-size: 2rem; margin-bottom: 2rem;">
            构建卓越的数字体验
          </n-h2>
          <n-p :type="isDark ? 'default' : 'default'" style="font-size: 1.2rem; max-width: 600px; margin-bottom: 2.5rem;">
            这是一个基于Vue 3和Naive UI构建的现代Web应用平台。我们致力于提供优雅的用户界面和出色的用户体验。
          </n-p>
          <n-space :size="20">
            <n-button type="primary" size="large" @click="scrollTo('features')">
              开始探索
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </n-icon>
              </template>
            </n-button>
            <n-button secondary type="info" size="large" @click="openGitHub">
              查看项目
            </n-button>
          </n-space>
        </div>
      </section>
      
      <!-- Features Section -->
      <section id="features" class="features-section">
        <n-h2 prefix="bar" align-text :type="isDark ? 'info' : 'primary'" style="font-size: 2.5rem; margin-bottom: 3rem;">
          核心服务
        </n-h2>
        
        <div class="features-grid">
          <n-card
            v-for="feature in features"
            :key="feature.title"
            hoverable
            class="feature-card"
            :bordered="!isDark"
            :style="{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }"
          >
            <template #cover>
              <n-image
                :src="feature.image"
                height="200"
                object-fit="cover"
                preview-disabled
              />
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
        <n-h2 prefix="bar" align-text :type="isDark ? 'warning' : 'error'" style="font-size: 2.5rem; margin-bottom: 2rem;">
          关于我们
        </n-h2>
        
        <n-card
          :bordered="!isDark"
          :style="{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', maxWidth: '800px', margin: '0 auto' }"
        >
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
              <n-button
                v-for="(contact, index) in contacts"
                :key="index"
                :type="contact.type"
                quaternary
                :icon-placement="contact.icon"
                @click="contact.action"
              >
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
  NFlex
} from 'naive-ui';

// 主题状态 - 与外部同步
const isDark = ref(false);

// 监听主题变化
const updateTheme = () => {
  const html = document.documentElement;
  const theme = localStorage.getItem('theme') || 'light';
  isDark.value = theme === 'dark';
  html.setAttribute('data-theme', theme);
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

// 项目列表
const projects = ref([
  {
    name: 'CSPlatform',
    description: '一个全面的计算机科学学习平台，提供丰富的教程和实践项目',
    status: 'Active',
    tech: ['Vue 3', 'TypeScript', 'Naive UI']
  },
  {
    name: 'Design System',
    description: '企业级设计系统，包含完整的组件库和设计规范',
    status: 'Active',
    tech: ['React', 'Storybook', 'Figma']
  },
  {
    name: 'E-Commerce Platform',
    description: '现代化的电子商务平台，支持多商家和智能推荐',
    status: 'Completed',
    tech: ['Vue 3', 'Node.js', 'MongoDB']
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

// 平滑滚动到指定部分
const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 60; // Header高度
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

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

/* 可滚动内容区域 - 修复空白问题 */
.scrollable-content {
  padding-top: 60px; /* Header高度 */
  min-height: calc(100vh - 60px); /* 计算正确的高度 */
  background-color: var(--n-color-embedded);
  transition: background-color 0.3s ease;
  margin: 0;
  overflow-x: hidden;
}

/* 各部分通用样式 */
section {
  padding: 40px 20px; /* 减少上下的padding */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

/* Hero Section - 特别处理 */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px); /* 填满首屏，减去Header高度 */
  padding: 20px; /* 减少padding */
  margin: 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 800px;
  padding: 20px 0;
}

/* Features Section */
.features-section {
  padding: 60px 20px; /* 减少padding */
  min-height: auto; /* 移除min-height */
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
  padding: 60px 20px; /* 减少padding */
  min-height: auto; /* 移除min-height */
}

/* Footer Section */
.footer-section {
  padding: 40px 20px;
  text-align: center;
  background-color: var(--n-color-embedded);
  border-top: 1px solid var(--n-border-color);
  min-height: auto; /* 移除min-height */
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
    padding: 10px;
  }
  
  section {
    padding: 30px 12px;
  }
  
  .hero-section h1 {
    font-size: 2.5rem !important;
  }
  
  .hero-section h2 {
    font-size: 1.5rem !important;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-buttons .n-button:not(.theme-toggle-btn):not(.github-btn) {
    display: none;
  }
}
</style>

<style>
/* 重置全局默认边距 */
body, html {
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