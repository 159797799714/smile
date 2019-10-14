const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
      name: '未使用',
      type: 'not_use'
    }, {
      name: '已使用',
      type: 'is_use'
    }, {
      name: '已过期',
      type: 'is_expire'
    }],      // 顶部导航栏
    tabData: 'not_use',
    list: [],         // 优惠券列表
    notcont: false    // show
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
    // 获取优惠券列表
    this.getCouponList(this.data.tabData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  
  /**
   * 获取优惠券列表
   */
  getCouponList(type) {
    let that = this;
    App._get('user.redenvelope/lists', {
      data_type: type
    }, function(res) {
      that.setData({
        list: res.data.list
      });
    });
  },
  
  // 使用优惠券
  getCoupon(e) {
    let that= this,
      coupon_id= e.currentTarget.dataset.id;
      console.log(that.data.tabData === 'not_use')
    if(that.data.tabData === 'not_use') {
      wx.switchTab({
        url: '/pages/shopping-mall/index'
      })
    } else {
      return
    }
    // else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '是否去领取更多优惠券?',
    //     success (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/coupon/coupon'
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
    
  },
  
  // 点击顶部tab
  selectab(e) {
    let that= this,
      type= e.currentTarget.dataset.type;
    that.setData({
      tabData: type
    })
    
    // 获取优惠券列表
    that.getCouponList(type)
  },


});