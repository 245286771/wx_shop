let ajaxTimec = 0;
export const request=(params)=>{
    ajaxTimec++;

    //判断url中是否带/my/ 是带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync("token");
        
    }
    //获取数据显示加载中
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    return new Promise((resolve,reject)=>{
        const reqUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
        wx.request({
            ...params,
            header:header,
            url:reqUrl+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimec--;
                if(ajaxTimec===0){
                    //取消加载中
                    wx.hideLoading();
                }
            }
        })
    })
}