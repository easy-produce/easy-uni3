import type { ComponentPublicInstance } from "vue";
// import { inject } from 'vue'
import { AliYun, Log } from '@/easy-uni3/log'

/**
 * 全局异常处理
 */
export function errorHandler(err : unknown, instance : ComponentPublicInstance | null, info : string) {

	// (new AliYun()).saveLog();

	// const log = new Log();
	console.log(err, instance, info);
}

/**
 * 全局警告处理
 */
export function warnHandler(msg : string, instance : ComponentPublicInstance | null, trace : string) {
	// const global : any = inject('global');
	console.log('warnHandler', msg, instance, trace)
}