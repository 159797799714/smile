const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    banner: '',           // 红包背景图
    redBoxList: [],       // 红包列表
    new_user_share: [],   // 分销规则说明
    info: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取红包列表
    this.getRedBoxList()
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // // 分销说明处理
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
  // 获取红包列表
  getRedBoxList() {
    let _this= this
    App._get('redenvelope/lists', {}, function(res) {
      _this.setData({
        redBoxList: res.data.list,
        banner: res.data.banner
      })
    })
  },
  // 领取红包
  getRedBox(e) {
    let _this= this,
      id= e.currentTarget.dataset.id,
      index= e.currentTarget.dataset.index,
      item= 'redBoxList['+index + '].is_receive';
    App._post_form('user.redenvelope/receive', {
      coupon_id: id
    }, function(res) {
      _this.setData({
        [item]: !_this.data.redBoxList[index].is_receive
      })
    })
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

  