<script setup>
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { userLoginService } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const form = ref()

const formModel = ref({
  username: '',
  password: ''
})
const login = async () => {
  // await form.value.validate()
  const res = await userLoginService(form.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}


</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
          ref="form"
          size="large"
          autocomplete="off"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item>
          <el-input
              :prefix-icon="User"
              placeholder="请输入用户名"
              v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="() => login()"
          >登录
          </el-button
          >
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
    background: url('@/assets/lab.jpeg') no-repeat center / cover;
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

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
