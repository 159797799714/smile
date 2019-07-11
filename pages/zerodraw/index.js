const App = getApp();

Page({

  data: {
    activityList: [],                 // 活动列表
    selectBarIndex: '',               // 选中的活动列表的索引值
    goodsList: {
      data: [],
      banners: []
    },                    // 商品列表    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 加载页面数据
    
    // 加载0元抽奖活动分类
    this.getActivityList()
  },
  
  // 0元抽奖活动分类
  getActivityList() {
    let that = this
    let url = 'luckydraw/categorys'
    App._get(url,{},function(result) {
      console.log(result.data.list)
      that.setData({
        activityList: result.data.list,
        selectBarIndex: result.data.list[0].category_id
      })
      that.getGoodsById(result.data.list[0].category_id)
    })
  },
  
  // 通过活动分类ID获取商品列表
  getGoodsById(id) {
    let that = this
    let url = 'luckydraw/goodsbycategoryid'
    App._post_form(url, {
      category_id: id
    }, function(res) {
      console.log('商品列表', res.data.list)
      that.setData({
        goodsList: res.data.list
      })
    })
  },
  
  // 点击活动分类
  selectBar(e) {
    this.setData({
      selectBarIndex: e.currentTarget.dataset.id
    })
    this.getGoodsById(e.currentTarget.dataset.id)
  },
  
  // 抽奖详情
  goDraw(e) {
    
    // 抽奖的参数
    let param = {
      goods_id: e.currentTarget.dataset.good_id,
      activity_category_id: e.currentTarget.dataset.activity_category_id,
      formId: e.detail.formId
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