import request from '@/utils/request'

// GET /laboratory/record/list
// 获取实验室记录列表
export const getLabRecordListService = (page) => {
    return request.get(`/laboratory/record/list?page=${page}&pageSize=10`)
}

// 根据id查询详细记录
// GET /laboratory/record/find/{id}
export const getLabRecordByIdService = (id) => {
    return request.get(`/laboratory/record/find/${id}`)
}
