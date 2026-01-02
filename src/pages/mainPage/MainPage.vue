<template>
  <div class="main-page" :class="{ 'dark-theme': isDark }">
    <!-- 主布局 -->
    <n-layout class="layout-container">
      <!-- Header 区域 -->
      <n-layout-header class="main-header">
        <div class="header-content">
          <!-- 左侧菜单按钮和标题 -->
          <div class="header-left">
            <n-button
              quaternary
              circle
              @click="toggleDrawer"
              class="menu-btn"
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </n-icon>
              </template>
            </n-button>
            <n-text strong class="page-title">控制台</n-text>
          </div>

          <!-- 中间：全局搜索 -->
          <div class="header-center">
            <n-input
              placeholder="全局搜索"
              round
              clearable
              class="global-search"
            >
              <template #prefix>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </n-icon>
              </template>
            </n-input>
          </div>

          <!-- 右侧功能按钮 -->
          <div class="header-right">
            <n-space :size="[12, 0]" :wrap="false">
              <!-- 学习情况 -->
              <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <n-button quaternary circle @click="showLearningStatus" class="header-btn">
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                学习情况
              </n-tooltip>

              <!-- 目标日历 -->
              <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <n-button quaternary circle @click="showTargetCalendar" class="header-btn">
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                          <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                目标日历
              </n-tooltip>

              <!-- 信封/消息 -->
              <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <n-button quaternary circle @click="showMessages" class="header-btn">
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                          <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                消息
              </n-tooltip>

              <!-- 通知 -->
              <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                  <n-badge :value="3" dot>
                    <n-button quaternary circle @click="showNotifications" class="header-btn">
                      <template #icon>
                        <n-icon>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                          </svg>
                        </n-icon>
                      </template>
                    </n-button>
                  </n-badge>
                </template>
                通知
              </n-tooltip>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <!-- Body 区域 -->
      <n-layout-content class="main-content">
        <div class="content-grid">
          <!-- 今日任务区域 -->
          <n-card 
            :bordered="false" 
            class="content-card today-tasks"
          >
            <template #header>
              <div class="task-header">
                <n-text strong>今日任务</n-text>
                <n-button text type="primary" size="small" @click="addNewTask">添加任务</n-button>
              </div>
            </template>
            <div class="task-list-container">
              <div class="task-list" ref="taskListRef">
                <div v-for="task in todayTasks" :key="task.id" class="task-item">
                  <div class="task-content">
                    <n-checkbox v-model:checked="task.completed" class="task-checkbox">
                      <span class="task-title" :class="{ 'completed': task.completed }">{{ task.title }}</span>
                    </n-checkbox>
                    <div class="task-actions">
                      <n-tag 
                        :type="task.priority" 
                        size="small" 
                        :bordered="false"
                        class="task-priority"
                        closable
                        @close="removeTask(task.id)"
                      >
                        {{ task.priorityText }}
                      </n-tag>
                      <n-text depth="3" class="task-time">{{ task.time }}</n-text>
                    </div>
                  </div>
                  <n-progress
                    v-if="task.progress !== undefined"
                    type="line"
                    :percentage="task.progress"
                    :height="4"
                    :show-indicator="false"
                    class="task-progress"
                    :status="task.progress === 100 ? 'success' : 'default'"
                  />
                </div>
              </div>
            </div>
            <template #action>
              <div class="task-footer">
                <n-text depth="3" class="task-count">{{ completedTaskCount }}/{{ todayTasks.length }} 已完成</n-text>
                <n-button text size="small" @click="clearCompleted">清除已完成</n-button>
              </div>
            </template>
          </n-card>

          <!-- 快速访问区域 -->
          <n-card :bordered="false" class="content-card common-options">
            <n-grid :cols="2" :x-gap="12" :y-gap="12">
              <n-gi v-for="option in commonOptions" :key="option.id">
                <n-card
                  :title="option.title"
                  hoverable
                  @click="handleOptionClick(option)"
                  class="option-card"
                >
                  <template #cover>
                    <div class="option-cover" :style="{ background: option.color }">
                      <n-icon size="28" class="option-icon">
                        <component :is="option.icon" />
                      </n-icon>
                    </div>
                  </template>
                  <n-text depth="2" class="option-description">
                    {{ option.description }}
                  </n-text>
                </n-card>
              </n-gi>
            </n-grid>
          </n-card>

          <!-- 新增：系统状态卡片区域 -->
          <n-card :bordered="false" class="content-card system-status">
            <n-grid :cols="3" :x-gap="12">
              <n-gi>
                <div class="stat-item">
                  <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <n-icon size="20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </n-icon>
                  </div>
                  <div class="stat-info">
                    <n-text strong class="stat-value">{{ stats.activeUsers }}</n-text>
                    <n-text depth="3" class="stat-label">在线用户</n-text>
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="stat-item">
                  <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <n-icon size="20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </n-icon>
                  </div>
                  <div class="stat-info">
                    <n-text strong class="stat-value">{{ stats.serverLoad }}%</n-text>
                    <n-text depth="3" class="stat-label">服务器负载</n-text>
                  </div>
                </div>
              </n-gi>
              <n-gi>
                <div class="stat-item">
                  <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <n-icon size="20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </n-icon>
                  </div>
                  <div class="stat-info">
                    <n-text strong class="stat-value">{{ stats.responseTime }}ms</n-text>
                    <n-text depth="3" class="stat-label">响应时间</n-text>
                  </div>
                </div>
              </n-gi>
            </n-grid>
          </n-card>

          <!-- 新增：快捷功能 -->
          <n-card title="快捷功能" :bordered="false" class="content-card quick-actions">
            <n-grid :cols="4" :x-gap="12" :y-gap="12">
              <n-gi v-for="action in quickActions" :key="action.id">
                <n-card
                  hoverable
                  @click="handleQuickAction(action)"
                  class="quick-action-card"
                >
                  <template #cover>
                    <div class="quick-action-icon" :style="{ background: action.color }">
                      <n-icon size="20" class="action-icon">
                        <component :is="action.icon" />
                      </n-icon>
                    </div>
                  </template>
                  <n-text class="action-title">{{ action.title }}</n-text>
                </n-card>
              </n-gi>
            </n-grid>
          </n-card>
        </div>
      </n-layout-content>
    </n-layout>

    <!-- 左侧抽屉 -->
    <n-drawer
      v-model:show="drawerVisible"
      placement="left"
      width="240"
      :style="{ backgroundColor: isDark ? '#1a1d24' : '#fff' }"
    >
      <n-drawer-content title="" closable @close="drawerVisible = false">
        <!-- 用户信息区域 -->
        <div class="user-info">
          <n-avatar
            round
            size="large"
            :src="userInfo.avatar"
            class="user-avatar"
          />
          <div class="user-details">
            <n-text strong class="username">{{userInfo.username}}</n-text>
            <n-text depth="3" class="user-email">{{userInfo.email}}</n-text>
            <n-tag size="small" type="success" round class="user-status">在线</n-tag>
          </div>
        </div>

        <!-- 菜单列表 -->
        <n-menu
          :options="menuOptions"
          :value="activeMenu"
          @update:value="handleMenuSelect"
          class="side-menu"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, h } from 'vue';
