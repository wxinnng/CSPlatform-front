<!-- src/views/auth/LoginRegister.vue -->
<template>
  <div class="auth-page" :class="{ 'dark-theme': isDark }">
    <!-- 背景装饰 -->
    <div class="auth-background">
      <div class="shape shape-1" :class="{ 'dark': isDark }"></div>
      <div class="shape shape-2" :class="{ 'dark': isDark }"></div>
    </div>

    <!-- 主要内容 -->
    <div class="auth-container">
      <!-- Logo和标题 -->
      <div class="auth-header">
        <n-gradient-text :size="20" type="danger" class="logo-text">
          Sing Platform
        </n-gradient-text>
        <n-text class="welcome-text">
          {{ isLogin ? '欢迎回来' : '加入我们' }}
        </n-text>
      </div>

      <!-- 表单区域 -->
      <div class="auth-form">
        <!-- 标签切换 -->
        <n-tabs
          v-model:value="activeTab"
          type="line"
          size="large"
          class="auth-tabs"
          :on-update:value="handleTabChange"
        >
          <n-tab name="login">
            登录
          </n-tab>
          <n-tab name="register">
            注册
          </n-tab>
        </n-tabs>

        <!-- 登录表单 -->
        <transition name="fade" mode="out-in">
          <div v-if="isLogin" key="login" class="form-content">
            <n-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
            >
              <n-form-item path="email" label="邮箱地址">
                <n-input
                  v-model:value="loginForm.email"
                  placeholder="请输入邮箱地址"
                  size="medium"
                  :input-props="{ autocomplete: 'username' }"
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>

              <n-form-item path="password" label="密码">
                <n-input
                  v-model:value="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  size="medium"
                  show-password-on="click"
                  :input-props="{ autocomplete: 'current-password' }"
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>

              <!-- 记住我和忘记密码 -->
              <div class="form-options">
                <n-checkbox v-model:checked="rememberMe">
                  记住我
                </n-checkbox>
                <n-button text type="primary" @click="showForgetPassword = true">
                  忘记密码？
                </n-button>
              </div>

              <n-button
                type="primary"
                size="medium"
                :loading="loginLoading"
                @click="handleLogin"
                class="submit-btn"
              >
                登录
              </n-button>
            </n-form>
          </div>

          <!-- 注册表单 -->
          <div v-else key="register" class="form-content">
            <n-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              class="register-form"
            >
              <n-form-item path="email" label="邮箱地址">
                <n-input
                  v-model:value="registerForm.email"
                  placeholder="请输入邮箱地址"
                  size="medium"
                  :input-props="{ autocomplete: 'email' }"
                  @blur="validateEmail"
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>

              <n-form-item path="password" label="密码">
                <n-input
                  v-model:value="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  size="medium"
                  show-password-on="click"
                  :input-props="{ autocomplete: 'new-password' }"
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>

              <n-form-item path="confirmPassword" label="确认密码">
                <n-input
                  v-model:value="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  size="medium"
                  show-password-on="click"
                  :input-props="{ autocomplete: 'new-password' }"
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>

              <n-form-item path="verificationCode" label="邮箱验证码">
                <div class="code-input-wrapper">
                  <n-input-otp
                    v-model:value="registerForm.verificationCode"
                    :length="6"
                    :mask="false"
                    :loading="codeLoading"
                    :input-props="{ autocomplete: 'one-time-code' }"
                    class="verification-code-input"
                    @finish="onCodeFinish"
                    @update:value="onCodeUpdate"
                  />
                  <n-button
                    type="primary"
                    :disabled="!canSendCode || countdown > 0"
                    :loading="sendingCode"
                    @click="sendVerificationCode"
                    class="send-code-btn"
                    size="medium"
                  >
                    {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
                  </n-button>
                </div>
              </n-form-item>

              <!-- 协议同意 -->
              <div class="agreement">
                <n-checkbox v-model:checked="agreedToTerms">
                  我已阅读并同意
                </n-checkbox>
                <n-button text type="primary" @click="showTerms = true">
                  《用户协议》
                </n-button>
                和
                <n-button text type="primary" @click="showPrivacy = true">
                  《隐私政策》
                </n-button>
              </div>

              <n-button
                type="primary"
                size="medium"
                :loading="registerLoading"
                :disabled="!agreedToTerms"
                @click="handleRegister"
                class="submit-btn"
              >
                注册
              </n-button>
            </n-form>
          </div>
        </transition>
      </div>

      <!-- 切换提示 -->
      <div class="auth-footer">
        <n-text depth="3">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
        </n-text>
        <n-button
          text
          type="primary"
          @click="toggleMode"
          class="switch-btn"
        >
          {{ isLogin ? '立即注册' : '立即登录' }}
        </n-button>
      </div>
    </div>

    <!-- 模态框 -->
    <!-- 忘记密码模态框 -->
    <n-modal
      v-model:show="showForgetPassword"
      preset="dialog"
      title="忘记密码"
      positive-text="发送重置邮件"
      negative-text="取消"
      @positive-click="handleForgetPassword"
      @negative-click="showForgetPassword = false"
    >
      <n-form
        ref="forgetPasswordFormRef"
        :model="forgetPasswordForm"
        :rules="forgetPasswordRules"
      >
        <n-form-item path="email" label="邮箱地址">
          <n-input
            v-model:value="forgetPasswordForm.email"
            placeholder="请输入注册邮箱"
            size="medium"
          />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 用户协议模态框 -->
    <n-modal
      v-model:show="showTerms"
      title="用户协议"
      preset="card"
      style="max-width: 500px;"
    >
      <div class="terms-content">
        <h3>用户协议</h3>
        <p>欢迎使用Sing Platform，请您在使用前仔细阅读本协议...</p>
        <p>1. 用户注册需提供真实、准确、完整的个人资料</p>
        <p>2. 用户对其账号和密码的安全负全部责任</p>
        <p>3. 不得利用本服务从事任何违法违规活动</p>
      </div>
    </n-modal>

    <!-- 隐私政策模态框 -->
    <n-modal
      v-model:show="showPrivacy"
      title="隐私政策"
      preset="card"
      style="max-width: 500px;"
    >
      <div class="privacy-content">
        <h3>隐私政策</h3>
        <p>我们尊重并保护所有使用服务用户的个人隐私权...</p>
        <p>1. 我们收集的信息仅用于为您提供更好的服务</p>
        <p>2. 我们不会将您的个人信息出售或泄露给第三方</p>
        <p>3. 您可以随时查看、修改或删除您的个人信息</p>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch } from 'vue';
