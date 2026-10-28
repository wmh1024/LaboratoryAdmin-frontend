import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import Login from './Login.vue'

const makeRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', component: { template: '<div>home</div>' } },
            { path: '/login', component: Login }
        ]
    })

describe('Login.vue', () => {
    it('能渲染出登录表单（回归：async setup 无 Suspense 会只剩注释节点）', async () => {
        const wrapper = mount(Login, {
            global: {
                plugins: [createPinia(), makeRouter()]
            }
        })

        expect(wrapper.find('.login-page').exists()).toBe(true)
        expect(wrapper.text()).toContain('管理员登录')

        const inputs = wrapper.findAll('input')
        expect(inputs.length).toBeGreaterThanOrEqual(2)
        expect(wrapper.html()).not.toContain('<!---->')

        wrapper.unmount()
    })
})
