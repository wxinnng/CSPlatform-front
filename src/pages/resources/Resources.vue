<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-layout class="resources-container">
      <!-- 顶部导航栏 -->
      <n-layout-header bordered class="header">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <!-- 动态面包屑导航 -->
            <n-breadcrumb>
              <n-breadcrumb-item @click="goToRoot">首页</n-breadcrumb-item>
              <n-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index" @click="goToPath(index)">
                {{ crumb.name }}
              </n-breadcrumb-item>
              <n-breadcrumb-item v-if="currentFolder">我的网盘</n-breadcrumb-item>
            </n-breadcrumb>
          </n-space>
          <n-space align="center">
            <n-input v-model:value="searchValue" placeholder="搜索文件..." clearable class="search-input">
              <template #prefix>
                <n-icon>
                  <SearchIcon />
                </n-icon>
              </template>
            </n-input>
            <n-button-group>
              <n-button @click="changeView('list')" :type="viewType === 'list' ? 'primary' : 'default'">
                <template #icon>
                  <n-icon>
                    <ListIcon />
                  </n-icon>
                </template>
                列表视图
              </n-button>
              <n-button @click="changeView('grid')" :type="viewType === 'grid' ? 'primary' : 'default'">
                <template #icon>
                  <n-icon>
                    <GridIcon />
                  </n-icon>
                </template>
                网格视图
              </n-button>
            </n-button-group>
          </n-space>
        </n-space>
      </n-layout-header>

      <n-layout has-sider class="main-layout">
        <!-- 左侧边栏 -->
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
          show-trigger @collapse="collapsed = true" @expand="collapsed = false" class="sider">
          <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions"
            v-model:value="activeMenu" @update:value="handleMenuChange" />

          <!-- 存储空间使用情况 -->
          <n-card size="small" :bordered="false" class="storage-card">
            <template #header>
              <n-space vertical align="center" :size="[8, 0]">
                <n-text class="storage-title">存储空间</n-text>
              </n-space>
            </template>
            <n-space vertical align="center" :size="[12, 0]">
              <n-progress type="circle" :percentage="storageUsage" :stroke-width="6" :width="52" :height="52"
                :status="storageUsage > 90 ? 'error' : storageUsage > 70 ? 'warning' : 'success'" />
              <n-text depth="3" class="storage-info">
                {{ formatFileSize(usedStorage) }} / {{ formatFileSize(totalStorage) }}
              </n-text>
              <n-button size="tiny" type="primary" ghost class="storage-btn">扩容</n-button>
            </n-space>
          </n-card>
        </n-layout-sider>

        <!-- 主内容区 -->
        <n-layout-content class="content">
          <!-- 操作工具栏 -->
          <n-card size="small" class="toolbar-card">
            <n-space justify="space-between" align="center">
              <n-space>
                <n-button @click="handleUpload" type="primary">
                  <template #icon>
                    <n-icon>
                      <CloudUploadOutline />
                    </n-icon>
                  </template>
                  上传文件
                </n-button>
                <n-button @click="handleNewFolder">
                  <template #icon>
                    <n-icon>
                      <AddCircleOutline />
                    </n-icon>
                  </template>
                  新建文件夹
                </n-button>
                <n-button :disabled="selectedFiles.length === 0" @click="handleDownload">
                  <template #icon>
                    <n-icon>
                      <DownloadOutline />
                    </n-icon>
                  </template>
                  下载
                </n-button>
                <n-button :disabled="selectedFiles.length === 0" @click="handleDelete">
                  <template #icon>
                    <n-icon>
                      <TrashOutline />
                    </n-icon>
                  </template>
                  删除
                </n-button>
                <n-button :disabled="selectedFiles.length === 0" @click="handleShare">
                  <template #icon>
                    <n-icon>
                      <ShareSocialOutline />
                    </n-icon>
                  </template>
                  分享
                </n-button>
                <n-button :disabled="selectedFiles.length === 0" @click="handlePreview" type="info">
                  <template #icon>
                    <n-icon>
                      <EyeOutline />
                    </n-icon>
                  </template>
                  预览
                </n-button>
                <!-- 返回上级按钮 -->
                <n-button v-if="currentFolder || breadcrumbs.length > 0" @click="goBack" type="default">
                  <template #icon>
                    <n-icon>
                      <ArrowBackOutline />
                    </n-icon>
                  </template>
                  返回上级
                </n-button>
              </n-space>

              <n-space>
                <n-dropdown :options="sortOptions" @select="handleSortChange">
                  <n-button>
                    <template #icon>
                      <n-icon>
                        <FilterOutline />
                      </n-icon>
                    </template>
                    排序: {{ getSortLabel(sortBy) }}
                  </n-button>
                </n-dropdown>
                <n-button @click="refreshFiles" circle>
                  <template #icon>
                    <n-icon>
                      <RefreshOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </n-space>
          </n-card>

          <!-- 加载状态 -->
          <n-spin :show="isLoading" class="loading-spin">
            <n-card class="files-card">
              <!-- 网格视图 -->
              <div v-if="viewType === 'grid'" class="grid-view">
                <n-grid :cols="gridCols" :x-gap="16" :y-gap="16" responsive="screen">
                  <n-gi v-for="file in currentFiles" :key="file.fileId">
                    <n-card :class="['file-card', { 'selected': selectedFiles.includes(file.fileId) }]"
                      @click="toggleFileSelection(file.fileId)" @dblclick="handleFileDblClick(file)" hoverable
                      size="small">
                      <div class="file-card-content">
                        <div class="file-icon-container">
                          <n-icon :size="36" :color="getFileIconColor(getFileType(file.fileCategory))"
                            class="file-icon">
                            <component :is="getFileIcon(getFileType(file.fileCategory))" />
                          </n-icon>
                          <div v-if="file.fileCategory !== 4" class="file-extension">
                            {{ getFileExtension(file.fileName) }}
                          </div>
                        </div>

                        <div class="file-info">
                          <n-ellipsis class="file-name" :line-clamp="1">{{ file.fileName }}</n-ellipsis>
                          <n-space vertical class="file-meta">
                            <n-text depth="1" class="file-size">{{ formatFileSize(file.fileSize) }}</n-text>
                            <n-text depth="3" class="file-date">{{ formatDate(file.createTime) }}</n-text>
                          </n-space>
                        </div>

                        <div class="file-actions" @click.stop>
                          <n-space vertical size="small">
                            <n-button circle size="tiny" type="primary" ghost @click="handleDownloadSingle(file)">
                              <n-icon>
                                <DownloadOutline />
                              </n-icon>
                            </n-button>
                            <n-button circle size="tiny" type="info" ghost @click="handlePreviewSingle(file)">
                              <n-icon>
                                <EyeOutline />
                              </n-icon>
                            </n-button>
                            <n-button circle size="tiny" type="success" ghost @click="handleShareSingle(file)">
                              <n-icon>
                                <ShareSocialOutline />
                              </n-icon>
                            </n-button>
                          </n-space>
                        </div>
                      </div>

                      <div v-if="selectedFiles.includes(file.fileId)" class="selection-indicator">
                        <n-icon color="#18a058" size="16">
                          <CheckmarkCircleOutline />
                        </n-icon>
                      </div>
                    </n-card>
                  </n-gi>
                </n-grid>
                <!-- 空状态 -->
                <div v-if="currentFiles.length === 0" style="margin-top: 15%;" class="empty-state">
                  <n-empty description="当前文件夹为空">
                    <template #icon>
                      <n-icon>
                        <FolderOpenOutline />
                      </n-icon>
                    </template>
                  </n-empty>
                </div>
              </div>

              <!-- 列表视图 -->
              <n-data-table v-else :columns="columns" :data="currentFiles" :row-class-name="getRowClass"
                :row-props="getRowProps" @dblclick="handleRowDblClick" v-model:checked-row-keys="selectedFiles" />
            </n-card>
          </n-spin>
        </n-layout-content>
      </n-layout>

      <!-- 上传模态框 -->
      <n-modal v-model:show="showUploadModal">
        <n-card style="width: 600px" title="上传文件" :bordered="false" size="huge">
          <n-upload ref="uploadRef" multiple directory-dnd :max="10" :before-upload="handleBeforeUpload"
            @change="handleFileChange" @finish="handleUploadFinish" @error="handleUploadError" :show-file-list="false">
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <ArchiveOutline />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
            </n-upload-dragger>
          </n-upload>

          <!-- 上传文件列表和进度 -->
          <div v-if="uploadTasks.length > 0" style="margin-top: 20px;">
            <n-list bordered>
              <n-list-item v-for="task in uploadTasks" :key="task.id">
                <template #suffix>
                  <n-space v-if="task.status !== 'uploading'">
                    <n-button v-if="task.status === 'failed'" text @click="retryUpload(task)" type="primary"
                      size="small">
                      重试
                    </n-button>
                    <n-button text @click="removeUploadTask(task.id)" type="error" size="small"
                      :disabled="!canRemoveFile(task)">
                      移除
                    </n-button>
                  </n-space>
                  <n-text v-else depth="3" style="font-size: 12px;">
                    上传中...
                  </n-text>
                </template>
                <n-space vertical style="width: 100%">
                  <n-space justify="space-between" align="center">
                    <n-space align="center">
                      <n-icon>
                        <component :is="getUploadFileIcon(task.file.name)" />
                      </n-icon>
                      <n-text>{{ task.file.name }}</n-text>
                    </n-space>
                    <n-text depth="3" style="font-size: 12px">
                      {{ formatFileSize(task.file.size) }}
                    </n-text>
                  </n-space>

                  <!-- 上传进度 -->
                  <div v-if="task.status === 'uploading'">
                    <n-space vertical :size="8">
                      <n-progress type="line" :percentage="task.progress" :indicator-placement="'inside'" :height="8"
                        :status="getProgressStatus(task)">
                        {{ Math.round(task.progress) }}%
                      </n-progress>
                      <n-text depth="3" style="font-size: 12px">
                        {{ task.statusText }}
                      </n-text>
                    </n-space>
                  </div>

                  <!-- 状态指示器 -->
                  <div v-else style="text-align: right;">
                    <n-tag :type="getTagType(task.status)" size="small" :bordered="false">
                      {{ getStatusText(task.status) }}
                    </n-tag>
                    <n-text v-if="task.error" depth="3" style="font-size: 12px; margin-left: 8px;">
                      {{ task.error }}
                    </n-text>
                  </div>
                </n-space>
              </n-list-item>
            </n-list>
          </div>

          <n-space style="margin-top: 20px;" justify="end">
            <n-button @click="handleCancelUpload" :disabled="isUploading">
              取消
            </n-button>
            <n-button type="primary" @click="handleSubmit" :disabled="uploadTasks.length === 0 || isUploading"
              :loading="isUploading">
              {{ isUploading ? '上传中...' : '开始上传' }}
            </n-button>
          </n-space>
        </n-card>
      </n-modal>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, h, inject, onMounted, nextTick } from 'vue'
