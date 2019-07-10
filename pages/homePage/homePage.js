const app = getApp()
const login = require('../../utils/wxLogin.js')
Page({
    data: {

    },
    onLoad: function (options) {
      login.wxLogin(app)
    },
    onReady: function () {

    },
    onShow: function () {

      // let that = this
      // login.wxLogin(app)
    },

})