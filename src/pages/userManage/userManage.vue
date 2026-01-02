<template>
    <div class="user-profile-page">
        <!-- 可自定义背景 -->
        <div class="profile-background" :style="{ backgroundImage: `url(${userInfo.backgroundImage})` }">
            <div class="background-overlay"></div>
        </div>

        <div class="profile-content">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-container">
                <n-spin size="large" description="加载中..." />
            </div>

            <!-- 错误状态 -->
            <div v-else-if="isError" class="error-message">
                <n-alert type="error" title="加载失败">
                    {{ errorMessage }}
                </n-alert>
                <n-button @click="fetchUserInfo" type="primary" class="retry-btn">
                    重新加载
                </n-button>
            </div>

            <!-- 正常内容 -->
            <template v-else>
                <!-- 用户信息卡片 -->
                <div class="user-info-card">
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
                    <div class="user-details">
                        <div class="user-details-row">
                            <div class="detail-item">
                                <span class="detail-label">用户名称</span>
                                <span class="detail-value">{{ displayUserInfo.name }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">用户邮箱</span>
                                <span class="detail-value">{{ displayUserInfo.email }}</span>
                            </div>
                        </div>

                        <div class="user-details-row">
                            <div class="detail-item">
                                <span class="detail-label">用户性别</span>
                                <span class="detail-value">{{ displayUserInfo.gender }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">手机号</span>
                                <span class="detail-value">{{ displayUserInfo.phone }}</span>
                            </div>
                        </div>

                        <div class="user-details-row">
                            <div class="detail-item">
                                <span class="detail-label">用户创建时间</span>
                                <span class="detail-value">{{ displayUserInfo.createdAt }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">用户学习等级</span>
                                <span class="detail-value">{{ displayUserInfo.level }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 编辑按钮 -->
                    <n-button class="edit-button" type="info" @click="handleEdit">
                        编辑个人信息
                    </n-button>
                </div>

                <!-- 功能按钮区域 -->
                <div class="function-tabs">
                    <button v-for="tab in tabs" :key="tab.key" class="tab-button"
                        :class="{ 'tab-active': activeTab === tab.key }" @click="switchTab(tab.key)">
                        <span class="tab-icon">{{ tab.icon }}</span>
                        <span class="tab-text">{{ tab.label }}</span>
                    </button>
                </div>

                <!-- 内容展示区域 -->
                <div class="content-display-area">
                    <transition name="tab-fade" mode="out-in">
                        <!-- 我发布的课程 -->
                        <div v-if="activeTab === 'published-courses'" class="content-section">
                            <div v-if="publishedCourses.length === 0" class="empty-state">
                                <n-empty size="large" description="暂无发布的课程">
                                    <template #extra>
                                        <n-button size="small" @click="handleCreateCourse">
                                            创建课程
                                        </n-button>
                                    </template>
                                </n-empty>
                            </div>
                            <div v-else v-for="course in publishedCourses" :key="course.id" class="content-card">
                                <div class="card-image">
                                    <img :src="course.cover" :alt="course.title">
                                </div>
                                <div class="card-body">
                                    <h4 class="card-title">{{ course.title }}</h4>
                                    <p class="card-description">{{ course.description }}</p>
                                    <div class="card-meta">
                                        <span class="card-category">{{ course.category }}</span>
                                        <span class="card-students">{{ course.students }} 人学习</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 我学习的课程 -->
                        <div v-else-if="activeTab === 'learning-courses'" class="content-section">
                            <div v-if="learningCourses.length === 0" class="empty-state">
                                <n-empty size="large" description="暂无学习中的课程">
                                    <template #extra>
                                        <n-button size="small" @click="handleBrowseCourses">
                                            浏览课程
                                        </n-button>
                                    </template>
                                </n-empty>
                            </div>
                            <div v-else v-for="course in learningCourses" :key="course.id" class="content-card">
                                <div class="card-image">
                                    <img :src="course.cover" :alt="course.title">
                                    <div class="progress-container">
                                        <div class="progress-bar" :style="{ width: `${course.progress}%` }"></div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <h4 class="card-title">{{ course.title }}</h4>
                                    <div class="card-progress">
                                        <span class="progress-text">学习进度: {{ course.progress }}%</span>
                                        <span class="progress-time">已学习 {{ course.timeSpent }}h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 其他标签页内容... -->
                    </transition>
                </div>
            </template>
        </div>
    </div>

    <n-modal v-model:show="showEditModal" preset="card" title="👤 编辑个人信息" :bordered="false" size="huge"
        class="edit-modal" :mask-closable="false" style="width: 500px;">
        <div class="edit-form-container">
            <!-- 表单区域 -->
            <n-form ref="formRef" :model="editForm" :rules="rules" label-placement="left" label-width="100"
                label-align="right" size="large" class="edit-form">
                <!-- 用户名称 -->
                <n-form-item label="👤 用户名称" path="name">
                    <n-input v-model:value="editForm.name" placeholder="请输入用户名称" :maxlength="30" clearable />
                </n-form-item>

                <!-- 用户性别 -->
                <n-form-item label="👫 用户性别" path="gender" :maxlength="30">
                    <n-radio-group v-model:value="editForm.gender" class="gender-radio">
                        <n-space>
                            <n-radio value="男">
                                <n-space align="center" :size="4">
                                    <span style="font-size: 16px;">👨</span>
                                    <span>男</span>
                                </n-space>
                            </n-radio>
                            <n-radio value="女">
                                <n-space align="center" :size="4">
                                    <span style="font-size: 16px;">👩</span>
                                    <span>女</span>
                                </n-space>
                            </n-radio>
                            <n-radio value="保密">
                                <n-space align="center" :size="4">
                                    <span style="font-size: 16px;">🤐</span>
                                    <span>保密</span>
                                </n-space>
                            </n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>

                <!-- 出生日期 -->
                <n-form-item label="📅 出生日期" path="birthday" :maxlength="30">
                    <n-date-picker v-model:formatted-value="editForm.birthday" value-format="yyyy-MM-dd" type="date"
                        actions="['今天','确定']" clearable style="width: 100%;" />
                </n-form-item>

                <!-- 用户邮箱 -->
                <n-form-item label="📧 用户邮箱" path="email" :maxlength="30">
                    <n-input v-model:value="editForm.email" placeholder="请输入用户邮箱" type="email" clearable />
                </n-form-item>
                <!-- 在模态框表单中添加密码字段 -->
                <n-form-item label="🔐 密码" path="password">
                    <n-input v-model:value="editForm.password" placeholder="请输入密码" type="password" clearable
                        show-password-on="mousedown" />
                </n-form-item>
                <!-- 手机号码 -->
                <n-form-item label="📱 手机号码" path="phone" :maxlength="30">
                    <n-input v-model:value="editForm.phone" placeholder="请输入手机号码" :maxlength="11" clearable />
                </n-form-item>

                <!-- 学习等级 -->
                <n-form-item label="🏆 学习等级" path="level">
                    <n-select v-model:value="editForm.level" :disabled="true" :options="levelOptions"
                        placeholder="请选择学习等级" clearable />
                </n-form-item>

                <!-- 说明区域 -->
                <div class="form-note">
                    <n-alert title="💡 说明" type="info" :bordered="false" :maxlength="40">
                        <ul class="note-list">
                            <li>用户名称和邮箱将用于登录和找回密码</li>
                            <li>手机号用于重要通知和安全验证</li>
                            <li>学习等级会根据您的学习进度自动更新</li>
                        </ul>
                    </n-alert>
                </div>
            </n-form>

            <!-- 表单操作按钮 -->
            <div class="form-actions">
                <n-space justify="center" :size="20">
                    <n-button type="error" size="large" @click="handleCancelEdit" class="action-btn cancel-btn">
                        取消
                    </n-button>

                    <n-button type="primary" size="large" @click="handleSaveEdit" :loading="saving"
                        class="action-btn save-btn">
                        保存修改
                    </n-button>
                </n-space>
            </div>
        </div>
    </n-modal>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import {
    NButton, NModal, NForm, NFormItem, NInput, NRadioGroup, NRadio,
    NSpace, NDatePicker, NSelect, NAlert, NSpin, NEmpty, NMessageProvider,
    useMessage, useLoadingBar
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
const responsiveConfig = computed(() => ({
    formLayout: isMobile.value ? 'vertical' : 'horizontal',
    labelWidth: isMobile.value ? 'auto' : '100px',
    buttonSize: isMobile.value ? 'large' : 'medium'
}))

// 用户信息
const userInfo = ref({
    backgroundImage: '',
    avatar: '',
    name: '',
    email: '',
    gender: '',
    phone: '',
    createdAt: '',
    level: ''
})

// 格式化显示的用户信息
const displayUserInfo = computed(() => ({
    ...userInfo.value,
    phone: userInfo.value.phone && userInfo.value.phone.length === 11
        ? userInfo.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        : userInfo.value.phone,
    createdAt: formatDateForDisplay(userInfo.value.createdAt)
}))

// 编辑表单数据
const editForm = reactive({
    name: '',
    email: '',
    gender: '',
    phone: '',
    createdAt: null,
    level: '',
    password: '',
})

// 学习等级选项
const levelOptions = [
    { label: '初级', value: '初级' },
    { label: '中级', value: '中级' },
    { label: '高级', value: '高级' },
    { label: '专家', value: '专家' },
    { label: '大师', value: '大师' }
]

// 表单验证规则 [6,7](@ref)
const rules = {
    name: [
        { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] },
        { min: 2, max: 20, message: '用户名称长度为2-20个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
        {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur',
            validator: (rule, value) => {
                if (!value) return true
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return emailRegex.test(value)
            }
        }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
        }
    ],
    createdAt: [
        { required: true, message: '请选择创建时间', trigger: 'change' }
    ],
    level: [
        { required: true, message: '请选择学习等级', trigger: 'change' }
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

// 日期处理函数 [6](@ref)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '未设置'
    try {
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? '无效日期' : date.toLocaleDateString('zh-CN')
    } catch {
        return '无效日期'
    }
}

const parseDateForPicker = (dateString) => {
    if (!dateString) return null
    try {
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? null : date.getTime()
    } catch {
        return null
    }
}

const getDefaultDate = () => {
    return userInfo.value.createdAt ? parseDateForPicker(userInfo.value.createdAt) : Date.now()
}

// API调用函数
const fetchUserInfo = async () => {
    try {
        isLoading.value = true
        isError.value = false
        loadingBar.start()

        // 模拟API调用
        const userResponse = await service.get(`/api/user/info/e`, {
            params: { email: localStorage.getItem("userEmail") }
        })

        if (userResponse.code === 200 && userResponse.data) {
            const userData = userResponse.data
            userInfo.value = {
                backgroundImage: userData.backgroundUrl || '',
                avatar: userData.avatarUrl || '',
                name: userData.username || '用户',
                email: userData.email || '',
                gender: userData.gender || '未设置',
                phone: userData.phone || '',
                createdAt: userData.createTime || '',
                level: userData.learningLevel || '初级'
            }
        } else {
            throw new Error(userResponse.data?.message || '获取用户信息失败')
        }
    } catch (error) {
        console.error('获取用户信息失败:', error)
        isError.value = true
        errorMessage.value = error.response?.data?.message || error.message || '网络错误，请稍后重试'
        message.error(`获取用户信息失败: ${errorMessage.value}`)
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

const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // 验证文件类型和大小 [1](@ref)
        if (!file.type.startsWith('image/')) {
            message.error('请选择图片文件')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error('图片大小不能超过5MB')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            userInfo.value.avatar = e.target.result
            message.success('头像上传成功')
        }
        reader.readAsDataURL(file)
    }
    event.target.value = ''
}

const handleEdit = () => {
    Object.assign(editForm, {
        name: userInfo.value.name || '',
        email: userInfo.value.email || '',
        gender: userInfo.value.gender || '男',
        phone: userInfo.value.phone || '',
        createdAt: parseDateForPicker(userInfo.value.createdAt),
        level: userInfo.value.level || '初级'
    })
    showEditModal.value = true
}


const handleSaveEdit = async () => {

    try {
        isLoading.value = true
        isError.value = false
        loadingBar.start()
        saving.value = true


        // 格式化生日日期
        let formattedBirthday = ''
        if (editForm.birthday) {
            // 如果是时间戳，转换为日期
            if (typeof editForm.birthday === 'number') {
                formattedBirthday = new Date(editForm.birthday).toISOString().split('T')[0]
            } else if (editForm.birthday.includes('-')) {
                // 如果是yyyy-MM-dd格式，直接使用
                formattedBirthday = editForm.birthday
            } else {
                // 其他情况尝试解析
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
            id:u.id,
            username: editForm.name,
            email: editForm.email,
            gender: genderValue,
            birthday: formattedBirthday,  // 使用格式化后的日期字符串
            phone: editForm.phone,
            learningLevel: editForm.level , // 添加学习等级
            password: editForm.password 
        }

        console.log('发送给后端的数据:', requestData)

        // 调用后端API
        const response = await service.post("/api/user/info/modify", requestData)

        console.log('后端响应:', response)

        if (response.code === 200) {
            message.success('个人信息更新成功！')

            // 更新前端显示的用户信息
            Object.assign(userInfo.value, {
                name: editForm.name,
                email: editForm.email,
                gender: editForm.gender,
                phone: editForm.phone,
                // 如果是生日字段，可能需要单独存储
                birthday: formattedBirthday,  // 存储为生日字段
                createdAt: userInfo.value.createdAt,  // 保持创建时间不变
                level: editForm.level
            })

            showEditModal.value = false
        } else {
            message.error(response.message || "修改失败！")
        }
    } catch (error) {
        message.error("服务器异常")
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

const switchTab = (tabKey) => {
    activeTab.value = tabKey
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
/* 之前的CSS样式保持不变，添加以下响应式样式 */
.loading-container,
.error-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
}

.retry-btn {
    margin-top: 16px;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.form-grid.single-column {
    grid-template-columns: 1fr !important;
}

/* 原有的CSS样式保持不变 */
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
    background-size: cover;
    background-position: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    z-index: 1;
}

.user-info-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    position: relative;
}

/* 其他样式保持不变... */

@media (max-width: 768px) {
    .user-info-card {
        flex-direction: column;
        text-align: center;
        padding: 20px;
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

    .function-tabs {
        flex-direction: column;
    }

    .content-section {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .profile-content {
        padding: 10px;
    }
}

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
    background-size: cover;
    background-position: center;
    background-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
}

.profile-content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    z-index: 1;
    opacity: ;
}

/* 用户信息卡片 */
.user-info-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid #e8e8e8;
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

/* 用户详细信息 */
.user-details {
    flex: 1;
}

.user-details-row {
    display: flex;
    margin-bottom: 20px;
    gap: 40px;
}

.detail-item {
    flex: 1;
    min-width: 200px;
}

.detail-label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
    font-weight: 500;
}

.detail-value {
    display: block;
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

/* 编辑按钮 */
.edit-button {
    position: absolute;
    top: 30px;
    right: 30px;
    padding: 8px 24px;
}

.edit-button:hover {
    background: #1890ff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* 功能标签区域 */
.function-tabs {
    display: flex;
    gap: 4px;
    background: white;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
}

.tab-button {
    flex: 1;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    font-family: inherit;
}

.tab-button:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    border-color: #e6f7ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-active {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    color: white !important;
    border-color: #1890ff !important;
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3) !important;
}

.tab-active:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(24, 144, 255, 0.4) !important;
}

.tab-icon {
    font-size: 24px;
    margin-bottom: 4px;
    transition: transform 0.3s ease;
}

.tab-button:hover .tab-icon {
    transform: scale(1.1);
}

.tab-active .tab-icon {
    transform: scale(1.1);
}

.tab-text {
    font-size: 14px;
    font-weight: 500;
}

/* 内容展示区域 */
.content-display-area {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;
    min-height: 400px;
    position: relative;
    overflow: hidden;
}

.content-section {
    display: flex;
    gap: 24px;
    padding: 8px 4px 20px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    height: 100%;
    align-items: stretch;
}

.content-section::-webkit-scrollbar {
    display: none;
}

/* 课程卡片 */
.content-card {
    flex: 0 0 280px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.content-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
}

.card-image {
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.content-card:hover .card-image img {
    transform: scale(1.05);
}

.progress-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #52c41a, #73d13d);
    transition: width 0.3s ease;
}

.card-body {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-description {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
}

.card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
}

.card-category {
    font-size: 12px;
    padding: 4px 8px;
    background: #f0f7ff;
    color: #1890ff;
    border-radius: 4px;
    font-weight: 500;
}

.card-students {
    font-size: 12px;
    color: #999;
}

.card-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
}

.progress-text {
    font-size: 13px;
    color: #52c41a;
    font-weight: 500;
}

.progress-time {
    font-size: 12px;
    color: #999;
}

/* 卡片列表（文本卡片） */
.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 8px;
    max-height: 400px;
}

.card-list::-webkit-scrollbar {
    display: none;
}

.text-card,
.experience-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
}

.text-card:hover,
.experience-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.text-card {
    border-color: #1890ff;
}

.text-card:hover {
    border-color: #1890ff;
}

.experience-card {
    border-color: #faad14;
}

.experience-card:hover {
    border-color: #faad14;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.card-status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
}

.status-learning {
    background: #e6f7ff;
    color: #1890ff;
}

.status-mastered {
    background: #f6ffed;
    color: #52c41a;
}

.card-views {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
}

.card-content {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
    font-size: 12px;
    color: #999;
}

.card-likes {
    color: #f5222d;
}

.exp-tag {
    font-size: 12px;
    padding: 4px 8px;
    background: #fff7e6;
    color: #faad14;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
}

.exp-content {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.exp-likes,
.exp-comments {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 切换动画 */
.tab-fade-enter-active,
.tab-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.tab-fade-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.tab-fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-info-card {
        flex-direction: column;
        text-align: center;
        padding: 20px;
    }

    .avatar-area {
        margin-right: 0;
        margin-bottom: 20px;
    }

    .avatar-circle {
        width: 80px;
        height: 80px;
    }

    .avatar-default {
        font-size: 24px;
    }

    .user-details-row {
        flex-direction: column;
        gap: 16px;
    }

    .detail-item {
        min-width: 100%;
    }

    .edit-button {
        position: static;
        margin-top: 20px;
        width: 100%;
    }

    .function-tabs {
        flex-direction: column;
    }

    .tab-button {
        padding: 16px;
    }

    .content-section {
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 500px;
    }

    .content-card {
        flex: 0 0 auto;
        width: 100%;
    }

    .card-list {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .profile-content {
        padding: 10px;
    }

    .avatar-circle {
        width: 60px;
        height: 60px;
    }

    .tab-button {
        padding: 12px;
    }

    .tab-icon {
        font-size: 20px;
    }

    .tab-text {
        font-size: 12px;
    }

    .content-display-area {
        padding: 20px;
    }
}
</style>