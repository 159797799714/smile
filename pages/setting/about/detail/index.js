const App = getApp();

Page({

  data: {
    category_id: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    console.log(opt)
    this.setData({
      category_id: opt.category_id?opt.category_id: '',
      search: opt.search?opt.search: ''
    })
    wx.setNavigationBarTitle({
      title: opt.title
    })
    if(opt.category_id) {
      this.getContentById(opt.category_id)
    } else if(opt.search) {
      this.getRegister(opt.search)
    }
    
  },
  
  getContentById(id) {
    let _this= this,
      category_id = id;
    App._get(App.url.agreementCategoryGetContentById, {
      category_id: category_id
    }, function(res) {
      _this.setData({
        content: res.data.content
      })
    })
  },
  // 登录时注册协议
  getRegister(search) {
    let _this= this;
    App._get(App.url.agreementCategoryGetContentByName, {
      search: search
    }, function(res) {
      _this.setData({
        content: res.data.content
      })
    })
  }

});
