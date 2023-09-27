let config = require('./Configuration.js');
const getPolicyEncode = require('./getPolicy.js');
const getSignature = require('./GetSignature.js');

const OBSupload = function(filePath, fileName = 'testMiniprogram.jpg', cb) {
	console.log('in obs func =======', filePath, fileName);
	if (!config.SecretKey || config.SecretKey == '') {
		// config是异步请求回来的 weapp第一次launch时候加载文件没值
		let obsConfig = uni.getStorageSync('obsConfig');
		config = {
			AccessKeyId: obsConfig.accessKey, //AK
			SecretKey: obsConfig.secretKey, //SK
			EndPoint: obsConfig.endPoint, //上传文件的路径
			address: obsConfig.address,
			bucketName: obsConfig.bucketName
		};
	}
	
	
	if (!filePath) {
		uni.showToast({
			title: '文件路径不能为空',
			icon: 'none',
		});
	} else {

		
		const OBSPolicy = { //设定policy内容
			"expiration": "2121-12-31T12:00:00.000Z",
			"conditions": [{
					"bucket": uni.getStorageSync('obsConfig').bucketName
				}, //Bucket name
				{
					'key': fileName
				},
				
				{
					'x-obs-acl': 'public-read'
				}
			]
		}
		
		
		const policyEncoded = getPolicyEncode(OBSPolicy); //计算policy编码值
		const signature = getSignature(policyEncoded, config.SecretKey); //计算signature
		console.log('sign =====', {
			url: `${config.address}`,
			filePath: filePath,
			name: 'file',
			header: {
				'content-type': 'multipart/form-data;',
			},
			formData: {
				'AccessKeyID': config.AccessKeyId,
				'policy': policyEncoded,
				'signature': signature,
				'key': fileName,
			}
		})
		uni.showLoading({
			title: '上传中',
			mask: true
		})
		uni.uploadFile({
			url: `${config.address}`,
			filePath: filePath,
			name: 'file',
			header: {
				'content-type': 'multipart/form-data;',
			},
			formData: {
				'AccessKeyID': config.AccessKeyId,
				'policy': policyEncoded,
				'signature': signature,
				'key': fileName,
				'x-obs-acl': 'public-read'
			},
			
			success: function(res) {
				uni.hideLoading()
				console.log(res.statusCode); //打印响应状态码
				if (res.statusCode == '204') {
					console.log('上传成功', res)
					uni.showToast({
						title: '上传成功',
						icon: 'none',
						complete() {
							cb(res)
						}
					});
				} else {
					console.log('上传失败', res)
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					});
				}
			},
			fail: function(e) {
				uni.hideLoading()
				console.log(e);
			},
		})

	}
}

module.exports = OBSupload;
