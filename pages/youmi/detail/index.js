const App = getApp();
const wxParse = require("../../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',      // 当前用户自己id
    detail: null,     // 文章详情
    article_id: 0,
    isLike: false,
    haveComment: false,
    isClose: true,
    isSendComment: false,
    isTextareaFocus: false,
    commentValue: "",         // 文章评论输入框value
    replyCommentValue: '',    // 评论的评论输入框value
    comment_id: '',           // 要评论的评论的id
    comment_type: '',       // 评论类型ten为外面十条，all为查看全部
    comment_index: '',     // 评论的索引
    scrollViewHeight: "",
    // 轮播图时长
    params: {
      interval: "3000"
    },
    canrReceive: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this= this
    // 获取本地user_id
    wx.getStorage({
      key: 'user_id',
      success (res) {
        _this.setData({
          user_id: res.data
        })
      }
    })
    
    // 获取文章详情
    this.getArticleDetail(options.article_id);
    this.setData({
      article_id: options.article_id
    })
  },

  /**
   * 获取文章详情
   */
  getArticleDetail(article_id) {
    let _this = this;
    App._get('umi.article/detail', {
      article_id
    }, function(res) {
      console.log('文章详情', res.data.detail)
      _this.setData({
        detail: res.data.detail,
        haveComment: res.data.detail.comments.num > 0
      })
    });
  },
  
  // 去作者主页
  goUserDetail(e) {
    let id= e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/youmi/user/index?id=' + id
    })
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },
  // 删除文章
  delArticle() {
    let _this= this
    wx.showModal({
      title: '提示',
      content: '确定删除此篇文章？',
      success (res) {
        if (res.confirm) {
          App._post_form('umi.article/delete', {
            article_id: _this.data.article_id
          }, function(res) {
            App.showSuccess('删除成功');
            wx.navigateBack({
              delta: 1
            })
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 关注用户
  focusAction(e) {
    let _this = this,
      status = e.currentTarget.dataset.status,
      url = 'user.index/focusOn'; // status为true代表已关注
    console.log(status)
    if (status) {
      url = 'user.index/unFocus'
    }
    App._post_form(url, {
      focus_user_id: _this.data.detail.user.user_id
    }, function(res) {
      _this.setData({
        'detail.isFocus': status ? 'no' : 'yes'
      })
    });
  },
  /**
   * 发布评论
   */
  sendComment() {
    let _this = this;
    App._get('umi.article/addcomments', {
      'article_id': _this.data.detail.article_id,
      'comment': _this.data.commentValue
    }, function(result) {
      App.showSuccess(result.data, function() {
        _this.setData({
          commentValue: "",
          isSendComment: false
        })
        _this.getArticleDetail(_this.data.article_id)
      });
    });
  },
  like(e) {
    let commentsListContent = this.data.detail.comments_show[e.currentTarget.dataset.index],
      type= e.currentTarget.dataset.type,
      commentListAll = this.data.detail.comments.list[e.currentTarget.dataset.index];
    wx.showLoading({
      title: '',
    });
    const _this = this;
    let url = '';
    let params = {};
    var num= '';
    if(e.currentTarget.dataset.state === 'commentreplylike') {
      num= e.currentTarget.dataset.num
    }
    console.log(num)
    
    switch (e.currentTarget.dataset.state) {
      case "articlelike":
        url = 'umi.article/like';
        params = {
          article_id: _this.data.article_id,
        }
        if (this.data.isLike) {
          url = 'umi.article/unLike';
        }
        break;
      case "commentlike":
        url = 'umi.article/commentlike';
        params = {
          comment_id: commentsListContent.id
        }
        let tenstatus= commentsListContent.islike === "yes" && type === 'ten',
          allstatus= commentListAll.islike === "yes" && type === 'all';
        if (tenstatus || allstatus) {
          url = 'umi.article/commentunlike';
        }
        break;
      case "commentreplylike":
        console.log(type,type === 'all'?commentListAll.replys[num]: commentsListContent.replys[num].isreplylike )
        url = 'umi.article/commentreplylike'
        params = {
          reply_id: type === 'all'? commentListAll.replys[num].id: commentsListContent.replys[num].id
        }
        let tenReplystatus= commentsListContent.replys[num].isreplylike === "yes" && type === 'ten',
          allReplystatus= commentListAll.replys[num].isreplylike === "yes" && type === 'all';
        if (tenReplystatus || allReplystatus) {
          url = 'umi.article/commentreplyunlike';
        } 
        break;
      default:
        break;
    }
    App._get(url, params, function(result) {
      switch (e.currentTarget.dataset.state) {
        // 文章点赞
        case "articlelike":
          _this.setData({
            'detail.like_num': _this.data.isLike ? _this.data.detail.like_num - 1 : _this.data.detail.like_num +
              1,
            isLike: !_this.data.isLike,
          });
          break;
          
        // 评论点赞
        case "commentlike":
          if(type === 'all') {
            commentListAll.likenum = commentListAll.islike == "yes" ? commentListAll.likenum - 1 :
            commentListAll.likenum + 1
            commentListAll.islike = commentListAll.islike == "yes" ? "no" : "yes"
          } else {
            commentsListContent.likenum = commentsListContent.islike == "yes" ? commentsListContent.likenum - 1 :
              commentsListContent.likenum + 1
            commentsListContent.islike = commentsListContent.islike == "yes" ? "no" : "yes"
          }
          _this.setData({
            detail: _this.data.detail
          })
          break;
          
        // 评论的评论点赞
        case "commentreplylike":
          if(type === 'all') {
            console.log('前', commentListAll.replys[num].isreplylike, commentListAll.replys[num].replylikenum)
            commentListAll.replys[num].isreplylike = commentListAll.replys[num].isreplylike === "yes" ? 'no' :
              "yes"
            commentListAll.replys[num].replylikenum = commentListAll.replys[num].isreplylike === "yes" ? commentListAll.replys[num].replylikenum + 1 :
              commentListAll.replys[num].replylikenum -1
            console.log('后', commentListAll.replys[num].isreplylike, commentListAll.replys[num].replylikenum)
          } else {
            commentsListContent.replys[num].isreplylike = commentsListContent.replys[num].isreplylike === "yes" ? 'no' :
              "yes"
            commentsListContent.replys[num].replylikenum = commentsListContent.replys[num].isreplylike === "yes" ? commentsListContent.replys[num].replylikenum + 1 :
              commentsListContent.replys[num].replylikenum -1  
          }
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

  // 评论评论
  commentReview(e) {
    let _this = this,
      type= e.currentTarget.dataset.type,
      id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index;
    
    _this.setData({
      isReplyComment: true,
      comment_id: id,
      comment_type: type,
      comment_index: index
    })
  },
  
  // 发表对评论的评论
  sendReplyComment(opt) {
    let _this= this,
      id= _this.data.comment_id,
      index= _this.data.comment_index,
      type= _this.data.comment_type,
      comment= _this.data.replyCommentValue,
      commentsListContent = _this.data.detail.comments_show[_this.data.comment_index],
      commentListAll = _this.data.detail.comments.list[_this.data.comment_index];;
    App._post_form('umi.article/commentreply', {
      comment_id: id,
      comment: comment
    }, function(res) {
      App.showSuccess(res.data);
      _this.getArticleDetail(_this.data.article_id)
    })
  },
  
  

  // 收藏文章
  collect() {
    let _this = this,
      url = 'umi.article/collection';
    if (_this.data.detail.isCollection === 'yes') {
      url = 'umi.article/unCollection'
    }
    App._post_form(url, {
      article_id: _this.data.detail.article_id
    }, function(res) {
      _this.setData({
        'detail.isCollection': _this.data.detail.isCollection === 'no' ? 'yes' : 'no'
      })
    })
  },
  closeAllcomment(e) {
    let _this = this;
    if (_this.data.isClose) {
      this.setData({
        scrollViewHeight: "0"
      })
    } else {
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
  // 评论输入
  textareaInput(e) {
    let _this = this;
    _this.setData({
      commentValue: e.detail.value
    });
  },
  // 评论的评论输入
  replyCommentInput(e) {
    let _this = this;
    _this.setData({
      replyCommentValue: e.detail.value
    });
  },
  
  textareaBlur(e) {
    let _this = this;
    _this.setData({
      isTextareaFocus: false,
      scrollIntoView: '',
      isSendComment: false,
      isReplyComment: false
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
      path: "/pages/youmi/detail/index?article_id=" + this.data.article_id
    };
  },

})
