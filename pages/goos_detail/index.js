import {request} from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:[]
    },
    GoodsInfo:{},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {goods_id} = options;
        this.getGoodsDetail(goods_id);
    },
    //获取商品详情页数据
    async getGoodsDetail(goods_id){
        const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
        this.GoodsInfo = goodsObj;
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                goods_introduce:goodsObj.goods_introduce,
                pics:goodsObj.pics
            }
        })
    },
    //点击图片放大
    handlePrevewImage(e){
        const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        });
    },
    //加入购物车
    handleCartAdd(){
        //获取缓存的购物车数据
        let cart = wx.getStorageSync("cart")||[];
        let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        if(index === -1){
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        }else{
            cart[index].num++;
        }
        //把购物车添加会缓存中
        wx.setStorageSync("cart",cart);
        //提示
        wx.showToast({
          title: '加入购物车成功', //提示的内容,
          icon: 'success', //图标,
          duration: 1500, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        
    },
    //收藏
    handleLive(e){
        let collect = wx.getStorageSync("collect")?wx.getStorageSync("collect"):[];
        this.GoodsInfo.is_promote = !this.GoodsInfo.is_promote;
        if(this.GoodsInfo.is_promote){
            collect.push(this.GoodsInfo);
            wx.showToast({
                title: '商品已收藏', //提示的内容,
                icon: 'success', //图标,
                duration: 1500, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
        }else{
            for(var i=0;i<collect.length;i++){
                if(collect[i].goods_id == this.GoodsInfo.goods_id){
                    collect.splice(i,1)
                }
            }
            wx.showToast({
                title: '取消收藏成功', //提示的内容,
                icon: 'success', //图标,
                duration: 1500, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            console.log(this.GoodsInfo);
        }
        wx.setStorageSync("collect", collect);
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