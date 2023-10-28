/* 实验室类别 */

import axios from 'axios'

export const getLabCategoryListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/lab/category?1=1')
}
export const getLabCategoryByIdService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/lab/category/1?1=1')
}

export const deleteLabCategoryByIdsService = (ids) => {
    return axios.delete('https://mock.apifox.cn/m1/3472636-0-default/lab/category', ids)
}

export const editLabCategoryService = (labCategory) => {
    console.log('labCategory', labCategory)
    return axios.put('https://mock.apifox.cn/m1/3472636-0-default/lab/category?q=1', labCategory)
}
export const addLabCategoryService = (labCategory) => {
    console.log('labCategory', labCategory)
    return axios.post('https://mock.apifox.cn/m1/3472636-0-default/lab/category?q=1', labCategory)
}

/* 实验室管理 */