import { 
  NForm, 
  NFormItem, 
  NInput, 
  NInputOtp,
  NButton, 
  NTabs, 
  NTab, 
  NText, 
  NGradientText,
  NIcon, 
  NCheckbox, 
  NModal,
  useMessage,
  useLoadingBar
} from 'naive-ui';
import { useRouter } from 'vue-router';
import service from '../../utils/request'

const router = useRouter();
const message = useMessage();
const loadingBar = useLoadingBar();

// 主题状态 - 从localStorage读取
const isDark = ref(false);

// 监听主题变化
const updateTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  isDark.value = theme === 'dark';
  // 更新文档的data-theme属性
  document.documentElement.setAttribute('data-theme', theme);
  console.log('登录页主题更新:', theme, isDark.value);
};

// 监听localStorage变化
const setupStorageListener = () => {
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      console.log('检测到主题变化:', e.newValue);
      updateTheme();
    }
  });
};

// 监听自定义主题变化事件
const setupThemeChangeListener = () => {
  window.addEventListener('theme-change', () => {
    console.log('收到theme-change事件');
    updateTheme();
  });
};

// 表单引用
const loginFormRef = ref(null);
const registerFormRef = ref(null);
const forgetPasswordFormRef = ref(null);

// 状态控制
const activeTab = ref('login');
const isLogin = computed(() => activeTab.value === 'login');
const rememberMe = ref(false);
const agreedToTerms = ref(false);

// 加载状态
const loginLoading = ref(false);
const registerLoading = ref(false);
const sendingCode = ref(false);
const codeLoading = ref(false);

// 倒计时
const countdown = ref(0);
let countdownTimer = null;

// 模态框控制
const showForgetPassword = ref(false);
const showTerms = ref(false);
const showPrivacy = ref(false);

// 登录表单
const loginForm = reactive({
  email: '',
  password: ''
});

// 注册表单
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
});

// 忘记密码表单
const forgetPasswordForm = reactive({
  email: ''
});

// 验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ]
};

const registerRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { 
      validator: (rule, value) => value === registerForm.password,
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码必须为6位', trigger: 'blur' }
  ]
};

const forgetPasswordRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

// 计算是否可以发送验证码
const canSendCode = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(registerForm.email);
});

// 切换登录/注册
const toggleMode = () => {
  activeTab.value = isLogin.value ? 'register' : 'login';
};