import { 
  NLayout, 
  NLayoutHeader, 
  NLayoutContent,
  NDrawer,
  NDrawerContent,
  NMenu,
  NInput,
  NButton,
  NIcon,
  NSpace,
  NCard,
  NGrid,
  NGi,
  NText,
  NTag,
  NAvatar,
  NCheckbox,
  NTooltip,
  NProgress,
  NBadge,
  useMessage
} from 'naive-ui';

const message = useMessage();

// 主题状态
const isDark = ref(false);

// 抽屉状态
const drawerVisible = ref(false);
const activeMenu = ref('dashboard');
const taskListRef = ref(null);

// 用户信息
const userInfo = reactive({});

// 系统状态信息
const stats = reactive({
  activeUsers: 128,
  serverLoad: 24,
  responseTime: 42
});

// 菜单选项
const menuOptions = [
  {
    label: '学习中心',
    key: 'learning-center',
    icon: () => h('span', { class: 'menu-icon' }, '📚')
  },
  {
    label: '我的课程',
    key: 'courses',
    icon: () => h('span', { class: 'menu-icon' }, '🎓')
  },
  {
    label: '考试中心',
    key: 'exams',
    icon: () => h('span', { class: 'menu-icon' }, '📝')
  },
  {
    label: '学习资源',
    key: 'resources',
    icon: () => h('span', { class: 'menu-icon' }, '📁')
  },
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h('span', { class: 'menu-icon' }, '👤')
  },
  {
    label: '系统设置',
    key: 'settings',
    icon: () => h('span', { class: 'menu-icon' }, '⚙️')
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('span', { class: 'menu-icon' }, '🚪')
  }
];

