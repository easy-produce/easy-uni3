/*
 * 日志
 */
import { useAccountStore } from '@/store/account'
import SlsTracker from '@aliyun-sls/web-track-browser'
import type { ComponentPublicInstance } from "vue";
import { inject } from 'vue'
// import * as StackTrace from 'stacktrace-js';

/**
 * 日志网关
 */
export class Gateway {

	/**
	 * 保存日志
	 */
	saveErrorLog(err : unknown, instance : ComponentPublicInstance | null, info : string) {
		console.log('errorLog', err)
	}
}

export class Log {

	// 昵称
	nickName : string;
	// 唯一id
	uniqueId : string;

	constructor() {

		// 获取昵称
		this.nickName = useAccountStore().getNickName;
		// 获取唯一请求Id
		const global : any = inject('global');
		this.uniqueId = global.uniqueId;
	}
}

/* 
 * 阿里云日志
 */
export class AliYun {

	/**
	 * 保存日志
	 */
	saveLog() {
		const opts = {
			host: 'cn-beijing.log.aliyuncs.com', // 所在地域的服务入口。例如cn-hangzhou.log.aliyuncs.com
			project: 'easy-log', // Project名称。
			logstore: 'easy-uni3', // Logstore名称。
			time: 10, // 发送日志的时间间隔，默认是10秒。
			count: 10, // 发送日志的数量大小，默认是10条。
			topic: 'topic',// 自定义日志主题。
			source: 'source',
			tags: {
				tags: 'tags',
			},
		}
		const tracker = new SlsTracker(opts)
		console.log(SlsTracker, 'SlsTracker')
		tracker.send({
			customer: 'zhangsan',
			product: '111 12',
			price: 7998,
		})
	}
}
// 当前请求唯一id
// const account = getAccount();
// console.log(account, 'account')
// new Log().saveErrorLog();
// import { Err } from '@/easy-uni3/exception';

// }