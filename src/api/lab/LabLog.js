import request from '@/utils/request'

// GET /laboratory/record/list
// 获取实验室记录列表
export const getLabRecordListService = (page) => {
    return request.get(`/laboratory/record/list?page=${page}&pageSize=10`)
}

