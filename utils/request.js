const login = require('./wxLogin.js')
const baseUrl = require('./baseUrl.js')
//添加事件结束
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}
const request = (url, method, data,tokens) => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
//   console.log(data)
  return new Promise((resolve, reject) => {
      let token
      if (tokens){
          token = wx.getStorageSync('token')
      }
    // let token = wx.getStorageSync('token')
    console.log(token)
    wx.request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'access_token': token
      },
      success: function (res) {
        // console.log(res)
        if (res.statusCode == 200) {
          if (res.data.rlt_code == 'E_0003'){
            login.wxLogin()
            wx.showToast({
              title: '请求失败，请重试',
              icon: 'none'
            })
          }
          resolve(res); //返回成功提示信息
        } else {
          reject(res.data.rlt_msg); //返回错误提示信息
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail：',res)
        reject("网络连接错误"); //返回错误提示信息
        if (res.errMsg.indexOf('timeout') > -1) {
          wx.showToast({
            title: '网络连接超时，请检查网络后刷新重试',
            icon: 'none',
            duration: 2000
          })
          return
        }
        wx.showToast({
          title: '网络连接错误，请检查网络后刷新重试',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {
        // console.log('complete:',res)

      }
    })
  });
}

module.exports = {
  request: request
}
