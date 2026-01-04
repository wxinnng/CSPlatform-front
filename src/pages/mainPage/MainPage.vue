<template>
  <div class="main-page" :class="{ 'dark-theme': isDark }">
    <!-- 主布局 -->
    <n-layout class="layout-container">
      <!-- Header 区域 -->
      <n-layout-header class="main-header">
        <div class="header-content">
          <!-- 左侧菜单按钮和标题 -->
          <div class="header-left">
            <n-button quaternary circle @click="toggleDrawer" class="menu-btn">
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                  </svg>
                </n-icon>
              </template>
            </n-button>
          </div>

          <!-- 中间：全局搜索 -->
          <div class="header-center">
            <n-input placeholder="全局搜索" round clearable class="global-search">
              <template #prefix>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor"
                      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
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
                          <path fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
                          <path fill="currentColor"
                            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
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
                          <path fill="currentColor"
                            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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
                            <path fill="currentColor"
                              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
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
          <n-card :bordered="false" class="content-card today-tasks">
            <template #header>
              <div class="task-header">
                <n-text strong>今日任务</n-text>
                <n-button text type="primary" size="small" @click="showAddModal = true">添加任务</n-button>
              </div>
            </template>
            <div class="task-list-container">
              <div class="task-list" ref="taskListRef">
                <div v-for="(task, index) in todayTasks" :key="task.id" class="task-item" draggable="true"
                  @click.stop="toggleTaskDetail(task)" @dragstart="handleDragStart($event, index)"
                  @dragover="handleDragOver($event, index)" @dragenter="handleDragEnter($event, index)"
                  @dragleave="handleDragLeave($event)" @dragend="handleDragEnd" @drop="handleDrop($event, index)">

                  <div class="task-content">
                    <n-checkbox v-model:checked="task.completed" @click="handleComplete(task.id)" class="task-checkbox" @click.stop>
                      <span class="task-title" :class="{ 'completed': task.completed }">
                        <n-icon size="16" class="drag-handle">
                          <DragHandleIcon />
                        </n-icon>
                        {{ task.title }}
                      </span>
                    </n-checkbox>
                    <div class="task-actions">
                      <n-text depth="3" class="task-time">{{ formatTaskTime(task.startTime) }}</n-text>
                      <n-tag :type="getPriorityType(task.priority)" size="small" :bordered="false" class="task-priority"
                        closable @click.stop @close="removeTask(task.id)">
                        {{ getPriorityText(task.priority) }}
                      </n-tag>
                    </div>
                  </div>

                  <!-- 任务详情展开区域 -->
                  <div v-if="expandedTaskId === task.id" class="task-detail-expanded">
                    <div class="task-detail-content">
                      <h4>任务详情:</h4>
                      <p>{{ task.content || '暂无描述' }}</p>

                      <div class="task-detail-meta">
                        <div class="detail-item">
                          <n-icon size="16">
                            <CalendarIcon />
                          </n-icon>
                          <strong>创建时间:</strong> {{ formatDateTime(task.createdAt) }}
                        </div>
                        <!-- 在详情区域修改时间显示 -->
                        <div class="detail-item">
                          <n-icon size="16">
                            <ClockIcon />
                          </n-icon>
                          <strong>截止时间:</strong> {{ task.displayEndTime || '无' }}
                        </div>
                        <div class="detail-item">
                          <n-icon size="16">
                            <TagIcon />
                          </n-icon>
                          <strong>标签：</strong>
                          <n-space v-if="task.tagsArray && task.tagsArray.length > 0" :size="8"
                            style="display: inline-flex; margin-left: 8px;">
                            <n-tag v-for="tag in task.tagsArray" :key="tag" size="small" type="info">
                              {{ tag }}
                            </n-tag>
                          </n-space>
                          <span v-else style="color: #999; margin-left: 8px;">无标签</span>
                        </div>
                      </div>

                      <div class="task-detail-actions">
                        <n-button size="small" style="margin-left: 170px;" type="info"
                          @click.stop="toggleTaskDetail(task)">收起</n-button>
                      </div>
                    </div>
                  </div>
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
                <n-card :title="option.title" hoverable @click="handleOptionClick(option)" class="option-card">
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

          <!-- 系统状态卡片区域 -->
          <n-card :bordered="false" class="content-card system-status">
            <n-grid :cols="3" :x-gap="12">
              <n-gi>
                <div class="stat-item">
                  <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <n-icon size="20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
                        <path fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
                        <path fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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

          <!-- 快捷功能 -->
          <n-card title="快捷功能" :bordered="false" class="content-card quick-actions">
            <n-grid :cols="4" :x-gap="12" :y-gap="12">
              <n-gi v-for="action in quickActions" :key="action.id">
                <n-card hoverable @click="handleQuickAction(action)" class="quick-action-card">
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

    <!-- 添加任务模态框 -->
    <n-modal v-model:show="showAddModal" preset="dialog" title="添加新任务" positive-text="添加" negative-text="取消"
      @positive-click="handleAddTask" @negative-click="showAddModal = false" style="width: 500px;"
      :mask-closable="false">
      <n-form ref="formRef" :model="newTask" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="medium">
        <n-form-item label="任务标题" path="title">
          <n-input v-model:value="newTask.title" placeholder="请输入任务标题" clearable maxlength="50" show-count />
        </n-form-item>

        <n-form-item label="任务描述" path="content">
          <n-input v-model:value="newTask.content" type="textarea" placeholder="请输入任务描述（可选）"
            :autosize="{ minRows: 2, maxRows: 4 }" maxlength="200" show-count />
        </n-form-item>

        <n-form-item label="优先级" path="priority">
          <n-radio-group v-model:value="newTask.priority">
            <n-space>
              <n-radio :value="1" class="priority-option">
                <n-tag type="error" size="small" :bordered="false">紧急</n-tag>
              </n-radio>
              <n-radio :value="2" class="priority-option">
                <n-tag type="warning" size="small" :bordered="false">重要</n-tag>
              </n-radio>
              <n-radio :value="3" class="priority-option">
                <n-tag type="info" size="small" :bordered="false">一般</n-tag>
              </n-radio>
              <n-radio :value="4" class="priority-option">
                <n-tag type="success" size="small" :bordered="false">不重要</n-tag>
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <!-- 修改时间选择器的绑定 -->
        <!-- 修改后的时间选择器 -->
        <n-form-item label="开始时间" path="startTime">
          <n-date-picker v-model:value="newTask.startTime" clearable placeholder="请选择日期和时间" type="datetime"
            format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
        </n-form-item>

        <n-form-item label="截止时间" path="endTime">
          <n-date-picker v-model:value="newTask.endTime" clearable placeholder="请选择日期和时间" type="datetime"
            format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
        </n-form-item>
        <n-form-item label="标签" path="tags">
          <n-dynamic-tags v-model:value="newTask.tags" :max="5" placeholder="输入标签，按回车添加" />
          <!-- 使用计算属性，不需要 v-model 和 :value -->
          <input type="hidden" :value="tagsArrayToString(newTaskTagsArray)" />
        </n-form-item>

        <n-form-item label="提醒" path="reminder">
          <n-switch v-model:value="newTask.reminder" />
          <span style="margin-left: 8px; font-size: 12px; color: #666;">
            在截止时间前提醒我
          </span>
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 左侧抽屉 -->
    <n-drawer v-model:show="drawerVisible" placement="left" width="240"
      :style="{ backgroundColor: isDark ? '#1a1d24' : '#fff' }">
      <n-drawer-content title="" closable @close="drawerVisible = false">
        <!-- 用户信息区域 -->
        <div class="user-info">
          <n-avatar round size="large" :src="userInfo.avatar" class="user-avatar" />
          <div class="user-details">
            <n-text strong class="username">{{ userInfo.username }}</n-text>
            <n-text depth="3" class="user-email">{{ userInfo.email }}</n-text>
            <n-tag size="small" type="success" round class="user-status">在线</n-tag>
          </div>
        </div>

        <!-- 菜单列表 -->
        <n-menu :options="menuOptions" :value="activeMenu" @update:value="handleMenuSelect" class="side-menu" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, h, watch } from 'vue';
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
  NModal,
  NForm,
  NFormItem,
  NRadioGroup,
  NRadio,
  NSwitch,
  useMessage
} from 'naive-ui';
import { useRouter } from 'vue-router';
import service from '../../utils/request';

