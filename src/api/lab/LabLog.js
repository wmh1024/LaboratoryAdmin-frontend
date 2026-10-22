import request from '@/utils/request'
import { pageParams } from '@/api/common'

// GET /laboratory/record/list
// 获取实验室记录列表
export const getLabRecordListService = (page) => {
    return request.get('/laboratory/record/list', { params: pageParams(page) })
}

// 根据id查询详细记录
// GET /laboratory/record/find/{id}
export const getLabRecordByIdService = (id) => {
    return request.get(`/laboratory/record/find/${id}`)
}