import { useMessage, useDialog, useLoadingBar } from 'naive-ui'
import {
  NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NSpace, NBreadcrumb, NBreadcrumbItem, NInput, NIcon, NButton, NButtonGroup,
  NDropdown, NMenu, NProgress, NText, NCard, NGrid, NGi, NEllipsis,
  NDataTable, NModal, NUpload, NUploadDragger, darkTheme, NList, NListItem, NTag,
  NSpin, NEmpty
} from 'naive-ui'

// 图标引入
import {
  SearchOutline as SearchIcon, ListOutline as ListIcon, GridOutline as GridIcon,
  CloudUploadOutline, AddCircleOutline, DownloadOutline, TrashOutline,
  ShareSocialOutline, RefreshOutline, FilterOutline, ArchiveOutline,
  DocumentTextOutline, ImageOutline, VideocamOutline, MusicalNotesOutline,
  FolderOutline, AppsOutline, CheckmarkCircleOutline, EyeOutline,
  ArrowBackOutline, DocumentOutline, FolderOpenOutline, CloseCircleOutline, CodeOutline
} from '@vicons/ionicons5'

// 导入文件上传工具
import fileUtils from '../../utils/file.js'
import service from '../../utils/request.js'

// 从父组件接收主题状态
const globalTheme = inject('globalTheme')
const isDark = globalTheme || ref(false)

