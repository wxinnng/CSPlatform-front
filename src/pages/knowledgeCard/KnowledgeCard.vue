<template>
  <n-layout class="knowledge-library">
    <!-- 使用 sticky 替代 affix -->
    <n-layout-header class="library-header" bordered>
      <n-space class="header-content" justify="space-between" align="center">
        <n-gradient-text type="info" :size="22" class="header-title">
          知识卡片库
        </n-gradient-text>

        <n-space :size="12" class="header-controls">
          <n-input-group class="search-group">
            <n-input v-model:value="searchKeyword" placeholder="搜索卡片集..." clearable round style="width: 200px">
              <template #prefix>
                <n-icon><search-icon /></n-icon>
              </template>
            </n-input>
          </n-input-group>

          <n-select v-model:value="selectedCategory" :options="categoryOptions" placeholder="全部分类" style="width: 120px"
            clearable />

          <n-button type="error" @click="handleMyCard" round size="small">
            查看我的卡片
          </n-button>

          <n-button type="primary" @click="handleCreate" round size="small">
           
            新建卡片集
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>

    <!-- 内容区域 -->
    <n-layout-content class="library-content">
      <!-- 快速筛选 -->
      <n-card class="filter-card" :bordered="false">
        <template #header>
          <n-space :size="20" align="center">
            <n-space :size="8">
              <n-tag v-for="tag in quickTags" :key="tag.value" :type="selectedTag === tag.value ? 'primary' : 'default'"
                checkable round size="small" @click="handleTagClick(tag.value)">
                {{ tag.label }}
              </n-tag>
            </n-space>

            <n-select v-model:value="sortBy" :options="sortOptions" style="width: 140px" size="small" clearable />
          </n-space>
        </template>
      </n-card>

      <!-- 卡片网格 -->
      <n-grid :x-gap="16" :y-gap="16" :cols="4" responsive="screen" class="cards-grid">
        <n-gi v-for="card in paginatedCards" :key="card.id" :span="1" class="card-item">
          <n-card :title="card.title" :bordered="false" size="small" class="knowledge-card" hoverable
            @click="handleCardClick(card)">
            <!-- 封面区域 -->
            <template #cover>
              <div class="card-cover">
                <n-image v-if="card.coverUrl" :src="card.coverUrl" :alt="card.title" class="cover-image"
                  object-fit="cover" preview-disabled />
                <n-space v-else class="cover-placeholder" justify="center" align="center" vertical>
                  <n-icon size="36" depth="3">
                    <image-icon />
                  </n-icon>
                  <n-text depth="3" class="placeholder-text">暂无封面</n-text>
                </n-space>
                <div class="cover-overlay">
                  <n-tag size="small" :bordered="false" type="primary">
                    {{ card.category }}
                  </n-tag>
                </div>
              </div>
            </template>

            <!-- 卡片内容 -->
            <div class="card-content">
              <n-ellipsis :line-clamp="3" class="card-description">
                {{ card.description }}
              </n-ellipsis>

              <!-- 统计信息 -->
              <n-space :size="12" class="card-stats">
                <n-space :size="4" align="center">
                  <n-icon size="12" depth="3"><card-icon /></n-icon>
                  <n-text depth="3" class="stat-text">{{ card.cardNum }} 卡片</n-text>
                </n-space>
                <n-space :size="4" align="center">
                  <n-icon size="12" depth="3"><study-icon /></n-icon>
                  <n-text depth="3" class="stat-text">{{ card.learningNum }} 学习</n-text>
                </n-space>
                <n-space :size="4" align="center">
                  <n-icon size="12" depth="3"><time-icon /></n-icon>
                  <n-text depth="3" class="stat-text">{{ formatTime(card.updateTime) }}</n-text>
                </n-space>
              </n-space>
            </div>

            <!-- 卡片操作 -->
            <template #action>
              <n-space :size="8" justify="space-between">
                <n-button size="tiny" tertiary @click.stop="handleShare(card)">
                  分享
                </n-button>
                <n-button size="tiny" type="primary" @click.stop="handleStudy(card)">
                  开始学习
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- 空状态 -->
      <n-empty v-if="filteredCards.length === 0" description="暂无知识卡片" class="empty-state">
        <template #extra>
          <n-button type="primary" @click="handleCreate" round>
            创建第一个卡片集
          </n-button>
        </template>
      </n-empty>

      <!-- 分页 -->
      <div v-if="filteredCards.length > 0" class="pagination-section">
        <n-pagination v-model:page="currentPage" :page-size="pageSize" :item-count="filteredCards.length"
          show-size-picker :page-sizes="[12, 24, 48]" @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange" />
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NGradientText,
  NCard,
  NGrid,
  NGi,
  NInput,
  NInputGroup,
  NSelect,
  NButton,
  NIcon,
  NSpace,
  NTag,
  NEllipsis,
  NEmpty,
  NPagination,
  NImage,
  NText,
  useMessage
} from 'naive-ui'

