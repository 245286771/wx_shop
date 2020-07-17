import {request} from "../../request/index";
// import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList:[],  //左侧菜单数据
        rightContent:[],   //右侧商品数据
        currentIndex:0,   //左侧选中菜单
        scrollRight:0     //右侧商品距离顶部
    },
    //接口返回数据
    Cates:[],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const Cates = wx.getStorageSync('cates');
        if(!Cates){
            this.getCates();
        }else{
            if(Date.now - Cates.time > 50000){
                this.getCates();
            }else{
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v=>v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    //获取分类数据
    async getCates(){
        // request({url: '/categories'}).then(res=>{
        //     this.Cates = res.data.message;
        //     wx.setStorageSync("cates",{
        //         tiem:Date.now(),
        //         data:this.Cates
        //     });
            
        //     let leftMenuList = this.Cates.map(v=>v.cat_name);
        //     let rightContent = this.Cates[0].children;
        //     this.setData({
        //         leftMenuList,
        //         rightContent
        //     })
        // })

        //使用es7 async await来发送请求
        const res = await request({url:"/categories"});
        // this.Cates = res.data.message;
        this.Cates = res;
        wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })

    },
    //点击左侧菜单
    handleItemTap(e){
        let {index} = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex:index,
            rightContent,
            scrollRight:0
        })
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