// 使用 Naive UI 的 message 和 dialog
const message = useMessage()
const dialog = useDialog()
const loadingBar = useLoadingBar()

// 响应式数据
const searchValue = ref('')
const viewType = ref('grid')
const collapsed = ref(false)
const activeMenu = ref('all')
const selectedFiles = ref([])
const showUploadModal = ref(false)
const sortBy = ref('name')
const storageUsage = ref(65)
const usedStorage = ref(65 * 1024 * 1024 * 1024)
const totalStorage = ref(100 * 1024 * 1024 * 1024)
const isLoading = ref(false)

// 文件夹导航相关状态
const currentFolder = ref(null)
const currentFolderInfo = ref(null)
const breadcrumbs = ref([])
const folderHistory = ref([])

// 上传相关状态
const uploadRef = ref(null)
const isUploading = ref(false)
const uploadTasks = ref([])

// 文件数据
const fileList = ref([])

// 计算当前主题
const currentTheme = computed(() => isDark.value ? darkTheme : null)
const gridCols = computed(() => '1 s:2 m:3 l:4 xl:5')

// 动态主题配置
const themeOverrides = computed(() => ({
  common: {
    primaryColor: isDark.value ? '#36ad6a' : '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    borderRadius: '8px'
  },
  Card: {
    borderRadius: '12px',
    borderColor: isDark.value ? '#46464a' : '#e0e0e0'
  },
  Layout: {
    headerColor: isDark.value ? '#1f1f1f' : '#ffffff',
    siderColor: isDark.value ? '#1a1a1a' : '#f7f7f7'
  }
}))

