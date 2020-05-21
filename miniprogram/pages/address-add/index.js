const db = wx.cloud.database()
const TOOLS = require('../../utils/tools')

Page({
  data: {
    provinces: undefined,// 省份数据数组
    pIndex: 0,//选择的省下标
    cities: undefined,// 城市数据数组
    cIndex: 0,//选择的市下标
    areas: undefined,// 区县数数组
    aIndex: 0,//选择的区下标
  },

  async bindSave(e) {
    const linkMan = e.detail.value.linkMan;
    const address = e.detail.value.address;
    const mobile = e.detail.value.mobile;
    const code = '322000';
    if (linkMan == ""){
      wx.showToast({
        title: '请填写联系人姓名',
        icon: 'none'
      })
      return
    }
    if (mobile == ""){
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return
    }
    if (address == ""){
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }    
    const postData = {
      linkMan: linkMan,
      address: address,
      mobile: mobile,
      post_code: code,
      isDefault: 'true'
    }
    let apiResult
    if (this.data.id) {
      postData.id = this.data.id
      // apiResult = await WXAPI.updateAddress(postData)
    } else {
      apiResult = await db.collection('addresses')
        .add({
          data: postData
        })
    }
    if (!TOOLS.checkStatus(apiResult)) {
      // 登录错误 
      // wx.hideLoading();
      // wx.showToast({
      //   title: apiResult.msg,
      //   icon: 'none'
      // })
      // return;
    } else {
      wx.navigateBack()
    }
  },
  async onLoad(e) {
    
  },

  deleteAddress: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          WXAPI.deleteAddress(wx.getStorageSync('token'), id).then(function () {
            wx.navigateBack({})
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  async readFromWx() {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        const provinceName = res.provinceName;
        const cityName = res.cityName;
        const diatrictName = res.countyName;
        // 读取省
        const pIndex = that.data.provinces.findIndex(ele => {
          return ele.name == provinceName
        })
        if (pIndex != -1) {
          const e = {
            detail: {
              value: pIndex
            }
          }
          that.provinceChange(e, 0, 0).then(() => {
            // 读取市
            const cIndex = that.data.cities.findIndex(ele => {
              return ele.name == cityName
            })
            if (cIndex != -1) {
              const e = {
                detail: {
                  value: cIndex
                }
              }
              that.cityChange(e, 0).then(() => {
                // 读取区县
                const aIndex = that.data.areas.findIndex(ele => {
                  return ele.name == diatrictName
                })
                if (aIndex != -1) {
                  const e = {
                    detail: {
                      value: aIndex
                    }
                  }
                  that.areaChange(e)
                }
              })
            }
          })
        }
        const addressData = {}
        addressData.linkMan = res.userName
        addressData.mobile = res.telNumber
        addressData.address = res.detailInfo
        that.setData({
          addressData
        });
      }
    })
  },
})
