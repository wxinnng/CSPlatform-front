<template>
    <div class="user-profile-page">
        <!-- 可自定义背景 -->
        <div class="profile-background"
            :style="{ backgroundImage: `url(http://localhost:9000/singing/png/22cab91c-cab6-4427-9f57-63c63cee89b2Screenshot_2024_1030_161042.png)` }">
            <div class="background-overlay"></div>
        </div>

        <div class="profile-content">
            <!-- 加载状态 -->
            <n-spin v-if="isLoading" size="large" description="加载中...">
                <div style="height: 400px"></div>
            </n-spin>

            <!-- 错误状态 -->
            <n-alert v-else-if="isError" type="error" title="加载失败" class="error-message">
                {{ errorMessage }}
                <template #action>
                    <n-button @click="fetchUserInfo" type="primary" size="small" class="retry-btn">
                        重新加载
                    </n-button>
                </template>
            </n-alert>

            <!-- 正常内容 -->
            <template v-else>
                <!-- 用户信息卡片 -->
                <n-card class="user-info-card" :content-style="{ padding: '30px' }" :bordered="false">
                    <div class="card-content">
                        <!-- 头像区域 -->
                        <!-- 头像区域 -->
                        <div class="avatar-area">
                            <div class="avatar-container" @mouseenter="showAvatarHint = true"
                                @mouseleave="showAvatarHint = false" @click="triggerAvatarUpload">
                                <div class="avatar-circle">
                                    <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="头像" class="avatar-image" />
                                    <div v-else class="avatar-default">
                                        {{ userInfo.name?.charAt(0) || '用' }}
                                    </div>
                                </div>
                                <!-- 悬浮提示 -->
                                <div v-if="showAvatarHint" class="avatar-tooltip">
                                    修改头像
                                </div>
                                <input ref="avatarInput" type="file" accept="image/*" class="avatar-file-input"
                                    @change="handleAvatarUpload" />
                            </div>
                        </div>


                        <!-- 用户详细信息 -->
                        <n-grid :cols="isMobile ? 1 : 3" :x-gap="24" class="user-details">
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">用户名称：</n-text>
                                    <n-text class="detail-value" strong>{{ displayUserInfo.name }}</n-text>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">用户邮箱：</n-text>
                                    <n-text class="detail-value">{{ displayUserInfo.email }}</n-text>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">用户性别：</n-text>
                                    <n-text class="detail-value">{{ displayUserInfo.gender }}</n-text>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">手机号：</n-text>
                                    <n-text class="detail-value">{{ displayUserInfo.phone }}</n-text>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">用户创建时间：</n-text>
                                    <n-text class="detail-value">{{ displayUserInfo.createdAt }}</n-text>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical>
                                    <n-text class="detail-label">用户学习等级：</n-text>
                                    <n-tag :type="levelTagType" size="small">{{ displayUserInfo.level }}</n-tag>
                                </n-space>
                            </n-gi>
                        </n-grid>

                        <!-- 编辑按钮 -->
                        <n-button type="info" ghost @click="handleEdit" class="edit-button" :block="isMobile">
                            编辑个人信息
                        </n-button>
                    </div>
                </n-card>

                <!-- 功能标签区域 -->
                <n-card :bordered="false" class="function-tabs-card">
                    <n-tabs v-model:value="activeTab" type="segment" animated :tabs-padding="20" pane-class="tab-pane"
                        size="large">
                        <n-tab-pane name="published-courses" tab="我发布的课程">
                            <template #tab>
                                <n-space align="center" :size="8">
                                    <n-text style="font-size: 20px;">📚</n-text>
                                    <span>我发布的课程</span>
                                </n-space>
                            </template>
                        </n-tab-pane>

                        <n-tab-pane name="learning-courses" tab="我学习的课程">
                            <template #tab>
                                <n-space align="center" :size="8">
                                    <n-text style="font-size: 20px;">🎓</n-text>
                                    <span>我学习的课程</span>
                                </n-space>
                            </template>
                        </n-tab-pane>

                        <n-tab-pane name="learning-cards" tab="正在学习的卡片">
                            <template #tab>
                                <n-space align="center" :size="8">
                                    <n-text style="font-size: 20px;">📝</n-text>
                                    <span>正在学习的卡片</span>
                                </n-space>
                            </template>
                        </n-tab-pane>

                        <n-tab-pane name="published-cards" tab="我发布的卡片">
                            <template #tab>
                                <n-space align="center" :size="8">
                                    <n-text style="font-size: 20px;">📢</n-text>
                                    <span>我发布的卡片</span>
                                </n-space>
                            </template>
                        </n-tab-pane>

                        <n-tab-pane name="shared-experiences" tab="我分享的经验">
                            <template #tab>
                                <n-space align="center" :size="8">
                                    <n-text style="font-size: 20px;">💡</n-text>
                                    <span>我分享的经验</span>
                                </n-space>
                            </template>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>

                <!-- 内容展示区域 -->
                <n-card class="content-display-area" :content-style="{ padding: 0, minHeight: '400px' }">
                    <!-- 我发布的课程 -->
                    <div v-if="activeTab === 'published-courses'" class="tab-content">
                        <template v-if="publishedCourses.length === 0">
                            <n-empty size="large" description="您还没有发布过课程" class="empty-state">
                                <template #icon>
                                    <n-text style="font-size: 60px; color: #bfbfbf;">📚</n-text>
                                </template>
                                <template #extra>
                                    <n-space vertical align="center">
                                        <n-text depth="3" style="margin-bottom: 16px;">
                                            快来分享你的知识，创建第一个课程吧！
                                        </n-text>
                                        <n-button type="primary" size="medium" @click="handleCreateCourse" round>
                                            创建课程
                                        </n-button>
                                    </n-space>
                                </template>
                            </n-empty>
                        </template>

                        <n-grid v-else :cols="isMobile ? 1 : 2" :x-gap="20" :y-gap="20">
                            <n-gi v-for="course in publishedCourses" :key="course.id">
                                <n-card class="course-card" hoverable :content-style="{ padding: 0 }">
                                    <div class="course-image-container">
                                        <img :src="course.cover" :alt="course.title" class="course-image" />
                                    </div>

                                    <n-space vertical :size="12" style="padding: 20px;">
                                        <n-ellipsis :line-clamp="2" :tooltip="false" class="course-title">
                                            {{ course.title }}
                                        </n-ellipsis>

                                        <n-ellipsis :line-clamp="2" :tooltip="false" class="course-description">
                                            {{ course.description }}
                                        </n-ellipsis>

                                        <n-space justify="space-between" align="center" class="course-meta">
                                            <n-tag v-if="course.category" :bordered="false" size="small" type="info">
                                                {{ course.category }}
                                            </n-tag>

                                            <n-space :size="4" align="center">
                                                <n-text depth="3" class="meta-text">
                                                    {{ course.students }} 人学习
                                                </n-text>
                                            </n-space>
                                        </n-space>
                                    </n-space>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </div>

                    <!-- 我学习的课程 -->
                    <div v-else-if="activeTab === 'learning-courses'" class="tab-content">
                        <template v-if="learningCourses.length === 0">
                            <n-empty size="large" description="您还没有开始学习任何课程" class="empty-state">
                                <template #icon>
                                    <n-text style="font-size: 60px; color: #bfbfbf;">🎓</n-text>
                                </template>
                                <template #extra>
                                    <n-space vertical align="center">
                                        <n-text depth="3" style="margin-bottom: 16px;">
                                            快来探索精彩课程，开始学习之旅吧！
                                        </n-text>
                                        <n-button type="primary" size="medium" @click="handleBrowseCourses" round>
                                            浏览课程
                                        </n-button>
                                    </n-space>
                                </template>
                            </n-empty>
                        </template>

                        <n-grid v-else :cols="isMobile ? 1 : 2" :x-gap="20" :y-gap="20">
                            <n-gi v-for="course in learningCourses" :key="course.id">
                                <n-card class="learning-course-card" hoverable :content-style="{ padding: 0 }">
                                    <div class="course-image-container">
                                        <img :src="course.cover" :alt="course.title" class="course-image" />
                                        <div class="progress-overlay">
                                            <n-progress type="line" :percentage="course.progress" :height="6"
                                                status="success" :border-radius="4" :show-indicator="false" />
                                        </div>
                                    </div>

                                    <n-space vertical :size="12" style="padding: 20px;">
                                        <n-ellipsis :line-clamp="2" :tooltip="false" class="course-title">
                                            {{ course.title }}
                                        </n-ellipsis>

                                        <n-space vertical :size="8">
                                            <n-space justify="space-between" align="center">
                                                <n-text strong style="color: #52c41a;">
                                                    学习进度: {{ course.progress }}%
                                                </n-text>
                                            </n-space>

                                            <n-progress type="line" :percentage="course.progress" :height="8"
                                                status="success" :border-radius="4" processing />
                                        </n-space>

                                        <n-space justify="space-between" align="center" class="course-meta">
                                            <n-space :size="4" align="center">
                                                <n-text depth="3" class="meta-text">
                                                    已学习 {{ course.timeSpent }}h
                                                </n-text>
                                            </n-space>
                                        </n-space>
                                    </n-space>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </div>

                    <!-- 其他标签页 -->
                    <div v-else class="tab-content">
                        <n-empty size="large" description="功能开发中" class="empty-state">
                            <template #icon>
                                <n-text style="font-size: 60px; color: #bfbfbf;">🚧</n-text>
                            </template>
                            <template #extra>
                                <n-text depth="3">
                                    该功能正在积极开发中，敬请期待！
                                </n-text>
                            </template>
                        </n-empty>
                    </div>
                </n-card>
            </template>
        </div>

        <!-- 编辑信息模态框 -->
        <n-modal v-model:show="showEditModal" preset="card" title="编辑个人信息" :bordered="false" size="huge"
            class="edit-modal" :mask-closable="false" style="max-width: 500px;">
            <n-form ref="formRef" :model="editForm" :rules="rules" label-placement="left" label-width="auto"
                label-align="right" size="large" class="edit-form">
                <n-form-item label="用户名称" path="name">
                    <n-input v-model:value="editForm.name" placeholder="请输入用户名称" :maxlength="30" clearable />
                </n-form-item>

                <n-form-item label="用户性别" path="gender">
                    <n-radio-group v-model:value="editForm.gender">
                        <n-space>
                            <n-radio value="男">男</n-radio>
                            <n-radio value="女">女</n-radio>
                            <n-radio value="保密">保密</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>

                <!-- <n-form-item label="出生日期" path="birthday">
                    <n-date-picker v-model:formatted-value="editForm.birthday" value-format="yyyy-MM-dd" type="date"
                        clearable style="width: 100%;" />
                </n-form-item> -->

                <n-form-item label="用户邮箱" path="email">
                    <n-input v-model:value="editForm.email" placeholder="请输入用户邮箱" type="email" clearable />
                </n-form-item>

                <n-form-item label="密码" path="password">
                    <n-input v-model:value="editForm.password" placeholder="请输入密码" type="password" clearable
                        show-password-on="mousedown" />
                </n-form-item>

                <n-form-item label="手机号码" path="phone">
                    <n-input v-model:value="editForm.phone" placeholder="请输入手机号码" :maxlength="11" clearable />
                </n-form-item>

                <n-form-item label="学习等级" path="level">
                    <n-select v-model:value="editForm.level" disabled :options="levelOptions" placeholder="请选择学习等级"
                        clearable />
                </n-form-item>

                <n-alert title="说明" type="info" :bordered="false" class="form-note">
                    <n-ul>
                        <n-li>用户名称和邮箱将用于登录和找回密码</n-li>
                        <n-li>手机号用于重要通知和安全验证</n-li>
                        <n-li>学习等级会根据您的学习进度自动更新</n-li>
                    </n-ul>
                </n-alert>

                <n-space justify="end" class="form-actions">
                    <n-button @click="handleCancelEdit" class="action-btn">取消</n-button>
                    <n-button type="primary" @click="handleSaveEdit" :loading="saving" class="action-btn">
                        保存修改
                    </n-button>
                </n-space>
            </n-form>
        </n-modal>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import {
    NButton, NModal, NForm, NFormItem, NInput, NRadioGroup, NRadio,
    NSpace, NDatePicker, NSelect, NAlert, NSpin, NEmpty, NMessageProvider,
    useMessage, useLoadingBar, NCard, NGrid, NGi, NTabs, NTabPane, NTooltip,
    NAvatar, NTag, NEllipsis, NProgress, NText, NUl, NLi
} from 'naive-ui'
import { useWindowSize } from '@vueuse/core'
import service from '../../utils/request';