// 计算当前显示的文件列表
const currentFiles = computed(() => {
  let files = [...fileList.value]

  // 过滤搜索
  if (searchValue.value) {
    files = files.filter(file =>
      file.fileName.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  }

  // 过滤文件类型
  if (activeMenu.value !== 'all') {
    files = files.filter(file => {
      const fileType = getFileType(file.fileCategory)
      return fileType === activeMenu.value
    })
  }

  // 排序
  return [...files].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.fileName.localeCompare(b.fileName)
      case 'time': return new Date(b.createTime) - new Date(a.createTime)
      case 'size': return b.fileSize - a.fileSize
      case 'type': return a.fileCategory - b.fileCategory
      default: return 0
    }
  })
})
// 菜单选项
const menuOptions = [
  { label: '全部文件', key: 'all', icon: () => h(AppsOutline) },
  { label: '图片', key: 'image', icon: () => h(ImageOutline) },
  { label: '文档', key: 'document', icon: () => h(DocumentTextOutline) },
  { label: '视频', key: 'video', icon: () => h(VideocamOutline) },
  { label: '音频', key: 'audio', icon: () => h(MusicalNotesOutline) },
  { label: '回收站', key: 'trash', icon: () => h(TrashOutline) }
]

// 排序选项
const sortOptions = [
  { label: '按名称排序', key: 'name' },
  { label: '按时间排序', key: 'time' },
  { label: '按大小排序', key: 'size' },
  { label: '按类型排序', key: 'type' }
]

// 表格列定义
const columns = [
  { type: 'selection' },
  {
    title: '名称', key: 'fileName',
    render: (row) => h('div', { class: 'file-item' }, [
      h(NIcon, {
        size: 20,
        color: getFileIconColor(getFileType(row.fileCategory))
      }, () => h(getFileIcon(getFileType(row.fileCategory)))),
      h('span', { class: 'file-name' }, row.fileName)
    ])
  },
  {
    title: '大小',
    key: 'fileSize',
    render: (row) => row.fileCategory === 1 ? '--' : formatFileSize(row.fileSize)
  },
  { title: '修改时间', key: 'createTime', render: (row) => formatDate(row.createTime) },
  {
    title: '操作', key: 'actions',
    render: (row) => h(NSpace, {}, [
      h(NButton, {
        text: true,
        type: 'primary',
        onClick: () => handleDownloadSingle(row),
        disabled: row.fileCategory === 1
      }, '下载'),
      h(NButton, {
        text: true,
        type: 'info',
        onClick: () => handlePreviewSingle(row),
        disabled: row.fileCategory === 1
      }, '预览'),
      h(NButton, { text: true, type: 'success', onClick: () => handleShareSingle(row) }, '分享'),
      h(NButton, { text: true, type: 'error', onClick: () => handleDeleteSingle(row) }, '删除')
    ])
  }
]

// 文件夹导航方法
const enterFolder = async (folder) => {
  if (folder.fileCategory !== 4) return

  try {
    isLoading.value = true

    if (currentFolder.value) {
      folderHistory.value.push({
        id: currentFolder.value,
        info: currentFolderInfo.value
      })
    }

    currentFolder.value = folder.fileId
    currentFolderInfo.value = folder

    // 更新面包屑
    updateBreadcrumbs(folder)

    // 加载文件夹内容
    await loadFolder(folder.fileId)

    selectedFiles.value = []
  } catch (error) {
    console.error('进入文件夹失败:', error)
    message.error('加载文件夹失败')
  } finally {
    isLoading.value = false
  }
}

const goBack = async () => {
  if (folderHistory.value.length > 0) {
    try {
      isLoading.value = true
      const previous = folderHistory.value.pop()
      currentFolder.value = previous.id
      currentFolderInfo.value = previous.info

      // 更新面包屑
      updateBreadcrumbs(previous.info, true)

      // 加载文件夹内容
      await loadFolder(previous.id)
    } catch (error) {
      console.error('返回上一级失败:', error)
      message.error('加载失败')
    } finally {
      isLoading.value = false
    }
  } else {
    goToRoot()
  }
  selectedFiles.value = []
}

const goToRoot = async () => {
  try {
    isLoading.value = true
    currentFolder.value = null
    currentFolderInfo.value = null
    breadcrumbs.value = []
    folderHistory.value = []
    selectedFiles.value = []
    await loadRootFolder()
  } catch (error) {
    console.error('返回根目录失败:', error)
    message.error('加载失败')
  } finally {
    isLoading.value = false
  }
}

const goToPath = async (index) => {
  if (index === breadcrumbs.value.length - 1) return

  try {
    isLoading.value = true
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)

    if (index === -1) {
      await goToRoot()
    } else {
      const targetCrumb = breadcrumbs.value[index]
      currentFolder.value = targetCrumb.id
      currentFolderInfo.value = targetCrumb.info

      // 更新历史记录
      folderHistory.value = breadcrumbs.value.slice(0, index).map(crumb => ({
        id: crumb.id,
        info: crumb.info
      }))

      await loadFolder(targetCrumb.id)
    }

    selectedFiles.value = []
  } catch (error) {
    console.error('导航到路径失败:', error)
    message.error('加载失败')
  } finally {
    isLoading.value = false
  }
}

