const App = getApp();

Page({

  data: {
    info: {},
    onEdit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
  },
  getInfo() {
    let _this = this;
    App._get('app.center/getuserinfo', {}, function(result) {
      _this.setData({
        info: result.data.info
      })
    });
  },
  
  // 编辑个人信息
  editSign() {
    this.setData({
      onEdit: !this.data.onEdit
    })
  },
  
  // 输入框失去焦点
  submitSign(e) {
    let _this= this
    if(_this.data.info.sign !== e.detail.value) {
      App._post_form('app.center/modifyWxUserInfo', {
        sign: e.detail.value? e.detail.value: '',
      }, function(result) {
        _this.setData({
          'info.sign': e.detail.value
        })
      });  
    }
    _this.setData({
      onEdit: !_this.data.onEdit
    })
  }

});