const message = useMessage();
const router = useRouter()

// 主题状态
const isDark = ref(false);

// 抽屉状态
const drawerVisible = ref(false);
const activeMenu = ref('dashboard');
const taskListRef = ref(null);
const draggedIndex = ref(-1)
const dragOverIndex = ref(-1)
const isDragging = ref(false)

// 模态框状态
const showAddModal = ref(false)
const formRef = ref(null)

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
    label: '我的文件',
    key: '/resources',
    icon: () => h('span', { class: 'menu-icon' }, '📁')
  },
  {
    label: '个人中心',
    key: '/userManage',
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
const todayTasks = ref([]);

// 任务详情展开状态
const expandedTaskId = ref(null);

// 切换任务详情展开状态
const toggleTaskDetail = (task) => {
  if (expandedTaskId.value === task.id) {
    expandedTaskId.value = null;
  } else {
    expandedTaskId.value = task.id;
  }
};

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
  return todayTasks.value.filter(task => task.completed || task.isCompleted).length;
});

// 切换抽屉
const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value;
};

// 菜单选择处理
const handleMenuSelect = (key) => {

  activeMenu.value = key;
  router.push(key)
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

// 新任务表单数据
const newTask = reactive({
  title: '',
  content: '',
  priority: 3, // 默认为一般优先级
  startTime: null,
  endTime: null,
  tags: [], // 字符串格式
  reminder: false,
});

// 工具函数：将标签数组转换为字符串
const tagsArrayToString = (tagsArray) => {
  if (!tagsArray || tagsArray.length === 0) {
    return "";
  }
  return "-|" + tagsArray.join("-|");
};

// 工具函数：将标签字符串转换为数组
const tagsStringToArray = (tagsString) => {
  if (!tagsString || tagsString.trim() === "") {
    return [];
  }
  // 分割并过滤空值
  return tagsString.split("-|")
    .filter(tag => tag.trim() !== "")
    .map(tag => tag.trim());
};

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 1, max: 50, message: '标题长度在1-50个字符', trigger: 'blur' }
  ],
  content: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ],
  priority: [
    { required: true, type: 'number', message: '请选择优先级', trigger: 'change' }
  ]
};

