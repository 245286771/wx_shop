import {login} from "../../utils/asnycWx.js"
import {request} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    
    async handleGetUserInfo(e){
        try {
            const {encryptedData,errMsg,iv,signature} = e.detail;
            const {code} = await login();
            const loginParams = {encryptedData,errMsg,iv,signature,code}
            let token = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
            token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
            wx.setStorageSync("token",token);
            wx.navigateBack({
              delta: 1 
            });
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})