// 服务实例
const message = useMessage()
const loadingBar = useLoadingBar()
const { width } = useWindowSize()

// 响应式数据
const showAvatarHint = ref(false)
const activeTab = ref('published-courses')
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')
const showEditModal = ref(false)
const saving = ref(false)
const formRef = ref(null)

// 移动端适配
const isMobile = computed(() => width.value < 768)

// 用户信息
const userInfo = ref({
    backgroundImage: '',
    avatar: '',
    name: '',
    email: '',
    gender: '',
    phone: '',
    birthday: '',
    createdAt: '',
    level: '初级'
})

// 计算属性
const displayUserInfo = computed(() => ({
    ...userInfo.value,
    phone: userInfo.value.phone && userInfo.value.phone.length === 11
        ? userInfo.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        : userInfo.value.phone,
    createdAt: formatDateForDisplay(userInfo.value.createdAt)
}))

const levelTagType = computed(() => {
    const levels = { '初级': 'default', '中级': 'info', '高级': 'success', '专家': 'warning', '大师': 'error' }
    return levels[userInfo.value.level] || 'default'
})

const defaultAvatar = computed(() => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.value.name || 'user'}`
})

// 编辑表单数据
const editForm = reactive({
    name: '',
    email: '',
    gender: '男',
    birthday: '',
    phone: '',
    level: '初级',
    password: ''
})

// 学习等级选项
const levelOptions = [
    { label: '初级', value: '初级' },
    { label: '中级', value: '中级' },
    { label: '高级', value: '高级' },
    { label: '专家', value: '专家' },
    { label: '大师', value: '大师' }
]

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] },
        { min: 2, max: 20, message: '用户名称长度为2-20个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
}

// 功能标签
const tabs = [
    { key: 'published-courses', label: '我发布的课程', icon: '📚' },
    { key: 'learning-courses', label: '我学习的课程', icon: '🎓' },
    { key: 'learning-cards', label: '正在学习的卡片', icon: '📝' },
    { key: 'published-cards', label: '我发布的卡片', icon: '📢' },
    { key: 'shared-experiences', label: '我分享的经验', icon: '💡' }
]

// 模拟数据
const publishedCourses = ref([])
const learningCourses = ref([])

// 工具函数
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '未设置'
    try {
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? '无效日期' : date.toLocaleDateString('zh-CN')
    } catch {
        return '无效日期'
    }
}

// API调用函数
const fetchUserInfo = async () => {
    try {
        isLoading.value = true
        isError.value = false
        loadingBar.start()

        const userResponse = await service.get(`/api/user/info/e`, {
            params: { email: localStorage.getItem("userEmail") }
        })

        if (userResponse.code === 200 && userResponse.data) {
            const userData = userResponse.data
            userInfo.value = {
                backgroundImage: userData.backgroundUrl || '',
                avatar: userData.avatarUrl || defaultAvatarUrl,
                name: userData.username || '用户',
                email: userData.email || '',
                gender: userData.gender || '未设置',
                phone: userData.phone || '',
                createdAt: userData.createTime || '',
                level: userData.learningLevel || '初级'
            }
            console.log(userInfo.value.avatar)
        } else {
            throw new Error(userResponse.data?.message || '获取用户信息失败')
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
        isError.value = true
        errorMessage.value = '网络错误，请稍后重试'
    } finally {
        isLoading.value = false
        loadingBar.finish()
    }
}

// 事件处理函数
const triggerAvatarUpload = () => {
    const input = document.querySelector('.avatar-file-input')
    if (input) input.click()
}

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 验证文件类型和大小
    if (!file.type.startsWith('image/')) {
        message.error('请选择图片文件')
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        message.error('图片大小不能超过5MB')
        return
    }

    try {
        const u = JSON.parse(localStorage.getItem("user"))
        if (!u || !u.id) {
            message.error("用户信息获取失败，请重新登录")
            return
        }

        // 创建 FormData
        const formData = new FormData()
        formData.append('id', u.id.toString())
        formData.append('file', file)

        // 发送请求
        const response = await service.post("/api/user/info/modify_avatar", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (response.code === 200) {
            // 预览新头像
            const reader = new FileReader()
            reader.onload = (e) => {
                userInfo.value.avatar = e.target.result
            }
            reader.readAsDataURL(file)
            message.success('头像上传成功')
        } else {
            message.error(response.message || "头像上传失败")
        }
    } catch (error) {
        console.error('头像上传失败:', error)
        if (error.response) {
            console.error('响应数据:', error.response.data)
            message.error(error.response.data.message || "上传失败")
        } else {
            message.error("网络错误，请检查连接")
        }
    } finally {
        // 重置文件输入
        event.target.value = ''
    }
}

const handleEdit = () => {
    Object.assign(editForm, {
        name: userInfo.value.name || '',
        email: userInfo.value.email || '',
        gender: userInfo.value.gender || '男',
        phone: userInfo.value.phone || '',
        level: userInfo.value.level || '初级'
    })
    showEditModal.value = true
}

const handleSaveEdit = async () => {
    try {
        isLoading.value = true
        loadingBar.start()
        isError.value = false
        saving.value = true

        // 格式化生日日期
        let formattedBirthday = ''
        if (editForm.birthday) {
            if (typeof editForm.birthday === 'number') {
                formattedBirthday = new Date(editForm.birthday).toISOString().split('T')[0]
            } else if (editForm.birthday.includes('-')) {
                formattedBirthday = editForm.birthday
            } else {
                const date = new Date(editForm.birthday)
                if (!isNaN(date.getTime())) {
                    formattedBirthday = date.toISOString().split('T')[0]
                }
            }
        }

        // 性别转换
        const genderValue = editForm.gender === '男' ? 1 : (editForm.gender === '女' ? 0 : null)

        const u = JSON.parse(localStorage.getItem("user"))

        // 准备发送给后端的数据
        const requestData = {
            id: u.id,
            username: editForm.name,
            email: editForm.email,
            gender: genderValue,
            birthday: formattedBirthday,
            phone: editForm.phone,
            learningLevel: editForm.level,
            password: editForm.password
        }

        // 调用后端API
        const response = await service.post("/api/user/info/modify", requestData)

        if (response.code === 200) {
            message.success('个人信息更新成功！')

            // 更新前端显示的用户信息
            Object.assign(userInfo.value, {
                name: editForm.name,
                email: editForm.email,
                gender: editForm.gender,
                phone: editForm.phone,
                birthday: formattedBirthday,
                level: editForm.level
            })

            showEditModal.value = false
        } else {
            message.error(response.message || "修改失败！")
        }
    } catch (error) {
        console.error('保存失败:', error)
        message.error("服务器异常，请稍后重试")
    } finally {
        isLoading.value = false
        loadingBar.finish()
        saving.value = false
    }
}

const handleCancelEdit = () => {
    showEditModal.value = false
    message.info('已取消编辑')
}

const handleCreateCourse = () => {
    message.info('跳转到课程创建页面')
}

const handleBrowseCourses = () => {
    message.info('跳转到课程浏览页面')
}

// 生命周期
onMounted(() => {
    fetchUserInfo()
})
</script>

<style scoped>
.user-profile-page {
    min-height: 100vh;
    background: #f5f7fa;
    position: relative;
}

.profile-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-size: cover;
    background-position: center;
}

.background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
}

.profile-content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    z-index: 1;
}

/* 用户信息卡片 */
.user-info-card {
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
}

.card-content {
    display: flex;
    align-items: center;
    position: relative;
}

.avatar-area {
    margin-right: 40px;
}

.avatar-container {
    position: relative;
    width: 100px;
    height: 100px;
    cursor: pointer;
}

.avatar-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 4px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.avatar-hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}
.avatar-container:hover .avatar-circle {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.avatar-default {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: white;
    font-weight: bold;
}

.avatar-tooltip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
    padding: 6px;
    font-size: 12px;
    border-radius: 0 0 50px 50px;
    animation: fadeIn 0.3s ease;
}

.avatar-file-input {
    display: none;
}

.user-details {
    flex: 1;
}

.detail-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
    font-weight: 500;
}

.detail-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.edit-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 24px;
}

/* 功能标签区域 */
.function-tabs-card {
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
}

/* 内容展示区域 */
.content-display-area {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    background: white;
    overflow: hidden;
    min-height: 400px;
}

.tab-content {
    min-height: 400px;
    display: flex;
    flex-direction: column;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-state :deep(.n-empty) {
    max-width: 400px;
}

.empty-state :deep(.n-empty__icon) {
    margin-bottom: 24px;
}

.empty-state :deep(.n-empty__description) {
    font-size: 18px;
    color: #333;
    margin-bottom: 8px;
}

.empty-state :deep(.n-empty__extra) {
    margin-top: 8px;
}

/* 课程卡片样式 */
.course-card,
.learning-course-card {
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.course-card:hover,
.learning-course-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
}

.course-image-container {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.course-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.course-card:hover .course-image,
.learning-course-card:hover .course-image {
    transform: scale(1.05);
}

.progress-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px 12px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
}

/* 课程信息样式 */
.course-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin: 0;
    min-height: 44px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-description {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin: 0;
    min-height: 42px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-meta {
    margin-top: 4px;
}

.meta-text {
    font-size: 12px;
    line-height: 1;
}

/* 学习进度卡片特殊样式 */
.learning-course-card {
    border-color: #e6f7ff;
    background: linear-gradient(to bottom, rgba(230, 247, 255, 0.1), transparent);
}

.learning-course-card:hover {
    border-color: #91d5ff;
    background: linear-gradient(to bottom, rgba(145, 213, 255, 0.1), transparent);
}

/* 错误状态 */
.error-message {
    margin: 40px auto;
    max-width: 400px;
}

.retry-btn {
    margin-top: 16px;
}

/* 表单样式 */
.form-note {
    margin: 16px 0;
}

.form-actions {
    margin-top: 24px;
}

.action-btn {
    min-width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .card-content {
        flex-direction: column;
        text-align: center;
    }

    .avatar-area {
        margin-right: 0;
        margin-bottom: 20px;
    }

    .edit-button {
        position: static;
        margin-top: 20px;
        width: 100%;
    }

    .course-image-container {
        height: 160px;
    }

    .course-title {
        font-size: 15px;
        min-height: 40px;
    }

    .course-description {
        font-size: 13px;
        min-height: 36px;
    }

    .content-display-area {
        border-radius: 12px;
    }
}

@media (max-width: 480px) {
    .profile-content {
        padding: 10px;
    }

    .avatar-container {
        width: 80px;
        height: 80px;
    }

    .tab-content {
        min-height: 300px;
    }

    .empty-state {
        padding: 40px 20px;
    }

    .empty-state :deep(.n-empty__description) {
        font-size: 16px;
    }

    .course-image-container {
        height: 140px;
    }
}
</style>