// 今日任务数据
const todayTasks = ref([
  { 
    id: 1, 
    title: '完成Vue.js项目开发', 
    completed: false, 
    priority: 'error', 
    priorityText: '紧急',
    time: '09:00 - 12:00',
    progress: 75
  },
  { 
    id: 2, 
    title: '学习React Hooks高级用法', 
    completed: true, 
    priority: 'warning', 
    priorityText: '重要',
    time: '13:00 - 15:00',
    progress: 100
  },
  { 
    id: 3, 
    title: '准备项目周报', 
    completed: false, 
    priority: 'info', 
    priorityText: '一般',
    time: '15:00 - 16:00',
    progress: 30
  },
  { 
    id: 4, 
    title: '代码审查会议', 
    completed: false, 
    priority: 'success', 
    priorityText: '低',
    time: '16:00 - 17:00',
    progress: 0
  },
  { 
    id: 5, 
    title: '阅读技术文档', 
    completed: false, 
    priority: 'info', 
    priorityText: '一般',
    time: '19:00 - 20:00',
    progress: 20
  },
  { 
    id: 6, 
    title: '学习TypeScript高级类型', 
    completed: true, 
    priority: 'warning', 
    priorityText: '重要',
    time: '20:00 - 21:00',
    progress: 100
  }
]);

// 快速访问选项
const commonOptions = ref([
  { 
    id: 1, 
    title: '学习课程', 
    description: '在线学习各种编程课程',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24' }, [
      h('path', { fill: 'currentColor', d: 'M12 2L1 9l11 7 9-6.16V17H22V9M5 13.18V17h7v-3.18z' })
    ]),
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    action: 'courses'
  },
  { 
    id: 2, 
    title: '在线考试', 
    description: '参加在线考试和测试',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24' }, [
      h('path', { fill: 'currentColor', d: 'M5.5 7.5A1.5 1.5 0 0 1 7 9v6a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 2 15V9a1.5 1.5 0 0 1 1.5-1.5h2m6-3A1.5 1.5 0 0 1 13 6v12a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 8 18V6a1.5 1.5 0 0 1 1.5-1.5h2m6-3A1.5 1.5 0 0 1 19 3v18a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 14 21V3a1.5 1.5 0 0 1 1.5-1.5h2z' })
    ]),
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    action: 'exams'
  },
  { 
    id: 3, 
    title: '书籍资源', 
    description: '获取学习资料和电子书',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24' }, [
      h('path', { fill: 'currentColor', d: 'M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z' })
    ]),
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    action: 'books'
  },
  { 
    id: 4, 
    title: '经验分享', 
    description: '与其他学习者交流经验',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '24', height: '24' }, [
      h('path', { fill: 'currentColor', d: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z' })
    ]),
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    action: 'share'
  }
]);

// 快捷功能
const quickActions = ref([
  { 
    id: 1, 
    title: '新建课程', 
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '20', height: '20' }, [
      h('path', { fill: 'currentColor', d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' })
    ]),
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    action: 'create-course'
  },
  { 
    id: 2, 
    title: '上传文件', 
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '20', height: '20' }, [
      h('path', { fill: 'currentColor', d: 'M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z' })
    ]),
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    action: 'upload-file'
  },
  { 
    id: 3, 
    title: '数据分析', 
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '20', height: '20' }, [
      h('path', { fill: 'currentColor', d: 'M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm8 14H5v-6h6v6zm2 0v-6h6v6h-6zm6-8H5V5h14v6z' })
    ]),
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    action: 'data-analysis'
  },
  { 
    id: 4, 
    title: '系统备份', 
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '20', height: '20' }, [
      h('path', { fill: 'currentColor', d: 'M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z' })
    ]),
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    action: 'backup-system'
  }
]);

// 计算属性
const completedTaskCount = computed(() => {
  return todayTasks.value.filter(task => task.completed).length;
});

// 切换抽屉
const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value;
};

// 菜单选择处理
const handleMenuSelect = (key) => {
  activeMenu.value = key;
  if (key === 'logout') {
    handleLogout();
  } else {
    message.info(`切换到: ${key}`);
    drawerVisible.value = false;
  }
};

// 功能按钮处理
const showLearningStatus = () => {
  message.info('查看学习情况');
};

const showTargetCalendar = () => {
  message.info('打开目标日历');
};

const showMessages = () => {
  message.info('查看消息');
};

const showNotifications = () => {
  message.info('查看通知');
};

const handleOptionClick = (option) => {
  message.info(`打开: ${option.title}`);
};

const handleQuickAction = (action) => {
  message.info(`执行: ${action.title}`);
};

// 任务管理
const addNewTask = () => {
  const newTask = {
    id: todayTasks.value.length + 1,
    title: '新的学习任务',
    completed: false,
    priority: 'info',
    priorityText: '一般',
    time: '待安排',
    progress: 0
  };
  todayTasks.value.unshift(newTask);
  message.success('任务已添加');
};

