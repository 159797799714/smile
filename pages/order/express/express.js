const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},

    express: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 获取物流动态
    this.getExpressDynamic(options.order_id, options.type);
  },

  /**
   * 获取物流动态
   */
  getExpressDynamic: function(order_id, type) {
    let _this = this,
      url= type === 'sharing'? 'sharing.order/express': 'user.order/express';
    App._get(url, {
        order_id
      }, function(result) {
        _this.setData(result.data);
      },
      function() {
        wx.navigateBack();
      });
  },

})