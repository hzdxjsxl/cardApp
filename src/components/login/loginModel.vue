<template>
  <Transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="closeModal">&times;</button>

        <!-- 顶部 Tab 切换 -->
        <div class="modal-header">
          <span
            :class="['tab', { active: isLogin }]"
            @click="switchTab(true)"
          >登录</span>
          <span class="divider">·</span>
          <span
            :class="['tab', { active: !isLogin }]"
            @click="switchTab(false)"
          >注册</span>
        </div>

        <!-- 表单区域 -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 账号 -->
            <div class="form-group">
              <input
                type="text"
                v-model="formData.username"
                placeholder="请输入账号"
                @focus="clearError('username')"
              />
              <span class="error-msg" v-show="errors.username">{{ errors.username }}</span>
            </div>

            <!-- 密码 -->
            <div class="form-group">
              <input
                type="password"
                v-model="formData.password"
                placeholder="请输入密码"
                @focus="clearError('password')"
              />
              <span class="error-msg" v-show="errors.password">{{ errors.password }}</span>
            </div>
            <!-- 引入滑块组件 -->
            <div class="form-group">
              <SliderCaptcha
                ref="sliderRef"
                @success="handleSliderSuccess"
              />
              <span class="error-msg" v-show="errors.captcha">{{ errors.captcha }}</span>
            </div>
            <!-- 提交按钮 -->
            <button type="submit" class="submit-btn">
              {{ isLogin ? '进入牌阵' : '缔结契约' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SliderCaptcha from './slider.vue' // 引入组件
// 定义 Props 和 Emits，实现 v-model:visible 的双向绑定
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:visible', 'success'])

// 状态管理
const isLogin = ref(true)
const countdown = ref(0)

const formData = reactive({
  username: '',
  password: '',
  isCaptchaPassed: false
})

const errors = reactive({
  username: '',
  password: '',
  captcha: ''
})
const sliderRef = ref(null)
// 关闭弹窗
const closeModal = () => {
  emit('update:visible', false)
  resetForm()
}

// 切换登录/注册
const switchTab = (status) => {
  isLogin.value = status
  resetForm()
  if (sliderRef.value) {
    sliderRef.value.reset() // 调用子组件的重置方法
  }
}
const reloadForm=()=>{
  resetForm()
  sliderRef.value.reset()
}
defineExpose({
  reloadForm
})
// 清理错误提示
const clearError = (field) => {
  errors[field] = ''
}

// 重置表单
const resetForm = () => {
  formData.username = ''
  formData.password = ''
  formData.isCaptchaPassed = false
  errors.username = ''
  errors.password = ''
  errors.isCaptchaPassed = false
}

// 获取验证码模拟逻辑
const getCaptcha = () => {
  if (!formData.username) {
    errors.username = '请先输入账号'
    return
  }
  // 模拟发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 前端严格校验逻辑
const validateForm = () => {
  let isValid = true
  if (!formData.username.trim()) {
    errors.username = '账号在星象中不可为空'
    isValid = false
  } else if (formData.username.length < 4) {
    errors.username = '账号长度需大于4位'
    isValid = false
  }

  if (!formData.password) {
    errors.password = '需提供你的专属密语'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '密语长度需大于6位'
    isValid = false
  }
  if (!formData.isCaptchaPassed) {
    errors.captcha = '请先拖动滑块完成灵力验证'
    isValid = false
  }
  return isValid
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm()) return

  // 校验通过，抛出事件给父组件，附带当前模式（登录或注册）和表单数据
  const action = isLogin.value ? 'login' : 'register'
  console.log('cc',formData)
  emit('success', { action, ...formData })
}
// 滑块验证成功回调
const handleSliderSuccess = () => {
  formData.isCaptchaPassed = true
  clearError('captcha')
}
</script>

<style scoped>
/* 弹窗遮罩层：继承背景的神秘感，增加毛玻璃效果 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(8, 5, 16, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 主容器：暗黑紫渐变 + 细微的紫色光晕边框 */
.modal-container {
  position: relative;
  width: 380px;
  background: linear-gradient(145deg, #1A1325 0%, #0F0A1A 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 40px 30px;
  color: #E2E2E2;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.close-btn:hover {
  color: #D4AF37; /* 悬停变为截图中的淡金色 */
}

/* 顶部 Tab 设计 */
.modal-header {
  text-align: center;
  margin-bottom: 30px;
  font-size: 18px;
  letter-spacing: 2px;
}
.tab {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}
.tab.active {
  color: #D4AF37; /* 激活态采用顶部导航的淡金色 */
  font-weight: bold;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}
.divider {
  margin: 0 15px;
  color: rgba(255, 255, 255, 0.2);
}

/* 表单输入框体系 */
.form-group {
  margin-bottom: 24px;
  position: relative;
}
input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  color: #E2E2E2;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
input:focus {
  border-color: #8B5CF6; /* 聚焦时亮紫色边框 */
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
  background: rgba(255, 255, 255, 0.05);
}
input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

/* 验证码特殊布局 */
.captcha-input-wrapper {
  display: flex;
  gap: 10px;
}
.captcha-input-wrapper input {
  flex: 1;
}
.captcha-btn {
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.5); /* 金色边框幽灵按钮 */
  color: #D4AF37;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}
.captcha-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.1);
}
.captcha-btn:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

/* 错误提示文字 */
.error-msg {
  position: absolute;
  bottom: -18px;
  left: 4px;
  font-size: 12px;
  color: #EF4444; /* 红色提示 */
  opacity: 0.9;
}

/* 提交按钮：复刻截图中的“单张抽牌”那种圆角渐变 */
.submit-btn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: linear-gradient(90deg, #A855F7, #7E22CE); /* 紫色渐变 */
  border: none;
  border-radius: 24px; /* 胶囊形状 */
  color: white;
  font-size: 16px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

/* Vue 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
