const App = getApp();

Page({

  data: {
    info: {},
    onEdit: false,
    sign: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
  },
  getInfo() {
    let _this = this;
    App._get(App.url.appCenterGetuserinfo, {}, function(result) {
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
  
  signOninput(e) {
    this.setData({
      sign: e.detail.value
    })
  },
  // 输入框失去焦点
  submitSign() {
    let _this= this,
      value= _this.data.sign;
    if(_this.data.info.sign !== value) {
      App._post_form(App.url.appCenterModifyWxUserInfo, {
        sign: value? value: '',
      }, function(result) {
        _this.setData({
          'info.sign': value
        })
      });  
    }
    _this.setData({
      onEdit: !_this.data.onEdit
    })
  }

});
