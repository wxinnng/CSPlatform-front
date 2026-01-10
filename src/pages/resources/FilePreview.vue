<template>
  <div class="file-preview-wrapper">
    <!-- 加载状态 -->
    <div v-if="loading" class="preview-loading">
      <n-spin size="large" description="文件加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="preview-error">
      <n-result status="error" title="文件预览失败" :description="error">
        <template #footer>
          <n-button @click="retry">重试</n-button>
        </template>
      </n-result>
    </div>

    <!-- 主预览区域 -->
    <div v-else class="preview-container">
      <!-- 顶部文件信息栏 -->
      <div class="preview-header">
        <div class="file-info">
          <n-icon :component="getFileIcon()" :size="24" class="file-icon" />
          <div class="file-info-text">
            <n-text strong>{{ fileInfo.fileName }}</n-text>
            <n-text depth="3" tag="div" class="file-meta">
              {{ formatFileSize(fileInfo.fileSize) }} • {{ fileExtension.toUpperCase() }} • 
              上传: {{ formatTime(fileInfo.createTime) }}
            </n-text>
          </div>
        </div>
        <div class="preview-actions">
          <n-button-group>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button @click="downloadFile" secondary>
                  <template #icon>
                    <n-icon><DownloadOutline /></n-icon>
                  </template>
                  下载
                </n-button>
              </template>
              下载文件
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button @click="copyFileLink" secondary>
                  <template #icon>
                    <n-icon><ShareSocialOutline /></n-icon>
                  </template>
                  复制链接
                </n-button>
              </template>
              复制文件链接
            </n-tooltip>
          </n-button-group>
        </div>
      </div>

      <!-- 预览内容区域 -->
      <div class="preview-content">
        <!-- 图片预览 -->
        <div v-if="isImage" class="preview-section">
          <div class="image-preview">
            <n-image
              :src="fileUrl"
              :alt="fileInfo.fileName"
              object-fit="contain"
              :preview-disabled="false"
              class="preview-image"
            />
          </div>
        </div>

        <!-- PDF预览 - 使用vue-office -->
        <div v-else-if="isPdf" class="preview-section">
          <div class="pdf-preview">
            <VueOfficePdf
              :src="fileUrl"
              style="height: 100%; width: 100%;"
              @rendered="onPdfRendered"
              @error="onPdfError"
            />
          </div>
        </div>

        <!-- Word文档预览 -->
        <div v-else-if="isWord" class="preview-section">
          <div class="office-preview">
            <VueOfficeDocx
              :src="fileUrl"
              style="height: 100%; width: 100%;"
              @rendered="onOfficeRendered"
              @error="onOfficeError"
            />
          </div>
        </div>

        <!-- Excel预览 -->
        <div v-else-if="isExcel" class="preview-section">
          <div class="office-preview">
            <VueOfficeExcel
              :src="fileUrl"
              style="height: 100%; width: 100%;"
              @rendered="onOfficeRendered"
              @error="onOfficeError"
            />
          </div>
        </div>

        <!-- 视频预览 - 使用@videojs-player/vue -->
        <div v-else-if="isVideo" class="preview-section">
          <div class="media-preview">
            <VideoPlayer
              :src="fileUrl"
              :options="videoOptions"
              class="preview-video"
              @mounted="onVideoMounted"
              @play="onVideoPlay"
              @pause="onVideoPause"
              @error="onVideoError"
            />
          </div>
        </div>

        <!-- 音频预览 -->
        <div v-else-if="isAudio" class="preview-section">
          <div class="media-preview audio-preview">
            <VideoPlayer
              :src="fileUrl"
              :options="audioOptions"
              class="preview-audio"
            />
            <div class="audio-info">
              <n-text strong>{{ fileInfo.fileName }}</n-text>
              <n-text depth="3">{{ formatFileSize(fileInfo.fileSize) }}</n-text>
            </div>
          </div>
        </div>

        <!-- Markdown预览 -->
        <div v-else-if="isMarkdown" class="preview-section">
          <div class="markdown-preview">
            <div class="markdown-header">
              <n-text strong>Markdown文档预览</n-text>
              <n-button-group size="small">
                <n-button @click="toggleTheme" secondary>
                  <template #icon>
                    <n-icon><CodeOutline /></n-icon>
                  </template>
                  {{ isDarkTheme ? '浅色' : '深色' }}
                </n-button>
              </n-button-group>
            </div>
            <div class="markdown-content">
              <v-md-preview :text="fileContent" class="markdown-display" />
            </div>
          </div>
        </div>

        <!-- 文本文件预览 -->
        <div v-else-if="isText" class="preview-section">
          <div class="text-preview">
            <div class="text-header">
              <n-text strong>文本内容预览</n-text>
              <n-button-group size="small">
                <n-button @click="copyText" secondary>
                  <template #icon>
                    <n-icon><DocumentTextOutline /></n-icon>
                  </template>
                  复制
                </n-button>
              </n-button-group>
            </div>
            <div class="text-content">
              <n-code
                :code="fileContent"
                language="text"
                show-line-numbers
                word-wrap
                class="code-preview"
              />
            </div>
          </div>
        </div>

        <!-- 代码文件预览 -->
        <div v-else-if="isCode" class="preview-section">
          <div class="code-preview-container">
            <div class="code-header">
              <n-text strong>代码预览</n-text>
              <n-tag type="info" size="small">{{ codeLanguage }}</n-tag>
            </div>
            <div class="code-content">
              <n-code
                :code="fileContent"
                :language="codeLanguage"
                show-line-numbers
                word-wrap
                class="code-display"
              />
            </div>
          </div>
        </div>

        <!-- 默认预览（不支持的类型） -->
        <div v-else class="preview-section">
          <div class="default-preview">
            <n-result status="info" title="文件预览" :description="fileInfo.fileName">
              <template #icon>
                <n-icon :component="getFileIcon()" :size="64" />
              </template>
              <template #footer>
                <div class="default-actions">
                  <n-space vertical>
                    <n-text depth="3">
                      文件格式: {{ fileExtension.toUpperCase() }} • 大小: {{ formatFileSize(fileInfo.fileSize) }}
                    </n-text>
                    <n-button-group>
                      <n-button @click="downloadFile" type="primary" size="large">
                        <template #icon>
                          <n-icon><DownloadOutline /></n-icon>
                        </template>
                        下载文件
                      </n-button>
                      <n-button @click="copyFileLink" size="large">
                        复制文件链接
                      </n-button>
                    </n-button-group>
                  </n-space>
                </div>
              </template>
            </n-result>
          </div>
        </div>
      </div>

      <!-- 底部状态栏 -->
      <div class="preview-footer">
        <n-space justify="space-between" align="center">
          <div class="file-status">
            <n-text depth="3" size="small">
              <n-space :size="[16, 0]">
                <span>文件ID: {{ fileInfo.fileId }}</span>
                <span>MD5: {{ fileInfo.fileMd5 }}</span>
                <span v-if="loadTime">加载时间: {{ loadTime }}ms</span>
              </n-space>
            </n-text>
          </div>
          <div class="preview-info">
            <n-text depth="3" size="small">
              {{ getPreviewInfo() }}
            </n-text>
          </div>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  NSpin,
  NResult,
  NButton,
  NButtonGroup,
  NTooltip,
  NIcon,
  NText,
  NCode,
  NImage,
  NSpace,
  NTag,
  useMessage
} from 'naive-ui'

