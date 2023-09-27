// 引入配置
import config from '@/config/api'
/**
 * @param noCatch 不reject错误 
 */
const requestInterceptors = (vm?: any) => {
	/**
	 * 请求拦截
	 * @param {Object} http
	 */
	uni.$u.http.interceptors.request.use((config?: any) => { // 可使用async await 做异步操作
		config.data = config.data || {}
		if (typeof config.params === 'object' && config.url.includes('/:')) {
			let url = config.url;
			// 替换动态参数
			const regex = /\/:(.*?)(\/|$)/;
			const match = url.match(regex);
			// console.log('match', match, config)
			let params = config.params
			if (config.method !== 'GET') {
				params = config.data;
			}
			for (const key of Object.keys(params)) {
				if (match.includes(key)) {
					// console.log('key =====', key, params[key])
					config.url = url.replace(`:${key}`, params[key])
				} 
			}
			console.log(url)
		}


		if (uni.getStorageSync('token')) {
			config.header.identity = uni.getStorageSync('token')
			config.header.app_code = uni.getStorageSync('app_code') || ''
		}
		// console.log(vm.$store.state);
		return config
	}, (config?: any) => // 可使用async await 做异步操作
		Promise.reject(config))
}
const responseInterceptors = (vm?: any) => {
	/**
	 * 响应拦截
	 * @param {Object} http 
	 */
	uni.$u.http.interceptors.response.use((response?: any) => {

		const data = response.data
		// 自定义参数
		const custom = response.config && response.config.custom
		if (data.code !== 100000) {
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (data.msg && !custom.noToast) {
				uni.$u.toast(data.msg)
			}
			uni.$emit('z-paging-error-emit')
			if (custom && custom.noCatch) {
				return new Promise(() => { })
			} else {
				return Promise.reject(data)

			}
		}
		return data === undefined ? {} : data[custom && custom.filterKey || 'result']
	}, (response?: any) => { /*  对响应错误做点什么 （statusCode !== 200）*/
		if (response.statusCode == 401) {
			uni.$emit('loginInvalid')
		}
		if (response.statusCode >= 500) {
			uni.$u.toast('服务器异常，请稍后再试！')
		}
		uni.$emit('z-paging-error-emit')
		return Promise.reject(response)
	})
}

//  初始化请求配置
const initRequest = (vm) => {
	uni.$u.http.setConfig((defaultConfig?: any) => {
		/* defaultConfig 为默认全局配置 */
		// #ifdef APP-PLUS
		defaultConfig.baseURL = config.basePath
		console.log('baseURL ====', import.meta.env.VITE_APP_BASE_URL, plus.runtime.appid)

		// #endif
		// #ifdef H5
		console.log('base ====', process.env.NODE_ENV, import.meta.env)
		defaultConfig.baseURL = import.meta.env.VITE_APP_BASE_URL
		// #endif
		//#ifdef MP-WEIXIN || MP-ALIPAY

		defaultConfig.baseURL = config.basePath /* 根域名 */
		// #endif
		defaultConfig.header['Content-Type'] = 'application/json;charset=utf-8';
		defaultConfig.responseType = 'application/json';
		defaultConfig.dataType = 'json';
		defaultConfig.withCredentials = true;

		return defaultConfig
	})
	requestInterceptors()
	responseInterceptors()
}
export {
	initRequest
}