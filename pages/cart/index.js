// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asnycWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{},    //地址
        cart:[],        //购物车商品
        allChecked:false,      //全选
        totalPrice:0,     //总价格
        totalNum:0       //总数量
    },
    //获取收货地址
    async handleChooseAddress(){
        //是否获取收货地址权限authSetting scope.address
        // wx.getSetting({
        //     success: (result) => {
        //         const scopeAddress = result.authSetting["scope.address"];
        //         if(scopeAddress==true || scopeAddress == undefined){
        //             wx.chooseAddress({
        //                 success: (result1) => {
        //                     console.log(result1);
        //                 }
        //             });
        //         }else{
        //             wx.openSetting({
        //                 success: (result2) => {
        //                     wx.chooseAddress({
        //                         success: (result3) => {
        //                             console.log(result3);
        //                         }
        //                     });
        //                 },
        //             });
                      
        //         }
        //     },
        // });
        try {
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            if(scopeAddress==false){
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            wx.setStorageSync("address",address); 
        } catch (error) {
            console.log(error);
        }
        
        

          
          
    },
    handeItemChange(e){
        const goods_id = e.currentTarget.dataset.id;
        let {cart} = this.data;
        let index = cart.findIndex(v=>v.goods_id==goods_id);
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },
    //封装购物车状态方法
    setCart(cart){
        let allChecked = true;//是否全选
        let totalPrice = 0;
        let totalNum = 0
        cart.forEach(v=>{
            if(v.checked){
                totalPrice += v.goods_price * v.num;
                totalNum += v.num;
            }else{
                allChecked = false;
            }
        })
        allChecked = cart.length?allChecked:false;
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync("cart", cart);
    },
    //设置全选反选
    handleItemAllchecked(){
        let {cart,allChecked} = this.data;
        allChecked = !allChecked;
        cart.forEach(v=>v.checked=allChecked);
        this.setCart(cart);
    },
    //点击计数器
    async handeItemNum(e){
        let {id,operation} = e.currentTarget.dataset;
        let {cart} = this.data;
        const index = cart.findIndex(v=>v.goods_id==id);
        if(cart[index].num==1&&operation==-1){
            const res = await showModal({content:'你确定要删除吗?'});
            if(res.confirm){
                cart.splice(index,1);
                this.setCart(cart); 
            }
        }else{
            cart[index].num += parseInt(operation);
            this.setCart(cart);
        }
    },
    async handePay(){
        const {address,totalNum} = this.data;
        if(totalNum==0){
            await showToast({title:"你还没有选择购买的商品"});
            return;
        }
        if(!address.userName){
            await showToast({title:"你还没有选择收货地址"});
            return;
        }
        wx.navigateTo({
            url:"/pages/pay/index"
        })
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
        const cart = wx.getStorageSync("cart")||[];//获取购物车数据
        this.setData({address});
        this.setCart(cart);
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