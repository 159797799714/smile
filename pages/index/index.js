const App = getApp();

Page({

  data: {
    // 搜索框样式
    searchName: "大家都在搜“森海塞尔”",
    // 页面参数
    options: {},
    // 页面元素
    items: [{
        data: [{
          imgUrl: "https://market.pd-unixe.com/uploads/201906111745582db721897.png",
          article_id: 10001
        }, {
          imgUrl: "https://market.pd-unixe.com/uploads/2019061117455884a819697.jpg"
        }, {
          imgUrl: "https://market.pd-unixe.com/uploads/20190611174558d5c576479.png"
        }, {
          imgUrl: "https://market.pd-unixe.com/uploads/201906111745539eac11543.png"
        }],
        name: "图片轮播",
        params: {
          interval: "2800"
        },
        type: 'banner'
      },
      {
        data: [],
        name: "文章组",
        type: 'article'
      }
    ],
    scrollTop: 0,
    scrollTopDist: '',
    time: 0 // 进入次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    if (options) {
      // 当前页面参数
      this.setData({
        options
      });
    }
  },

  onShow: function() {
    let _this = this
    let token = wx.getStorageSync('token')
    if (!token) {
      App.doLogin()
    }
    // 加载页面数据
    _this.getcategoryList()
  },

  onPageScroll: function(options) {
    // Do something when page scroll
    // this.data.items[1].scrollTopDist = options.scrollTop
    // let data = this.data
    this.setData({
      scrollTopDist: options.scrollTop
    })
  },

  /**
   * 加载页面数据
   */
  getPageData: function(callback) {
    let _this = this;
    typeof callback === 'function' && callback();

    // App._get('page/index', {
    //   page_id: _this.data.options.page_id
    // }, function(result) {
    //   // 设置顶部导航栏栏
    //   _this.setPageBar(result.data.page);
    //   _this.setData(result.data);
    //   // 回调函数
    //   typeof callback === 'function' && callback();
    // });
  },

  /**
   * 获取分类
   */
  getcategoryList: function() {
    let _this = this;
    App._get('article/categorylist', {
      page_id: _this.data.options.page_id
    }, function(result) {
      _this.data.items[1].tabList = result.data.categoryList
      // let data = _this.data
      App._get('article/articlesbycategoryid', {
        category_id: result.data.categoryList[0].category_id
      }, function(resultItem) {
        _this.data.items[1].data = resultItem.data.list
        let data = _this.data
        _this.setData(data)
      });
      // _this.setData(data)
    });
  },

  /**
   * 设置顶部导航栏
   */
  setPageBar: function(page) {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: page.params.title
    });
    // 设置navbar标题、颜色
    wx.setNavigationBarColor({
      frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
      backgroundColor: page.style.titleBackgroundColor
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 获取首页数据
    let _this = this
    this.getPageData(function() {
      wx.stopPullDownRefresh();
      _this.getcategoryList()
    });
  }

  // /**
  //  * 返回顶部
  //  */
  // goTop: function(t) {
  //   this.setData({
  //     scrollTop: 0
  //   });
  // },

  // scroll: function(t) {
  //   this.setData({
  //     indexSearch: t.detail.scrollTop
  //   }), t.detail.scrollTop > 300 ? this.setData({
  //     floorstatus: !0
  //   }) : this.setData({
  //     floorstatus: !1
  //   });
  // },

});
