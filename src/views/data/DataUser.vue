<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { getUserByIdService, getUserListService } from '@/api/data'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const addDrawer = ref(false)
let editDrawer = ref(false)
let tableData = ref([])

const getUserList = async () => {
  const userResult = await getUserListService()
  tableData.value = userResult.data.data.items
}

const getUserById = async (id) => {
  const result = await getUserByIdService(id)
  console.log(result)
  return result.data.data
}

const positionList = [
  { id: 0, name: "学生" },
  { id: 1, name: "教职工" }
]

const formModel = ref({})

const onAdd = () => {
  formModel.value = {}
  addDrawer.value = true
}

const onEdit = async (index) => {
  formModel.value = await getUserById(index)
  // console.log(formModel.value)
  editDrawer.value = true
}

const onDelete = async (id) => {
  await ElMessageBox.confirm('你确认要删除吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // await artDelChannelService(id)
  ElMessage.success('删除成功')
  await getUserList()
}


const addUser = () => {
  console.log(formModel.value)
  ElMessage.success('添加成功')
  addDrawer.value = false
  getUserList()
}

const editUser = () => {
  console.log(formModel.value)
  ElMessage.success('修改成功')
  editDrawer.value = false
  getUserList()
}

getUserList()

</script>


<template>
  <div>
    <el-row>
      <h3 style="margin: 5px auto;">用户信息管理</h3>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button plain style="margin-left: 20px;" type="primary"
                 @click="onAdd">用户添加
      </el-button>
      <el-button plain style="margin-left: 20px;" type="danger">删除选中</el-button>

    </el-row>
    <el-table :data="tableData" border style="width: 98%; margin:0 auto">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="学号(工号)" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.username }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.position_status === 0 ? '学生' : '教职工' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="专业班级" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.class }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="违规次数" width="">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ scope.row.violation_count }}</span>
            <el-tag
                v-if="scope.row.violation_status === 1"
                effect="dark"
                label='Tag 4'
                type='danger'
                style="margin-left: 15px;"
            >
              现有违规
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="() => onEdit(scope.row.id)" :icon="Edit" circle type="primary"/>
          <el-button @click="onDelete" :icon="Delete" circle type="danger"/>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center">
      <ElPagination
          style="margin: 20px auto"
          background
          hide-on-single-page
          :default-page-size="5"
          layout="total, prev, pager, next" :total="20"/>
    </div>
  </div>
  <el-drawer
      v-model="addDrawer"
      title="添加用户"
      direction="rtl"
      size="50%"
  >
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="学号(工号)">
        <el-input v-model="formModel.username" placeholder="请输入学号(工号)"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select
            v-model="formModel.statues"
            style="width: 100%;"
        >
          <el-option
              v-for="channel in positionList"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model="formModel.class" placeholder="请输入专业班级"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="addUser" type="primary">添加</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer
      v-model="editDrawer"
      title="编辑用户"
      direction="rtl"
      size="35%"
  >
    <el-form ref="formRef" label-width="100px">
      <el-form-item label="学号(工号)">
        <el-input v-model="formModel.username" placeholder="请输入学号(工号)"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select
            v-model="formModel.position_status"
            style="width: 100%;"
        >
          <el-option
              v-for="channel in positionList"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model="formModel.class" placeholder="请输入专业班级"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formModel.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="formModel.repassword" placeholder="请输入确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="editUser" type="primary">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped>
</style>
