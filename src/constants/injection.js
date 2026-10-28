/**
 * 应用级 provide/inject key。
 *
 * 集中声明，避免页面与入口各写一个字符串导致注入失效。
 */
export const DEMO_ACCOUNT_KEY = Symbol('demoAccount')
