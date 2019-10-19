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
    this.getExpressDynamic(options.order_id, options.type, options.order_goods_id);
  },

  /**
   * 获取物流动态
   */
  getExpressDynamic: function(order_id, type, goods_id) {
    let _this = this,
      url= type === 'sharing'? 'sharing.order/goodsExpress': 'user.order/goodsExpress';
    App._get(url, {
        order_id: order_id,
        order_goods_id: goods_id
      }, function(result) {
        _this.setData(result.data);
      },
      function() {
        wx.navigateBack();
      });
  },

})