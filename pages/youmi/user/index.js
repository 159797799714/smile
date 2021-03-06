const App = getApp();

Page({

  data: {
    tabList: ['分享', '点赞'],         // 分类
    tabIndex: 0,                      // 选中分享
    user_id: '',                      // 当前用户id
    fans_user_id: '',                 // 粉丝id
    mycircle: {},                    // 数量
    userInfo: {},                    // 用户信息
    articleList: [],                 // 分享
    likeList: [],                    // 点赞文章
    msglist: [{
      name: '关注',
      type: 'focus_num'
    },{
      name: '粉丝',
      type: 'fans'
    }, {
      name: '点赞',
      type: 'like_num'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    wx.getStorage({
      key: 'user_id',
      success (res) {
        _this.setData({
          user_id: res.data
        })
      }
    })
    
    this.setData({
      fans_user_id: options.id
    })
    let _this = this;
    
    // 加载活动详情数据
    this.getDetail()
  },
  
  
  // 加载文章详情
  getDetail() {
    let _this = this;
    App._get(App.url.umiUserFansHomePage, {
      fans_user_id: _this.data.fans_user_id
    }, function(res) {
      console.log('详情', res.data)
      _this.setData({
        articleList: res.data.article_list,
        likeList: res.data.like_article_list? res.data.like_article_list: [],
        userInfo: res.data.userInfo,
        mycircle: res.data.mycircle
      })
    });
  },
  
  // 关注用户
  focusAction(e) {
    let _this= this,
      status= e.currentTarget.dataset.status,
      url= App.url.umiUserFocuson;           // status为true代表已关注
    if(status) {
      url= App.url.umiUserUnfocus
    }
    App._post_form(url, {
      focus_user_id: _this.data.userInfo.user_id
    }, function(res) {
      _this.setData({
        'mycircle.is_focus': status? 'no': 'yes'
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
  // 点赞文章
  collectAction(e) {
    let _this= this,
      index= e.currentTarget.dataset.index,
      id= e.currentTarget.dataset.id,
      url= App.url.umiArticleLike,
      articleList= _this.data.articleList,
      likeList= _this.data.likeList;
    // 分享
    if(_this.data.tabIndex === 0) {
      let islike_count= 'articleList[' + index + '].islike_count',
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
    }
    // 点赞
    else {
      let islike_count= 'likeList[' + index + '].islike_count',
        articlelike_count= 'likeList[' + index + '].articlelike_count',
        count= likeList[index].articlelike_count;
      if(likeList[index].islike_count === 1) {
        url= App.url.umiArticleUnlike,
        count--
      } else {
        count++
      }
      App._post_form(url, {
        article_id: id
      }, function(res) {
        _this.setData({
          [islike_count]: likeList[index].islike_count === 1 ? 0: 1,
          [articlelike_count]: count
        })
      });
    }
    
  },
  
  // 分享点赞tab点击
  selectTab(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    _this.setData({
      tabIndex: index
    })
  }

});