// 格式化时间
// 格式化时间
const formatTaskTime = (time) => {
  if (!time) return '全天';

  // 如果是 Date 对象
  if (time instanceof Date) {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // 如果是字符串
  if (typeof time === 'string') {
    // 提取时间部分
    const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      const hours = match[1].padStart(2, '0');
      const minutes = match[2].padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  return '全天';
};
// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取优先级类型
const getPriorityType = (priority) => {
  switch (priority) {
    case 1: return 'error';
    case 2: return 'warning';
    case 3: return 'info';
    case 4: return 'success';
    default: return 'info';
  }
};

// 获取优先级文本
const getPriorityText = (priority) => {
  switch (priority) {
    case 1: return '紧急';
    case 2: return '重要';
    case 3: return '一般';
    case 4: return '不重要';
    default: return '一般';
  }
};

// 添加任务
const handleAddTask = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        const newTaskData = {
          title: newTask.title,
          content: newTask.content,
          priority: newTask.priority,
          startTime: newTask.startTime,
          endTime: newTask.endTime,
          tags: tagsArrayToString(newTask.tags), // 保持字符串格式
          userId: u.id
        };
        console.log(newTask)
        console.log('提交的任务数据:', newTaskData);

        // 调用API
        const response = await service.post("/api/user/task/add", newTaskData);


        if (response.code == 200) {

          // 为前端显示添加额外字段
          loadTasks();

          // 重置表单
          resetForm();

  

          // 关闭模态框
          showAddModal.value = false;

          message.success('任务添加成功');
        } else {
          message.error(response.data?.message || '添加任务失败');
        }
      } catch (error) {
        message.error('添加失败：');
      }
    } else {
      message.error('请填写完整信息');
    }
  });
};

