const App = getApp();

const utils = require("../../utils/util.js")

Page({
  data: {
    title: '',                         // 顶部标题
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    indicatorActiveColor: '#ffffff',   // 以上轮播图信息
    banners: [],
    timeList: [
      { 
        category_id: 1,
        activity_date: '05-01',
        activity_time: '20:00',
        status: '已开抢',
      },
    ],                              // 时间
    selectIndex: 0,                 // 选中的时间
    nowState: '',                   //当前状态
    goodList: [
      {
        goods_name: 'Sony/索尼 MDR-ZX310头戴式监听重低音耳机Sony/索尼 MDR-ZX310头戴式监听重低音耳机',
        surplus_inventory: 0,
        total_inventory: 100,
        // discount: '4.6',
        goods_min_price: 300,
        goods_max_price: 4000,
        code: 1,
        goods_id: 10002
      }, 
    ],
    openingTime: "",    //距下次开场时间
  },
  onLoad(option) {
    this.title = option.origin
    wx.setNavigationBarTitle({
      title: option.origin
    })
  },
  onShow() {
    this.getSeckillCategory()
  },
  

  // 去商品详情
  toGoodDetail(e) {
    let url = e.currentTarget.dataset.url
    if(url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })  
    } else {
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  // 提醒我
  remindMe(e) {
    let _this = this;
    let activitycategoryid = e.currentTarget.dataset.activitycategoryid
    let goodid = e.currentTarget.dataset.goodid
    let isremind = e.currentTarget.dataset.isremind
    let index = e.currentTarget.dataset.index
    let url = ''
    if (_this.title == "限时购") {
      if(isremind == "no") {
        url = "flashsale/remind"
      }else {
        url = "flashsale/cancelremind"
      }
    } else {
      if(isremind == "no") {
        url = "seckill/remind"
      }else {
        url = "seckill/cancelremind"
      }
    }
    let param = {
      good_id: goodid,
      activity_category_id: activitycategoryid,
      formId: e.detail.formId
    }
    App._post_form(url,param,function(result){
      if(isremind == "no") {
        wx.showToast({
          title: '小逸提醒设置成功',
          icon: 'none',
          duration: 2000
        })
      _this.data.goodList[index].isremind = "yes"
      }else {
        wx.showToast({
          title: '小逸取消提醒成功',
          icon: 'none',
          duration: 2000
        })
      _this.data.goodList[index].isremind = "no"
      }
      _this.setData({
        goodList: _this.data.goodList
      })
    })
  },
  
  //   获取秒杀活动分类
  getSeckillCategory(categoryId) {
    let _this = this;
    let url = ""
    let idUrl = ""
    console.log("标题",_this.title)
    if(_this.title == "限时购") {
      url = "flashsale/categorys"
      idUrl = "flashsale/goodsbycategoryid"
    } else{
      url = "seckill/categorys"
      idUrl = "seckill/goodsbycategoryid"
    }
    App._get(url,{},function(result) {
      console.log("获取秒杀活动分类",result)
      _this.setData({
        timeList: result.data.list,
        selectIndex: categoryId ? categoryId : result.data.list[0].category_id,
      })
      let param = {
        category_id: categoryId ? categoryId : result.data.list[0].category_id
      }
      App._get(idUrl,param,function(goodsResult) {
        console.log("根据id获取秒杀活动列表",goodsResult)
        let goodsResultList = goodsResult.data.list.data
        goodsResultList.forEach((item,index) => {
          item.discount = item.goods_discount_price
          item.url = `../shop-seckill/goods/index?goods_id=${item.goods_id}&type=${item.goods_type}`
        })
        _this.setData({
          goodList: goodsResultList,
          openingTime: goodsResult.data.list.header_info.next_activity_starttime,
          banners: goodsResult.data.list.banners
        })
        utils.countDown(_this.data.openingTime,function(nowTime) {
          _this.setData({
            openingTime: nowTime
          })
        
        })
      })
    })
  },

  /**
   *切换时间
   */
  selectTime(e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.categoryid,
      nowState: this.data.timeList[e.currentTarget.dataset.index].status
    })
    this.getSeckillCategory(e.currentTarget.dataset.categoryid)
  }
})