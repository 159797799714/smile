const App = getApp();
const utils = require("../../../utils/util.js")

Page({

  data: {
    activityList: [],                 // 活动列表
    selectBarIndex: 0,               // 选中的活动列表的索引值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    // 加载页面数据
    this.getList()
  },
  getList() {
    let that = this
    let url = 'luckydraw/luckydrawwinsing'
    App._get(url,{},function(result) {
      console.log('查看往期', result.data.list)
      let data = result.data.list
      // 有数据
      if(result.data.list.length > 0) {
        // 过滤时间将2017-10-11 换成2017年10月11日
        data.forEach((item)=> {
          let time = item.win_luckydraw_date
          item.win_luckydraw_date = time.substr(0, 4) + '年' + time.substr(5,2) + '月' + time.substr(8, 2) + '日'
        })
        that.setData({
          activityList: data
        })
        return
      } else {
        // 数据为空
        that.setData({
          activityList: ''
        })  
      }
    })
  },
  selectBar(e) {
    this.setData({
      selectBarIndex: e.currentTarget.dataset.index
    })
  },
  goPast() {
    wx.navigateTo({
      url: '../pastlook/index'
    })
  }
  
})