const App = getApp();

Page({
  data: {
    scrollHeight: null,

    inputClearValue: '',

    flag: false,
    name: '',

    brandId: '',
    categoryId: '',
    promotionsType: '',
    minPrice: '',
    maxPrice: '',

    option: {}, // 当前页面参数
    list: {}, // 商品列表数据

    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码

    style: 0,                    // 商品块默认0上图下文，1为左图右文
    tabList: ['分享', '商品'],
    tabIndex: 0,                // 默认选中分享
    articles_list: [],          // 分享文章列表
    goods_list: [],             // 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let that = this;
    // 获取浏览列表
    that.getGoodsList()
  },

  
  
  // 分享商城tab点击
  selectTab(e) {
    let that = this
    that.setData({
      filterIndex: 0
    })
    let index = e.currentTarget.dataset.index
    that.setData({
      tabIndex: index
    })
  },
  
  
  /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList: function(isPage, page) {
    let that = this;
    App._get('app.center/myViews', {}, function(res) {
      console.log(res.data)
      that.setData({
        articles_list: res.data.list.articles_list,
        goods_list: res.data.list.goods_list
      })
    });
  },

  //点赞
  clickZan(e) {
    let that = this,
      index = e.currentTarget.dataset.index,
      type = e.currentTarget.dataset.type;
    var url = ""
    if(type === 'umi') {
      url= 'umi.'
    }
    let list= this.data.articles_list,
      articleData = list[index]
    if(articleData.isLike) {
      url = url + 'article/unLike'
    }else {
      url = url + 'article/like'
    }
    let param = {
      article_id: articleData.article_id
    }
    App._get(url,param,function(result) {
      articleData.isLike = !articleData.isLike
      articleData.like_num = articleData.isLike ? articleData.like_num + 1 : articleData.like_num - 1
      that.setData({
        articles_list: list
      })
    })
  },
  // 商品详情页
  goDetail(e) {
    let that = this, 
      goods_id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type;
    console.log(goods_id, type)
    switch(type) {
      // 普通
      case 'general':
        wx.navigateTo({
          url: '/pages/goods/index?goods_id=' + goods_id
        })
        break
        
      // 秒杀
      case 'seckill':
        wx.navigateTo({
          url: '/pages/shop-seckill/goods/index?type=1&goods_id=' + goods_id
        })
        break
        
      // 限时购
      case 'flashsale':
        wx.navigateTo({
          url: '/pages/shop-seckill/goods/index?type=2&goods_id=' + goods_id
        })
        break
        
      // 0元抽奖
      case 'luckydraw':
        let form = {
          goods_id: goods_id
        }
        wx.navigateTo({
          url: '/pages/zerodraw/detail?form=' + JSON.stringify(form)
        })
        break
        
      // 拼团
      case 'sharing':
        wx.navigateTo({
          url: '/pages/sharing/goods/index?goods_id=' + goods_id
        })
        break
    }
  },
  // 文章详情
  goShareDetail(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      type= e.currentTarget.dataset.type;
    console.log(type)
    
    if(type === 'unixe') {
      wx.navigateTo({
        url: '/pages/article/detail/index?article_id=' + id
      })  
    } else if(type === 'umi') {
      wx.navigateTo({
        url: '/pages/youmi/detail/index?article_id=' + id
      }) 
    }
    
  }
});