const App = getApp();

// 工具类
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  onShow() {
    console.log('login的onshow')
  },
  
  checkboxChange: function (e) {
    this.setData({
      checked: e.detail.value.length > 0
    })
  },
  /**
   * 授权登录
   */
  authorLogin: function(e) {
    let _this = this,
      checked= _this.data.checked;
    if(checked) {
      if (e.detail.errMsg !== 'getUserInfo:ok') {
        return false;
      }
      wx.showLoading({
        title: "正在登录",
        mask: true
      });
      // 执行微信登录
      wx.login({
        success: function(res) {
          wx.setStorageSync('is_new_user_share', '');
          // 发送用户信息
          App._post_form('user/login', {
            code: res.code,
            user_info: e.detail.rawData,
            encrypted_data: e.detail.encryptedData,
            iv: e.detail.iv,
            signature: e.detail.signature,
            referee_id: wx.getStorageSync('referee_id')
          }, function(result) {
            // 记录token user_id
            wx.setStorageSync('token', result.data.token);
            wx.setStorageSync('user_id', result.data.user_id);
            if(result.data.is_new_user === 'yes') {
              wx.setStorageSync('is_new_user_share', result.data.is_new_user_share);
              wx.navigateTo({
                url: '../dealer-dialog/index'
              })
              return
            }
            // 跳转回原页面
            _this.navigateBack();
          }, false, function() {
            wx.hideLoading();
          });
        }
      });
    } else {
      App.showError('请先勾选同意用户服务协议')
    }
    
    
  },
  goRegisterWord() {
    wx.navigateTo({
      url: '/pages/setting/about/detail/index?search=注册协议&title=注册协议'
    })
  },
  
  reject() {
    // 跳转回原页面
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  
  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function() {
    wx.navigateBack();
    
    
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + util.urlEncode(currentPage.options)
    // });
  }

})