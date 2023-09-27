
/**
 * 环境变量
 */

export class Env {

	// 生产环境
	public static readonly dev : string = 'production';

	// 开发环境
	public static readonly prod : string = 'development';

	/**
	 * 获取当前环境
	 */
	env() : string {

		const env = process.env.NODE_ENV ?? null;

		if (!env) {
			throw Error('获取环境失败');
		}

		return env;
	}

	/**
	 * 当前是否为开发环境
	 */
	isDev() : boolean {
		return Env.dev == this.env();
	}

	/**
	 * 当前是否为生产环境
	 */
	isProd() : boolean {
		return Env.prod == this.env();
	}
}