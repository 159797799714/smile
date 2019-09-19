const App = getApp();
const utils = require("../../utils/util.js")

Page({

  data: {
    // 搜索框样式
    searchName: "大家都在搜“森海塞尔”",
    statusHeight: 20,
    // 轮播图
    swiperList: [{
      type: "banner",
      data: [],
      params: {
        interval: 2800
      }
    }],
    // 商品全部分类
    shopClassify: [],
    // 为你推荐
    recommendList: [],

    // 页面元素
    items: {},
    // 限时购，秒杀购以及零元购等整个数据
    discount: [{
      imgUrl: '../../images/xianshigou-text.png',
      name: '限时购',
      time: '',
      min_price: '',
      max_price: '',
      info: '',
      img: ''
    }, {
      imgUrl: '../../images/miaoshagou-text.png',
      name: '秒杀购',
      time: '',
      min_price: '',
      max_price: '',
      img: ''
    }, {
      imgUrl: '../../images/pintuan-text.png',
      name: '拼团购',
      info: '',
      time: '',
      min_price: '',
      max_price: '',
      img: ''
    }, {
      imgUrl: '../../images/zero-text.png',
      name: '0元购',
      time: '',
      min_price: '',
      max_price: '',
      img: ''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

    // 秒杀，限时购，零元购
    that.getGoodsbyone()
    that.getGoodsbyone2()
    that.getZero()

    // 加载页面数据
    that.getPageData();
    App.getSystemInfo({
      cb: function(res) {
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    });
  },
  onShow() {
    if (this.data.swiperList[0].data.length < 1) {
      // 商城首页轮播图
      this.getSwiperList()
    }
  },
  onHide() {
    console.log('onUnload')
  },
  

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
    
    // 商城首页轮播图
    this.getSwiperList()
    // 加载页面数据
    this.getPageData();
    // 秒杀，限时购，零元购
    this.getGoodsbyone()
    this.getGoodsbyone2()
    this.getZero()
  },
  /**
   * 加载页面数据
   */
  getPageData: function(callback) {
    let _this = this;
    _this.getAllgoodsCategory()
    _this.getRecommendgoods()
  },

  getSwiperList() {
    let that = this
    App._get('goods/gethomebanners', {}, function(res) {
      if (res.data.list) {
        console.log(res.data.list)
        let arr = []
        res.data.list.map((item, index) => {
          let banner = 'swiperList[0].data'
          let obj = {}
          let goods = item.activity_link.indexOf('goods_id=')
          let article = item.activity_link.indexOf('article_id=')
          let luckdraw = item.activity_link.indexOf('luckydraw_id=')
          if (item.image.file_path) {
            obj.imgUrl = item.image.file_path
            if (goods !== -1) {
              obj.goods_id = item.activity_link.slice(9)
              arr.push(obj)
              that.setData({
                'swiperList[0].data': arr
              })
              return
            }
            if (article !== -1) {
              obj.article_id = item.activity_link.slice(11)
              arr.push(obj)
              that.setData({
                'swiperList[0].data': arr
              })
              return
            } if(luckdraw !== -1) {
              obj.luckydraw_id = item.activity_link.slice(13)
              arr.push(obj)
              that.setData({
                'swiperList[0].data': arr
              }) 
              return
            } else {
              arr.push(obj)
              that.setData({
                'swiperList[0].data': arr
              })
            }
          }
        })
      }
    })
  },

  // 拼团，秒杀，限时，0元
  goPintuan(e) {
    let that= this
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    // if (!that.data.discount[index].time && index < 2) {
    //   wx.showToast({
    //     title: '暂无相关活动',
    //     icon: 'none',
    //     mask: true,
    //     duration: 1500,
    //     success: function() {
    //       return
    //     }
    //   })
    //   return
    // }
    switch (name) {
      case '限时购':
        wx.navigateTo({
          url: `../shop-seckill/index?origin=限时购`
        })
        break
      case '秒杀购':
        wx.navigateTo({
          url: `../shop-seckill/index?origin=秒杀购`
        })
        break
      case '拼团购':
        wx.navigateTo({
          url: '../sharing/index/index'
        })
        break
      case '0元购':
        wx.navigateTo({
          url: '../zerodraw/index'
        })
        break

    }
  },

  // 获取限时购
  getGoodsbyone() {
    let _this = this
    App._get('flashsale/getflashsalegoodsbyone', {}, function(result) {
      if (result.data.goods) {
        _this.setData({
          'discount[0].info': result.data.goods.homepage_activity_subtitle ? result.data.goods.homepage_activity_subtitle : '',
          'discount[0].img': result.data.goods.headimg ? result.data.goods.headimg.file_path: '',
          'discount[0].min_price': result.data.goods.sku ? result.data.goods.sku[0].goods_price: '',
          'discount[0].max_price': result.data.goods.sku ? result.data.goods.sku[0].line_price: ''
        })
        utils.countDown(result.data.goods.category.activity_endtime, function(nowTime) {
          _this.setData({
            'discount[0].time': nowTime
          })
        })
      }

    })
  },

  // 秒杀购
  getGoodsbyone2() {
    let _this = this
    App._get('seckill/getseckillgoodsbyone', {}, function(result) {
      if (result.data) {
        console.log(result.data.sharing_goods.image_url)
        _this.setData({
          'discount[1].min_price': result.data.goods.sku ? result.data.goods.sku[0].goods_price: '',
          'discount[1].max_price': result.data.goods.sku ? result.data.goods.sku[0].line_price: '',
          'discount[1].img': result.data.goods.headimg ? result.data.goods.headimg.file_path: '',
          'discount[1].info': result.data.goods.homepage_activity_subtitle ? result.data.goods.homepage_activity_subtitle : '',
          'discount[2].img': result.data.sharing_goods.image_url,
          'discount[2].info': result.data.sharing_goods.sharing_home_subtitle,
          'discount[2].min_price': result.data.sharing_goods ? result.data.sharing_goods.sharing_home_goods_price: '',
          'discount[2].max_price': result.data.sharing_goods ? result.data.sharing_goods.sharing_home_line_price: '',
        })
        
        // 秒杀购有时间
        if(result.data.goods) {
          utils.countDown(result.data.goods.category.activity_endtime, function(nowTime) {
            _this.setData({
              'discount[1].time': nowTime
            })
          })  
        }
        // 拼团购有时间就
        // if(result.data.sharing_goods) {
        //   utils.countDown(result.data.sharing_goods.sharing_homa_activity_time, function(Time) {
        //     _this.setData({
        //       'discount[2].time': Time
        //     })
        //   })  
        // }
        // 
      }
    })
  },

  // 零元购
  getZero() {
    let _this = this
    App._get('luckydraw/getluckydrawgoodsbyone', {}, function(result) {
      if (result.data.goods) {
        _this.setData({
          'discount[3].min_price': result.data.goods.sku ? result.data.goods.sku[0].goods_price: '',
          'discount[3].max_price': result.data.goods.sku ? result.data.goods.sku[0].line_price: '',
          'discount[3].info': result.data.goods.homepage_activity_subtitle ? result.data.goods.homepage_activity_subtitle : '',
          'discount[3].img': result.data.goods.headimg ? result.data.goods.headimg.file_path: ''
        })
        utils.countDown(result.data.goods.category.activity_endtime, function(nowTime) {
          _this.setData({
            'discount[3].time': nowTime
          })
        })
      }

    })
  },

  /**
   * 获取所有商品分类
   */
  getAllgoodsCategory() {
    let _this = this;
    App._get('category/goodscategorynew', {}, function(result) {
      _this.setData({
        shopClassify: result.data.list
        // shopClassify: this.data.shopClassify
      })
    })
  },

  /**
   * 获取推荐商品列表
   */
  getRecommendgoods() {
    let _this = this;
    App._get('goods/recommendgoods', {}, function(result) {
      _this.setData({
        recommendList: result.data.list
      })
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/shopping-mall/index?" + App.getShareUrlParams()
    };
  },

});
