const App = getApp();
const utils = require("../../../utils/util.js")

Page({

  data: {
    indicatorDots: false,  // 是否显示面板指示点
    autoplay: true,        // 是否自动切换
    interval: 3000,        // 自动切换时间间隔
    duration: 800,         // 滑动动画时长
    
    currentIndex: 1,       // 轮播图指针
    
    day: 0,         // 剩余开奖天数,
    hour: 0,        // 剩余开奖小时
    min: 0,         // 剩余开奖分钟
    sec: 0,         // 剩余开奖秒  
    
    specData: {},             // 商品规格信息
    showBottomPopup: false,   // 选择规格弹窗
    isWin: true,              // 可以领奖
    canGet: false,            // 中奖了领奖弹窗
    
    
    detail: [],                      // 活动列表
    endtime: '',                     // 抽奖剩余时间
    leave_time:  '',                 // 活动开奖剩余时间 
    selectBarIndex: 0,               // 选中的活动列表的索引值,
    param: {},                       //传过来的抽奖的参数
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
    console.log('11111', options)
    let that = this
    
    if(options.form) {
      let opt = JSON.parse(options.form)
      let user_id = wx.getStorageInfoSync('user_id')
      that.setData({
        data: opt,
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
    
    // 弹出领奖弹窗
    // setTimeout(function() {
    //   this.setData({
    //     canGet: true
    //   })  
    // }.bind(this), 1000)
    
  },
  
  /**
   * 点击切换不同规格
   */
  modelTap: function(e) {
    let attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      specData = this.data.specData;
    for (let i in specData.spec_attr) {
      for (let j in specData.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          specData.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            specData.spec_attr[i].spec_items[itemIdx].checked = true;
            this.goods_spec_arr[i] = specData.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }
    this.setData({
      specData
    });
  },
  
  // 设置轮播图当前指针 数字
  setCurrent: function(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
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
      let time = 0
      // 成功
      if(res.code === 1) {
        
        // 剩余开奖时间
        utils.countDown(luckydrawtime,function(luckytime) {
          let index = luckytime.indexOf(':')
          // 处理剩余开奖时间
          that.setData({
            day: Math.floor(luckytime.slice(0, index) / 24),
            hour: luckytime.slice(0, index) % 24,
            min: luckytime.slice(index + 1, index + 3),
            sec: luckytime.slice(index + 4, index + 6) 
          })
          // 剩余开奖时间为零
          if(luckytime === '00:00:00') {
            console.log('luckytime === 00:00:00', that.data.time)
            // 停留等待活动开奖
            if(time > 0) {
              that.getDetail(that.data.data.goods_id)
              that.setData({
                time: 0
              })
            }
            that.setData({
              leave_time: luckytime
            })
            return
          } else {
            time += 1
            // 每次进来次数加1
            that.setData({
              time: time,
              leave_time: luckytime
            })  
          }
        })
        
        // 活动结束剩余时间
        utils.countDown(endtime,function(nowtime) {
          
          that.setData({
            endtime: nowtime
          })
        })
        // 过滤时间将2017-10-11 换成2017年10月11日
        res.data.detail.luckydraw_time = data.substr(0,4) + '年' + data.substr(5,2) + '月' + data.substr(8, 2) + '日' + data.substr(11,5)
        that.setData({
          detail: res.data.detail,
          specData: res.data.specData
        })
        if(res.data.detail.iswin === 'yes') {
          // 获取收货地址
          that.getAddress()
          // 判断是否超过中奖后领奖7天
          let canReceive = utils.DecideReceive(luckydrawtime)
          console.log('是否超过7天', canReceive)
          
          if(!canReceive && res.data.detail.is_confirm === 'no' ) {
            that.setData({
              canGet: true
            })  
          }
          
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
  
  // 关闭或者开启弹窗
  onToggleTrade() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  // 立即领奖
  getPrize() {
    this.closeWinAlert()
    this.setData({
      showBottomPopup: true
    })
  },
  
  // 关闭领奖弹窗
  closeWinAlert() {
    let that= this
    that.setData({
      canGet: false
    })
    setTimeout(function() {
      that.setData({
        isWin: false
      })
    }, 1000);
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
  sureAction() {
    let that= this
    let url= 'luckydraw/winConfirm'
    let param = {
      win_code: that.data.detail.win_code
    }
    App._post_form(url, param,function(result){
      console.log(result)
    })
  },
  shareAction() {
    App.showError('分享失败，每个用户最多只能拥有5个抽奖码！')
    return
  },
  // 分享
  onShareAppMessage(options) {
    let that = this
    let reuser_id = wx.getStorageSync('user_id')
    
    let info = JSON.stringify({...that.data.param, reuser_id: reuser_id})
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
    // if(!this.data.detail.is_confirm === 'no') {
      wx.navigateTo({
        url: '../../address/index' 
      })  
    // }
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