const updateBreadcrumbs = (folder, isBack = false) => {
  if (!folder) {
    breadcrumbs.value = []
    return
  }

  if (!isBack) {
    breadcrumbs.value.push({
      id: folder.fileId,
      name: folder.fileName,
      info: folder
    })
  } else {
    const currentIndex = breadcrumbs.value.findIndex(crumb => crumb.id === folder.fileId)
    if (currentIndex !== -1) {
      breadcrumbs.value = breadcrumbs.value.slice(0, currentIndex + 1)
    }
  }
}

// 文件操作方法
const handleFileDblClick = (file) => {
  console.log(file.fileCategory)
  if (file.fileCategory == 4) { // 文件夹
    enterFolder(file)
  } else {
    message.info(`打开文件: ${file.fileName}`)
  }
}

const handleRowDblClick = (row) => {
  handleFileDblClick(row)
}

// 菜单变化处理
const handleMenuChange = (key) => {
  if (key === 'trash') {
    message.info('进入回收站')
    // 这里可以添加加载回收站文件的逻辑
  }
  // 其他菜单项切换会自动触发 computed 的过滤
}

// 上传相关方法
const handleBeforeUpload = (options) => {
  const { file } = options
  const maxSize = 2 * 1024 * 1024 * 1024
  if (file.file.size > maxSize) {
    message.error(`文件 ${file.name} 超过2GB限制`)
    return false
  }

  const allowedTypes = ['image/', 'video/', 'audio/', 'text/', 'application/']
  const isValidType = allowedTypes.some(type => file.file.type.startsWith(type))

  if (!isValidType) {
    message.error(`文件类型 ${file.file.type} 不支持`)
    return false
  }

  return true
}

const handleFileChange = ({ fileList: newFileList }) => {
  const newFiles = newFileList.filter(newFile =>
    !uploadTasks.value.some(task =>
      task.id === newFile.id ||
      (task.file.name === newFile.name && task.file.size === newFile.file?.size)
    )
  )

  newFiles.forEach(fileInfo => {
    uploadTasks.value.push({
      id: fileInfo.id || Date.now() + Math.random(),
      file: fileInfo.file || fileInfo,
      fileName: fileInfo.name,
      fileSize: fileInfo.file?.size || 0,
      status: 'pending',
      progress: 0,
      statusText: '等待上传',
      error: null,
      result: null
    })
  })
}

const removeUploadTask = (taskId) => {
  const taskIndex = uploadTasks.value.findIndex(task => task.id === taskId)
  if (taskIndex === -1) return

  const task = uploadTasks.value[taskIndex]

  if (task.status === 'uploading') {
    message.warning('文件正在上传中，请等待上传完成或取消上传后再移除')
    return
  }

  uploadTasks.value = uploadTasks.value.filter(task => task.id !== taskId)

  if (uploadRef.value) {
    nextTick(() => {
      try {
        const currentList = Array.isArray(uploadRef.value.fileList)
          ? [...uploadRef.value.fileList]
          : []

        const updatedList = currentList.filter(file =>
          !(file.name === task.file.name && file.size === task.file.size)
        )

        uploadRef.value.fileList = updatedList
      } catch (error) {
        console.warn('更新文件列表时出现小问题，但不影响功能:', error)
      }
    })
  }

  message.success('文件已从上传列表移除')
}

const canRemoveFile = (task) => {
  return ['pending', 'failed', 'success'].includes(task.status)
}

const retryUpload = async (task) => {
  if (task.status === 'failed') {
    task.status = 'pending'
    task.progress = 0
    task.statusText = '等待重试'
    task.error = null
    await uploadSingleFile(task)
  }
}

const getTagType = (status) => {
  switch (status) {
    case 'success': return 'success'
    case 'failed': return 'error'
    case 'uploading': return 'info'
    default: return 'default'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'success': return '成功'
    case 'failed': return '失败'
    case 'uploading': return '上传中'
    case 'pending': return '等待中'
    default: return status
  }
}

const getProgressStatus = (task) => {
  if (task.status === 'failed') return 'error'
  if (task.status === 'success') return 'success'
  return 'default'
}

const cancelUpload = () => {
  if (isUploading.value) {
    uploadTasks.value.forEach(task => {
      if (task.status === 'uploading') {
        task.status = 'failed'
        task.statusText = '已取消'
        task.error = '用户取消上传'
      }
    })
    isUploading.value = false
    message.info('上传已取消')
  }

  uploadTasks.value = []

  if (uploadRef.value) {
    nextTick(() => {
      uploadRef.value = []
    })
  }

  showUploadModal.value = false
}

