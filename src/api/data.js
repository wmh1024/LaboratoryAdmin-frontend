import axios from 'axios'

export const getStudentListService = () => {
    return axios.get('https://mock.apifox.cn/m1/3472636-0-default/data/stu?apifoxApiId=119662893&test=1')
}
