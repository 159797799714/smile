const App = getApp();
const utils = require("../../utils/util.js")

Page({

  data: {
    // 搜索框样式
    searchName: "大家都在搜“森海塞尔”",

            // {
            //     imgUrl:"https://market.pd-unixe.com/uploads/2019061117455884a819697.jpg"
            // },{
            //   imgUrl:"https://market.pd-unixe.com/uploads/20190611174558d5c576479.png"
            // },{
            //   imgUrl:"https://market.pd-unixe.com/uploads/201906111745539eac11543.png"
            // }
            
    // 轮播图
    swipeList: [
        {
            type: "banner",
            data:[{
                imgUrl:"https://market.pd-unixe.com/uploads/20190625200421f6a525590.png",
                goods_id: 10255
            }],
            params: {
                interval: 2800
            }
        }
    ],
    // 商品全部分类
    shopClassify: [
    ],
    // 为你推荐
    recommendList: [
    ],
    
    // 页面元素
    items: {},
    // 限时购，秒杀购以及零元购等整个数据
    discount: [
    {
      imgUrl: '../../images/pintuan-text.png',
      name: '拼团购',
      info: '拼得越多，越优惠',
      img: ['../../images/pintuan-icon.png']
    }, {
      imgUrl: '../../images/miaoshagou-text.png',
      name: '秒杀购',
      time: '',
      min_price: '',
      max_price: '',
      img: []
    }, {
      imgUrl: '../../images/xianshigou-text.png',
      name: '限时购',
      time: '',
      info: '',
      img: []
    }, {
      imgUrl: '../../images/zero-text.png',
      name: '0元购',
      time: '',
      min_price: '',
      max_price: '',
      img: []
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 商城首页轮播图
    this.getSwiperList()
    // 加载页面数据
    this.getPageData();
  },
  onShow() {
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
      if(res.data.list) {
        console.log(res.data.list)
        let arr = []
        res.data.list.map((item, index) => {
          let banner = 'swipeList[0].data'
          let obj = {}
          let goods = item.activity_link.indexOf('goods_id=')
          let article = item.activity_link.indexOf('article_id=')
          if(item.image.file_path) {
            obj.imgUrl = item.image.file_path
            if(goods !== -1) {
              obj.goods_id = item.activity_link.slice(9)
              arr.push(obj)
              that.setData({
                'swipeList[0].data': arr
              }) 
              return
            }
            if(article !== -1) {
              obj.article_id = item.activity_link.slice(11)
              arr.push(obj)
              that.setData({
                'swipeList[0].data': arr
              }) 
              return
            } else {
              arr.push(obj)
              that.setData({
                'swipeList[0].data': arr
              }) 
            }
          }
        })
      }
    })
  },
  
  // 拼团，秒杀，限时，0元
  goPintuan(e) {
    let index = e.currentTarget.dataset.index
    if(!this.data.discount[index].time && index !== 0 && index !== 3) {
      wx.showToast({
        title: '暂无相关活动',
        icon: 'none',
        mask: true,
        duration: 1500,
        success: function() {
         return 
        }
      })
      return
    }
    switch(index) {
      case 0: 
        wx.navigateTo({
          url: '../sharing/index/index'
        })
        break
      case 1:
        wx.navigateTo({
          url: `../shop-seckill/index?origin=秒杀购`
        })
        break
      case 2:
        wx.navigateTo({
          url: `../shop-seckill/index?origin=限时购`
        })
        break
      case 3:
        wx.navigateTo({
          url: '../zerodraw/index'
        })
        break
      
    }
  },
  
  // 获取限时购
  getGoodsbyone() {
    let _this = this
    App._get('flashsale/getflashsalegoodsbyone',{},function(result) {
      if(result.data.goods) {
        _this.setData({
          'discount[2].info': result.data.goods.goods_discount_price,
          'discount[2].img[0]': result.data.goods.image[0].file_path
        })
        if(result.data.goods.image.length > 1) {
          _this.setData({
            'discount[2].img[1]': result.data.goods.image[1].file_path
          })
        }
        utils.countDown(result.data.goods.category.activity_endtime,function(nowTime) {
          _this.setData({
            'discount[2].time': nowTime
          })
        })
      }
      
    })
  },
  
  // 秒杀购
  getGoodsbyone2() {
    let _this = this
    App._get('seckill/getseckillgoodsbyone',{},function(result) {
      if(result.data.goods) {
       _this.setData({
         'discount[1].min_price': result.data.goods.sku[0].goods_price,
         'discount[1].max_price': result.data.goods.sku[0].line_price,
         'discount[1].img[0]': result.data.goods.image[0].file_path
       })
       if(result.data.goods.image.length > 1) {
         _this.setData({
           'discount[1].img[1]': result.data.goods.image[1].file_path
         })
       }
       utils.countDown(result.data.goods.category.activity_endtime,function(nowTime) {
         _this.setData({
           'discount[1].time': nowTime
         })
       })
      }
      
    })
  },
  
  // 零元购
  getZero() {
    let _this = this
    App._get('luckydraw/getluckydrawgoodsbyone',{},function(result) {
      if(result.data.goods) {
        _this.setData({
          'discount[3].min_price': result.data.goods.sku[0].goods_price,
          'discount[3].max_price': result.data.goods.sku[0].line_price,
          'discount[3].img[0]': result.data.goods.image[0].file_path
        })
        if(result.data.goods.image.length > 1) {
          _this.setData({
            'discount[3].img[1]': result.data.goods.image[1].file_path
          })
        }
        utils.countDown(result.data.goods.category.activity_endtime,function(nowTime) {
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
    App._get('category/goodscategory',{},function(result) {
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
    App._get('goods/recommendgoods',{},function(result) {
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