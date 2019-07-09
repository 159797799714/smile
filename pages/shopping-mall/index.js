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
    
    // // 秒杀购和限时购 
    // activityList: [
    //     {
    //         originalPrice: "",      //原价
    //         specialPrice: "",        //特价
    //         type: "限时购",
    //         time: '',
    //         img1: "",
    //         img2: ""
    //     },
    //     {
    //         originalPrice: "", 
    //         specialPrice: "",  
    //         type: "秒杀购",
    //         time: '',
    //         img1: "",
    //         img2: ""
    //     }
    // ],
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
      info: '五折起',
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
    // 加载页面数据
    this.getPageData();
  },

  /**
   * 加载页面数据
   */
  getPageData: function(callback) {
    let _this = this;
    _this.getAllgoodsCategory()
    _this.getRecommendgoods()
    _this.getGoodsbyone()
    _this.getGoodsbyone2()
    _this.getZero()
  },
  
  // 拼团，秒杀，限时，0元
  goPintuan(e) {
    let index = e.currentTarget.dataset.index
    if(!this.data.discount[index].time && index !== 0) {
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
      console.log("获取限时购", result.data.goods)
      if(result.data.goods) {
        _this.setData({
          'discount[2].img[0]': result.data.goods.image[0].file_path,
          'discount[2].img[1]': result.data.goods.image[1].file_path
        })
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
      console.log("获取秒杀购", result)
      if(result.data.goods) {
       _this.setData({
         'discount[1].min_price': result.data.goods.sku[0].goods_price,
         'discount[1].max_price': result.data.goods.sku[0].line_price,
         'discount[1].img[0]': result.data.goods.image[0].file_path,
         'discount[1].img[1]': result.data.goods.image[1].file_path
       })
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
      console.log("获取零元购", result)
      if(result.data.goods) {
       _this.setData({
         'discount[3].min_price': result.data.goods.sku[0].goods_price,
         'discount[3].max_price': result.data.goods.sku[0].line_price,
         'discount[3].img[0]': result.data.goods.image[0].file_path,
         'discount[3].img[1]': result.data.goods.image[1].file_path
       })
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
      console.log("获取所有商品分类",result.data.list)
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
      console.log("获取所有推荐商品列表",result)
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