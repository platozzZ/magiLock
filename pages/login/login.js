const app = getApp()
const code = require('../../utils/getCode.js')
const api = require('../../utils/request.js')
import WxValidate from '../../utils/WxValidate'
Page({
    data: {
        reg: false,
        second: 10
    },

    onLoad: function (options) {
        let that = this
        that.initValidate()

    },
    formSubmit(e){
        console.log(e)
        let that = this
        let data = e.detail.value
        console.log(data)
        if (!that.WxValidate.checkForm(data)) {
            const error = that.WxValidate.errorList[0]
            console.log(error)
            that.showToast(error.msg)
            return false
        } else {
            that.login(data)
        }

    },
    login(e){
        let that = this
        console.log(e)
        let openid = wx.getStorageSync('openid')
        let data = e
        data.openid = openid
        console.log(data)
        api.request('/dms/system/miniapp/login', 'POST', data).then(res => {
            console.log(res)
            if(res.data.rlt_code == 'S_0000'){
                wx.setStorageSync('token', res.data.data.access_token)
                wx.showToast({
                    title: '登录成功',
                    success(res){
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '../index/index',
                            })
                        },1000)
                    }
                })
            } else {
                that.showToast(res.data.rlt_msg)
            }
        }).catch(res =>{

        }).finally(() => { })
    },
    showToast(e) {
        wx.showToast({
            title: e,
            icon: 'none',
            mask: true
        })
    },
    initValidate() {
        // 验证字段的规则
        const rules = {
            mobile: {
                required: true,
                tel: true,
            },
            password: {
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
            }
        }
        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages)

    },
})
