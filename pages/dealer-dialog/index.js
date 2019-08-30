const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    new_user_share: [],
    info: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let system = wx.getSystemInfoSync();
    let new_user_share = wx.getStorageSync('is_new_user_share');
    let arr = []
    new_user_share.describe.map((item, index) => {
       let obj = {}
      for(let i in item) {
        obj.title= i
        obj.content= item[i]
      }
      arr.push(obj)
    })
    
    console.log(new_user_share.describe)
    this.setData({
      height: system.windowHeight,
      width: system.windowWidth,
      new_user_share: new_user_share,
      info: arr
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  godealer() {
    wx.navigateTo({
      url: '../dealer/index/index'
    })
  },
  goBack() {
    wx.switchTab({
      url: '../index/index'
    })
  }
  
});

  