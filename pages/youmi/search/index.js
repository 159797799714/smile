const App = getApp();

Page({

  data: {
    // 搜索框样式
    searchName: '',
    articleList: [],                // 草场文章列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  
  // 加载草场文章数据
  getArticleList() {
    let _this = this;
    App._post_form('umi.article/articlesbysearch', {
      search: _this.data.searchName
    }, function(res) {
      console.log('搜索结果', res.data)
      if(res.data.list.data.length === 0) {
        App.showError('抱歉，没有搜到相关内容！')
      }
      _this.setData({
        articleList: res.data.list.data
      })
    });
  },
  
  onInput(e) {
    this.setData({
      searchName: e.detail.value
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
  
  // 点赞文章
  collectAction(e) {
    let _this= this,
      index= e.currentTarget.dataset.index,
      id= e.currentTarget.dataset.id,
      url= 'umi.article/like',
      articleList= _this.data.articleList,
      islike_count= 'articleList[' + index + '].islike_count',
      articlelike_count= 'articleList[' + index + '].articlelike_count',
      count= articleList[index].articlelike_count;
    if(articleList[index].islike_count === 1) {
      url= 'umi.article/unLike',
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
  
  // 分享当前页面
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  }

});
