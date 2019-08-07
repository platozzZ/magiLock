const app = getApp()
const api = require('../../utils/request.js')
var that
Page({
    data: {
      art: '',
      lockId: '',
      showEditModal: false,
      lockName: ''
    },

    onLoad(options) {
        console.log(options)
        that = this
        that.setData({
            lockId: options.id,
        })
        that.getLock(options.id)
    },
    getLock(e){ //
        let datas = { lock_id: e,}
        console.log(e)
        api.request('/dms/device/lock/info.do', 'POST', datas, true).then(res => {
          console.log('getLock:',res.data)
          if (res.data.rlt_code == 'S_0000') {
            let data = res.data.data
            wx.setNavigationBarTitle({
              title: data.lock_name,
            })
                if (data.comu_status == '00' && data.gateway_comu_status == '00') {
                    data.lockStatus = '0'
                    data.lockStatus_text = '在线'
                } else {
                    data.lockStatus = '1'
                    data.lockStatus_text = '离线'
                }
                console.log(data)
                that.setData({
                    art: data,
                  lockName: data.lock_name
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
  lockName(e){
    that.setData({
      lockName: e.detail.value
    })
  },
  showEditModal(e){
    that.setData({
      showEditModal: true
    })
  },

  hideEditModal(e) {
    that.setData({
      showEditModal: false,
    })
  },
  editSubmit(e){
    let data = e.detail.value
    console.log(data)
    if (!!data.lock_name && !!data.lock_id){
      that.editName(data)
    } else {
      that.showToast('请输入门锁名称')
    }
  },
  editName(e){
    let data = e
    api.request('/dms/device/lock/update_name.do', 'POST', data, true).then(res => {
      console.log('editName:',res.data)
      if (res.data.rlt_code == 'S_0000') {
        that.hideEditModal()
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000,
          success(res){
            setTimeout(function () {
              that.getLock(that.data.lockId)
            },2000)
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
    },

})
