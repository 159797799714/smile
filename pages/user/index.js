let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 20,    // 原生导航栏高度
    userInfo: {},
    orderCount: {},
    
    msglist: [{
      num: 100,
      name: '关注'
    }, {
      num: 100,
      name: '收藏'
    }, {
      num: 100,
      name: '点赞'
    }, {
      num: 100,
      name: '粉丝'
    }],
    
    // 每日签到等一栏
    munulist1: [{
      icon: '../../images/user/menu1-1.png',
      name: '每日签到'
    }, {
      icon: '../../images/user/menu1-2.png',
      name: '我的分享'
    }, {
      icon: '../../images/user/menu1-3.png',
      name: '我的消息'
    }, {
      icon: '../../images/user/menu1-4.png',
      name: '客服小蜜'
    }],
    
    // 我的订单
    munulist2: [{
      icon: '../../images/user/menu2-1.png',
      name: '待付款',
      url: '/pages/order/index?type=payment'
    }, {
      icon: '../../images/user/menu2-2.png',
      name: '待收货',
      url: '/pages/order/index?type=received'
    }, {
      icon: '../../images/user/menu2-3.png',
      name: '待评价',
      url: '/pages/order/index?type=comment'
    }, {
      icon: '../../images/user/menu2-4.png',
      name: '退款/售后',
      url: '/pages/order/refund/index'
    }],
    // 我的拼团订单
    munulist2_2: [{
      icon: '../../images/user/menu2-1.png',
      name: '待付款',
      url: '/pages/sharing/order/index?type=payment'
    }, {
      icon: '../../images/user/menu2-5.png',
      name: '拼团中',
      url: '/pages/sharing/order/index?type=sharing'
    }, {
      icon: '../../images/user/menu2-6.png',
      name: '待收货',
      url: '/pages/sharing/order/index?type=received'
    }, {
      icon: '../../images/user/menu2-7.png',
      name: '待评价',
      url: '/pages/sharing/order/index?type=comment'
    },],
    
    // 我的钱包
    purselist: [{
      num: 1000,
      name: '余额'
    }, {
      num: 1000,
      name: '优惠券',
      url: '/pages/coupon/mycoupon/index'
    }, {
      num: 1000,
      name: '红包',
      url: '/pages/redbox/index'
    }],
    
    // 我的分销
    munulist3: [{
      icon: '../../images/user/menu3-1.png',
      name: '我的团队',
      url: '/pages/dealer/team/team'
    }, {
      icon: '../../images/user/menu3-2.png',
      name: '我的佣金',
      url: '/pages/dealer/index/index'
    }, {
      icon: '../../images/user/menu3-3.png',
      name: '分销订单',
      url: '/pages/dealer/order/order'
    }, {
      icon: '../../images/user/menu3-4.png',
      name: '分销码',
      url: '/pages/dealer/qrcode/qrcode'
    }],
    
    // 我的福利
    munulist4: [{
      icon: '../../images/user/menu4-1.png',
      name: '红包中心',
      url: '/pages/redbox/index'
    }, {
      icon: '../../images/user/menu4-2.png',
      name: '领券中心',
      url: '/pages/coupon/coupon'
    }, {
      icon: '../../images/user/menu4-4.png',
      name: '会员中心'
    }, {
      icon: '../../images/user/menu5-2.png',
      name: '最近浏览',
      url: '/pages/look-notes/index'
    }],
    
    // 动态
    munulist5: [{
      icon: '../../images/user/menu4-3.png',
      name: '积分兑换'
    }, {
      icon: '../../images/user/menu5-1.png',
      name: '我的收藏'
    }]
  },
  
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    App.getSystemInfo({
      cb: function(res) {
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取当前用户信息
    this.getUserDetail();
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail: function() {
    let _this = this;
    App._get('user.index/detail', {}, function(result) {
      _this.setData(result.data);
    });
  },
  
  // 设置
  goSetting() {
    wx.navigateTo({
      url: '/pages/setting/index/index'
    })
  },

  /**
   *我的订单导航跳转
   */
  // onTargetOrder(e) {
  //   let urls = {
  //     all: '/pages/order/index?type=all',
  //     payment: '/pages/order/index?type=payment',
  //     received: '/pages/order/index?type=received',
  //     comment: '/pages/order/index?type=comment',
  //     refund: '/pages/order/refund/index',
  //   };
  //   // 转跳指定的页面
  //   wx.navigateTo({
  //     url: urls[e.currentTarget.dataset.type]
  //   })
  // },
  
  // 我的拼团订单
  // goPintuanOrder(e) {
  //   let urls = {
  //     all: '/pages/sharing/order/index?type=all',
  //     payment: '/pages/sharing/order/index?type=payment',
  //     received: '/pages/sharing/order/index?type=received',
  //     sharing: '/pages/sharing/order/index?type=sharing',
  //     refund: '/pages/sharing/order/refund/index',
  //   };
  //   // 转跳指定的页面
  //   wx.navigateTo({
  //     url: urls[e.currentTarget.dataset.type]
  //   })
  // },
  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

})