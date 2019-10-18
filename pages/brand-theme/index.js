const App = getApp();
const wxParse = require("../../wxParse/wxParse.js");

Page({
  data: {
    theme_id: '',
    theme: {}
  },
  onLoad(opt) {
    console.log(opt)
    this.setData({
      theme_id: opt.id
    })
    
    // 获取详情
    this.getDetail();
  },
  
  // 获取详情
  getDetail() {
    let _this = this;
    App._get('theme_category/brandsThemeInfo', {
      brands_theme_id: _this.data.theme_id
    }, function(res) {
      console.log(res)
      wx.setNavigationBarTitle({
        title: res.data.theme.brand_theme_name
      })
      let content= res.data.theme.brand_theme_describe
      _this.setData({
        theme: res.data.theme
      })
      if ( content.length > 0) {
        content = content
          .replace(/&amp;nbsp;/g, ' ')
          .replace(/&amp;amp;nbsp;/g, ' ')
          .replace(/&nbsp;/g, ' ')
        wxParse.wxParse('content', 'html', content, _this, 0);
      }
    });
  },
  
  // 跳转商品详情页
  gotoDetail(e) {
    let id= e.currentTarget.dataset.id,
      type= e.currentTarget.dataset.type;
    console.log(id, type)
    switch(type) {
      // 普通商品
      case 0:
        wx.navigateTo({
          url: '/pages/goods/index?goods_id=' + id
        })
        break
      // 秒杀商品
      case 1:
        wx.navigateTo({
          url: '/pages/shop-seckill/index?goods_id=' + id + '&goods_type=' + type
        })
        break
      // 限时商品
      case 2:
        wx.navigateTo({
          url: '/pages/shop-seckill/index?goods_id=' + id + '&goods_type=' + type
        })
        break
      // 0元抽奖
      case 3:
        let obj = {
          goods_id: id
        }
        wx.navigateTo({
          url: '/pages/zerodraw/detail/index?form' + JSON.stringify(obj)
        })
        break
      // 积分商城
      case 4:
        App.showError('积分商城暂未开放，敬请期待')
        // wx.navigateTo({
        //   url: '/pages/goods/index?goods_id=' + id
        // })
        // break
    }
  }
})
