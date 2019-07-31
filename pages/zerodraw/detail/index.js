const App = getApp();
const utils = require("../../../utils/util.js")

Page({

  data: {
    detail: [],                      // 活动列表
    endtime: '',                        // 抽奖剩余时间
    leave_time:  '',                 // 活动开奖剩余时间 
    selectBarIndex: 0,               // 选中的活动列表的索引值,
    param: {},                       //传过来的抽奖的参数
    draw_num: '请点击抽奖领取抽奖码',  // 还未抽奖时我的抽奖码显示的文字
    remarks: ['分享微信领取抽奖码', '邀请好友参加得额外抽奖码（邀请越多，抽奖码越多，中奖概率越高）', '开奖通知(微信服务通知)'],
    addressData: {},
    data: '',
    id: '',
    formId: '',
    time: 0,
    isOverTime: false,                  // 超过72小时且没收货地址时为true
    canReceive: false,                  // 是否已经超过72小时
  },
  
  /*下拉刷新*/
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
    // 加载页面数据
    this.getDetail(this.data.data.goods_id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let opt = JSON.parse(options.form)
    that.setData({
      data: opt
    })
    if(options.form) {
      let user_id = wx.getStorageInfoSync('user_id')
      that.setData({
        param: opt
      })
      if(opt.reuser_id !== undefined) {
        // 分享人和被分享人一致
        if(user_id === opt.reuser_id) {
          return
        } else {
          // 分享回调接口
          that.shareRes(opt.goods_id, opt.reuser_id)
        }
      }
    }
    
  },
  onShow() {
    // 加载页面数据
    this.getDetail(this.data.data.goods_id)
    // 获取收货地址
    this.getAddress()
  },
  // 获取详情
  getDetail(id) {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    let url = 'luckydraw/detail'
    App._post_form(url, {
      goods_id: id
    }, function(res) {
      
      let data = res.data.detail.luckydraw_time
      
      let luckydrawtime = res.data.detail.luckydraw_time
      let endtime = res.data.detail.activity_endtime
      // 成功
      if(res.code === 1) {
        
        utils.countDown(luckydrawtime,function(luckytime) {
          if(luckytime === '00:00:00') {
            let format = luckydrawtime.replace(/-/g, '/')
            let countDown = Date.parse(new Date(format))
            let time = that.data.time + 1
            // 判断刚进来是否开
            if(countDown < new Date()) {
              that.setData({
                time: time
              })
            }
            if(that.data.time > 1 ) {
              that.setData({
                leave_time: '00:00:00'
              })
              return
              that.getDetail(that.data.data.goods_id)
            }
            
          }
          that.setData({
            leave_time: luckytime
          })
        })
        utils.countDown(endtime,function(nowtime) {
          that.setData({
            endtime: nowtime
          })
        })
        // 过滤时间将2017-10-11 换成2017年10月11日
        res.data.detail.luckydraw_time = data.substr(0,4) + '年' + data.substr(5,2) + '月' + data.substr(8, 2) + '日' + data.substr(11,5)
        that.setData({
          detail: res.data.detail
        })
        if(res.data.detail.iswin === 'yes') {
          that.setData({
            remarks: ['分享微信获取更多中奖信息', '请于开奖后3天内填写收货地址及信息,否则视为自动放弃奖励！']
          }) 
          // 获取收货地址
          that.getAddress()
          // 判断是否超过中奖后领奖72小时
          let canReceive = utils.DecideReceive(luckydrawtime)
          console.log('是否超过71小时', canReceive)
          that.setData({
            canReceive: canReceive
          })
          // 判断有没有地址
          if(!that.data.addressData) {
            that.setData({
              isOverTime: canReceive
            })
          }
        }
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        wx.showToast({
          title: '商品详情加载失败',
          icon: 'success',
          mask: true,
          duration: 1500,
        })
      }
    })
  },
   
  // 抽奖
  goDraw(e) {
    console.log(e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
    let that = this
    let url = 'luckydraw/remind'
    let param = this.data.param
    param.good_id = param.goods_id
    param.formId = e.detail.formId
    App._post_form(url, param,function(result){
      if(result.code === 1) {
        wx.showToast({
          title: '抽奖成功',
          icon: 'success',
          mask: true,
          duration: 1500,
        })
        that.setData({
          'detail.isremind': 'yes',
          'detail.luckydraw_code[0]': result.data.info.luckydraw_code
        })
      }
    })
  },
  
  // 分享
  onShareAppMessage(options) {
    let that = this
    let reuser_id = wx.getStorageSync('user_id')
    
    let info = JSON.stringify({...that.data.param, reuser_id: reuser_id})
    console.log(info)
    return {
      title: '快来和我一起参与抽奖吧~',
      path: '/pages/zerodraw/detail/index?form=' + info,
      success: function (res) {
        wx.showToast({
          title: '分享完成',
          icon: 'success',
          mask: true,
          duration: 1500,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
    }
  },
  
  // 抽奖分享回调
  shareRes(goods_id, reuser_id) {
    let url = 'luckydraw/luckydrawshare'
    let param = {
      goods_id: goods_id,
      reuser_id: reuser_id
    }
    App._post_form(url, param,function(result){
      console.log(result)
    })
  },
  
  // 去选择地址或者添加地址
  goSelectAddress(e) {
    console.log(e.currentTarget.dataset.type)
    if(!this.data.canReceive) {
      wx.navigateTo({
        url: '../../address/' + e.currentTarget.dataset.type
      })  
    }
  },
  
  // 获取收货地址
  getAddress() {
    let that = this
    let url = 'address/lists'
    App._get(url, {}, function(res) {
      console.log('获取收货地址', res.data.default_id)
      if(res.code === 1) {
        console.log(res.data.list)
        if(res.data.list.length > 0) {
          res.data.list.map((item, index) => {
            if(item.address_id === res.data.default_id) {
              console.log(item)
              that.setData({
                addressData: item
              })
            }
          })  
        } else {
          console.log('进来了222')

          that.setData({
            addressData: ''
          })
        }
      } else {
        wx.showToast({
          title: '收货地址',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
    })
  }
})