const handleCancelUpload = () => {
  if (isUploading.value) {
    dialog.warning({
      title: '确认取消上传',
      content: '当前有文件正在上传，确定要取消吗？',
      positiveText: '确定取消',
      negativeText: '继续上传',
      onPositiveClick: () => {
        cancelUpload()
      }
    })
  } else {
    cancelUpload()
  }
}

// 批量上传文件
const handleSubmit = async () => {
  if (uploadTasks.value.length === 0) {
    message.warning('请先选择文件')
    return
  }

  isUploading.value = true

  try {
    const pendingTasks = uploadTasks.value.filter(task =>
      task.status === 'pending' || task.status === 'failed'
    )

    if (pendingTasks.length === 0) {
      message.info('没有需要上传的文件')
      return
    }

    let quickUploadCount = 0
    let normalUploadCount = 0
    let failedCount = 0

    for (let i = 0; i < pendingTasks.length; i++) {
      const task = pendingTasks[i]
      try {
        const result = await uploadSingleFile(task)

        if (result && result.isQuickUpload) {
          quickUploadCount++
        } else if (result) {
          normalUploadCount++
        }
      } catch (error) {
        failedCount++
        console.error('文件上传失败:', error)
      }
    }

    let resultMessage = ''
    if (quickUploadCount > 0) {
      resultMessage += `${quickUploadCount}个文件秒传成功`
    }
    if (normalUploadCount > 0) {
      if (resultMessage) resultMessage += '，'
      resultMessage += `${normalUploadCount}个文件上传成功`
    }
    if (failedCount > 0) {
      if (resultMessage) resultMessage += '，'
      resultMessage += `${failedCount}个文件上传失败`
    }

    if (resultMessage) {
      message.success(resultMessage)
    }

  } catch (error) {
    console.error('上传过程中出错：', error)
  } finally {
    isUploading.value = false
  }
}

// 上传单个文件
const uploadSingleFile = async (task) => {
  const taskIndex = uploadTasks.value.findIndex(t => t.id === task.id)
  if (taskIndex === -1) {
    console.warn('任务不存在')
    return
  }

  try {
    const updatedTasks = [...uploadTasks.value]
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      status: 'uploading',
      statusText: '准备上传...',
      progress: 0,
      error: null
    }
    uploadTasks.value = updatedTasks

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const userId = user.id
    const filePid = currentFolder.value || '0'

    if (!userId) {
      throw new Error('用户未登录')
    }

    const result = await fileUtils.uploadFileInChunks(task.file, {
      userId: userId,
      filePid: filePid,
      chunkSize: 5 * 1024 * 1024,
      maxConcurrent: 3,
      onProgress: (progress, message) => {
        const currentTasks = [...uploadTasks.value]
        const currentTaskIndex = currentTasks.findIndex(t => t.id === task.id)
        if (currentTaskIndex !== -1) {
          currentTasks[currentTaskIndex] = {
            ...currentTasks[currentTaskIndex],
            progress: progress,
            statusText: message || '上传中...'
          }
          uploadTasks.value = currentTasks
        }
      },
      onChunkComplete: (chunkIndex, totalChunks, chunkResult) => {
        if (chunkResult && (chunkResult.status === 3 || chunkResult.isQuickUpload)) {
          console.log('检测到秒传结果')
        }
      }
    })

    const successTasks = [...uploadTasks.value]
    const successTaskIndex = successTasks.findIndex(t => t.id === task.id)
    if (successTaskIndex !== -1) {
      if (result.isQuickUpload) {
        successTasks[successTaskIndex] = {
          ...successTasks[successTaskIndex],
          status: 'success',
          statusText: '秒传完成',
          progress: 100,
          isQuickUpload: true,
          result: result
        }
        // message.success(`文件 "${task.file.name}" 秒传成功`)
      } else {
        successTasks[successTaskIndex] = {
          ...successTasks[successTaskIndex],
          status: 'success',
          statusText: '上传完成',
          progress: 100,
          isQuickUpload: false,
          result: result
        }

        message.success(`文件 "${task.file.name}" 上传成功`)
      }
      //重新加载该目录
      uploadTasks.value = successTasks
    }

    return result

  } catch (error) {
    const failedTasks = [...uploadTasks.value]
    const failedTaskIndex = failedTasks.findIndex(t => t.id === task.id)
    if (failedTaskIndex !== -1) {
      failedTasks[failedTaskIndex] = {
        ...failedTasks[failedTaskIndex],
        status: 'failed',
        statusText: '上传失败',
        error: error.message || '上传失败',
        result: null
      }
      uploadTasks.value = failedTasks
    }

    message.error(`文件 "${task.file.name}" 上传失败：${error.message}`)
    throw error
  } finally {
  }
}

// 工具函数
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getUploadFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
    return ImageOutline
  } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
    return VideocamOutline
  } else if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) {
    return MusicalNotesOutline
  } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
    return DocumentOutline
  } else {
    return DocumentOutline
  }
}

