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
        // let storageOpenid = wx.getStorageSync('openid')
        // let globalOpenid = app.globalData.open_id
        // console.log('that.checkOpenid(storageOpenid):', that.checkOpenid(storageOpenid))
        // console.log('that.checkOpenid(globalOpenid):', that.checkOpenid(globalOpenid))
        // that.checkOpenid(storageOpenid)
        // that.checkOpenid(globalOpenid)
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
        console.log(app)
        let that = this
        console.log(e)
        let storageOpenid = wx.getStorageSync('openid')
        let globalOpenid = app.globalData.open_id
        let data = e
        data.openid = that.checkOpenid(storageOpenid) ? storageOpenid : globalOpenid
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
    checkOpenid(e) {
        if (e == 0 || e == undefined || e == null || e == false || e == '') {
            return false
        } else {
            return true
        }
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
                rangelength: [6,10]
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
            }
        }
        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages)

    },
})
