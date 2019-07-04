const app = getApp()
const api = require('../../utils/request.js')
Page({
    data: {
        lockList: [],
        curPage: 1,
        pageSize: 20,
        total_page: '',
        showContainer: true,
        showBtn: false,
    },
    onLoad: function (options) {
        let that = this
        that.getList()
    },
    getList(e){
        let that = this
        let data = {
            current_page: that.data.curPage,
            page_size: that.data.pageSize,
        }
        api.request('/dms/device/lock/list.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000' ) {
                if (res.data.data.rows) {
                    let datas = res.data.data.rows
                    let list
                    if (that.data.curPage == 1) {
                        list = datas
                    } else {
                        list = that.data.lockList.concat(datas)
                    }
                    list.map((item,index,arr) =>{
                        if (item.comu_status == '00' && item.gateway_comu_status == '00'){
                            item.lockStatus = '0'
                            item.lockStatus_text = '在线'
                        } else {
                            item.lockStatus = '1'
                            item.lockStatus_text = '离线'
                        }
                    })
                    that.setData({
                        lockList: list,
                        curPage: res.data.data.current_page + 1
                    })
                }
                that.setData({
                    total_page: res.data.data.total_page
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => {
            wx.stopPullDownRefresh()
        })
    },
    bindLayout(e){
        let that = this
        wx.showActionSheet({
            itemList: ['退出登录'],
            success(res) {
                console.log(res.tapIndex)
                if(res.tapIndex == 0){
                    wx.showModal({
                        title: '提示',
                        content: '确认退出登录吗？',
                        success(res) {
                            if (res.confirm) {
                                that.layout()
                            }
                        }
                    })
                }
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },
    layout(e){
        let that = this
        // let token = wx.getStorageSync('token')
        api.request('/dms/system/miniapp/logout.do', 'POST', '' ,true).then(res => {
            console.log(res)
            if (res.data.rlt_code == 'S_0000') {
                wx.showToast({
                    title: '退出成功',
                    success(res) {
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '../login/login',
                            })
                        }, 1000)
                    }
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    showToast(e) {
        wx.showToast({
            title: e,
            icon: 'none',
            mask: true,
            duration: 2000
        })
    },
    onPullDownRefresh: function () {
        this.setData({
            curPage: 1
        })
        this.getList()
    },
    onReachBottom: function () {
        let that = this
        console.log(that.data)
        // that.getList()
        if (that.data.total_page >= that.data.curPage) {
            that.getList()
        }
    },
    onShareAppMessage: function () {
      console.log(options)
      return {
        title: '麦极智能锁管理平台',
        path: "/pages/homePage/homePage",
        success: function (res) {
          console.log('onShareAppMessage  success:',res)
        },
        fail: function (res) {
          console.log('onShareAppMessage  fail:', res)
        }
      }
    }
})