/* 实验室类别 */
import request from '@/utils/request'

export const getLabCategoryListService = () => {
    return request.get('/lab/category/list?page=1&pageSize=50')
}
export const getLabCategoryByIdService = (id) => {
    return request.get(`/lab/category/find/${id}`)
}

export const deleteLabCategoryByIdsService = (ids) => {
    return request.delete('/lab/category/delete', ids)
}

export const editLabCategoryService = (labCategory) => {
    return request.put('/lab/category/update', labCategory)
}
export const addLabCategoryService = (labCategory) => {
    return request.post('/lab/category/add', labCategory)
}