// 重置表单
// 重置表单
const resetForm = () => {
  newTask.title = "";
  newTask.content = "";
  newTask.priority = 3;
  newTask.startTime = null;
  newTask.endTime = null;
  newTask.tags = [];
  newTask.reminder = false;
};

// 删除任务
const removeTask = async (taskId) => {
  try {
    const response = await service.get(`/api/user/task/delete/${taskId}`);
    if (response.code == 200) {
      todayTasks.value = todayTasks.value.filter(task => task.id !== taskId);
      message.success('任务已删除');
    } else {
      message.error(response.data?.message || '删除失败');
    }
  } catch (error) {
    message.error('删除失败：' + error.message);
  }
};

// 清除已完成任务
const clearCompleted = async () => {
  const completedTasks = todayTasks.value.filter(task => task.completed || task.isCompleted);
  if (completedTasks.length === 0) {
    message.info('没有已完成的任务');
    return;
  }

  try {
    // // 可以批量删除，这里简单处理为逐个删除
    // for (const task of completedTasks) {
    //   await service.delete(`/api/user/task/delete/${task.id}`);
    // }

    const initialLength = todayTasks.value.length;
    todayTasks.value = todayTasks.value.filter(task => !(task.completed || task.isCompleted));
    const removedCount = initialLength - todayTasks.value.length;
    message.success(`已清除 ${removedCount} 个已完成任务`);
  } catch (error) {
    message.error('清除失败：' + error.message);
  }
};

// 拖拽相关函数
const handleDragStart = (event, index) => {
  draggedIndex.value = index
  isDragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index)
  event.currentTarget.style.opacity = '0.5'
  event.currentTarget.classList.add('dragging')
}

const handleDragOver = (event, index) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  if (dragOverIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const handleDragEnter = (event, index) => {
  event.preventDefault()
  if (draggedIndex.value === index) return
  event.currentTarget.classList.add('drag-over')
}

const handleDragLeave = (event) => {
  event.currentTarget.classList.remove('drag-over')
}

const handleDrop = (event, dropIndex) => {
  event.preventDefault()
  event.stopPropagation()

  if (draggedIndex.value === -1 || draggedIndex.value === dropIndex) {
    resetDragState()
    return
  }

  // 重新排序
  const newTasks = [...todayTasks.value]
  const draggedItem = newTasks[draggedIndex.value]

  newTasks.splice(draggedIndex.value, 1)
  newTasks.splice(dropIndex, 0, draggedItem)

  todayTasks.value = newTasks
  saveTaskOrder(newTasks)
  resetDragState()
}

const handleDragEnd = (event) => {
  resetDragState()
  event.currentTarget.style.opacity = '1'
  event.currentTarget.classList.remove('dragging')
  const items = document.querySelectorAll('.task-item')
  items.forEach(item => item.classList.remove('drag-over'))
}

const resetDragState = () => {
  draggedIndex.value = -1
  dragOverIndex.value = -1
  isDragging.value = false
}

const saveTaskOrder = async (tasks) => {
  try {
    const orderData = tasks.map((task, index) => ({
      id: task.id,
      order: index
    }))
    console.log('保存任务顺序:', orderData)
    // 如果需要保存到后端，可以调用API
    // await service.post("/api/user/task/updateOrder", orderData)
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存任务顺序失败')
  }
}

// 拖拽手柄图标
const DragHandleIcon = {
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '16',
        height: '16',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        style: {
          cursor: 'grab',
          opacity: '0.4',
          transition: 'opacity 0.2s',
          marginRight: '8px',
          flexShrink: '0'
        },
        onMouseenter(e) {
          e.target.style.opacity = '0.7'
        },
        onMouseleave(e) {
          e.target.style.opacity = '0.4'
        }
      },
      [
        h('circle', { cx: '9', cy: '5', r: '1' }),
        h('circle', { cx: '9', cy: '12', r: '1' }),
        h('circle', { cx: '9', cy: '19', r: '1' }),
        h('circle', { cx: '15', cy: '5', r: '1' }),
        h('circle', { cx: '15', cy: '12', r: '1' }),
        h('circle', { cx: '15', cy: '19', r: '1' })
      ]
    )
  }
}