//router
const router = useRouter()

// 图标组件
const SearchIcon = { template: '🔍' }
const AddIcon = { template: '➕' }
const ImageIcon = { template: '🖼️' }
const CardIcon = { template: '📋' }
const StudyIcon = { template: '📚' }
const TimeIcon = { template: '⏰' }

const message = useMessage()

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref(null)
const selectedTag = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(12)

// 模拟数据
const knowledgeCards = ref([
  {
    id: 1,
    title: 'Vue 3 高级技巧',
    description: '深入学习 Vue 3 的组合式 API 和高级特性，掌握现代前端开发技术，包括响应式原理、组件通信等核心概念。',
    category: '前端',
    tags: ['Vue', 'JavaScript', '前端框架'],
    coverUrl: 'https://picsum.photos/400/250?random=1',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-10',
    updateTime: '2026-01-10'
  },
  {
    id: 2,
    title: 'TypeScript 类型系统',
    description: '全面掌握 TypeScript 的类型系统和高级类型编程技巧，提升代码质量和开发效率。',
    category: '前端',
    tags: ['TypeScript', '类型系统'],
    coverUrl: null,
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-09',
    updateTime: '2026-01-09'
  },
  {
    id: 3,
    title: 'React Hooks 完全指南',
    description: '掌握 React Hooks 的各种用法，包括自定义 Hook 和最佳实践，提升 React 开发效率。',
    category: '前端',
    tags: ['React', 'Hooks', '前端框架'],
    coverUrl: 'https://picsum.photos/400/250?random=2',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-08',
    updateTime: '2026-01-08'
  },
  {
    id: 4,
    title: 'Python 数据分析实战',
    description: '使用 Python 进行数据分析的实战技巧，涵盖 Pandas、NumPy、Matplotlib 等核心库的使用。',
    category: '数据科学',
    tags: ['Python', '数据分析', 'Pandas'],
    coverUrl: 'https://picsum.photos/400/250?random=3',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-07',
    updateTime: '2026-01-07'
  },
  {
    id: 5,
    title: 'Docker 容器化部署',
    description: '学习 Docker 容器化技术的原理和实践，掌握微服务架构下的容器化部署方案。',
    category: '后端',
    tags: ['Docker', '容器化', 'DevOps'],
    coverUrl: null,
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-06',
    updateTime: '2026-01-06'
  },
  {
    id: 6,
    title: 'Node.js 高性能编程',
    description: '深入理解 Node.js 的事件循环、异步编程和高性能服务器开发的最佳实践。',
    category: '后端',
    tags: ['Node.js', 'JavaScript', '后端'],
    coverUrl: 'https://picsum.photos/400/250?random=4',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-05',
    updateTime: '2026-01-05'
  },
  {
    id: 7,
    title: '机器学习基础',
    description: '机器学习的基本概念和常用算法，包括监督学习、无监督学习和深度学习的基础知识。',
    category: '数据科学',
    tags: ['机器学习', 'AI', '算法'],
    coverUrl: 'https://picsum.photos/400/250?random=5',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-04',
    updateTime: '2026-01-04'
  },
  {
    id: 8,
    title: 'CSS 现代布局技巧',
    description: '掌握 CSS Grid、Flexbox 等现代布局技术，实现响应式设计和复杂页面布局。',
    category: '前端',
    tags: ['CSS', '布局', '前端开发'],
    coverUrl: null,
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-03',
    updateTime: '2026-01-03'
  },
  {
    id: 9,
    title: 'MySQL 数据库优化',
    description: 'MySQL 数据库的性能优化技巧，包括索引优化、查询优化和服务器配置调优。',
    category: '后端',
    tags: ['MySQL', '数据库', '优化'],
    coverUrl: 'https://picsum.photos/400/250?random=6',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-02',
    updateTime: '2026-01-02'
  },
  {
    id: 10,
    title: '微服务架构设计',
    description: '微服务架构的设计原则、模式和实践，包括服务拆分、通信机制和部署策略。',
    category: '后端',
    tags: ['微服务', '架构', '分布式'],
    coverUrl: 'https://picsum.photos/400/250?random=7',
    cardNum: 156,
    learningNum: 1234,
    status: 'published',
    createTime: '2026-01-01',
    updateTime: '2026-01-01'
  }
])

// 筛选选项
const categoryOptions = [
  { label: '前端开发', value: '前端' },
  { label: '后端开发', value: '后端' },
  { label: '数据科学', value: '数据科学' }
]