const handleUploadFinish = ({ file }) => {
  message.success(`文件 ${file.name} 上传成功`)
}

const handleUploadError = ({ file }) => {
  message.error(`文件 ${file?.name || '未知'} 上传失败`)
}

// 其他方法
const changeView = (type) => { viewType.value = type }

const handleUpload = () => {
  showUploadModal.value = true
}
//新建文件夹的名称
// 新建文件夹的名称
const newFolderName = ref("")

const handleNewFolder = async () => {
  dialog.create({
    title: "新建文件夹",
    content: () => h('div', [
      h('input', {
        type: 'text',
        value: newFolderName.value,
        onInput: (e) => {
          newFolderName.value = e.target.value
        },
        placeholder: '请输入文件夹名称',
        style: 'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;'
      })
    ]),
    positiveText: '确定',
    negativeText: '取消',
    draggable: true,
    onPositiveClick: async () => {
      if (!newFolderName.value.trim()) {
        message.error('文件夹名称不能为空')
        return false // 阻止对话框关闭
      }

      const f = {
        userId: JSON.parse(localStorage.getItem("user")).id,
        fileName: newFolderName.value,
        fileSize: 0,
        filePid: currentFolderInfo.value.fileId
      }


      const response = await service.post("/api/file/info/c_folder", f)

      console.log(response)
      if (response.code == 200) {
        message.success(`创建文件夹成功: ${newFolderName.value}`)
        // 这里可以添加实际的创建文件夹逻辑
        newFolderName.value = ""
        loadFolder(currentFolderInfo.value.fileId)
        return true // 允许对话框关闭
      } else {
        message.error("操作失败，请稍后再试！")
        return false;
      }
    },
    onNegativeClick: () => {
      newFolderName.value = ''
      message.warning('已取消')
    }
  })
}

const handleDownload = () => {
  if (selectedFiles.value.length > 0) {
    message.success(`开始下载 ${selectedFiles.value.length} 个文件`)
  }
}

const handleDelete = () => {
  if (selectedFiles.value.length === 0) return

  dialog.warning({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedFiles.value.length} 个文件吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      fileList.value = fileList.value.filter(file => !selectedFiles.value.includes(file.fileId))
      message.success('删除成功')
      selectedFiles.value = []
    }
  })
}

const handleShare = () => {
  if (selectedFiles.value.length > 0) {
    message.info(`分享 ${selectedFiles.value.length} 个文件`)
  }
}

const handlePreview = () => {
  if (selectedFiles.value.length > 0) {
    message.info(`预览 ${selectedFiles.value.length} 个文件`)
  }
}

const handleSortChange = (key) => { sortBy.value = key }

const refreshFiles = async () => {
  try {
    if (currentFolder.value) {
      await loadFolder(currentFolder.value)
    } else {
      await loadRootFolder()
    }
    message.success('刷新成功')
  } catch (error) {
    message.error('刷新失败')
  }
}

const toggleFileSelection = (fileId) => {
  const index = selectedFiles.value.indexOf(fileId)
  index > -1 ? selectedFiles.value.splice(index, 1) : selectedFiles.value.push(fileId)
}

const handlePreviewSingle = (file) => {
  if (file.fileCategory === 1) {
    message.info('文件夹不支持预览')
  } else {
    message.info(`预览文件: ${file.fileName}`)
  }
}
const baseUrl = "http://localhost:9000/"
const handleDownloadSingle = (file) => {
  if (file.fileCategory == 4) {
    message.info('文件夹不支持下载')
  } else {
    // console.log(file.filePath)
    const link = document.createElement('a');
    link.href = baseUrl + file.filePath;
    link.download = file.fileName || 'download'; // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`下载文件: ${file.fileName}`)
  }
}

const handleShareSingle = (file) => message.info(`分享文件: ${file.fileName}`)

const handleDeleteSingle = (file) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除文件 "${file.fileName}" 吗？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      fileList.value = fileList.value.filter(f => f.fileId !== file.fileId)
      message.success('删除成功')
    }
  })
}

// 根据枚举值返回对应的文件类型
const getFileType = (category) => {
  // 根据枚举返回对应的文件类型分类
  // folder: 文件夹, image: 图片, document: 文档, video: 视频, audio: 音频, code: 代码文件
  switch (category) {
    // 文件夹
    case 4: return 'folder'

    // 图片类型
    case 5:  // gif
    case 9:  // jpg
    case 14: // png
      return 'image'

    // 视频类型
    case 12: // mp4
      return 'video'

    // 音频类型
    case 11: // mp3
      return 'audio'

    // 代码文件
    case 1:  // c
    case 2:  // cpp
    case 3:  // css
    case 6:  // html
    case 7:  // java
    case 8:  // js
    case 10: // json
    case 16: // sql
    case 17: // txt
    case 21: // md
      return 'code'

    // 文档类型
    case 13: // pdf
    case 15: // pptx
    case 18: // docx
    case 19: // doc
    default:  // 其他类型
      return 'document'
  }
}

