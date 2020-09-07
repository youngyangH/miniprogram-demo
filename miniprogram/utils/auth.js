import CONFIG from '../config'

async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync(CONFIG.token)
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync(CONFIG.token)
    return false
  }
  return true
}

async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        return resolve(res)
      },
      fail: err => {
        console.error(err)
        return resolve()
      }
    })
  })
}

async function login(){
  wx.cloud.callFunction({
    name: 'login',
  }).then((res) => {
    wx.setStorageSync({
      key: CONFIG.token,
      data: res.openid
    })
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

module.exports = {
  checkHasLogined: checkHasLogined,
  getUserInfo: getUserInfo,
  login: login,
  loginOut: loginOut,
}