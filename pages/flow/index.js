const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart_goods_list: [], // 商品列表
    // order_total_num: 0,
    // 商品总金额
    // order_total_price: 0,

    action: 'complete',
    checkedAll: false,

    // 商品总价格
    cartTotalPrice: '0.00',
    showBottomPopup: false,     // 优惠券弹窗显示隐藏
    couponList: [],             // 优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  //   // 获取购物车列表
  //   this.getCartList();
  },
  onShow() {
    // 获取购物车列表
    this.getCartList();
  },
  onPullDownRefresh: function() {
    // 获取购物车列表
    this.getCartList();
    
    wx.stopPullDownRefresh()
  },

  /**
   * 获取购物车列表
   */
  getCartList: function() {
    let _this = this;
    App._get(App.url.cartListnew, {}, function(result) {
      console.log(result)
      _this.setData({
        cart_goods_list: result.data.cart_goods_list,
        order_total_price: result.data.order_total_price,
        action: 'complete',
        checkedAll: false,
        cartTotalPrice: '0.00'
      });
    });
  },
  // 品牌分类选中
  storeChecked(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodslist = _this.data.cart_goods_list[index].goods_list;
    if(_this.data.cart_goods_list[index].checked) {
      goodslist.forEach(function(item, num){
        item.checked = false
      })  
    } else {
      goodslist.forEach(function(item, num){
        item.checked = true
      })  
    }
    _this.setData({
      ['cart_goods_list[' + index + '].goods_list']: goodslist,
      ['cart_goods_list[' + index + '].checked']: !_this.data.cart_goods_list[index].checked
    }, function() {
      // 更新购物车已选商品总价格
      _this.updateTotalPrice();
    });
    
  },
  
  // 通过ID查询优惠券
  searchCoupon: function (id, cb) {
    let that = this;
    App._get(App.url.couponGetCouponsByThemeId, {
      theme_id: id
    }, function(res) {
      if(res.data.list.length < 1) {
        wx.showToast({
          title: '该品牌暂无可用优惠券哦！',
          icon: 'none'
        })
      }
      that.setData({
        couponList: res.data.list
      });
      cb(true);
    });
  },
  
  // 领取优惠券
  getCoupon(e) {
    let that= this,
      coupon_id= e.currentTarget.dataset.id,
      index= e.currentTarget.dataset.index,
      couponList = this.data.couponList,
      is_receive= e.currentTarget.dataset.status;
    if(is_receive) {
      wx.showToast({
        title: '不要太贪心哦！',
        icon: 'none'
      })
    } else {
      App._post_form('user.coupon/receive', {
        coupon_id: coupon_id
      }, function(res) {
        App.showSuccess(res.msg)
        couponList[index].is_receive = true
        that.setData({
          couponList: couponList
        })
      });
    }
  },
  
  // 控制优惠券弹窗显示隐藏
  controlCoupon(e) {
    let that = this,
      id = e.currentTarget.dataset.id;
    // 打开弹窗时
    if(id && !that.data.showBottomPopup) {
      // 通过ID搜索优惠券
      that.searchCoupon(id, function(status) {
        if(that.data.couponList.length > 0 && id) {
          that.setData({
            showBottomPopup: true
          })
        }
      })
    } else {
      that.setData({
        showBottomPopup: false
      })
    }
  },
  
  /**
   * 普通商品单个选择框选中
   */
  radioChecked: function(e) {
    let _this = this,
      time = 0,
      index = e.currentTarget.dataset.index,
      num = e.currentTarget.dataset.num,
      goodslist = _this.data.cart_goods_list[index].goods_list,
      checked = !_this.data.cart_goods_list[index].goods_list[num].checked;
    _this.setData({
      ['cart_goods_list[' + index + '].goods_list[' + num + '].checked']: checked
    }, function() {
      // 更新购物车已选商品总价格
      _this.updateTotalPrice();
    });
    goodslist.forEach(function(item, numj) {
      if(item.checked) {
        time += 1
      }
    })
    if(time === goodslist.length) {
      _this.setData({
        ['cart_goods_list[' + index + '].checked']: true
      })
    } else {
      _this.setData({
        ['cart_goods_list[' + index + '].checked']: false
      })
    }
  },

  /**
   * 选择框全选
   */
  radioCheckedAll: function(e) {
    let _this = this,
      cartgoodlist = this.data.cart_goods_list;
    cartgoodlist.forEach(function(item) {
      item.checked = !_this.data.checkedAll;
      item.goods_list.forEach(function(li) {
        li.checked = !_this.data.checkedAll;
      })
      
    });
    _this.setData({
      cart_goods_list: cartgoodlist,
      checkedAll: !_this.data.checkedAll
    }, function() {
      // 更新购物车已选商品总价格
      _this.updateTotalPrice();
    });
  },

  /**
   * 切换编辑/完成
   */
  switchAction: function(e) {
    let _this = this;
    _this.setData({
      action: e.currentTarget.dataset.action
    });
  },

  /**
   * 删除商品
   */
  deleteHandle: function() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }
    wx.showModal({
      title: "提示",
      content: "您确定要移除选择的商品吗?",
      success: function(e) {
        e.confirm && App._post_form('cart/delete', {
          goods_sku_id: cartIds
        }, function(result) {
          // 获取购物车列表
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 获取已选中的商品
   */
  getCheckedIds: function() {
    let arrIds = [];
    this.data.cart_goods_list.forEach(function(item) {
      item.goods_list.forEach(function(li) {
        if (li.checked === true) {
          arrIds.push(li.goods_id + '_' + li.goods_sku_id);
        }  
      })
      
    });
    return arrIds;
  },

  /**
   * 更新购物车已选商品总价格
   */
  updateTotalPrice: function() {
    let _this = this;
    let cartTotalPrice = 0;
    _this.data.cart_goods_list.forEach(function(item) {
      item.goods_list.forEach(function(li) {
        if (li.checked === true) {
          cartTotalPrice = _this.mathadd(cartTotalPrice, li.total_price);
        }  
      })
      
    });
    _this.setData({
      cartTotalPrice: Number(cartTotalPrice).toFixed(2)
    });
  },

  /**
   * 递增指定的商品数量
   */
  addCount: function(e) {
    let type= e.currentTarget.dataset.type
    if(type === 0) {
      let _this = this,
        index = e.currentTarget.dataset.index,
        num = e.currentTarget.dataset.num,
        goodsSkuId = e.currentTarget.dataset.skuId,
        goods = _this.data.cart_goods_list[index].goods_list[num];
      // order_total_price = _this.data.order_total_price;  
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      App._post_form(App.url.cartAdd, {
        goods_id: goods.goods_id,
        goods_num: 1,
        goods_sku_id: goodsSkuId
      }, function() {
        // 商品数量
        goods.total_num++;
        // 商品总价格
        goods.total_price = _this.mathadd(goods.total_price, goods.goods_price);
        // 更新商品信息
        _this.setData({
          ['cart_goods_list[' + index + '].goods_list[' + num + ']']: goods
        }, function() {
          // 更新购物车总价格
          _this.updateTotalPrice();
        });
      }, null, function() {
        wx.hideLoading();
      });
    } else {
      wx.showToast({
        title: '抢购或者秒杀商品限购一件',
        icon: 'none'
      })
    } 
  },
  goDetail(e) {
    let goods_id= e.currentTarget.dataset.goodsId
    let type= e.currentTarget.dataset.type
    if(type === 0) {
      wx.navigateTo({
        url: '../goods/index?goods_id=' + goods_id
      })
    } else{
      wx.navigateTo({
        url: '../shop-seckill/goods/index?goods_id='  + goods_id + '&type=' + type
      })
    }
  },
  /**
   * 递减指定的商品数量
   */
  minusCount: function(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      num = e.currentTarget.dataset.num,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.cart_goods_list[index].goods_list[num];
    // order_total_price = _this.data.order_total_price;

    if (goods.total_num > 1) {
      
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form(App.url.cartSub, {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, function(res) {
        // 商品数量
        goods.total_num--;
        if (goods.total_num > 0) {
          // 商品总价格
          goods.total_price = _this.mathsub(goods.total_price, goods.goods_price);
          // 更新商品信息
          _this.setData({
            ['cart_goods_list[' + index + '].goods_list[' + num + ']']: goods
          }, function() {
            // 更新购物车总价格
            _this.updateTotalPrice();
          });
        }
      }, null, function() {
        wx.hideLoading();
      });

    }
  },

  /**
   * 购物车结算
   */
  submit: function() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart&cart_ids=' + cartIds
    });
  },

  /**
   * 加法
   */
  mathadd: function(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub: function(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping: function() {
    wx.switchTab({
      url: '../shopping-mall/index',
    });
  },

})