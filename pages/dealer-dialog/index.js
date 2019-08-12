const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let system = wx.getSystemInfoSync();
    console.log(system)
    this.setData({
      height: system.windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  }
  
});

  