// 视频播放器
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

// Office文档预览
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

// Markdown预览
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

// 图标
import {
  DownloadOutline,
  ShareSocialOutline,
  DocumentTextOutline,
  ImageOutline,
  VideocamOutline,
  MusicalNotesOutline,
  DocumentOutline,
  CodeOutline
} from '@vicons/ionicons5'

// 初始化Markdown预览器
VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

// 定义组件属性
const props = defineProps({
  fileInfo: {
    type: Object,
    required: true,
    default: () => ({})
  },
  baseUrl: {
    type: String,
    default: 'http://localhost:9000/'
  }
})

// 响应式状态
const loading = ref(true)
const error = ref('')
const fileContent = ref('')
const fileUrl = ref('')
const loadTime = ref(0)
const isDarkTheme = ref(false)

const message = useMessage()

// 视频播放器配置
const videoOptions = ref({
  controls: true,
  responsive: true,
  fluid: true,
  playbackRates: [0.5, 1, 1.5, 2],
  controlBar: {
    remainingTimeDisplay: false,
    playToggle: {},
    progressControl: {},
    volumePanel: {},
    fullscreenToggle: {}
  }
})

const audioOptions = ref({
  controls: true,
  responsive: true,
  fluid: true,
  height: 80,
  controlBar: {
    playToggle: {},
    progressControl: {},
    volumePanel: {},
    fullscreenToggle: { display: false }
  }
})