// 标签页切换处理
const handleTabChange = (value) => {
  activeTab.value = value;
  // 重置表单
  if (loginFormRef.value) loginFormRef.value.restoreValidation();
  if (registerFormRef.value) registerFormRef.value.restoreValidation();
};

// 验证邮箱格式
const validateEmail = () => {
  if (registerForm.email && !canSendCode.value) {
    message.error('邮箱格式不正确');
  }
};

// 发送验证码
const sendVerificationCode = async () => {
  if (!canSendCode.value) {
    message.error('请先输入正确的邮箱地址');
    return;
  }

  sendingCode.value = true;
  loadingBar.start();

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 开始倒计时
    startCountdown();
    message.success('验证码已发送到您的邮箱，请注意查收');
  } catch (error) {
    message.error('验证码发送失败，请重试');
  } finally {
    sendingCode.value = false;
    loadingBar.finish();
  }
};

// 开始倒计时
const startCountdown = (seconds = 60) => {
  countdown.value = seconds;
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

//TODO: 验证码输入完成
const onCodeFinish = (value) => {
  console.log('验证码输入完成:', value);
  codeLoading.value = true;
  
  // 模拟验证码验证
  setTimeout(() => {
    codeLoading.value = false;
    if (value === '123456') { // 这里应该是后端验证
      message.success('验证码验证成功');
    } else {
      message.error('验证码错误，请重新输入');
    }
  }, 500);
};

// 验证码输入更新
const onCodeUpdate = (value) => {
  console.log('验证码更新:', value);
};

// 处理登录
const handleLogin = async () => {
  try {
    // 1. 表单验证
    await loginFormRef.value?.validate()
    
    // 2. 开始加载
    loginLoading.value = true
    loadingBar.start()
    // console.log(loginForm)
    // 3. 模拟API调用（实际项目中替换为真实API）
    const response = await mockLoginAPI(loginForm)
    console.log(response)

    // 4. 登录成功处理
    if (response.code == 200) {
      // 存储登录信息
      saveLoginData(response.data, rememberMe.value)
      
      // 显示成功消息
      message.success('登录成功，正在跳转...')
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        // 检查是否有重定向路径
        const redirect = router.currentRoute.value.query.redirect || '/mainPage'
        router.push(redirect)
      }, 1000)
    } else {
      message.error(response.message || '登录失败')
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    
    // 根据错误类型显示不同消息
    if (error.name === 'ValidationError') {
      message.error('表单验证失败，请检查输入')
    } else if (error.message.includes('网络')) {
      message.error('网络错误，请检查连接')
    } else if (error.message.includes('密码')) {
      message.error('邮箱或密码错误')
    } else {
      message.error(error.message || '登录失败，请重试')
    }
    
  } finally {
    // 5. 结束加载
    loginLoading.value = false
    loadingBar.finish()
  }
}

// 模拟登录API（实际项目中使用真实的登录接口）
// 模拟登录API（实际项目中使用真实的登录接口）
const mockLoginAPI = async (formData) => {
  try {
    console.log(formData)

    const response = await service.post('/api/user/auth/login', {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe || false
    })
    return response
    
  } catch (error) {
    throw error
  }
}


// 保存登录数据
const saveLoginData = (data, remember) => {
  const { token, refreshToken, user, expiresIn } = data
  
  // 计算过期时间
  const expiryTime = new Date().getTime() + expiresIn * 1000
  
  if (remember) {
    // 使用 localStorage（长期存储）
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token_expiry', expiryTime.toString())
    localStorage.setItem('rememberMe', 'true')
    localStorage.setItem('userEmail', user.email)
  } else {
    // 使用 sessionStorage（会话期间存储）
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('refresh_token', refreshToken)
    sessionStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('token_expiry', expiryTime.toString())
    
    // 清理 localStorage 的相关数据
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('token_expiry')
  }
  
  // 设置 token 过期定时提醒（可选）
  setupTokenExpiryReminder(expiryTime)
  
  // 也可以设置自动刷新 token 的逻辑
  setupTokenAutoRefresh(refreshToken, expiryTime)
}

// 设置 token 过期提醒
const setupTokenExpiryReminder = (expiryTime) => {
  const now = new Date().getTime()
  const timeToExpiry = expiryTime - now
  
  if (timeToExpiry > 0) {
    // 在过期前5分钟提醒
    const reminderTime = Math.max(timeToExpiry - 5 * 60 * 1000, 0)
    
    setTimeout(() => {
      message.warning('登录状态即将过期，请及时保存工作')
    }, reminderTime)
  }
}

