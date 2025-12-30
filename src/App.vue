<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div id="app" :class="[isDark ? 'dark-theme' : 'light-theme']">
      <!-- Header固定区域 -->
      <n-layout-header bordered="true" class="fixed-header">
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
              <n-button quaternary :type="isDark ? 'default' : 'default'" focusable="false">首页</n-button>
              <n-button quaternary :type="isDark ? 'info' : 'info'" focusable="false">服务</n-button>
              <n-button quaternary :type="isDark ? 'primary' : 'primary'" focusable="false">项目</n-button>
              <n-button quaternary :type="isDark ? 'warning' : 'warning'" focusable="false">关于</n-button>

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

      <!-- 主内容区域 -->
      <n-layout class="main-layout">
        <n-layout-content class="content-area">
          <n-message-provider>
            <n-loading-bar-provider>
              <router-view />
            </n-loading-bar-provider>
          </n-message-provider>
          <n-global-style />
        </n-layout-content>
      </n-layout>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { darkTheme, NGlobalStyle } from 'naive-ui';

// 响应式主题状态
const isDark = ref(false);

// 自定义主题变量
const themeOverrides = computed(() => ({
  common: {
    primaryColor: isDark.value ? '#63e2b7' : '#18a058',
  }
}));

// 切换主题函数
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  // 添加切换动画类
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 300);
};

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
  }
});
</script>

<style scoped>
/* 全局样式重置 */
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 固定Header样式 - 固定尺寸 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  /* 固定宽度占满视口 */
  height: 60px;
  /* 固定高度 */
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin: 0;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-color, rgb(224, 222, 222));
  background-color: var(--header-bg, rgb(255, 255, 255));
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Header内容容器 */
.header-content {
  width: 100%;
  max-width: 1200px;
  /* 最大宽度限制 */
  margin: 0 auto;
  /* 水平居中 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  /* 继承Header的固定高度 */
}

/* 左侧Logo和标题 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  /* 继承Header的固定高度 */
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
  /* 继承Header的固定高度 */
}

.nav-buttons {
  display: flex;
  align-items: center;
  height: 100%;
  /* 继承Header的固定高度 */
}

.nav-buttons .n-button {
  height: 36px;
  /* 固定按钮高度 */
  font-size: 14px;
  font-weight: 500;
  padding: 0 12px;
  white-space: nowrap;
}

.theme-toggle-btn {
  height: 36px;
  /* 固定按钮高度 */
  padding: 0 12px;
  min-width: auto;
}

.github-btn {
  height: 36px;
  /* 固定按钮高度 */
  padding: 0 12px;
}

.github-btn a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  height: 100%;
}

/* 主布局区域 */
.main-layout {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

/* 内容区域 - 自动填充剩余空间 */
.content-area {
  position: fixed;
  top: 60px;
  /* Header固定高度 */
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: var(--content-bg, #f8f8fa);
  transition: all 0.3s ease;
}

/* 主题特定样式 */
.light-theme {
  --header-bg: rgba(255, 255, 255, 0.95);
  --content-bg: #f8f8fa;
  --border-color: rgb(224, 222, 222);
}

.dark-theme {
  --header-bg: rgba(16, 16, 20, 0.95);
  --content-bg: #101014;
  --border-color: rgb(60, 60, 67);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .fixed-header {
    height: 56px;
    /* 移动端稍小的高度 */
  }

  .content-area {
    top: 56px;
    /* 对应移动端Header高度 */
    padding: 16px;
  }

  .header-content {
    padding: 0 12px;
  }

  .nav-buttons .n-button:not(.theme-toggle-btn):not(.github-btn) {
    display: none;
    /* 移动端隐藏部分导航按钮 */
  }
}
</style>

<style>
/* 全局过渡效果 */
.theme-transition * {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.dark-theme ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>