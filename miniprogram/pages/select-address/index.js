import Tools from '../../utils/tools'
import CONFIG from '../../config.js'
const db = wx.cloud.database()


Page({
  data: {
    addressList: [],
    defaultAddressId: "",
  },

  selectTap: function(e) {
    const $ = db.command
    if(!e.currentTarget.dataset.isdefault) {
      db.collection(CONFIG.addressCollection)
        .where({
          _id: $.in([this.data.defaultAddressId, e.currentTarget.dataset.id])
        })
        .update({
          is_default: true
        })
        .then(() =>
          wx.navigateBack({})
       )
    } else {
      wx.navigateBack({})
    }
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index?isDefault=" + (this.data.addressList.lenth==0? true: false)
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function(e) {
    this.setData({
      defaultAddressId: e.defaultAddressId,
    })
  },

  onShow: function() {
    //FIXME need to login?
    this.initShippingAddress()
  },
  
  initShippingAddress: function() {
    var that = this;
    db.collection(CONFIG.addressCollection)
      .where({
        userId: wx.getStorageSync(CONFIG.token)
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