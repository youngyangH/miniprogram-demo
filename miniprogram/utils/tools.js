// const WXAPI = require('apifm-wxapi')
// FIXME

// 显示购物车tabBar的Badge
function showTabBarBadge(){
  const token = wx.getStorageSync('token')
  if (!token) {
    return
  }
  // WXAPI.shippingCarInfo(token).then(res => {
  //   if (res.code == 700) {
  //     wx.removeTabBarBadge({
  //       index: 2
  //     });
  //   }
  //   if (res.code == 0) {
  //     if (res.data.number == 0) {
  //       wx.removeTabBarBadge({
  //         index: 2
  //       });
  //     } else {
  //       wx.setTabBarBadge({
  //         index: 2,
  //         text: `${res.data.number}`
  //       });
  //     }
  //   }
  // })
}

function checkStatus(res) {
  return res.errMsg.split(":").pop() === 'ok';
}

module.exports = {
  showTabBarBadge: showTabBarBadge,
  checkStatus: checkStatus
}