// 计算属性
const fileExtension = computed(() => {
  if (!props.fileInfo.fileName) return ''
  const parts = props.fileInfo.fileName.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
})

// 文件类型检测
const isImage = computed(() => {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico']
  return imageExts.includes(fileExtension.value)
})

const isPdf = computed(() => fileExtension.value === 'pdf')

const isWord = computed(() => {
  const wordExts = ['doc', 'docx']
  return wordExts.includes(fileExtension.value)
})

const isExcel = computed(() => {
  const excelExts = ['xls', 'xlsx']
  return excelExts.includes(fileExtension.value)
})

const isVideo = computed(() => {
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv']
  return videoExts.includes(fileExtension.value)
})

const isAudio = computed(() => {
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
  return audioExts.includes(fileExtension.value)
})

const isMarkdown = computed(() => fileExtension.value === 'md')

const isText = computed(() => {
  const textExts = ['txt', 'log', 'ini', 'conf', 'cfg']
  return textExts.includes(fileExtension.value)
})

const isCode = computed(() => {
  const codeExts = ['js', 'ts', 'vue', 'html', 'css', 'json', 'xml', 'java', 'py']
  return codeExts.includes(fileExtension.value)
})

const codeLanguage = computed(() => {
  const langMap = {
    'js': 'javascript', 'ts': 'typescript', 'vue': 'vue', 'html': 'html',
    'css': 'css', 'json': 'json', 'xml': 'xml', 'md': 'markdown',
    'java': 'java', 'py': 'python'
  }
  return langMap[fileExtension.value] || 'text'
})

// 方法
const getFileIcon = () => {
  if (isImage.value) return ImageOutline
  if (isPdf.value) return DocumentOutline
  if (isWord.value) return DocumentOutline
  if (isExcel.value) return DocumentOutline
  if (isVideo.value) return VideocamOutline
  if (isAudio.value) return MusicalNotesOutline
  if (isMarkdown.value) return DocumentTextOutline
  if (isText.value) return DocumentTextOutline
  if (isCode.value) return CodeOutline
  return DocumentOutline
}

