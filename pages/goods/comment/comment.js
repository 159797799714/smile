const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        name: '全部',
        scoreType: -1,
        type: 'all',
        num: 0,
      }, {
        name: '最新',
        scoreType: '',
        type: 'newest',
        num: ''
      }, {
        name: '有图',
        scoreType: '',
        type: 'is_picture',
        num: 0
      }
    // }, {
    //   name: '好评',
    //   scoreType: 10,
    //   type: 'praise',
    //   num: 0
    // }, {
    //   name: '中评',
    //   scoreType: 20,
    //   typa: 'review',
    //   num: 0
    // }, {
    //   name: '差评',
    //   scoreType: 30,
    //   type: 'negative',
    //   num: 0
    ],
    
    // 当前tab
    // currentTab: -1,

    // 列表高度
    swiperHeight: 0,

    // 页面参数
    options: {
      goods_id: null,
      type: 'all'
    },

    // 评论列表
    list: [],

    // 当前页码
    page: 1,

    // show
    notcont: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;

    // 设置swiper的高度
    this.setSwiperHeight();

    // 记录页面参数
    _this.setData({
      'options.goods_id': options.goods_id
    }, function() {
      // 获取评论列表
      _this.getCommentList();
    });
  },

  /**
   * 设置swiper的高度
   */
  setSwiperHeight: function() {
    // 获取系统信息(拿到屏幕宽度)
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 80) + 1, // tap高度
      swiperHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      swiperHeight
    });
  },

  /**
   * 获取评论列表
   */
  getCommentList: function(isNextPage, page) {
    let _this = this;
    let params = _this.data.options;
    params.page = page || 1;
    App._get('comment/listsnew', params, function(result) {
      let resultList = result.data.list,
        dataList = _this.data.list,
        total= result.data.total,
        tabList= _this.data.tabList;
        
      // 处理评论的数量
      for(let str in total) {
        tabList.map((item, index) => {
          if(item.type === str) {
            console.log(total[str])
            tabList[index].num= total[str]
          }
        })
      }
      
      _this.setData({
        tabList: tabList
      })
      
      
      if (isNextPage !== true || typeof dataList.data === 'undefined') {
        _this.setData({
          list: resultList,
          total: total,
          notcont: !resultList.length
        });
      } else {
        _this.setData({
          'list.data': dataList.data.concat(resultList.data),
          total: total
        });
      }
    });
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    let _this = this;
    _this.setData({
      list: {},
      page: 1,
      no_more: false,
      'options.type': e.target.dataset.current
    }, function() {
      // 获取评论列表
      _this.getCommentList();
    });
  },

  /**
   * 图片预览
   */
  previewImages: function(e) {
    let commentIndex = e.target.dataset.commentIndex,
      imgIndex = e.target.dataset.imgIndex,
      images = this.data.list.data[commentIndex].image,
      imageUrls = [];
    images.forEach(function(item) {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[imgIndex],
      urls: imageUrls
    })
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function() {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getCommentList(true, ++this.data.page);
  },

})