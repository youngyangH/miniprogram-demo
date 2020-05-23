//index.js
import CONFIG from '../../config.js'
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    //TODO implement later
    categories: null,
    goodsRecommend: null,
    banners: null,
    goods: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("session_key is ok!")
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        wx.cloud.callFunction({
          name: 'login',
        }).then((res) => {
          wx.setStorageSync({
            key: CONFIG.token,
            data: res.openid
          })
        }) //重新登录
      }
    })

    this.fetchGoods()
  },

  async fetchGoods() {
    const res = await db.collection(CONFIG.collectionName)
      // .where({
      // _openid: 'gh_a911ec9e8e19' // 填入当前用户 openid
      // })
      .field({
        cost: false,
        goodsDetails: false,
      })
      .get()
    this.setData({
      goods: res.data,
    })
  },

  goSearch: function() {
    // console.log("confirm")
      this.fetchGoods()
  },

  toDetailsTap: function(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/goods-details/goodsDetails?id=" + e.currentTarget.dataset.id
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
