const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../utils/request.js')
import WxValidate from '../../utils/WxValidate'
Page({
    data: {
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        radomPwd: '',
        lockId: '',
        pwdId: '',
        mobile: ''
    },

    onLoad: function (options) {
        console.log(options)
        let that = this
        if (options.status == 'a') {
            wx.setNavigationBarTitle({
                title: '新增密码',
            })
        } else {
            that.getInfo(options)
            wx.setNavigationBarTitle({
                title: '修改密码',
            })
        }
        that.setData({
            lockId: options.lockId,
            pwdId: options.id,
            status: options.status,
        })
        that.initValidate()
    },
    formSubmit(e) {
        console.log(e)
        let that = this
        let value = e.detail.value
        let data = {}
        data.valid_time_start = value.startDate + ' ' + value.startTime
        data.valid_time_end = value.endDate + ' ' + value.endTime
        data.pwd = value.password
        data.pwd_user_mobile = value.mobile
        data.send_sms_flag = 'Y'
        if (!that.WxValidate.checkForm(value)) {
            const error = that.WxValidate.errorList[0]
            console.log(error)
            that.showToast(error.msg)
            return false
        } else {
            if (that.data.status == 'a') {
                that.addPwd(data)
            } else {
                that.changePwd(data)
            }
        }

    },
    addPwd(e){
        let that = this
        console.log(e)
        let data = e
        data.lock_id = that.data.lockId
        console.log(data)
        api.request('/dms/device/lock/pwd/add.do', 'POST', data,true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                wx.navigateBack()
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    changePwd(e){
        let that = this
        let data = e
        data.lock_id = that.data.lockId
        data.pwd_id = that.data.pwdId
        console.log(data)
        api.request('/dms/device/lock/pwd/edit.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                wx.navigateBack()
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    getInfo(e){
        let that = this
        console.log(e)
        let data = {}
        data.lock_id = e.lockId
        data.pwd_id = e.id
        console.log(data)
        api.request('/dms/device/lock/pwd/info.do', 'POST', data, true).then(res => {
            console.log(res.data)
            if (res.data.rlt_code == 'S_0000') {
                let data = res.data.data

                that.setData({
                    mobile: res.data.data.pwd_user_mobile,
                    startDate: util.formatDate(new Date(data.valid_time_start)),
                    endDate: util.formatDate(new Date(data.valid_time_end)),
                    startTime: util.formatTime(new Date(data.valid_time_start)),
                    endTime: util.formatTime(new Date(data.valid_time_end)),
                })
                // wx.navigateBack()
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
            mask: true
        })
    },
    createCode() {
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        } 
        console.log(code)
        this.setData({
            radomPwd: code
        })
    },
    bindDateS(e){
        let that = this
        console.log('startDate:', e.detail.value)
        that.setData({
            startDate: e.detail.value
        })
    },
    bindDateE(e) {
        let that = this
        console.log('endDate:', e.detail.value)
        that.setData({
            endDate: e.detail.value
        })
    },
    bindTimeS(e) {
        let that = this
        console.log('startTime:', e.detail.value)
        that.setData({
            startTime: e.detail.value
        })
    },
    bindTimeE(e) {
        let that = this
        console.log('endTime:', e.detail.value)
        that.setData({
            endTime: e.detail.value
        })
    },
    initValidate() {
        // 验证字段的规则
        const rules = {
            mobile: {
                required: true,
                tel: true
            },
            password: {
                required: true,
                rangelength: [6, 10]
            },
            startDate: {
                required: true,
            },
            startTime: {
                required: true,
            },
            endDate: {
                required: true,
            },
            endTime: {
                required: true,
            },
        }
        const messages = {
            mobile: {
                required: '手机号不能为空',
                tel: '请输入正确的手机号',
            },
            password: {
                required: '密码不能为空',
                rangelength: '请输入6~10位密码'
            },
            startDate: {
                required: '请选择开始日期',
            },
            startTime: {
                required: '请选择开始时间',
            },
            endDate: {
                required: '请选择结束日期',
            },
            endTime: {
                required: '请选择结束时间',
            }
        }
        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages)

    },
})