// 文件类型图标映射
const getFileIcon = (type) => {
  const iconMap = {
    document: DocumentTextOutline,
    image: ImageOutline,
    video: VideocamOutline,
    audio: MusicalNotesOutline,
    folder: FolderOutline,
    code: CodeOutline, // 如果没有 CodeOutline 图标，可以用 DocumentTextOutline
  }
  return iconMap[type] || DocumentTextOutline
}

const getFileIconColor = (type) => ({
  document: '#1890ff',
  image: '#52c41a',
  video: '#fa541c',
  audio: '#faad14',
  folder: '#fadb14'
}[type] || '#666666')

const getFileExtension = (fileName) => {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSortLabel = (key) => ({ name: '名称', time: '时间', size: '大小', type: '类型' }[key] || '名称')
const getRowClass = (row) => selectedFiles.value.includes(row.fileId) ? 'selected-row' : ''
const getRowProps = (row) => ({ onDblclick: () => handleRowDblClick(row) })

// API 调用方法
const loadRootFolder = async () => {
  try {
    isLoading.value = true
    loadingBar.start()
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const response = await service.get("/api/file/info/root", {
      params: {
        userId: user.id,
      }
    })

    if (response.code === 200) {
      fileList.value = response.data.children || []
      currentFolderInfo.value = response.data.folderInfo
      currentFolder.value = currentFolderInfo.value.fileId
    } else {
      message.error(response.data?.message || '加载失败')
    }
  } catch (error) {
    console.error('加载根目录失败:', error)
    message.error('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
    loadingBar.finish()
  }
}

const loadFolder = async (folderId) => {
  try {
    isLoading.value = true

    const response = await service.get(`/api/file/info/folder/${folderId}`)

    console.log(response.data)

    if (response.code == 200) {
      fileList.value = response.data || []
    } else {
      message.error(response.data?.message || '加载失败')
    }
  } catch (error) {
    console.error('加载文件夹失败:', error)
    message.error('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 组件挂载
onMounted(async () => {
  await loadRootFolder()
})
</script>

<style scoped>
.resources-container {
  height: 100vh;
  background-color: var(--n-color);
  transition: all 0.3s ease;
}

.header {
  padding: 12px 24px;
  background-color: var(--n-color);
}

.search-input {
  width: 300px;
}

.main-layout {
  height: calc(100vh - 64px);
}

.sider {
  background-color: var(--n-color);
}

/* 面包屑样式 */
.n-breadcrumb {
  cursor: pointer;
}

.n-breadcrumb-item:hover {
  color: var(--n-primary-color);
}

/* 存储空间卡片优化样式 */
.storage-card {
  margin: -12px -10px;
  text-align: center;
  transform: scale(0.85);
  transform-origin: center;
}

.storage-title {
  font-weight: bold;
  font-size: 11px;
}

.storage-info {
  font-size: 9px;
}

.storage-btn {
  font-size: 10px;
  padding: 2px 8px;
}

.content {
  padding: 16px;
  background-color: var(--n-color-embedded);
}

.toolbar-card {
  margin-bottom: 16px;
}

.files-card {
  min-height: 400px;
}

.grid-view {
  padding: 8px;
}

/* 文件卡片样式 */
.file-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 140px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
}

.file-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--n-primary-color);
}

.file-card.selected {
  border-color: var(--n-primary-color);
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.03), rgba(24, 160, 88, 0.08));
}

.file-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 12px;
}

.file-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
}

.file-icon {
  transition: all 0.3s ease;
}

.file-card:hover .file-icon {
  transform: scale(1.1);
}

.file-extension {
  font-size: 10px;
  color: var(--n-text-color-disabled);
  background: var(--n-color-embedded);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.file-name {
  font-weight: 600;
  font-size: 13px;
  line-height: 1.3;
  margin-bottom: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  /* 添加以下属性 */
  direction: rtl;
  /* 从右到左 */
  unicode-bidi: bidi-override;
  text-align: left;
  /* 覆盖之前的 text-align: center */
}

.file-meta {
  text-align: center;
}

.file-size,
.file-date {
  font-size: 11px;
}

.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.file-card:hover .file-actions {
  opacity: 1;
  transform: translateX(0);
}

.selection-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 2px;
}

:deep(.selected-row) {
  background-color: rgba(24, 160, 88, 0.05) !important;
}

:deep(.n-data-table) {
  border-radius: 8px;
}

:deep(.n-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .search-input {
    width: 200px;
  }

  .header {
    padding: 8px 16px;
  }

  .content {
    padding: 8px;
  }

  .file-card {
    height: 120px;
  }

  .file-icon {
    font-size: 28px;
  }
}
</style>