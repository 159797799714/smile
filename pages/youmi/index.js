const App = getApp();

Page({

  data: {
    // 搜索框样式
    searchName: "大家都在搜“森海塞尔”",
    bannerList: [],
    tabList: ['草场', '关注', '活动'],
    tabIndex: 0,                    // 默认选中草场
    articleList: [],                // 草场文章列表
    activityList: [],               // 活动列表数据
    current_page: 1,                // 当前页码
    last_page: '',                  // 总共页码
    scrollTop: '',                  // 滚动距离顶部
    isTop: false,                   // 返回顶部按钮显隐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // 加载录播图数据
    this.getBannerList()
  },
  onShow() {
    if(this.data.tabIndex === 0) {
      // 加载草场文章数据
      this.getArticleList()
    }
  },
  
  // 获取轮播图数据
  getBannerList() {
    let _this = this;
    App._get(App.url.umiHomebanner, {}, function(res) {
      _this.setData({
        bannerList: res.data.list
      })
    });
  },
  // 加载草场文章数据
  getArticleList() {
    let _this = this;
    App._get(App.url.umiArticleList, {
      page: _this.data.current_page
    }, function(res) {
      console.log('种草文章', res.data)
      _this.setData({
        articleList: _this.data.articleList.concat(res.data.list.data),
        current_page: res.data.list.current_page,
        last_page: res.data.list.last_page
      })
    });
  },
  
  // 关注文章数据
  getFocusList() {
    let _this = this;
    App._get(App.url.umiArticleFocusList, {
      page: _this.data.current_page
    }, function(res) {
      console.log('关注文章', res.data)
      _this.setData({
        articleList: _this.data.articleList.concat(res.data.list.data),
        current_page: res.data.list.current_page,
        last_page: res.data.list.last_page
      })
    });
  },
  
  // 加载活动列表数据
  getActivityList() {
    let _this = this;
    App._get(App.url.umiCategoryList, {
      page: _this.data.current_page
    }, function(res) {
      console.log('活动列表', res.data)
      _this.setData({
        activityList: _this.data.activityList.concat(res.data.list.data),
        current_page: res.data.list.current_page,
        last_page: res.data.list.last_page
      })
    });
  },
  // 去文章首页
  goShareDetail(e) {
    let id= e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/youmi/detail/index?article_id=' + id
    })
  },
  
  loadMore() {
    this.data.current_page++
    let _this= this,
      page= _this.data.current_page,
      last_page= _this.data.last_page,
      tabIndex= _this.data.tabIndex;
    console.log(page, last_page)
    if(page > last_page) {
      wx.showToast({
        title: '亲！没有更多了哦',
        icon: 'none'
      })
    } else {
      switch(tabIndex) {
        case 0:
          _this.getArticleList()
          break
        case 1:
          _this.getFocusList()
          break
        case 2:
          _this.getActivityList()
          break
      }
      
    }
  },
  pageOnScroll(e) {
    this.setData({
      isTop: e.detail.scrollTop > 600
    })
  },
  goTop() {
    this.setData({
      scrollTop: 0
    })
  },
  // 去作者主页
  goUserDetail(e) {
    let id= e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/youmi/user/index?id=' + id
    })
  },
  
  // 点赞文章
  collectAction(e) {
    let _this= this,
      index= e.currentTarget.dataset.index,
      id= e.currentTarget.dataset.id,
      url= App.url.umiArticleLike,
      articleList= _this.data.articleList,
      islike_count= 'articleList[' + index + '].islike_count',
      articlelike_count= 'articleList[' + index + '].articlelike_count',
      count= articleList[index].articlelike_count;
    if(articleList[index].islike_count === 1) {
      url= App.url.umiArticleUnlike,
      count--
    } else {
      count++
    }
    App._post_form(url, {
      article_id: id
    }, function(res) {
      _this.setData({
        [islike_count]: articleList[index].islike_count === 1 ? 0: 1,
        [articlelike_count]: count
      })
    });
  },
  
  // 切换tab
  swichNav(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
      current_page: 1,
      last_page: 1,
      activityList: [],
      articleList: []
    })
    if(index === 0) {
      // 草场
      this.getArticleList()
    } else if(index === 1) {
      // 关注文章列表
      this.getFocusList()
    }
    else if(index === 2) {
      // 获取活动列表数据
      this.getActivityList()
    }
  },
  
  // 参加活动
  goJoin(e) {
    let id= e.currentTarget.dataset.id?e.currentTarget.dataset.id: 0;
    console.log(id)
    wx.navigateTo({
      url: '/pages/youmi/activity/index?id=' + id
    })
  },
  
  // 分享当前页面
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },
  
  getLocalImage() {
    wx.navigateTo({
      url: './release/index'
    })
  }

});
