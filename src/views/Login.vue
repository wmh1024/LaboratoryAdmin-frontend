<script setup>
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { userLoginService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useMock } from '@/utils/request'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

const formModel = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const login = async () => {
  if (loading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await userLoginService({ ...formModel })
    const token = res?.data?.data?.token
    if (!token) {
      ElMessage.error('登录失败：未获取到登录凭证')
      return
    }
    userStore.setToken(token)
    ElMessage.success('登录成功')
    await router.push('/')
  } catch {
    // 错误提示已由请求拦截器统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"/>
    <el-col :offset="3" :span="6" class="form">
      <el-form
          ref="formRef"
          :model="formModel"
          :rules="rules"
          autocomplete="off"
          size="large"
          @submit.prevent="login"
      >
        <el-form-item>
          <h1>管理员登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
              v-model.trim="formModel.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              name="password"
              placeholder="请输入密码"
              show-password
              type="password"
              @keyup.enter="login"
          />
        </el-form-item>
        <el-form-item v-if="useMock" class="tip">
          <el-alert
              :closable="false"
              show-icon
              title="当前为演示模式（Mock 数据）：任意用户名与密码即可登录"
              type="info"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              :loading="loading"
              class="button"
              native-type="submit"
              type="primary"
              @click="login"
          >登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 98vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/sjzc.png') no-repeat 50% center / 240px auto,
    url('@/assets/lab.jpeg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .tip {
      margin-bottom: 12px;
    }
  }
}
</style>
