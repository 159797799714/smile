const App = getApp();
const wxParse = require("../../../wxParse/wxParse.js");

// 工具类
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsType: 1,          //1代表秒杀 2代表限时购
    countDownTime: "",     //倒计时时间
    activityStart: true,   //活动是否开始

    indicatorDots: false,  // 是否显示面板指示点
    autoplay: true,        // 是否自动切换
    interval: 3000,        // 自动切换时间间隔
    duration: 800,         // 滑动动画时长

    currentIndex: 1,       // 轮播图指针
    floorstatus: false,    // 返回顶部
    showView: true,        // 显示商品规格

    detail: {},            // 商品详情信息
    goods_price: 0,        // 商品价格
    line_price: 0,         // 划线价格
    stock_num: 0,          // 库存数量

    goods_num: 1,          // 商品数量
    goods_sku_id: 0,       // 规格id
    cart_total_num: 0,     // 购物车商品总数量
    specData: {},          // 多规格信息

    percent: 10,           //秒杀进度状态
    
    popupType: '',         // 弹窗类型促销信息promotions或者服务说明services

    // 分享按钮组件
    share: {
      show: false,
      cancelWithMask: true,
      cancelText: '关闭',
      actions: [{
        name: '生成商品海报',
        className: 'action-class',
        loading: false
      }, {
        name: '发送给朋友',
        openType: 'share'
      }],
      // 商品海报
      showPopup: false,
    },
    showRemark: false

  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    let _this = this,
      scene = App.getSceneData(e);

    _this.data.goodsType = e.type
    // 商品id
    _this.data.goods_id = e.goods_id ? e.goods_id : scene.gid;
    // 获取商品信息
    _this.getGoodsDetail();
  },
  onReady() {
    this.videoCtx = wx.createVideoContext('myVideo')  //根据id绑定
  },
  // 点击cover播放
  videoPlay: function (e) {
    console.log('点击播放', e);
    //隐藏封面图和播放图标
    this.setData({
      play_icon: "none"    //tab_image 来控制封面图 
    }),
    this.videoCtx.play();
  },
  /**
   * 提醒我
   */
  remindMe(e) {
    let _this = this;
    console.log("提醒我",e)
    let url = ""
    let isremind = _this.data.isremind
    if(_this.data.goodsType == 1) {
      if(isremind == "no") {
        url = App.url.seckillRemind
      }else {
        url = App.url.seckillCancelremind
      }
    }else{
      if(isremind == "no") {
        url = App.url.flashsaleRemind
      }else {
        url = App.url.flashsaleCancelremind
      }
    }
    let param = {
      good_id: _this.data.goods_id,
      activity_category_id: _this.data.activity_category_id,
      formId: e.detail.formId
    }
    App._post_form(url,param,function(result){
      console.log("提醒成功或者取消提醒成功",result)
      if(isremind == "no") {
        wx.showToast({
          title: '小逸提醒设置成功',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          isremind: "yes"
        })
      }else {
        wx.showToast({
          title: '小逸取消提醒成功',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          isremind: "no"
        })
      }
    })
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail: function() {
    let _this = this;

    // goods/detail
    let url = ""
    if(this.data.goodsType == 1) {
      url = App.url.seckillDetail
    } else{
      url = App.url.flashsaleDetail
    }
    App._get(url, {
      goods_id: _this.data.goods_id
    }, function(result) {
      // 初始化商品详情数据
      let data = _this.initGoodsDetailData(result.data);
      console.log(data)
      _this.setData(data);
    });
  },

  /**
   * 初始化商品详情数据
   */
  initGoodsDetailData: function(data) {
    let _this = this;
    // 富文本转码
    if (data.detail.content.length > 0) {
      wxParse.wxParse('content', 'html', data.detail.content, _this, 0);
    }
    // 商品价格/划线价/库存
    data.goods_sku_id = data.detail.sku[0].spec_sku_id;
    data.goods_price = data.detail.goods_min_price;
    data.isremind = data.detail.isremind;
    data.activity_category_id = data.detail.activity_category_id;
    data.percent = Math.ceil((data.detail.total_inventory - data.detail.surplus_inventory)/data.detail.total_inventory * 100) 
    // data.countDownTime = data.detail.activity_endtime
    if(new Date(data.detail.activity_starttime) > new Date()) {
      data.activityStart = false
      util.countDown(data.detail.activity_starttime,function(nowTime) {
        _this.setData({
          countDownTime: nowTime
        })
      })
    }else {
      data.activityStart = true
      util.countDown(data.detail.activity_endtime,function(nowTime) {
        _this.setData({
          countDownTime: nowTime
        })
      })
    }

    data.line_price = data.detail.goods_max_price;
    data.stock_num = data.detail.sku[0].stock_num;
    // 单规格商品封面图
    data.image_path = data.detail.image[0]['file_path'];
    // 多规格商品封面图
    if (data.detail.spec_type == 20 && data.detail.sku[0]['image']) {
      data.image_path = data.detail.sku[0]['image']['file_path'];
    }
    // 初始化商品多规格
    if (data.detail.spec_type == 20) {
      data.specData = _this.initManySpecData(data.specData);
    }
    return data;
  },

  /**
   * 初始化商品多规格
   */
  initManySpecData: function(data) {
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].spec_items) {
        if (j < 1) {
          data.spec_attr[i].spec_items[0].checked = true;
          this.goods_spec_arr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
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
    // 更新商品规格信息
    this.updateSpecGoods();
  },

  /**
   * 更新商品规格信息
   */
  updateSpecGoods: function() {
    let spec_sku_id = this.goods_spec_arr.join('_');

    // 查找skuItem
    let spec_list = this.data.specData.spec_list,
      skuItem = spec_list.find((val) => {
        return val.spec_sku_id == spec_sku_id;
      });

    // 记录goods_sku_id
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      this.setData({
        goods_sku_id: skuItem.spec_sku_id,
        goods_price: skuItem.form.goods_price,
        line_price: skuItem.form.line_price,
        stock_num: skuItem.form.stock_num,
        image_path: skuItem.form.image_id > 0 ? skuItem.form.image_path : this.data.detail.image[0].file_path
      });
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent: function(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState: function() {
    this.setData({
      showView: !this.data.showView
    });
  },

  /**
   * 返回顶部
   */
  goTop: function(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll: function(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up: function() {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down: function() {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function() {
    wx.switchTab({
      url: "../../flow/index"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  submit: function(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;
    if (submitType === 'buyNow') {
      let param = {
        goods_id: _this.data.goods_id,
        goods_num: _this.data.goods_num,
        goods_sku_id: _this.data.goods_sku_id,
      }
      App._get(App.url.orderBuyNowinventory, param, function(res) {
        wx.navigateTo({
          url: '../../flow/checkout?' + util.urlEncode({
            order_type: 'buyNow',
            goods_id: _this.data.goods_id,
            goods_num: _this.data.goods_num,
            goods_sku_id: _this.data.goods_sku_id,
          }),
          success() {
            // 关闭弹窗
            _this.onToggleTrade();
          }
        });
      })
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('cart/add', {
        goods_id: _this.data.goods_id,
        goods_num: _this.data.goods_num,
        goods_sku_id: _this.data.goods_sku_id,
      }, function(result) {
        App.showSuccess(result.msg);
        _this.setData(result.data);
      });
    }
  },

  /**
   * 浏览商品图片
   */
  previewImages: function(e) {
    let index = e.currentTarget.dataset.index,
      imageUrls = [];
    this.data.detail.image.forEach(function(item) {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  /**
   * 预览Sku规格图片
   */
  previewSkuImage: function(e) {
    wx.previewImage({
      current: this.data.image_path,
      urls: [this.data.image_path]
    })
  },

  /**
   * 跳转到评论
   */
  navigateToComment: function() {
    wx.navigateTo({
      url: './comment/comment?goods_id=' + this.data.goods_id
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      'goods_id': _this.data.goods_id
    });
    return {
      title: _this.data.detail.goods_name,
      path: "/pages/goods/index?" + params
    };
  },

  /**
   * 显示分享选项
   */
  openActionsheet(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    this.setData({
      'share.show': true
    });
  },

  /**
   * 关闭分享选项
   */
  closeActionSheet() {
    this.setData({
      'share.show': false
    });
  },

  /**
   * 点击分享选项
   */
  clickAction(e) {
    if (e.detail.index === 0) {
      // 显示商品海报
      this.showPoster();
    }
    this.closeActionSheet();
  },

  /**
   * 切换商品海报
   */
  togglePopup() {
    this.setData({
      'share.showPopup': !this.data.share.showPopup
    });
  },

  /**
   * 显示商品海报图
   */
  showPoster: function() {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    App._get('goods/poster', {
      goods_id: _this.data.goods_id
    }, function(result) {
      _this.setData(result.data, function() {
        _this.togglePopup();
      });
    }, null, function() {
      wx.hideLoading();
    });
  },

  /**
   * 保存海报图片
   */
  savePoster: function(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.showLoading({
      title: '加载中',
    });
    // 下载海报图片
    wx.downloadFile({
      url: _this.data.qrcode,
      success: function(res) {
        wx.hideLoading();
        // 图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            // 关闭商品海报
            _this.togglePopup();
          },
          fail: function(err) {
            console.log(err.errMsg);
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              wx.showToast({
                title: "请允许访问相册后重试",
                icon: "none",
                duration: 1000
              });
              setTimeout(function() {
                wx.openSetting();
              }, 1000);
            }
          },
          complete(res) {
            console.log('complete');
            // wx.hideLoading();
          }
        })
      }
    })
  },

  /**
   * 确认购买弹窗
   */
  onToggleTrade(e) {
    if (typeof e === 'object') {
      // 记录formId
      e.detail.hasOwnProperty('formId') && App.saveFormId(e.detail.formId);
    }
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  closeAlert(e) {
    let type= e.currentTarget.dataset.type ? e.currentTarget.dataset.type: ''
    
    this.setData({
      showRemark: !this.data.showRemark,
      popupType: type
    });
  }

})