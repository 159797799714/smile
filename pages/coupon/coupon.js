const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],      // 顶部导航栏
    tabData: '',      // 选中的tab值
    banner: [],       // 轮播图
    list: [],         // 优惠券列表
    items: [{
      data: [],
      name: "图片轮播",
      params: {
        interval: "2800"
      },
      type: 'banner'
    }],               // 轮播图
    notcont: false    // show
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取优惠券列表
    this.getCouponList();
    // 获取轮播图
    this.getBanner()
  },
  
  // 获取轮播图
  getBanner() {
    let that = this,
      items= that.data.items;
    App._get('coupon/gethomebanners', {}, function(res) {
      console.log(res.data.list)
      items[0].data= res.data.list
      that.setData({
        items: items
      });
    });
  },
  /**
   * 获取优惠券列表
   */
  getCouponList(params) {
    let that = this,
      data= params? params: {};
    App._post_form('coupon/couponCenter', data, function(res) {
      that.setData({
        list: res.data.coupons.list,
        notcont: !res.data.coupons.list.length,
        tabData: that.data.tabData? that.data.tabData: res.data.coupons.categorys[0].category_id
      });
      // 顶部tab列表只赋值一次
      if(that.data.tabList.length < 1) {
        that.setData({
          tabList: res.data.coupons.categorys,
        })
      }
    });
  },
  
  // 领取优惠券
  getCoupon(e) {
    let that= this,
      coupon_id= e.currentTarget.dataset.id,
      index= e.currentTarget.dataset.index,
      list = this.data.list,
      is_receive= e.currentTarget.dataset.status;
    if(is_receive) {
      wx.showToast({
        title: '不要太贪心哦！',
        icon: 'none'
      })
    } else {
      App._post_form('user.coupon/receive', {
        coupon_id: coupon_id
      }, function(res) {
        App.showSuccess(res.msg)
        list[index].is_receive = true
        that.setData({
          list: list
        })
      });
    }
  },
  
  // 点击顶部tab
  selectab(e) {
    let that= this,
      category_id= e.currentTarget.dataset.id,
      type= e.currentTarget.dataset.type;
    that.setData({
      tabData: category_id
    })
    
    // 请求优惠券
    that.getCouponList({
      category_id: category_id,
      type: type
    })
  },


});