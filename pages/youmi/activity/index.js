const App = getApp();

Page({

  data: {
    article_id: '',                 // 文章id
    bannerList: [],
    detail: {},                    // 文章详情
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    this.setData({
      article_id: options.id
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
    App._get('umi.homebanner/gethomebanners', {}, function(res) {
      _this.setData({
        bannerList: res.data.list
      })
    });
  },
  
  // 加载文章详情
  getDetail() {
    let _this = this;
    App._get('umi.article/detail', {
      article_id: _this.article_id
    }, function(res) {
      console.log('详情', res.data)
      // _this.setData({
      //   activityList: res.data.list.data
      // })
    });
  }

});
