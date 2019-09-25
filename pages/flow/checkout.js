const App = getApp();

// 枚举类：发货方式
const DeliveryTypeEnum = require('../../utils/enum/DeliveryType.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 当前页面参数
    options: {},

    // 配送方式
    deliverys: DeliveryTypeEnum,
    currentDelivery: DeliveryTypeEnum.EXPRESS.value,

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址

    selectedShopId: 0, // 选择的自提门店id

    goods: {}, // 商品信息
    coupon_list_new: [],     // 优惠券列表
    redenvelope_list: [],    // 红包列表
    coupon: [{
      coupon_id: 0,          // 选择的优惠券id
      reduced_price: '',     // 优惠券优惠的金额
    }, {
      red_envelope_id: 0,    // 选择红包id
      reduced_price: '',     // 红包优惠的金额
    }],
    popupType: '',          // 弹窗类型 coupon为优惠券 redenvelope为红包

    // 买家留言
    remark: '',

    // 禁用submit按钮
    disabled: false,

    hasError: false,
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let _this = this;
    // 当前页面参数
    _this.data.options = options;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this;
    // 获取当前订单信息
    _this.getOrderData();
  },
  
  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    console.log(this.data.coupon)
    let _this = this,
      options = _this.data.options;
    // 获取订单信息回调方法
    let callback = function(result) {
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      }
      _this.setData({
        address: result.data.address,
        coupon_list_new: result.data.coupon_list_new,
        redenvelope_list: result.data.redenvelope_list,
        delivery: result.data.delivery,
        error_msg: result.data.error_msg,
        exist_address: result.data.exist_address,
        express_price: result.data.express_price,
        extract_shop: result.data.extract_shop,
        has_error: result.data.has_error,
        intra_region: result.data.intra_region,
        order_pay_price: result.data.order_pay_price,
        order_total_num: result.data.order_total_num,
        order_total_price: result.data.order_total_price,
        goods_list: result.data.goods_list
      });
    };
    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        delivery: _this.data.currentDelivery,
        shop_id: _this.data.selectedShopId,
        remark: '',
        pay_method: 'JSAPI',
        coupon_id: _this.data.coupon[0].coupon_id,
        red_envelope_id: _this.data.coupon[1].red_envelope_id
      }, function(result) {
        callback(result);
      });
    }
    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('order/cart', {
        cart_ids: options.cart_ids,
        delivery: _this.data.currentDelivery,
        shop_id: _this.data.selectedShopId,
        coupon_id: _this.data.coupon[0].coupon_id,
        red_envelope_id: _this.data.coupon[1].red_envelope_id
      }, function(result) {
        callback(result);
      });
    }
  },

  /**
   * 切换配送方式
   */
  onSwichDelivery(e) {
    // 设置当前配送方式
    let _this = this,
      currentDelivery = e.currentTarget.dataset.current;
    _this.setData({
      currentDelivery
    });
    // 重新获取订单信息
    _this.getOrderData();
  },

  /**
   * 快递配送：选择收货地址
   */
  onSelectAddress() {
    wx.navigateTo({
      url: '../address/index'
    });
  },

  /**
   * 上门自提：选择自提点
   */
  onSelectExtractPoint() {
    let _this = this,
      selectedId = _this.data.selectedShopId;
    wx.navigateTo({
      url: '../_select/extract_point/index?selected_id=' + selectedId
    });
  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
      options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function(result) {
      if (result.code === -10) {
        App.showError(result.msg, function() {
          // 跳转到未付款订单
          wx.redirectTo({
            url: '../order/index',
          });
        });
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.payment.timeStamp,
        nonceStr: result.data.payment.nonceStr,
        package: 'prepay_id=' + result.data.payment.prepay_id,
        signType: 'MD5',
        paySign: result.data.payment.paySign,
        success: function(res) {
          // 跳转到订单详情
          wx.redirectTo({
            url: '../order/detail?order_id=' + result.data.order_id,
          });
        },
        fail: function() {
          App.showError('订单未支付', function() {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/index',
            });
          });
        },
      });
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      App._post_form('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        delivery: _this.data.currentDelivery,
        shop_id: _this.data.selectedShopId,
        coupon_id: _this.data.coupon[0].coupon_id,
        red_envelope_id: _this.data.coupon[1].red_envelope_id,
        remark: _this.data.remark
      }, function(result) {
        // success
        callback(result);
      }, function(result) {
        // fail
      }, function() {
        // complete
        console.log('complete');
        wx.hideLoading();
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

    // 创建订单-购物车结算
    else if (options.order_type === 'cart') {
      App._post_form('order/cart', {
        cart_ids: options.cart_ids,
        delivery: _this.data.currentDelivery,
        shop_id: _this.data.selectedShopId,
        coupon_id: _this.data.coupon[0].coupon_id,
        red_envelope_id: _this.data.coupon[1].red_envelope_id,
        remark: _this.data.remark
      }, function(result) {
        // success
        callback(result);
      }, function(result) {
        // fail
      }, function() {
        // complete
        wx.hideLoading();
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

  },
  // 优惠券等选择器事件
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    let type= this.data.popupType,
      dataset= e.currentTarget.dataset,
      coupon= this.data.coupon;
    if(type === 'coupon') {
      coupon[0].coupon_id= dataset.id
      coupon[0].reduced_price= dataset.price
      this.setData({
        coupon: coupon
      })
    } else {
      coupon[1].red_envelope_id= dataset.id
      coupon[1].reduced_price= dataset.price
      this.setData({
        coupon: coupon
      })
    }
    // 重新请求价格数据
    this.getOrderData();
  },
  /**
   * 买家留言
   */
  bindRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 选择优惠券(弹出/隐藏)
   */
  togglePopupCoupon(e) {
    let _this = this,
      type= e.currentTarget.dataset.type;
    if (_this.data.coupon_list_new.length > 0 || _this.data.redenvelope_list.length > 0 ) {
      _this.setData({
        showBottomPopup: !_this.data.showBottomPopup,
        popupType: type ? type: ''
      });
    }
  },
  

  /**
   * 选择优惠券
   */
  // selectCouponTap: function(e) {
  //   let _this = this,
  //     dataset = e.currentTarget.dataset;
  //   // 优惠券折扣金额
  //   let reducedPrice = _this.data.coupon_list[dataset.index].reduced_price;
  //   dataset.reduced_price = reducedPrice;
  //   // 计算优惠后的价格
  //   let actualPayPrice = _this.bcsub(_this.data.order_pay_price, reducedPrice);
  //   _this.setData({
  //     selectCoupon: dataset,
  //     actual_pay_price: actualPayPrice > 0 ? actualPayPrice : '0.01'
  //   });
  //   _this.togglePopupCoupon();
  // },

  /**
   * 不使用优惠券
   */
  // doNotCouponTap: function() {
  //   this.setData({
  //     selectCoupon: {},
  //     actual_pay_price: this.data.order_pay_price
  //   });
  //   this.togglePopupCoupon();
  // },

  /**
   * 数学运算相减
   */
  // bcsub: function(arg1, arg2) {
  //   return (Number(arg1) - Number(arg2)).toFixed(2);
  // },


});