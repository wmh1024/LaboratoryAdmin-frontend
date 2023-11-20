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
  const res = await userLoginService(formModel.value)
  console.log(res)
  userStore.setToken(res.data.data.token)
  ElMessage.success('登录成功')
  await router.push('/')
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :offset="3" :span="6" class="form">
      <el-form
          ref="form"
          autocomplete="off"
          size="large"
      >
        <el-form-item>
          <h1>管理员登录</h1>
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              name="password"
              placeholder="请输入密码"
              type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <!--            <el-checkbox>记住我</el-checkbox>-->
            <!--            <el-link type="primary" :underline="false">忘记密码？</el-link>-->
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
              auto-insert-space
              class="button"
              type="primary"
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

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