const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const formatTime = (timestamp) => {
  if (!timestamp) return '未知时间'
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getFileUrl = () => {
  if (props.fileInfo.filePath) {
    return `${props.baseUrl}${props.fileInfo.filePath}`
  }
  return ''
}

const loadTextContent = async () => {
  if (!fileUrl.value) return
  
  try {
    const startTime = Date.now()
    const response = await fetch(fileUrl.value)
    if (!response.ok) throw new Error('加载失败')
    
    const text = await response.text()
    fileContent.value = text
    loadTime.value = Date.now() - startTime
  } catch (err) {
    console.error('加载文本内容失败:', err)
    fileContent.value = '无法加载文件内容'
  }
}

const downloadFile = () => {
  if (!fileUrl.value) {
    message.error('文件地址无效')
    return
  }
  
  const link = document.createElement('a')
  link.href = fileUrl.value
  link.download = props.fileInfo.fileName || 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  message.success('开始下载文件')
}

const copyFileLink = async () => {
  if (!fileUrl.value) {
    message.error('文件地址无效')
    return
  }
  
  try {
    await navigator.clipboard.writeText(fileUrl.value)
    message.success('文件链接已复制到剪贴板')
  } catch (err) {
    message.error('复制失败，请手动复制链接')
  }
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(fileContent.value)
    message.success('文本内容已复制到剪贴板')
  } catch (err) {
    message.error('复制失败')
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  // 这里可以实现主题切换逻辑
}

const getPreviewInfo = () => {
  if (isImage.value) return '图片预览 - 支持缩放和全屏查看'
  if (isPdf.value) return 'PDF文档 - 使用vue-office渲染'
  if (isWord.value) return 'Word文档 - 使用vue-office渲染'
  if (isExcel.value) return 'Excel表格 - 使用vue-office渲染'
  if (isVideo.value) return '视频文件 - 使用@videojs-player/vue播放器'
  if (isAudio.value) return '音频文件 - 使用@videojs-player/vue播放器'
  if (isMarkdown.value) return 'Markdown文档 - 支持语法高亮'
  if (isText.value) return '文本文件 - 支持内容复制'
  if (isCode.value) return `代码文件 - ${codeLanguage.value}语法高亮`
  return '文件预览'
}

// 事件处理
const onPdfRendered = () => {
  console.log('PDF渲染完成')
  loading.value = false
}

const onPdfError = (error) => {
  console.error('PDF渲染失败:', error)
  message.error('PDF文件渲染失败')
}

const onOfficeRendered = () => {
  console.log('Office文档渲染完成')
  loading.value = false
}

const onOfficeError = (error) => {
  console.error('Office文档渲染失败:', error)
  message.error('Office文档渲染失败')
}

const onVideoMounted = (payload) => {
  console.log('视频播放器已加载', payload)
  loading.value = false
}

const onVideoPlay = () => {
  console.log('视频开始播放')
}

const onVideoPause = () => {
  console.log('视频暂停')
}

const onVideoError = (error) => {
  console.error('视频播放错误:', error)
  message.error('视频播放失败')
}

const retry = () => {
  error.value = ''
  loading.value = true
  initializePreview()
}

// 初始化预览
const initializePreview = () => {
  const startTime = Date.now()
  
  if (!props.fileInfo.filePath) {
    error.value = '文件路径不存在'
    loading.value = false
    return
  }

  fileUrl.value = getFileUrl()
  
  // 加载文本内容
  if (isText.value || isCode.value || isMarkdown.value) {
    loadTextContent().finally(() => {
      loading.value = false
      loadTime.value = Date.now() - startTime
    })
  } else if (isImage.value || isPdf.value || isWord.value || isExcel.value) {
    // 这些类型会通过各自组件的loaded事件来处理loading状态
    setTimeout(() => {
      if (loading.value) {
        loading.value = false
        loadTime.value = Date.now() - startTime
      }
    }, 3000) // 3秒超时
  } else {
    // 其他文件类型直接显示
    setTimeout(() => {
      loading.value = false
      loadTime.value = Date.now() - startTime
    }, 500)
  }
}

// 生命周期
onMounted(() => {
  initializePreview()
})

watch(() => props.fileInfo, () => {
  loading.value = true
  error.value = ''
  fileContent.value = ''
  fileUrl.value = ''
  loadTime.value = 0
  
  initializePreview()
}, { deep: true })
</script>

<style scoped>
.file-preview-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: auto;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-loading,
.preview-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  flex-shrink: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-info-text {
  min-width: 0;
}

.file-icon {
  flex-shrink: 0;
  color: #409eff;
}

.file-meta {
  font-size: 12px;
  margin-top: 4px;
}

.preview-actions {
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.preview-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 图片预览样式 */
.image-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
}

/* PDF和Office预览样式 */
.pdf-preview,
.office-preview {
  height: 100%;
  width: 100%;
}

/* 媒体预览样式 */
.media-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-video {
  width: 100%;
  max-width: 900px;
  max-height: 80%;
  border-radius: 4px;
}

.audio-preview {
  justify-content: center;
  gap: 20px;
}

.preview-audio {
  width: 100%;
  max-width: 600px;
}

.audio-info {
  text-align: center;
}

/* Markdown预览样式 */
.markdown-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.markdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.markdown-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.markdown-display {
  height: 100%;
  border: none;
}

/* 文本和代码预览样式 */
.text-preview,
.code-preview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.text-header,
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.text-content,
.code-content {
  flex: 1;
  overflow: auto;
}

.code-preview,
.code-display {
  height: 100%;
  border: none;
}

/* 默认预览样式 */
.default-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.default-actions {
  text-align: center;
}

/* 底部状态栏 */
.preview-footer {
  padding: 12px 24px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
  flex-shrink: 0;
}

.file-status {
  flex: 1;
}

.preview-info {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .preview-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .preview-footer {
    padding: 8px 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .file-status,
  .preview-info {
    width: 100%;
    text-align: center;
  }
}
</style>