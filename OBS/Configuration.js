//指定OBS服务相关信息：AK，SK，EndPoint
let obsConfig = uni.getStorageSync('obsConfig');
var Configuration = {
  AccessKeyId: obsConfig.accessKey,      //AK
  SecretKey: obsConfig.secretKey,        //SK
  EndPoint: obsConfig.endPoint,         //上传文件的路径
  address: obsConfig.address
};


module.exports = Configuration;