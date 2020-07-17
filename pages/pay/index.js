// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asnycWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {request} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{},    //地址
        cart:[],        //购物车商品
        totalPrice:0,     //总价格
        totalNum:0       //总数量
    },
    //点击支付
    async handleOrderPay(){
        try {
            const token = wx.getStorageSync("token");
            if(!token){
                wx.navigateTo({
                    url: '/pages/auth/index'
                });
                return;    
            }
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart;
            let goods=[];
            cart.forEach(v=>goods.push({
                goods_id:v.goods_id,
                goods_number:v.num,
                goods_price:v.goods_price,
            }))
            const orderParams = {order_price,consignee_addr,goods};
            const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams})
            const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
            await requestPayment(pay);
            const res = await request({url:"/my/orders/chkOrder",method:"POSt",data:{order_number}})
            await showToast({title:"支付成功"})
            wx.navigateTo({
                url: '/pages/order/index',
            });
        } catch (error) {
            await showToast({title:"支付成功"})
            let newCarts = wx.getStorageSync("cart");  //cart里的商品
            let newCart = newCarts.filter(v=>!v.checked);  //没有支付的商品
            let orderCart = newCarts.filter(v=>v.checked);  //支付了的商品
            let getOrderCart = wx.getStorageSync("orderCart")?wx.getStorageSync("orderCart"):[];
            for(var i=0;i<getOrderCart.length;i++){
                orderCart.push(getOrderCart[i]);
            }
            wx.setStorageSync("orderCart",orderCart)
            wx.setStorageSync("cart", newCart);
            wx.navigateTo({
                url: '/pages/order/index',
            });
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
        const address = wx.getStorageSync("address");//获取地址数据
        let cart = wx.getStorageSync("cart")||[];//获取购物车数据
        cart = cart.filter(v=>v.checked)
        let totalPrice = 0;
        let totalNum = 0
        cart.forEach(v=>{
            totalPrice += v.goods_price * v.num;
            totalNum += v.num;
        })
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
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