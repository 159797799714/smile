const App = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品分类列表
    categoryList: [],
    // 拼团商品列表
    goodsList: [],
    // 当前的分类id (0则代表首页)
    category_id: 0,
    isScroll: false,
    scrollHeight: null,
    option: {},                // 当前页面参数
    list: {},                  // 商品列表数据
    no_more: false,            // 没有更多数据
    isLoading: true,           // 是否正在加载中
    page: 1,                   // 当前页码
    params: {
      interval: 2000
    },
    swiperList: [{
      file_path: 'https://market.pd-unixe.com/uploads/20190611174558d5c576479.png'
    }],                        // 轮播图数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    // Api：获取拼团首页
    this.getIndexData();
  },
  
  onScroll(e){
    let that = this
    that.setData({
      isScroll: true
    })
    let timer= setTimeout(function() {
      that.setData({
        isScroll: false
      })
    }, 1500)  
    
    
  },
  /**
   * Api：获取拼团列表
   */
  getIndexData() {
    let _this = this;
    // 获取拼团首页
    App._get('sharing.index/index', {}, function(result) {
      _this.setData({
        categoryList: result.data.categoryList
      });
    });
    // Api：获取商品列表
    _this.getGoodsList();
  },

  /**
   * Api：切换导航栏
   */
  onSwitchTab: function(e) {
    let _this = this;
    // 第一步：切换当前的分类id
    _this.setData({
      category_id: e.currentTarget.dataset.id,
      goodsList: {},
      page: 1,
      no_more: false,
      isLoading: true,
    });
    // 第二步：更新当前的商品列表
    _this.getGoodsList();
  },
  
  
  goOrder() {
    wx.navigateTo({
      url: '../order/index'
    })
  },
  /**
   * Api：获取商品列表
   */
  getGoodsList(isPage, page) {
    let _this = this;
    App._get('sharing.goods/lists', {
      page: page || 1,
      category_id: _this.data.category_id
    }, function(result) {
      console.log(result)
      let resList = result.data.list,
        dataList = _this.data.goodsList;
      if (isPage == true) {
        _this.setData({
          'goodsList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          goodsList: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 跳转商品详情页
   */
  onTargetGoods(e) {
    wx.navigateTo({
      url: '../goods/index?goods_id=' + e.currentTarget.dataset.id
    });
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    return {
      title: '拼团首页',
      path: "/pages/sharing/index/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function() {
    // 已经是最后一页
    if (this.data.page >= this.data.goodsList.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.getGoodsList(true, ++this.data.page);
  },
  
  showNull() {
    wx.showToast({
      title: '抱歉！该商品已售完！',
      icon: 'none'
    })
  },
})