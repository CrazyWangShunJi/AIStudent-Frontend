<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-header">
        <div class="logo">
          <h1>AIStudent</h1>
          <p class="subtitle">AI智能学习助手</p>
        </div>
      </div>

      <div class="login-content">
        <el-tabs v-model="activeTab" class="login-tabs">
          <!-- 登录表单 -->
          <el-tab-pane label="登录" name="login">
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              @submit.prevent="handleLogin"
            >
              <el-form-item prop="identifier">
                <el-input
                  v-model="loginForm.identifier"
                  placeholder="用户名或邮箱"
                  size="large"
                  prefix-icon="User"
                  clearable
                  @keyup.enter="handleLogin"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  size="large"
                  prefix-icon="Lock"
                  show-password
                  @keyup.enter="handleLogin"
                />
              </el-form-item>

              <el-form-item class="login-actions">
                <el-button
                  type="primary"
                  size="large"
                  :loading="authStore.isLoading"
                  @click="handleLogin"
                  class="login-btn"
                >
                  {{ authStore.isLoading ? '登录中...' : '登录' }}
                </el-button>
              </el-form-item>

              <div class="login-links">
                <el-link type="primary" @click="activeTab = 'register'">
                  还没有账号？立即注册
                </el-link>
              </div>
            </el-form>
          </el-tab-pane>

          <!-- 注册表单 -->
          <el-tab-pane label="注册" name="register">
            <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              class="register-form"
              @submit.prevent="handleRegister"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="registerForm.username"
                  placeholder="用户名"
                  size="large"
                  prefix-icon="User"
                  clearable
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item prop="email">
                <el-input
                  v-model="registerForm.email"
                  placeholder="邮箱地址"
                  size="large"
                  prefix-icon="Message"
                  clearable
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="密码"
                  size="large"
                  prefix-icon="Lock"
                  show-password
                />
                <div class="password-strength">
                  <div class="strength-bar">
                    <div 
                      class="strength-fill" 
                      :class="`strength-${passwordStrength}`"
                      :style="{ width: `${passwordStrengthPercent}%` }"
                    ></div>
                  </div>
                  <span class="strength-text" :class="`text-${passwordStrength}`">
                    {{ passwordStrengthText }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  size="large"
                  prefix-icon="Lock"
                  show-password
                  @keyup.enter="handleRegister"
                />
              </el-form-item>

              <el-form-item class="register-actions">
                <el-button
                  type="primary"
                  size="large"
                  :loading="authStore.isLoading"
                  @click="handleRegister"
                  class="register-btn"
                >
                  {{ authStore.isLoading ? '注册中...' : '注册' }}
                </el-button>
              </el-form-item>

              <div class="register-links">
                <el-link type="primary" @click="activeTab = 'login'">
                  已有账号？立即登录
                </el-link>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 错误提示 -->
        <el-alert
          v-if="authStore.error"
          :title="authStore.error"
          type="error"
          center
          show-icon
          :closable="true"
          @close="authStore.clearError"
          class="error-alert"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('login')

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>()
const registerFormRef = ref<InstanceType<typeof ElForm>>()

// 登录表单
const loginForm = reactive({
  identifier: '',
  password: ''
})

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.password
  if (!password) return 'none'
  
  let score = 0
  
  // 长度检查
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // 复杂度检查
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
  
  if (score >= 5) return 'strong'
  if (score >= 3) return 'medium'
  if (score >= 1) return 'weak'
  return 'none'
})

const passwordStrengthPercent = computed(() => {
  const strength = passwordStrength.value
  switch (strength) {
    case 'strong': return 100
    case 'medium': return 66
    case 'weak': return 33
    default: return 0
  }
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  switch (strength) {
    case 'strong': return '强'
    case 'medium': return '中'
    case 'weak': return '弱'
    default: return ''
  }
})

// 自定义验证器
const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (value.length < 3) {
    callback(new Error('用户名长度至少3位'))
  } else if (value.length > 20) {
    callback(new Error('用户名长度不能超过20位'))
  } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error('用户名只能包含字母、数字、下划线和中文'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入邮箱地址'))
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 8) {
    callback(new Error('密码长度至少8位'))
  } else if (!/[A-Z]/.test(value)) {
    callback(new Error('密码必须包含至少一个大写字母'))
  } else if (!/[a-z]/.test(value)) {
    callback(new Error('密码必须包含至少一个小写字母'))
  } else if (!/\d/.test(value)) {
    callback(new Error('密码必须包含至少一个数字'))
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    callback(new Error('密码必须包含至少一个特殊字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 登录表单验证规则
const loginRules = {
  identifier: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  username: [
    { validator: validateUsername, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const success = await authStore.login(loginForm)
      if (success) {
        ElMessage.success('登录成功！')
        router.push('/')
      }
    }
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      const success = await authStore.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      })
      if (success) {
        ElMessage.success('注册成功！')
        router.push('/')
      }
    }
  })
}

// 组件挂载时检查是否已登录
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped lang="less">
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.login-header {
  padding: 40px 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  .logo h1 {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .subtitle {
    margin: 8px 0 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.login-content {
  padding: 30px;
}

.login-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 30px;
  }

  :deep(.el-tabs__nav-wrap) {
    display: flex;
    justify-content: center;
  }

  :deep(.el-tabs__item) {
    padding: 0 30px;
    font-size: 16px;
    font-weight: 500;
  }

  :deep(.el-tabs__active-bar) {
    background: #667eea;
  }

  :deep(.el-tabs__item.is-active) {
    color: #667eea;
  }
}

.login-form,
.register-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.login-actions,
.register-actions {
  margin-bottom: 20px;

  .login-btn,
  .register-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
  }
}

.login-links,
.register-links {
  text-align: center;
  
  :deep(.el-link) {
    font-size: 14px;
  }
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  .strength-bar {
    flex: 1;
    height: 4px;
    background: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;

    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: all 0.3s ease;

      &.strength-weak {
        background: #ff4757;
      }

      &.strength-medium {
        background: #ffa726;
      }

      &.strength-strong {
        background: #4caf50;
      }
    }
  }

  .strength-text {
    font-size: 12px;
    font-weight: 500;
    min-width: 20px;

    &.text-weak {
      color: #ff4757;
    }

    &.text-medium {
      color: #ffa726;
    }

    &.text-strong {
      color: #4caf50;
    }
  }
}

.error-alert {
  margin-top: 20px;
  border-radius: 8px;

  :deep(.el-alert__content) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-wrapper {
    max-width: 100%;
  }

  .login-header {
    padding: 30px 20px 15px;

    .logo h1 {
      font-size: 28px;
    }
  }

  .login-content {
    padding: 20px;
  }

  .login-tabs {
    :deep(.el-tabs__item) {
      padding: 0 20px;
      font-size: 14px;
    }
  }
}
</style> 