const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../utils/request.js')
Page({
    data: {
        list: [],
        curPage: 1,
        pageSize: 20,
        total_page: ''
    },
    onLoad: function (options) {
        console.log(options)
        console.log(this.data)
        let that = this
        that.getList(options.id)
        that.setData({
            lockId: options.id
        })
    },
    getList(e) {
        let that = this
        console.log(that.data)
        let data = {
            current_page: that.data.curPage,
            page_size: that.data.pageSize,
            lock_id: e
        }
        console.log(data)
        api.request('/dms/device/lock/open_door_list.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                if (res.data.data.rows) {
                    let datas = res.data.data.rows
                    let list
                    if (that.data.curPage == 1) {
                        list = datas
                    } else {
                        list = that.data.list.concat(datas)
                    }
                    list.map((item, index, arr) => {
                        item.createTime = util.formatAllTime(new Date(item.create_time))
                    })
                    // let curPage
                    // if (res.data.data.current_page < res.data.data.total_page){
                    //     curPage = res.data.data.current_page + 1
                    // } else {
                    //     curPage = res.data.data.current_page
                    // }
                    that.setData({
                        list: list,
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
        this.getList(this.data.lockId)
    },
    onReachBottom: function () {
        let that = this
        console.log(that.data)
        if (that.data.total_page >= that.data.curPage){
            that.getList(that.data.lockId)
        }
    }
})