const removeTask = (taskId) => {
  todayTasks.value = todayTasks.value.filter(task => task.id !== taskId);
  message.success('任务已删除');
};

const clearCompleted = () => {
  const initialLength = todayTasks.value.length;
  todayTasks.value = todayTasks.value.filter(task => !task.completed);
  const removedCount = initialLength - todayTasks.value.length;
  message.success(`已清除 ${removedCount} 个已完成任务`);
};

const handleLogout = () => {
  message.info('退出登录');
};

// 初始化主题
onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light';
  isDark.value = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  const u = JSON.parse(localStorage.getItem("user"));
  userInfo.avatar = u.avatarUrl != null ? u.avatarUrl: "https://ts2.tc.mm.bing.net/th/id/OIP-C._MolZc9ybWaQGJMZP3FrzgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" ;
  userInfo.username = u.username;
  userInfo.email = u.email;
  console.log(userInfo)
});
</script>

<style scoped>
.main-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 布局容器 */
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--content-bg);
}

/* Header 样式 */
.main-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  width: 40px;
  height: 40px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
}

.global-search {
  width: 100%;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
}

.header-right {
  display: flex;
  align-items: center;
}

.header-btn {
  width: 40px;
  height: 40px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--content-bg);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* 隐藏滚动条 */
.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.content-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  height: 100%;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-color);
}

.today-tasks {
  grid-column: 1;
  grid-row: 1;
  width: 320px;
  min-height: 400px;
}

.common-options {
  grid-column: 2;
  grid-row: 1;
  width: 100%;
}

.system-status {
  grid-column: 1;
  grid-row: 2;
  width: 320px;
  min-height: 120px;
}

.quick-actions {
  grid-column: 2;
  grid-row: 2;
  width: 100%;
  min-height: 200px;
}

/* 任务列表 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.task-list-container {
  max-height: 300px;
  overflow: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 300px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.task-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.task-item {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--hover-bg);
  border: 1px solid transparent;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-checkbox {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--text-color-secondary);
  opacity: 0.7;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-priority {
  cursor: pointer;
}

.task-time {
  font-size: 12px;
  min-width: 80px;
  text-align: right;
}

.task-progress {
  margin-top: 4px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color-light);
}

.task-count {
  font-size: 12px;
}

/* 选项卡片 */
.option-card {
  cursor: pointer;
  height: 140px;
  border: none;
  box-shadow: none;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color-light);
  overflow: hidden;
}

.option-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  border-radius: 8px 8px 0 0;
}

.option-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.option-description {
  font-size: 12px;
  line-height: 1.4;
  padding: 0 8px 12px;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 统计卡片 */
.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: var(--hover-bg);
  border-radius: 8px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* 快捷功能 */
.quick-action-card {
  cursor: pointer;
  border: none;
  box-shadow: none;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  text-align: center;
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  color: white;
}

.action-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-color);
}

/* 主题变量 */
:root {
  --header-bg: #ffffff;
  --content-bg: #f8f8fa;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --border-color-light: #f1f5f9;
  --text-color: #334155;
  --text-color-secondary: #64748b;
  --hover-bg: rgba(148, 163, 184, 0.08);
  --input-bg: #ffffff;
}

.main-page.dark-theme {
  --header-bg: #1a1d24;
  --content-bg: #101014;
  --card-bg: #1f2229;
  --border-color: #2a2e3a;
  --border-color-light: #1f2229;
  --text-color: #e2e8f0;
  --text-color-secondary: #94a3b8;
  --hover-bg: rgba(148, 163, 184, 0.12);
  --input-bg: #2a2e3a;
}

/* 应用主题变量 */
.main-header {
  background-color: var(--header-bg);
  color: var(--text-color);
}

.main-content {
  background-color: var(--content-bg);
  color: var(--text-color);
}

.content-card {
  background-color: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}

/* 抽屉样式 */
.user-info {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.username {
  font-size: 16px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-status {
  align-self: flex-start;
  font-size: 10px;
  padding: 0 6px;
  height: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 16px;
  }
  
  .today-tasks,
  .common-options,
  .system-status,
  .quick-actions {
    grid-column: 1;
    width: 100% !important;
  }
  
  .today-tasks {
    grid-row: 1;
  }
  
  .common-options {
    grid-row: 2;
  }
  
  .system-status {
    grid-row: 3;
  }
  
  .quick-actions {
    grid-row: 4;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .header-center {
    margin: 0 20px;
  }
  
  .page-title {
    display: none;
  }
}
</style>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none;
}

/* 确保Naive UI组件也隐藏滚动条 */
.n-drawer .n-drawer-content-wrapper {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.n-drawer .n-drawer-content-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>