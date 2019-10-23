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
    this.setData({
      category_id: opt.category_id
    })
    wx.setNavigationBarTitle({
      title: opt.title
    })
    this.getContentById(opt.category_id)
  },
  getContentById(id) {
    let _this= this,
      category_id = id;
    App._get('agreement_category/getContentById', {
      category_id: category_id
    }, function(res) {
      _this.setData({
        content: res.data.content
      })
    })
  }

});
