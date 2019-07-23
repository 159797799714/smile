const App = getApp();
const wxParse = require("../../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 文章详情
    detail: null,
    article_id: 0,
    isLike: false,
    haveComment: false,
    isClose: true,
    isSendComment: false,
    isTextareaFocus: false,
    commentValue: "",
    scrollViewHeight: "",
    // 轮播图
    swipeList: [
        {
            type: "banner",
            myClassTrue: true,
            data:[{
                imgUrl:"http://market.pd-unixe.com/uploads/20190416154110035220022.jpg"
            },{
                imgUrl:"http://market.pd-unixe.com/uploads/201904181441087c4823742.jpg"
            }],
            params: {
                interval: 2800
            }
        }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取文章详情
    this.getArticleDetail(options.article_id);
    this.data.article_id = options.article_id;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 获取文章详情
   */
  getArticleDetail(article_id) {
    let _this = this;
    wx.showLoading({
      title: '加载中'
    })
    App._get('article/detailing', {
      article_id
    }, function(result) {
      // console.log(result.data.detail.article_content)
      let detail = result.data.detail;
      // 富文本转码
      if (detail.article_content.length > 0) {
        detail.article_content = detail.article_content
          .replace(/&amp;nbsp;/g, ' ')
          .replace(/&amp;amp;nbsp;/g, ' ')
          .replace(/&nbsp;/g, ' ');
        wxParse.wxParse('content', 'html', detail.article_content, _this, 0);
      }
      _this.setData({
        detail
      });
      _this.setData({
        isLike: detail.isLike,
      });

    //   修改banner
      _this.data.swipeList[0].data = result.data.detail.banners
      _this.setData({
        swipeList: _this.data.swipeList
      })

      if(detail.comments.num > 0) {
        _this.setData({
            haveComment: true
        })
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    });
  },
  // 富文本a标签
  wxParseTagATap: function(e){
    var href = e.currentTarget.dataset.src
    //我们可以在这里进行一些路由处理
    // if(href.indexOf(index) > 0){
    // 	//跳转的方法根据项目需求的不同自己替换，也可以加参数，
    //   wx.redirectTo({
    //      url: '../index/index'+参数
    //   })
    // }
    let https = href.slice(0, 5)
    console.log(https, href)
    if(https === 'https') {
      wx.navigateTo({
        url: '../../goods/index?goods_id='+href.slice(28)
      })  
    } else {
      wx.navigateTo({
        url: '../../goods/index?goods_id='+href.slice(27)
      })  
    }
    
  },

  /**
   * 发布评论
   */
  sendComment() {
    let _this = this;
    App._get('article/addcomments', {
      'article_id': _this.data.detail.article_id,
      'comment': _this.data.commentValue
    }, function(result) {
        App.showSuccess(result.data,function() {
            _this.setData({
                commentValue: "",
                isSendComment: false
            })
            _this.getArticleDetail(_this.data.article_id)
        });
    });
  },
  like(e) {
    let commentsListContent = this.data.detail.comments.list[e.currentTarget.dataset.index]
    wx.showLoading({
      title: '',
    });
    const _this = this;
    let url = '';
    let params = {}
    switch (e.currentTarget.dataset.state) {
      case "articlelike":
      url = 'article/like';
      params = {
        article_id: _this.data.article_id,
      }
      if(this.data.isLike) {
        url = 'article/unLike';
      }
      break;
      case "commentlike":
      url = 'article/commentlike';
      params = {
        comment_id: commentsListContent.id
      }
      if(commentsListContent.islike == "yes") {
        url = 'article/commentunlike';
      }
      break;
      case "commentreplylike":
      url = 'article/commentreplylike'
      params = {
        reply_id: commentsListContent.replys[0].id
      }
      if(commentsListContent.replys[0].isreplylike == "yes") {
        url = 'article/commentreplyunlike';
      }
      break;
      default:
      break;
    }
    App._get(url, params, function (result) {
      switch (e.currentTarget.dataset.state) {
        case "articlelike":
        _this.setData({
          'detail.like_num': _this.data.isLike ? _this.data.detail.like_num - 1 : _this.data.detail.like_num + 1 ,
          isLike: !_this.data.isLike,
        });
        break;
        case "commentlike":
        commentsListContent.likenum = commentsListContent.islike == "yes" ? commentsListContent.likenum - 1 : commentsListContent.likenum + 1
        commentsListContent.islike = commentsListContent.islike == "yes" ? "no" : "yes"
        _this.setData({
          detail: _this.data.detail
        })
        console.log("aaa",_this.data.detail.comments.list[e.currentTarget.dataset.index])
        break;
        case "commentreplylike":
        commentsListContent.replys[0].isreplylike = commentsListContent.replys[0].isreplylike == "yes" ? 'no' : "yes"
        _this.setData({ 
          detail: _this.data.detail
        })
        break;
        default:
            break;
      }
      
      wx.hideLoading();
      App.showSuccess(result.data);
    });
  },
  closeAllcomment(e) {
    let _this = this;
    if(_this.data.isClose) {
      this.setData({
        scrollViewHeight: "0"
      })
    }else {
      this.setData({
        scrollViewHeight: ""
      })
    }
    _this.setData({
        isClose: !_this.data.isClose,
        isSendComment: !_this.data.isSendComment
    });
    
  },
  textareaFocus(e) {
    let _this = this;
    _this.setData({
        isTextareaFocus: true,
        scrollIntoView: 'comment-text'
    });
  },
  textareaInput(e) {
    let _this = this;
    _this.setData({
        commentValue: e.detail.value
    });
  },
  textareaBlur(e) {
    let _this = this;
    _this.setData({
        isTextareaFocus: false,
        scrollIntoView: ''
    });
  },
  toComment(e) {
    let _this = this;
    _this.setData({
        isTextareaFocus: !_this.data.isTextareaFocus,
        isSendComment: !_this.data.isSendComment
    });
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    // 构建页面参数
    let params = App.getShareUrlParams({
      'article_id': this.data.detail.article_id
    });
    return {
      title: this.data.detail.article_title,
      path: "/pages/article/detail/index?" + params
    };
  },

})