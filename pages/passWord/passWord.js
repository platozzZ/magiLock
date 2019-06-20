const app = getApp()
const code = require('../../utils/getCode.js')
const api = require('../../utils/request.js')
import WxValidate from '../../utils/WxValidate'
Page({
    data: {
        reg: false,
        second: 120,
        status: '',
        showPw: false,
        mobile: ''
    },
    onLoad: function (options) {
        let that = this
        that.initValidate()
        console.log(options)
        wx.setNavigationBarTitle({
            title: options.status,
        })
        that.setData({
            status: options.status,
        })
    },
    getCode(e) {
        console.log(e)
        let that = this
        let time = that.data.second//获取最初的秒数
        let data = { mobile: e.currentTarget.dataset.mobile }
        console.log(data)
        api.request('/sms/verify_code', 'POST', data).then(res => {
            console.log(res)
            if (res.data.rlt_code == 'S_0000') {
                code.getCode(that, time);　　//调用倒计时函数
                wx.showToast({
                    title: '短信发送成功',
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    }, 
    mobileInput(e){
        // console.log(e.detail)
        let that = this
        that.setData({
            mobile: e.detail.value
        })
    },
    formSubmit(e) {
        console.log(e)
        let that = this
        let status = that.data.status
        let data = e.detail.value
        console.log(data)
        if (!that.WxValidate.checkForm(data)) {
            const error = that.WxValidate.errorList[0]
            console.log(error)
            that.showToast(error.msg)
            return false
        } else {
            if (status == '注册') {
                that.register(data)
            } else if (status == '找回密码'){
                that.forget(data)
            }
        }
    },
    register(e){//注册
        console.log(e)
        let that = this
        let data = e
        console.log(data)
        api.request('/dms/system/user/register', 'POST', data).then(res => {
            console.log('register:',res)
            if (res.data.rlt_code == 'S_0000') {
                console.log(data)
                that.login(data)
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })

    },
    forget(e){//忘记密码
        console.log(e)
        let that = this
        let data = e
        console.log(data)
        api.request('/dms/system/user/forget_password', 'POST', data).then(res => {
            console.log('forget:',res)
            if (res.data.rlt_code == 'S_0000') {
                console.log(data)
                that.login(data)
            } else if (res.data.rlt_code == 'U_0006') {
                that.showToast('用户信息不存在，请注册后登录')
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res => {

        }).finally(() => { })
    },
    login(e) {
        let that = this
        console.log(e)
        let openid = wx.getStorageSync('openid')
        let data = e
        data.openid = openid
        console.log(data)
        api.request('/dms/system/miniapp/login', 'POST', data).then(res => {
            console.log(res)
            if (res.data.rlt_code == 'S_0000') {
                wx.setStorageSync('token', res.data.data.access_token)
                wx.showToast({
                    title: '登录成功',
                    success(res) {
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '../index/index',
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
    toggleEyes(e){
        this.setData({
            showPw: !this.data.showPw
        })
    },
    initValidate() {
        // 验证字段的规则
        const rules = {
            mobile: {
                required: true,
                tel: true,
            },
            verify_code: {
                required: true,
            },
            password: {
                required: true,
            },
            // renew_password: {
            //     required: true,
            //     equalTo: 'password',
            // }
        }
        const messages = {
            mobile: {
                required: '手机号不能为空',
                tel: '请输入正确的手机号',
            },
            verify_code: {
                required: '请输入验证码',
            },
            password: {
                required: '密码不能为空',
            }
        }
        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages)

    },

})