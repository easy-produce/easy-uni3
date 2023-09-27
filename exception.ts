/**
 * 异常处理类
 */
export class BaseException extends Error {
	constructor(message ?: string) {
		console.log('系统发生了错误')
		console.debug('系统发生了错误')
		// console.error('出错了')
		// console.trace('出错了')
		super(message);
	}
}

export class Err extends BaseException {
	constructor(message ?: string) {
		super(message);
	}
}

export class War extends BaseException {
	constructor(message ?: string) {
		super(message);
	}
}