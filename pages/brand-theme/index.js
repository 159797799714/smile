const App = getApp();
const wxParse = require("../../wxParse/wxParse.js");

Page({
  data: {
    theme_id: ''
  },
  onLoad(opt) {
    console.log(opt)
    this.setData({
      theme_id: opt.id
    })
    
    // 获取详情
    this.getDetail();
  },
  getDetail() {
    let _this = this;
    App._get('theme_category/brandsThemeInfo', {
      brands_theme_id: _this.data.theme_id
    }, function(res) {
      console.log(res)
      let content= res.data.theme.brand_theme_describe
      if ( content.length > 0) {
        content = content
          .replace(/&amp;nbsp;/g, ' ')
          .replace(/&amp;amp;nbsp;/g, ' ')
          .replace(/&nbsp;/g, ' ');
        wxParse.wxParse('content', 'html', content, _this, 0);
      }
    });
  }
})