const quickTags = [
  { label: '全部', value: 'all' },
  { label: '热门', value: 'hot' },
  { label: '最新', value: 'new' }
]

const sortOptions = [
  { label: '最新创建', value: 'newest' },
  { label: '最多学习', value: 'popular' },
  { label: '卡片数量', value: 'count' }
]

// 计算属性
const filteredCards = computed(() => {
  let filtered = knowledgeCards.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(card =>
      card.title.toLowerCase().includes(keyword) ||
      card.description.toLowerCase().includes(keyword) ||
      card.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(card => card.category === selectedCategory.value)
  }

  // 快速标签筛选
  if (selectedTag.value === 'hot') {
    filtered = filtered.filter(card => card.studyCount > 1000)
  } else if (selectedTag.value === 'new') {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    filtered = filtered.filter(card => new Date(card.createTime) > sevenDaysAgo)
  }

  return [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.studyCount - a.studyCount
      case 'count':
        return b.cardCount - a.cardCount
      default:
        return new Date(b.createTime) - new Date(a.createTime)
    }
  })
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCards.value.slice(start, end)
})

// 方法
const handleTagClick = (tag) => {
  selectedTag.value = tag
  currentPage.value = 1
}

const handleCardClick = (card) => {
  message.info(`查看卡片集: ${card.title}`)
  // 在实际项目中，这里可以跳转到卡片详情页
  // router.push(`/knowledge/${card.id}`)
}

const handleCreate = () => {
  message.info('创建新卡片集')
  // 在实际项目中，这里可以打开创建模态框或跳转到创建页面
}

const handleMyCard = () => {
  //跳转
  router.push("/userManage")
}

const handleShare = (card) => {
  message.info(`分享卡片集: ${card.title}`)
  // 在实际项目中，这里可以打开分享模态框
}

const handleStudy = (card) => {
  message.success(`开始学习: ${card.title}`)
  // 在实际项目中，这里可以跳转到学习页面
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  const today = new Date()
  const diffTime = Math.abs(today - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays <= 7) return `${diffDays}天前`

  return date.toLocaleDateString('zh-CN')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

onMounted(() => {
  console.log('Knowledge library mounted')
})
</script>

<style lang="scss" scoped>
.knowledge-library {
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  .library-header {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e2e8f0;
    padding: 12px 24px;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .header-title {
      margin-left: 100px;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }
}

.header-title {
  margin-left: 25%;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.library-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 24px;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.cards-grid {
  margin-top: 16px;
}

.knowledge-card {
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .card-cover {
    position: relative;
    height: 140px;
    overflow: hidden;
    border-radius: 6px 6px 0 0;

    .cover-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .cover-placeholder {
      height: 100%;
      background: #f1f5f9;
    }

    .cover-overlay {
      position: absolute;
      top: 8px;
      left: 8px;
    }
  }

  .card-content {
    padding: 12px;
    flex: 1;

    .card-description {
      color: #64748b;
      line-height: 1.5;
      margin-bottom: 12px;
      min-height: 66px;
      font-size: 13px;
    }

    .card-stats {
      .stat-text {
        font-size: 11px;
        color: #94a3b8;
      }
    }
  }
}

.empty-state {
  margin: 60px 0;
  text-align: center;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 16px 0;
}

// 响应式设计
@media (max-width: 1200px) {
  .sticky-header .library-header {
    padding: 12px 20px;
  }

  .library-content {
    padding: 20px;
  }

  .cards-grid {
    :deep(.n-grid) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@media (max-width: 900px) {
  .cards-grid {
    :deep(.n-grid) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .header-controls {
    flex-wrap: wrap;
    justify-content: flex-end;

    .search-group,
    .n-select {
      margin-bottom: 8px;
    }
  }
}

@media (max-width: 768px) {
  .sticky-header .library-header {
    padding: 10px 16px;
  }

  .library-content {
    padding: 16px;
  }

  .cards-grid {
    :deep(.n-grid) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .header-title {
    font-size: 20px !important;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;

    .search-group {
      width: 100%;
      margin-bottom: 8px;

      .n-input {
        width: 100%;
      }
    }

    .n-select {
      flex: 1;
    }
  }
}

@media (max-width: 480px) {
  .sticky-header .library-header {
    padding: 8px 12px;
  }

  .library-content {
    padding: 12px;
  }

  .header-title {
    font-size: 18px !important;
  }

  .header-controls {
    flex-direction: column;
    align-items: stretch;

    .search-group,
    .n-select {
      width: 100%;
      margin-bottom: 8px;
    }

    .n-button {
      width: 100%;
      margin-top: 4px;
    }
  }
}
</style>