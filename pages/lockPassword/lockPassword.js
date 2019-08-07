const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../utils/request.js')
Page({
    data: {
        lockList: [],
        lockId: '',
        showContainer: true,
        showBtn: false,
        showModel: false,
        hiddenContainer: false,
        title: '',
        offLine: ''
    },
    onLoad: function (options) {
        console.log(options)
        let that = this
        wx.setNavigationBarTitle({
            title: options.title,
        })
        that.setData({
            title: options.title,
            lockId: options.id
        })
        // that.getList(options.id)
        // console.log(that.data.lockList)
    },
    getList(e) {
        let that = this
        let data = {
            lock_id: e
        }
        api.request('/dms/device/lock/pwd/list.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                let list = res.data.data
                let obj = {
                    ['01']: {
                        lockStatus_text: '启用中',
                    }, ['02']: {
                        lockStatus_text: '禁用中'
                    }, ['03']: {
                        lockStatus_text: '删除中'
                    }, ['11']: {
                        lockStatus_text: '已启用'
                    }, ['12']: {
                        lockStatus_text: '已禁用'
                    }, ['13']: {
                        lockStatus_text: '已删除'
                    }, ['21']: {
                        lockStatus_text: '启用失败'
                    }, ['22']: {
                        lockStatus_text: '禁用失败'
                    }, ['23']: {
                        lockStatus_text: '删除失败'
                    }
                }
                list.map((item, index, arr) => {
                    let actions = obj[item.status]
                    item.startTime = util.formatAllTime(new Date(item.valid_time_start))
                    item.endTime = util.formatAllTime(new Date(item.valid_time_end))
                    item.createTime = util.formatAllTime(new Date(item.create_time))
                    
                    item.lockStatus_text = actions.lockStatus_text
                })
                console.log(list)
                that.setData({
                    lockList: list
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { 
            wx.stopPullDownRefresh()
        })
    },

  showToast(e) {
    wx.showToast({
      title: e,
      icon: 'none',
      mask: true,
      duration: 2000
    })
  },
    // getOffline(e) {
    //     let that = this
    //     that.setData({
    //         showModel: true,
    //         hiddenContainer: true
    //     })
    //     // wx.showModal({
    //     //     title: '离线密码',
    //     //     content: '123456\r\n开始时间：2019/06/06  12: 00\r\n结束时间：2019/06/06  12: 00',
    //     // })
    // },
    getOffline(e){
        let that = this
        let data = {
            lockid: that.data.lockId
        }
        api.request('/dms/device/lock/pwd/temp.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                that.setData({
                    offLine: res.data.data,
                    showModel: true,
                    hiddenContainer: true
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => {
            wx.stopPullDownRefresh()
        })
    },
    handelConfirm(e) {
        let that = this
        that.setData({
            showModel: false,
            hiddenContainer: false
        })

    },
    handleChange(e){
        let id = e.currentTarget.dataset.id
        let lockId = e.currentTarget.dataset.lockid
        wx.navigateTo({
            url: '../addPassword/addPassword?id=' + id + '&lockId=' + lockId + '&status=c',
        })
    },
    handleDetele(e) {
        let that = this
      console.log(e)
        let id = e.currentTarget.dataset.id
      let lockId = e.currentTarget.dataset.lockid
      console.log(id)
      console.log(lockId)
        let data = {
            lock_id: lockId,
            pwd_id: id
        }
        console.log(data)
        wx.showModal({
            title: '删除密码',
            content: '确认删除？',
            success(res){
                if(res.confirm){
                    that.detelePwd(data)
                }
            }
        })
    },
    detelePwd(e){
        let that = this
        let data = e
        console.log(data)
        api.request('/dms/device/lock/pwd/del.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                that.getList(that.data.lockId)
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    onShow(){
        this.getList(this.data.lockId)
    },
    onPullDownRefresh: function () {
        this.getList(this.data.lockId)
    },
    onReachBottom: function () {

    }
})