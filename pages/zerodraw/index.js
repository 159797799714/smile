const App = getApp();
const utils = require("../../utils/util.js")

Page({

  data: {
    activityList: [],                 // 活动列表
    selectBarIndex: '',               // 选中的活动列表的索引值
    goodsList: {
      data: [],
      banners: []
    },                                // 商品列表
    status: '',                       // 抢购活动状态
    leave_time: '',                   // 剩余时间抢购
    swiperList: [{
      type: "banner",
      data: [],
      params: {
        interval: 2800
      }
    }],                               // 轮播图
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 加载页面数据
    
    // 加载0元抽奖活动分类
    this.getActivityList()
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
     // 加载0元抽奖活动分类
    this.getActivityList()
    wx.stopPullDownRefresh()
  },
  // 0元抽奖活动分类
  getActivityList() {
    let that = this
    let url = 'luckydraw/categorys'
    App._get(url,{},function(res) {
      // let time = res.data.list[0].activity_endtime
      // utils.countDown(time,function(nowTime) {
      //   console.log(nowTime)
      //   that.setData({
      //     leave_time: nowTime
      //   })
      // })
      if(res.data.list.length > 0) {
        that.setData({
          activityList: res.data.list,
          selectBarIndex: res.data.list[0].category_id,
          status: res.data.list[0].status
        })
        // 通过id获取活动列表
        that.getGoodsById(res.data.list[0].category_id)  
      }
    })
  },
  
  // 通过活动分类ID获取商品列表
  getGoodsById(id) {
    let that = this
    let url = 'luckydraw/goodsbycategoryid'
    App._post_form(url, {
      category_id: id
    }, function(res) {
      console.log('商品列表', res.data.list, res.data.list.banners)
      that.setData({
        'swiperList[0].data': res.data.list.banners,
        goodsList: res.data.list
      })
    })
  },
  
  // 点击活动分类
  selectBar(e) {
    let that = this
    console.log(e.currentTarget.dataset)
    let time = e.currentTarget.dataset.endtime
    this.setData({
      selectBarIndex: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status
    })
    this.getGoodsById(e.currentTarget.dataset.id)
    // utils.countDown(time,function(nowTime) {
    //   that.setData({
    //     leave_time: nowTime
    //   })
    // })
  },
  
  // 抽奖详情
  goDraw(e) {
    // 抽奖的参数
    if(this.data.status === '即将开始') {
      wx.showToast({
        title: '活动还未开始',
        icon: 'none',
        duration: 1500
      })
      return
    }
    let param = {
      goods_id: e.currentTarget.dataset.good_id,
      activity_category_id: e.currentTarget.dataset.activity_category_id
    }
    wx.navigateTo({
      url: 'detail/index?form=' + JSON.stringify(param)
    })
  },
  
  // 往期查看
  goPast(e) {
    wx.navigateTo({
      url: 'pastlook/index'
    })
  }
})