// 设置 token 自动刷新
const setupTokenAutoRefresh = (refreshToken, expiryTime) => {
  const now = new Date().getTime()
  const refreshTime = expiryTime - 10 * 60 * 1000 // 过期前10分钟刷新
  
  if (refreshTime > now) {
    setTimeout(async () => {
      try {
        await refreshTokenAPI(refreshToken)
      } catch (error) {
        console.error('Token 刷新失败:', error)
      }
    }, refreshTime - now)
  }
}

// 模拟刷新 token API
const refreshTokenAPI = async (refreshToken) => {
  // 实际项目中实现 token 刷新逻辑
  console.log('刷新 token:', refreshToken)
  return Promise.resolve()
}

// 检查记住我状态
const checkRememberMe = () => {
  const remembered = localStorage.getItem('rememberMe') === 'true'
  if (remembered) {
    rememberMe.value = true
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      loginForm.value.email = savedEmail
    }
  }
}


// 处理注册
const handleRegister = async () => {
  try {
    if (!agreedToTerms.value) {
      message.warning('请先阅读并同意用户协议和隐私政策');
      return;
    }
    
    await registerFormRef.value?.validate();
    
    registerLoading.value = true;
    loadingBar.start();
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    message.success('注册成功，正在跳转...');
    
    // 切换到登录页
    setTimeout(() => {
      activeTab.value = 'login';
      // 清空注册表单
      Object.keys(registerForm).forEach(key => {
        registerForm[key] = '';
      });
      agreedToTerms.value = false;
    }, 1000);
  } catch (errors) {
    console.error('注册验证失败:', errors);
  } finally {
    registerLoading.value = false;
    loadingBar.finish();
  }
};

// 处理忘记密码
const handleForgetPassword = async () => {
  try {
    await forgetPasswordFormRef.value?.validate();
    
    loadingBar.start();
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    message.success('重置密码邮件已发送，请查收您的邮箱');
    showForgetPassword.value = false;
  } catch (errors) {
    console.error('忘记密码验证失败:', errors);
  } finally {
    loadingBar.finish();
  }
};

// 组件挂载时检查记住我和主题
onMounted(() => {
  updateTheme();
  setupStorageListener();
  setupThemeChangeListener();
  
  // 检查记住我
  if (localStorage.getItem('rememberMe') === 'true') {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      loginForm.email = savedEmail;
      rememberMe.value = true;
    }
  }
});

// 组件卸载前清理定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 通过data-theme属性控制主题 */
.auth-page[data-theme="light"] {
  --bg-color: #f8f8fa;
  --container-bg: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.08);
  --input-bg: #ffffff;
  --input-border: #d9d9d9;
  --input-text: #333333;
  --placeholder-color: #999999;
  --label-color: #666666;
  --checkbox-color: #666666;
  --link-color: #1890ff;
  --hover-bg: rgba(0, 0, 0, 0.02);
  --primary-color: #18a058;
  --primary-hover: #36ad6a;
}

.auth-page[data-theme="dark"] {
  --bg-color: #101014;
  --container-bg: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: #333333;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --input-bg: #2d2d2d;
  --input-border: #434343;
  --input-text: #e0e0e0;
  --placeholder-color: #888888;
  --label-color: #aaaaaa;
  --checkbox-color: #aaaaaa;
  --link-color: #63e2b7;
  --hover-bg: rgba(255, 255, 255, 0.05);
  --primary-color: #63e2b7;
  --primary-hover: #7fe7c4;
}

/* 设置页面背景 */
.auth-page {
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* 背景装饰 */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.auth-background .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.1;
  transition: all 0.3s ease;
}

.auth-page[data-theme="dark"] .auth-background .shape {
  opacity: 0.15;
}

.auth-background .shape-1 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, var(--link-color), #722ed1);
  top: 10%;
  left: 10%;
  animation: float 20s infinite ease-in-out;
}

.auth-background .shape-2 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #52c41a, #13c2c2);
  bottom: 20%;
  right: 15%;
  animation: float 25s infinite ease-in-out reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

