/* 实验室类别 */

import axios from 'axios'

export const getLabCategoryListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/lab/category?1=1')
}
export const getLabCategoryByIdService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/lab/category?1=1')
}
