const App = getApp();

Page({

  data: {
    category_id: '',                 // 文章id
    bannerList: [],
    detail: {},                    // 文章详情
    articleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    this.setData({
      category_id: options.id
    })
    let _this = this;

    // 加载录播图数据
    this.getBannerList()
    // 加载活动详情数据
    this.getDetail()
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
  
  // 加载文章详情
  getDetail() {
    let _this = this;
    App._get(App.url.umiCategoryDetail, {
      category_id: _this.data.category_id
    }, function(res) {
      console.log('详情', res.data)
      res.data.activity_datail.describe= res.data.activity_datail.describe.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
      _this.setData({
        detail: res.data.activity_datail,
        articleList: res.data.article_list.data
      })
    });
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
  
  // 立即参加
  goJoin() {
    wx.navigateTo({
      url: '/pages/youmi/release/index?activity_id=' + this.data.detail.category_id + '&name=' + this.data.detail.name
    })
  },
  // 去文章首页
  goShareDetail(e) {
    let id= e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/youmi/detail/index?article_id=' + id
    })
  },
  
  // 去作者主页
  goUserDetail(e) {
    let id= e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/youmi/user/index?id=' + id
    })
  },

});
