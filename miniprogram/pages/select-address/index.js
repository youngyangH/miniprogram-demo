import Tools from '../../utils/tools'
import CONFIG from '../../config.js'
const db = wx.cloud.database()


Page({
  data: {
    addressList: []
  },

  selectTap: function(e) {
    var id = e.currentTarget.dataset.id;
    WXAPI.updateAddress({
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 'true'
    }).then(function(res) {
      wx.navigateBack({})
    })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function() {
  },
  onShow: function() {
    //FIXME using the right auth and login api
    const that = this
    wx.login({
      success (isLogined) {
        that.initShippingAddress();
      }
    })
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (isLogined) {
    //     this.initShippingAddress();
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '本次操作需要您的登录授权',
    //       cancelText: '暂不登录',
    //       confirmText: '前往登录',
    //       success(res) {
    //         if (res.confirm) {
    //           wx.switchTab({
    //             url: "/pages/my/index"
    //           })
    //         } else {
    //           wx.navigateBack()
    //         }
    //       }
    //     })
    //   }
    // })
  },
  
  initShippingAddress: function() {
    var that = this;
    db.collection(CONFIG.addressCollection)
      .where({
        //FIXME
        // userId: '1'
      })
      //FIXME handle the multiple address case
      .get().then( res => {
        if (Tools.checkStatus(res)) {
          that.setData({
            addressList: res.data
          });
        } else {
          that.setData({
            addressList: null
          });
        }
      })
  }

})