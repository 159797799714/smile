const App = getApp();
const utils = require("../../../utils/util.js")

Page({

  data: {
    detail: [],                      // 活动列表
    leave_time:  '',                 // 活动剩余时间 
    selectBarIndex: 0,               // 选中的活动列表的索引值,
    param: {},                       //传过来的抽奖的参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    // 加载页面数据
    let form = JSON.parse(option.form)
    this.setData({
      param: form
    })
    this.getDetail(form.good_id)
  },
  // 获取详情
  getDetail(id) {
    let that = this
    let url = 'luckydraw/detail'
    App._post_form(url, {
      goods_id: id
    }, function(res) {
      // res.data.detail.activity_luckydrawtime
      console.log('商品列表', res.data.detail)
      let data = res.data.detail.luckydraw_time
      
      let luckydrawtime = res.data.detail.luckydraw_time
      utils.countDown(luckydrawtime,function(nowTime) {
        that.setData({
          leave_time: nowTime
        })
      })
      
      // 过滤时间将2017-10-11 换成2017年10月11日
      res.data.detail.luckydraw_time = data.substr(5,2) + '月' + data.substr(8, 2) + '日'
      
      that.setData({
        detail: res.data.detail
      })
      
    })
  },
   
  // 抽奖
  goDraw() {
    let url = 'luckydraw/remind'
    let param = this.data.param
    App._post_form(url, param,function(result){
      console.log(result)
    })
  },
  
  // 分享
   onShareAppMessage: function (res) {
    return {
      title: '转发',
      path: '/pages/index/community/topic/topic?jsonStr=' + this.data.list,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
  
})