/* 主容器 */
.auth-container {
  width: 100%;
  max-width: 320px;
  background: var(--container-bg);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  padding: 24px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

/* 头部 */
.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo-text {
  font-weight: bold;
  display: block;
  margin-bottom: 6px;
}

.welcome-text {
  font-size: 13px;
  color: var(--text-color);
  opacity: 0.8;
  letter-spacing: 0.5px;
}

/* 标签页 */
.auth-tabs {
  margin-bottom: 20px;
}

:deep(.auth-tabs .n-tab-pane) {
  padding: 0;
}

:deep(.auth-tabs .n-tabs-tab) {
  font-size: 15px;
  padding: 6px 12px;
  color: var(--text-color);
}

:deep(.auth-tabs .n-tabs-bar) {
  background: var(--primary-color);
}

/* 表单内容 */
.form-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单样式 */
.login-form,
.register-form {
  width: 100%;
}

/* 表单标签 */
:deep(.n-form-item-label) {
  font-weight: 500;
  color: var(--label-color);
  margin-bottom: 6px;
  font-size: 13px;
}

/* 输入框 */
:deep(.n-input) {
  border-radius: 6px;
  transition: all 0.3s ease;
  height: 40px;
  font-size: 13px;
  background: var(--input-bg);
  border-color: var(--input-border);
  color: var(--input-text);
}

:deep(.n-input .n-input__input-el) {
  color: var(--input-text);
}

:deep(.n-input .n-input__placeholder) {
  color: var(--placeholder-color);
}

:deep(.n-input .n-input__prefix) {
  color: var(--placeholder-color);
}

:deep(.n-input:hover) {
  border-color: var(--primary-color);
  background: var(--input-bg);
}

:deep(.n-input:focus-within) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 20%, transparent);
  background: var(--input-bg);
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 12px;
}

:deep(.form-options .n-checkbox) {
  color: var(--checkbox-color);
  font-size: 12px;
}

:deep(.form-options .n-checkbox .n-checkbox__label) {
  color: var(--checkbox-color);
}

:deep(.form-options .n-button) {
  color: var(--link-color);
  font-size: 12px;
}

/* 验证码输入 */
.code-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.verification-code-input {
  flex: 1;
}

:deep(.n-input-otp) {
  gap: 6px;
}

:deep(.n-input-otp .n-input-otp-input) {
  height: 40px;
  width: 36px;
  font-size: 15px;
  text-align: center;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
}

:deep(.n-input-otp .n-input-otp-input:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 20%, transparent);
}

.send-code-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.send-code-btn:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

/* 协议同意 */
.agreement {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0 20px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--checkbox-color);
  line-height: 1.4;
}

:deep(.agreement .n-checkbox) {
  margin-right: 4px;
  font-size: 12px;
}

:deep(.agreement .n-checkbox .n-checkbox__label) {
  color: var(--checkbox-color);
  font-size: 12px;
}

:deep(.agreement .n-button) {
  color: var(--link-color);
  font-size: 12px;
  padding: 0 2px;
  height: auto;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 0;
  /* background-color: var(--primary-color);
  border-color: var(--primary-color); */
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-color);
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 页脚 */
.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
}

:deep(.auth-footer .n-text) {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 12px;
}

:deep(.auth-footer .n-button) {
  color: var(--link-color);
  font-size: 12px;
  padding: 0 4px;
  height: auto;
}

/* 模态框内容 */
:deep(.n-modal) {
  color: var(--text-color);
}

:deep(.n-modal .n-card) {
  background: var(--container-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

:deep(.n-modal .n-dialog) {
  background: var(--container-bg);
  border: 1px solid var(--border-color);
}

.terms-content,
.privacy-content {
  padding: 16px 0;
  color: var(--text-color);
  font-size: 13px;
  line-height: 1.6;
}

.terms-content h3,
.privacy-content h3 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
}

.terms-content p,
.privacy-content p {
  margin: 0 0 8px 0;
  color: var(--text-color);
  opacity: 0.9;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(15px);
}

/* 响应式设计 */
@media (max-width: 576px) {
  .auth-container {
    padding: 20px 16px;
    max-width: 280px;
  }
  
  .code-input-wrapper {
    flex-direction: column;
  }
  
  .send-code-btn {
    width: 100%;
  }
  
  .auth-background .shape-1,
  .auth-background .shape-2 {
    display: none;
  }
  
  .logo-text {
    font-size: 18px;
  }
}
</style>

<style>
/* 全局主题样式 */
[data-theme="light"] {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

/* 确保模态框也跟随主题 */
[data-theme="dark"] .n-modal .n-card {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
  border-color: #333333 !important;
}

[data-theme="dark"] .n-modal .n-dialog {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
  border-color: #333333 !important;
}
</style>