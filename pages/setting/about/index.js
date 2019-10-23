const App = getApp();

Page({

  data: {
    menulist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取所有协议分类列表
    this.getAgreementList()
  },
  
  getAgreementList() {
    let _this= this
    App._get('agreement_category/list', {}, function(res) {
      _this.setData({
        menulist: res.data.list
      })
    })
  }

});
