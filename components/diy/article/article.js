const App = getApp();

Component({
  options: {
    
  },

  data: {
    // 选项卡标示
    tabFixed: false,
  },
 
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    // itemStyle: Object,
    params: Object,
    dataList: Object,
    tabList: Object,
    dataType: Number,
    scrollTopDist: {
        type: String,
        observer: function(newVal, oldVal) {
          // 属性值变化时执行
          let height = wx.getSystemInfoSync().windowWidth/375 * 228 + 100
          
          if(newVal > height) {
            if(newVal < oldVal) {
              this.setData({
                tabFixed: true
              })
            } else {
              this.setData({
                tabFixed: false
              })
            }
            
          }else {
            this.setData({
              tabFixed: false
            })
          }
        },
        
    }
  },
  
  onUnload() {
    console.log('onUnload')
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /** 
     * 点击tab切换 
     */
    swichNav(e) {
      let _this = this;
      console.log("...",e)
      wx.showLoading({
        title: '加载中',
      })
      this.triggerEvent('parentEvent', e.currentTarget.dataset.current)
      _this.setData({
        // list: {},
        dataType: e.currentTarget.dataset.current
      }, function() {
        // 获取文章列表
        _this.getArticleListById();
      });
    },
    
    /**
     * 文章点赞
     */
    like(e) {
      wx.showLoading({
        title: '',
      });
      const _this = this;
      let url = 'article/like';
      let item = _this.data.dataList[e.currentTarget.dataset.index]
      let index = e.currentTarget.dataset.index
      let params = {
        article_id: item.article_id,
      }
      if(item.islike == 'yes') {
        url = 'article/unLike';
      }
      App._get(url, params, function (result) {
        if(item.islike == 'yes') {
          item.islike = 'no'
          item.like_count = item.like_count - 1
        }else {
          item.islike = 'yes'
          item.like_count = item.like_count + 1
        }
        _this.data.dataList[index] = item
        _this.setData({
          dataList: _this.data.dataList
        })
        
        wx.hideLoading();
        App.showSuccess(result.data);
      });
      console.log("...",e,item)
    },

    /**
     * 获取文章列表
     */
    getArticleListById() {
      let _this = this;
      App._get('article/articlesbycategoryid',{
          category_id: _this.data.dataType
        }, function(result) {
          wx.hideLoading()
          _this.data.dataList = result.data.list
          let data = _this.data
          _this.setData(data)
      });
    },
 
    /**
     * 跳转文章详情页
     */
    onTargetDetail(e) {
      wx.navigateTo({
        url: '/pages/article/detail/index?article_id=' + e.currentTarget.dataset.id
      });
    },
  },

  contentStart(content) {
    return 'a';
  },

})