let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false,   // 快捷导航
    region: '',
    detail: {},
    error: '',
    address_id: '',     // 地址id
    tags: [{
      name: '家'
    }, {
      name: '公司'
    }, {
      name: '学校'
    }],                 // 地址标签
    tagData: '家',      // 默认选中家
    defauleId: '',      // 默认选中的id
    isDefault: false,   // 是否默认
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.address_id) {
      this.setData({
        address_id: options.address_id,
        isDefault: options.defaultId === options.address_id,
        defauleId: options.defaultId
      })
      // 获取当前地址信息
      this.getAddressDetail(options.address_id);
      return
    }
    wx.setNavigationBarTitle({
      title: '添加收货地址'
    })
  },

  /**
   * 获取当前地址信息
   */
  getAddressDetail: function(address_id) {
    let _this = this;
    App._get('address/detail', {
      address_id
    }, function(result) {
      _this.setData(result.data);
    });
  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value
    values.region = this.data.region;

    // 记录formId
    App.saveFormId(e.detail.formId);

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    values.address_id = _this.data.detail.address_id;
    values.tags_id = _this.data.tagData
    
    let url= 'address/edit'
    
    // 添加新地址
    if(!_this.data.address_id) {
      url= 'address/add'
    }
    console.log(values)
    App._post_form(url, values, function(result) {
      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },
  
  // 选择地址标签
  selectTag(e) {
    console.log(e.currentTarget.dataset.name)
    this.setData({
      tagData: e.currentTarget.dataset.name
    })
  },
  
  delAddress(e) {
    let that= this,
      address_id= that.data.address_id;
    App._get('address/delete', {
      address_id:address_id
    }, function(result) {
      App.showSuccess('删除成功', function() {
        wx.navigateBack({
          delta: 1
        })
      })
    })
  },
  
  // 是否默认收货地址
  switchChange(e) {
    let _this = this
    if (e.detail.value) {
      App._post_form('address/setDefault', {
        address_id: _this.data.address_id
      }, function(result) {
        App.showSuccess('设置成功', function() {
          _this.setData({
            isDefault: true
          })
        })
      })
      return
    } else {
      _this.setData({
        isDefault: false
      })
    }
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 获取微信地址
   */
  chooseAddress: function() {
    let _this = this;
    wx.chooseAddress({
      success: function(res) {
        _this.setData({
          'detail.name': res.userName,
          'detail.phone': res.telNumber,
          'detail.detail': res.detailInfo,
          region: [res.provinceName, res.cityName, res.countyName],
        });
      }
    })
  },

})