// 图标组件
const CalendarIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
      h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
      h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
    ])
  }
}

const ClockIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
}

const TagIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' }),
      h('line', { x1: '7', y1: '7', x2: '7.01', y2: '7' })
    ])
  }
}

// 加载任务
// 加载任务
const loadTasks = async () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    const response = await service.get(`/api/user/task/get_all/${u.id}`);

    if (response.data && Array.isArray(response.data)) {
      // 处理数据
      todayTasks.value = response.data.map(task => {
        // 确保有默认值
        return {
          ...task,
          completed: task.isCompleted || false,
          tags: task.tags || '',
          startTime: task.startTime || '',
          endTime: task.endTime || '',
          priority: task.priority || 3,
          // 为前端显示添加字段
          tagsArray: tagsStringToArray(task.tags || ''),
          priorityText: getPriorityText(task.priority || 3)
        };
      });
      console.log('加载任务成功:', todayTasks.value);
    } else {
      todayTasks.value = [];
    }
  } catch (error) {
    console.error('加载任务失败:', error);
    message.error("网络异常！");
  }
};

//
const handleComplete = async (id) => {
  // console.log(id)
  const response = await service.get(`/api/user/task/achieve/${id}`);
  if(response.code == 200){
    
  }else{
    message.error("网络异常！")
  }
} 

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  router.push("/login");
  message.success("退出登录成功");
};

// 初始化
onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light';
  isDark.value = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  const u = JSON.parse(localStorage.getItem("user"));
  if (u) {
    userInfo.avatar = u.avatarUrl || "https://ts2.tc.mm.bing.net/th/id/OIP-C._MolZc9ybWaQGJMZP3FrzgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3";
    userInfo.username = u.username;
    userInfo.email = u.email;
    loadTasks();
  } else {
    router.push("/login");
  }
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
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* 隐藏滚动条 */
.main-content::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
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
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 300px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.task-list::-webkit-scrollbar {
  display: none;
}

/* 任务项基础样式 */
.task-item {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--n-color-embedded);
  border: 1px solid var(--n-border-color);
  transition: all 0.3s ease;
  cursor: move;
  user-select: none;
}

.task-item:hover {
  border-color: var(--n-primary-color);
  box-shadow: 0 2px 8px var(--n-box-shadow-2);
  transform: translateY(-1px);
}

/* 拖拽时样式 */
.task-item.dragging {
  opacity: 0.5;
  border-color: var(--n-primary-color);
  box-shadow: 0 4px 16px var(--n-box-shadow-3);
  transform: rotate(2deg);
  z-index: 10;
}

/* 拖拽目标样式 */
.task-item.drag-over {
  border-top: 2px solid var(--n-primary-color);
  border-top-style: dashed;
  margin-top: 2px;
}

/* 拖拽指示线 */
.task-item.drag-over::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background-color: var(--n-primary-color);
  border-radius: 1px;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-title.completed {
  text-decoration: line-through;
  color: var(--n-text-color-disabled);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.task-checkbox {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.task-time {
  font-size: 12px;
  min-width: 80px;
  text-align: right;
  flex-shrink: 0;
}

.task-priority {
  cursor: pointer;
  flex-shrink: 0;
}

.task-progress {
  margin-top: 4px;
}

/* 拖拽手柄悬停效果 */
.task-item:hover .drag-handle svg {
  opacity: 0.7;
}

/* 禁用选择文本 */
.task-list * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 拖拽时的占位符 */
.task-item.sortable-ghost {
  opacity: 0.3;
  background-color: var(--n-primary-color-hover);
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
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.n-drawer .n-drawer-content-wrapper::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

/* 任务项样式 */
.task-item {
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.task-item:hover {
  background-color: #f9f9f9;
}

/* 任务详情展开区域样式 */
.task-detail-expanded {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
  animation: slideDown 0.3s ease;
}

.task-detail-content h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
}

.task-detail-meta {
  margin-top: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #666;
}

.detail-item .n-icon {
  margin-right: 8px;
  color: #999;
}

.task-detail-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }

  to {
    opacity: 1;
    max-height: 300px;
  }
}
</style>