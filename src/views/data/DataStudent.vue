<script setup>
import { ElPagination } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { getStudentListService } from '@/api/data'
import { ref } from 'vue'

// const handleEdit = (index) => {
//   console.log(index)
// }
// const handleDelete = (index, row) => {
//   console.log(index, row)
// }


let tableData = ref([])

const getStudentList = async () => {
  const studentResult = await getStudentListService()
  const studentData = studentResult.data
  tableData.value = studentData.data.items
  // console.log(studentData.items)
}

getStudentList()

</script>


<template>
  <el-row>
    <h3 style="margin: 5px auto;">学生信息管理</h3>
  </el-row>
  <el-row style="margin-bottom: 20px;">
    <el-button plain style="margin-left: 20px;" type="primary">添加学生信息</el-button>
    <el-button plain style="margin-left: 20px;" type="danger">删除选中</el-button>

  </el-row>
  <el-table :data="tableData" border style="width: 98%; margin:0 auto">
    <el-table-column type="selection" width="55"/>
    <el-table-column label="学号" width="">
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
    <!--    <el-table-column label="专业班级" width="">-->
    <!--      <template #default="scope">-->
    <!--        <div style="display: flex; align-items: center">-->
    <!--          <span>{{ scope.row.class }}</span>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-table-column>-->
    <el-table-column label="学生违规状态" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-tag
              v-if="scope.row.status"
              effect="dark"
              label='Tag 4'
              type='danger'
          >
            有违规
          </el-tag>
          <el-tag
              v-else
              effect="dark"
              label='Tag 2'
              type='success'
          >
            无违规
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="创建人" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.create_user }}</span>
        </div>
      </template>
    </el-table-column><el-table-column label="创建时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column><el-table-column label="更新人" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.update_user }}</span>
        </div>
      </template>
    </el-table-column><el-table-column label="更新时间" width="">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <span>{{ scope.row.update_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button :icon="Edit" circle type="primary"/>
        <el-button :icon="Delete" circle type="danger"/>
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
</template>

<style scoped>
</style>
