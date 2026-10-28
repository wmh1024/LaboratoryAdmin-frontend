import { ref } from 'vue'
import { toPageResult } from '@/api/common'
import { PAGE_SIZE } from '@/constants/page'

/**
 * 分页列表通用逻辑。
 *
 * - 并发安全：只采用「最后一次」请求的结果，避免快速翻页时旧响应覆盖新数据
 * - 空页回退：删除当前页最后一条后自动回退到上一页
 * - loading 由本函数统一复位，页面无需手工处理
 *
 * @param {(page: number, pageSize: number) => Promise<import('axios').AxiosResponse>} fetcher
 * @param {{ pageSize?: number, onError?: (err: unknown) => void }} [options]
 */
export const usePagedList = (fetcher, options = {}) => {
    const pageSize = options.pageSize || PAGE_SIZE
    const rows = ref([])
    const total = ref(0)
    const page = ref(1)
    const loading = ref(false)
    const selection = ref([])

    let seq = 0
    let lastPage = 1

    const load = async (targetPage = lastPage) => {
        const current = ++seq
        loading.value = true
        try {
            const { items, counts } = toPageResult(await fetcher(targetPage, pageSize))
            // 已有更新的请求在途，丢弃本次响应
            if (current !== seq) return
            if (items.length === 0 && targetPage > 1 && counts > 0) {
                // 空页回退：递归后由内层负责复位 loading
                loading.value = false
                await load(targetPage - 1)
                return
            }
            rows.value = items
            total.value = counts
            page.value = targetPage
            lastPage = targetPage
        } catch (err) {
            options.onError?.(err)
        } finally {
            if (current === seq) loading.value = false
        }
    }

    const onSelectionChange = (val) => {
        selection.value = val.map((item) => item.id)
    }

    /** 刷新当前页（删除/新增/修改后调用） */
    const refresh = () => load(lastPage)

    return { rows, total, page, pageSize, loading, selection, load, refresh, onSelectionChange }
}
