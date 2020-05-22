// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
//TODO Implement the details
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  console.log(cloud.getWXContext())

  // const db = cloud.database()
  // db.collection('demo').get().then((data) => console.log(data))

  // const res = await cloud.cloudPay.unifiedOrder({
  //   "body" : "demo",
  //   "outTradeNo" : "1217752501201407033233368018",
  //   "spbillCreateIp" : "127.0.0.1",
  //   "totalFee" : 0.01,
  //   "functionName": "pay_cb"
  // })

  return res          
}

