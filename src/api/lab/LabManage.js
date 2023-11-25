/* 实验室管理 */

import request from '@/utils/request'
import { List2String } from '@/utils/format'

export const getLabListService = (page) => {
    return request.get(`/laboratory/list?page=${page}&pageSize=10`)
}

export const getLabByIdService = (id) => {
    return request.get(`/laboratory/findl/${id}`)
}


export const deleteLabByIdsService = (ids) => {
    return request.delete('/laboratory/delete', {
        params: {
            ids: List2String(ids)
        }
    })
}

export const editLabService = (lab) => {
    return request.put('/laboratory/update', lab)
}

export const addLabService = (lab) => {
    return request.post('/laboratory/add', lab)
}
