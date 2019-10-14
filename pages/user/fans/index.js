let App = getApp();
Page({
  data: {
    type: '',
    list: []
  },
  
  onLoad(options) {
    console.log(options.type)
    this.setData({
      type: options.type
    })
    
    // 我的粉丝和我的关注页面区分
    if(options.type === 'fans') {
      wx.setNavigationBarTitle({
        title: '我的粉丝'
      })
      
      // 获取我的粉丝列表
      this.getFansList()
    } else {
      wx.setNavigationBarTitle({
        title: '我的关注'
      })
      
      // 获取我的关注列表
      this.getLikeList()
    }
  },
  
  // 获取我的粉丝列表
  getFansList() {
    let _this = this;
    App._get('user.index/myFansList', {}, function(res) {
      console.log('我的粉丝列表', res.data.list)
      _this.setData({
        list: res.data.list
      });
    });
  },
  
  // 获取我的关注列表
  getLikeList() {
    let _this = this;
    App._get('user.index/myFocusList', {}, function(res) {
      console.log('我的关注列表', res.data.list)
      _this.setData({
        list: res.data.list
      });
    });
  },
  
  
  
})