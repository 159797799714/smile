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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;

    // 加载录播图数据
    this.getBannerList()
    // 加载草场文章数据
    this.getArticleList()
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
    App._get('umi.homebanner/gethomebanners', {}, function(res) {
      _this.setData({
        bannerList: res.data.list
      })
    });
  },
  
  // 加载草场文章数据
  getArticleList() {
    let _this = this;
    App._get('umi.article/list', {}, function(res) {
      console.log('种草文章', res.data)
      _this.setData({
        articleList: res.data.list.data
      })
    });
  },
  
  // 关注文章数据
  getFocusList() {
    let _this = this;
    App._get('umi.article/focusList', {}, function(res) {
      console.log('关注文章', res.data)
      _this.setData({
        articleList: res.data.list
      })
    });
  },
  
  // 加载活动列表数据
  getActivityList() {
    let _this = this;
    App._get('umi.category/list', {}, function(res) {
      console.log('活动列表', res.data)
      _this.setData({
        activityList: res.data.list.data
      })
    });
  },
  
  // 切换tab
  swichNav(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
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

  // 拍照功能
  // getLocalImage() {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 6,
  //     success: function(res) {
  //       console.log('success', res)
  //       // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
  //       app.startOperating("保存中")
  //       var filePath = res.tempFilePaths[0];
  //       var session_key = wx.getStorageSync('session_key');
  //       // 这里顺道展示一下如何将上传上来的文件返回给后端，就是调用wx.uploadFile函数
  //       wx.uploadFile({
  //         url: app.globalData.url + '/home/upload/uploadFile/session_key/' + session_key,
  //         filePath: filePath,
  //         name: 'file',
  //         success: function(res) {
  //           app.stopOperating();
  //           // 下面的处理其实是跟我自己的业务逻辑有关
  //           var data = JSON.parse(res.data);
  //           if (parseInt(data.status) === 1) {
  //             app.showSuccess('文件保存成功');
  //           } else {
  //             app.showError("文件保存失败");
  //           }
  //         }
  //       })
  //     },
  //     fail: function(error) {
  //       console.error("调用本地相册文件时出错")
  //       console.warn(error)
  //     },
  //     complete: function() {

  //     }
  //   })
  // }
  
  getLocalImage() {
    wx.navigateTo({
      url: './release/index'
    })
  }

});
