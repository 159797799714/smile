const App = getApp();

Page({

  data: {
    // 搜索框样式
    searchName: "大家都在搜“森海塞尔”",
    options: {},            // 页面参数
    bannerList: [],
    scrollTop: 0,
    scrollTopDist: '',
    params: {
      interval: 2000
    },
    dataType: '',
    tabList: [],         // tab列表
    articleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(App.url)
    let _this = this;
    if (options) {
      // 当前页面参数
      _this.setData({
        options
      });
    }
    // 加载录播图数据
    this.getBannerList()
    
    // 加载页面数据
    this.getcategoryList()
  },
  onShow() {
    if(this.data.bannerList.length < 1 ) {
      // 加载录播图数据
      this.getBannerList()
    }
  },
  onPageScroll: function(options) {
    console.log(options)
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
  },

  /**
   * 获取分类
   */
  getcategoryList: function() {
    let _this = this;
    App._get(App.url.articleCategory, {
      page_id: _this.data.options.page_id
    }, function(result) {
      let dataType = _this.data.dataType
      
      console.log('dataType', dataType)
      if(!dataType) {
        _this.setData({
          tabList: result.data.categoryList,
          dataType: result.data.categoryList[0].category_id
        })  
      }
      console.log('dataType后', dataType)
      App._get(App.url.articlesbycategoryid, {
        category_id: dataType
      }, function(resultItem) {
        _this.setData({
          articleList: resultItem.data.list
        })
      });
    });
  },

  // 获取首页轮播图
  getBannerList() {
    let that = this
    App._get(App.url.articleHomeBanner, {}, function(res) {
      let arr = []
      res.data.list.map((item, index) => {
        let obj = {}
        let goods = item.activity_link.indexOf('goods_id=')
        let article = item.activity_link.indexOf('article_id=')
        let luckdraw = item.activity_link.indexOf('luckydraw_id=')
        if (item.image.file_path) {
          obj.imgUrl = item.image.file_path
          if (goods !== -1) {
            obj.goods_id = item.activity_link.slice(9)
            arr.push(obj)
            that.setData({
              bannerList: arr
            })
            return
          }
          if (article !== -1) {
            obj.article_id = item.activity_link.slice(11)
            arr.push(obj)
            that.setData({
              bannerList: arr
            })
            return
          }
          if (luckdraw !== -1) {
            obj.luckydraw_id = item.activity_link.slice(13)
            arr.push(obj)
            that.setData({
              bannerList: arr
            })
            return
          } else {
            arr.push(obj)
            that.setData({
              bannerList: arr
            })
          }
        }

      })
    })
  },
  // 去文章首页
  onTargetDetail(e) {
    wx.navigateTo({
      url: '/pages/article/detail/index?article_id=' + e.currentTarget.dataset.id
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
      // 加载录播图数据
      _this.getBannerList();
      _this.getcategoryList();
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
