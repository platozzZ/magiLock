const app = getApp()
const api = require('../../utils/request.js')
Page({
    data: {
        art: '',
        lockId: '',
        title: ''
    },

    onLoad(options) {
        console.log(options)
        let that = this
        wx.setNavigationBarTitle({
            title: options.title,
        })
        this.setData({
            lockId: options.id,
            title: options.title
        })
        that.getLock(options.id)
    },
    getLock(e){ //
        let that = this
        let data = { lock_id: e,}
        api.request('/dms/device/lock/info.do', 'POST', data, true).then(res => {
            console.log(res)
            if (res.data.rlt_code == 'S_0000') {
                let data = res.data.data
                if (data.comu_status == '00' && data.gateway_comu_status == '00') {
                    data.lockStatus = '0'
                    data.lockStatus_text = '在线'
                } else {
                    data.lockStatus = '1'
                    data.lockStatus_text = '离线'
                }
                console.log(data)
                that.setData({
                    art: data
                })
                // if (res.data.data.rows) {
                //     console.log(res.data.data.rows)
                //     let data = res.data.data.rows
                //     data.map((item, index, arr) => {
                //         if (item.comu_status == '00' && item.gateway_comu_status == '00') {
                //             item.lockStatus = '0'
                //             item.lockStatus_text = '在线'
                //         } else {
                //             item.lockStatus = '1'
                //             item.lockStatus_text = '离线'
                //         }
                //     })
                //     that.setData({
                //         lockList: data
                //     })
                // }
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    deteleLock(e){
        wx.showModal({
            title: '提示',
            content: '确认删除' + this.data.lockId,
            success(res){
                if(res.confirm){
                    wx.navigateBack()
                }
            }
        })
    }
})
