<template>
  <el-dialog
    :model-value="visible"
    width="420px"
    class="login-dialog"
    :show-close="true"
    :close-on-click-modal="true"
    @close="handleClose"
    center
  >
    <div class="dialog-header">
      <img src="@/assets/logo.jpg" alt="logo" class="logo" />
      <span class="product-name">知卷AI</span>
    </div>
    <el-tabs v-model="activeTab" stretch class="login-tabs">
      <el-tab-pane label="登录" name="login">
        <el-form @submit.prevent="handleLogin">
          <el-form-item>
            <el-input v-model="username" placeholder="用户名或邮箱" prefix-icon="el-icon-user" size="large" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="密码" prefix-icon="el-icon-lock" size="large" @keyup.enter="handleLogin" />
          </el-form-item>
          <el-button type="primary" class="main-btn" size="large" @click="handleLogin" round block>登录</el-button>
        </el-form>
        <div class="form-footer">
          <span class="footer-link" @click="activeTab = 'register'">没有账号？去注册</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form @submit.prevent="handleRegister">
          <el-form-item>
            <el-input v-model="regUsername" placeholder="用户名" prefix-icon="el-icon-user" size="large" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="regEmail" placeholder="邮箱" prefix-icon="el-icon-message" size="large" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="regPassword" type="password" placeholder="密码" prefix-icon="el-icon-lock" size="large" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="regConfirmPassword" type="password" placeholder="确认密码" prefix-icon="el-icon-lock" size="large" @keyup.enter="handleRegister" />
          </el-form-item>
          <el-button type="primary" class="main-btn" size="large" @click="handleRegister" round block>注册</el-button>
        </el-form>
        <div class="form-footer">
          <span class="footer-link" @click="activeTab = 'login'">已有账号？去登录</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const activeTab = ref('login')

// 登录表单
const username = ref('')
const password = ref('')

// 注册表单
const regUsername = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regConfirmPassword = ref('')

watch(() => props.visible, (val) => {
  if (!val) {
    username.value = ''
    password.value = ''
    regUsername.value = ''
    regEmail.value = ''
    regPassword.value = ''
    regConfirmPassword.value = ''
    activeTab.value = 'login'
  }
})

function handleClose() {
  emit('update:visible', false)
}

async function handleLogin() {
  if (!username.value || !password.value) {
    ElMessage.error('请输入用户名/邮箱和密码')
    return
  }
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: username.value, password: password.value })
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      emit('update:visible', false)
      ElMessage.success('登录成功')
    } else {
      ElMessage.error(data.error || '登录失败')
    }
  } catch (e) {
    ElMessage.error('网络错误，登录失败')
  }
}

async function handleRegister() {
  if (!regUsername.value || !regEmail.value || !regPassword.value || !regConfirmPassword.value) {
    ElMessage.error('请填写完整注册信息')
    return
  }
  if (regPassword.value !== regConfirmPassword.value) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regUsername.value, email: regEmail.value, password: regPassword.value })
    })
    const data = await res.json()
    if (res.ok) {
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
    } else {
      ElMessage.error(data.error || '注册失败')
    }
  } catch (e) {
    ElMessage.error('网络错误，注册失败')
  }
}
</script>

<style scoped>
.login-dialog >>> .el-dialog {
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(80, 120, 255, 0.18);
  background: #fafdff;
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.logo {
  width: 38px;
  height: 38px;
  margin-right: 10px;
}
.product-name {
  font-size: 22px;
  font-weight: bold;
  color: #22405c;
  letter-spacing: 1px;
}
.login-tabs {
  margin-top: 0;
}
.el-form {
  margin-top: 10px;
}
.el-form-item {
  margin-bottom: 18px;
}
.main-btn {
  background: linear-gradient(90deg, #5db1ff 0%, #8d37ff 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(93,177,255,0.08);
  margin-top: 6px;
  transition: background 0.2s;
}
.main-btn:hover {
  background: linear-gradient(90deg, #8d37ff 0%, #5db1ff 100%);
}
.form-footer {
  margin-top: 10px;
  text-align: right;
}
.footer-link {
  color: #5db1ff;
  cursor: pointer;
  font-size: 14px;
  margin-left: 4px;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #8d37ff;
}
</style> 