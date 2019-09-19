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

    showView: false, // 列表显示方式
    arrange: "", // 列表显示方式class

    sortType: 'all', // 排序类型
    sortPrice: true, // 价格从低到高

    option: {}, // 当前页面参数
    list: {}, // 商品列表数据

    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码

    style: 0,                    // 商品块默认0上图下文，1为左图右文
    tabList: ['分享', '商城'],
    tabIndex: 0,                // 默认选中分享
    shareTag: ['综合', '最热', '最新', '官方'],
    shopShareTag: [       //'综合', '销量', '上架', '价格', '筛选'
      {
        tag_name: '综合',
        dataType: 'all',
      },
      {
        tag_name: '销量',
        dataType: 'sales',
      },
      {
        tag_name: '上架',
        dataType: 'putaway',
      },
      {
        tag_name: '价格',
        dataType: 'price',
      },
      {
        tag_name: '筛选',
        dataType: 'filter',
      }
    ],
    filterIndex: 0,             // 默认选中综合
    filter: ['品牌', '分类'],
    filterTag_Index: '',           //默认选中品牌
    filterList: [],          // 品牌和分类总的数据     
    filterCoverList: {
      list: [{
        name: "",
        select: false
      }],
      sum: '',
      selectIndexArr: ['默认'],
    },
    filter_alert: false,             // 筛选遮罩层显示
    shareList: [],
    goodList: [], 
    captionList: [
      {
        title: '品牌',
        open: false,
        selectIndexArr: ['默认'],               //循环时加上
        arr: [
          {
            name: '索尼',
            select: false,
          },
        ]
      }, {
        title: '分类',
        open: false,
        selectIndexArr: ['默认'],
        arr: [
          {
            name: '索尼',
            select: false,
          },
        ]
      }, {
        title: '促销',
        open: false,
        selectIndexArr: ['默认'],
        arr: [
          {
            name: '索尼',
            select: false,
          },
        ]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();
     
     console.log('option', option)
    // 记录option
    _this.setData({
      option,
      categoryId : option.category_id ? option.category_id : '',
      inputClearValue: option.search ? option.search : '',
      tabIndex: option.search || option.category_id ? 1 : 0,
      name: option.name
    }, function() {
      // 获取商品列表
      // _this.searchGoods();
      if(_this.data.tabIndex === 0) {
        _this.getArticleList()
        _this.getArticleLabelList()
      }else {
        _this.setData({
          scrollHeight: _this.data.scrollHeight - 50,
        })
        _this.searchGoods()
        // 获取外层品牌列表
        let arr = []
        _this.getBrandsList("品牌",function(res){
          arr.push(res)
          _this.getBrandsList("分类",function(res){
            arr.push(res)
            _this.setData({
              filterList: arr
            })
            console.log(_this.data.filterList)
          })  
        })
        
      }
      
      // _this.getBrandsList()
    });

  },

  // 商品搜索
  searchGoods(isPage, page) {
    let _this = this
    let params = {
      page: page || 1,
      category_id: _this.data.categoryId || '',
      search: _this.data.inputClearValue,
      sortType: this.data.sortType,
      sortPrice: this.data.sortPrice ? 'true' : 'false',
      listRows: 15,
      brand_id:  _this.data.brandId || '',
      promotions_type: _this.data.promotionsType,
      min_price: _this.data.minPrice,
      max_price: _this.data.maxPrice,
    }
    App._post_form('goods/goodlists',params,function(result) {
      console.log("获取商品列表",result)
      let resList = result.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
          'filterCoverList.sum': resList.total
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
          'filterCoverList.sum': resList.total
        });
      }
    })
  },

  // 删除搜索框里的文字
  deleteSearch() {
    let _this = this
    _this.setData({
      inputClearValue: '',
      filterIndex: 0
    })
    
    // 删除搜索框重新请求数据
    // if(_this.data.tabIndex === 0) {
    //   _this.getArticleList()
    // }else {
    //   _this.searchGoods()
    // }
  },

  // 搜索最低价和最高价
  searchPrice(e) {
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    if(type == 'min') {
      this.data.minPrice = value
    }else {
      this.data.maxPrice = value
    }
    this.searchGoods()
  },
  // 根据商品类型跳转到相应商品详情
  goDetail(e) {
    let goods_id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type;
    console.log(goods_id, type)
    switch(type) {
      // 普通商品0
      case 0: 
        wx.navigateTo({
          url: '../goods/index?goods_id=' + goods_id
        })
        break;
      // 秒杀商品1
      case 1:
        wx.navigateTo({
          url: '../shop-seckill/goods/index?goods_id=' + goods_id + '&type=' + type
        })
        break;
      // 限时商品2
      case 2:
        wx.navigateTo({
          url: '../shop-seckill/goods/index?goods_id=' + goods_id + '&type=' + type
        })
        break;
      // 0元抽奖3
      case 3:
        let form = {
          goods_id: goods_id
        }
        wx.navigateTo({
          url: '../zerodraw/detail/index?form=' + JSON.stringify(form)
        })
        break;
      // // 积分商品4
      // case 4:
      //   wx.navigateTo({
      //     url: '../goods/index?goods_id=' + goods_id
      //   })
      //   break;
    }
    
  },
  // 搜索框
  seachInput(e) {
    console.log("输入框的值",e)
    let _this = this
    _this.setData({ 
      inputClearValue: e.detail.value,
      filterIndex: 0
    })
    if(_this.data.tabIndex === 0) {
      _this.getArticleList()
    }else {
      _this.searchGoods()
    }
  },

  // 获取分享文章
  getArticleList(id) {
    let _this = this
    let params = {
      search: _this.data.inputClearValue,
      tags_id: 0 || id
    }
    App._get('article/articlesbysearch',params,function(result) {
      console.log("获取分享文章",result)
      _this.setData({
        shareList: result.data.list
      })
    })
  },

  // 获取品牌分类
  getBrandsList(type,callback) {
    let _this = this
    let url = ''
    let param = {}
    // 从商城点击分类进来，携带参数id
    if(_this.data.categoryId) {
      param = {
        category_id: _this.data.categoryId
      }
      if(type === '品牌') {
        url = 'brands/getbrandsbycategoryid'
      } else {
        url = 'category/goodscategorybysecond'
      }
      // 从搜索进来
    } else {
      url = type === '品牌'? 'brands/getbrands': 'category/goodscategory'
    }
    App._get(url, param, function(result) {
      console.log("获取品牌分类",result.data.list)
      typeof callback === 'function' && callback(result.data.list);
    })
  },
    //直接点击外面的分类品牌
  selectFilterTag(e) {
    console.log('直接点击了外面的')
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let _this = this
    if(index === this.data.filterTag_Index && this.data.filterTag_Index !== '') {
      this.setData({
        filterTag_Index: ''
      })
      return
    }
    if (index !== this.data.filterTag_Index || this.data.filterTag_Index === '') {
      this.setData({
        filterTag_Index: index
      })
      
      let list = _this.data.filterList[index]
      // console.log(list)
      console.log(_this.data.filterList, list)
      
      _this.setData({
        'filterCoverList.list': list
      })
    }
  },
  // 外层筛选
  outselTag(e) {
    console.log('外层筛选')
    let _this = this
    let index = e.currentTarget.dataset.index
    let name = this.data.filterCoverList.list[index].name
    let id = e.currentTarget.dataset.id
    let charIndex = this.data.filterCoverList.selectIndexArr.indexOf(name)
    let open = 'captionList['+_this.data.filterTag_Index+'].open'

    if(charIndex === -1) {
      if(_this.data.filterTag_Index === 0) {
        _this.setData({
          brandId: id,
          [open]: true
        })
      } else {
        _this.setData({
          categoryId: id,
          [open]: true
        })
      }
      this.data.filterCoverList.selectIndexArr = ['默认']
      this.data.filterCoverList.selectIndexArr.push(name)
      let arr = [];
      let obj = this.data.filterCoverList.list
      for (let i in obj) {
          arr.push(obj[i])
      }
      arr.map((item,index1)=>{
        if(this.data.filterTag_Index == "") {
          index1 += 1
        }
        if(index1 == index) {
          item.select = true
        }else {
          item.select = false
        }
      })
      this.data.filterCoverList.list = arr
      console.log('arr', arr)
      _this.setData({
        filterCoverList : _this.data.filterCoverList
      })
      _this.searchGoods()
      return
    }
    
    if (charIndex !== -1) {
      if(_this.data.filterTag_Index === 0) {
        _this.setData({
          brandId: '',
          [open]: false
        })
      } else {
       _this.setData({
          categoryId: '',
          [open]: false
       })
      }
      this.data.filterCoverList.selectIndexArr.splice(charIndex, 1)
      this.data.filterCoverList.list[index].select = false
      _this.setData({
        filterCoverList : _this.data.filterCoverList
      })
      _this.searchGoods()
      return
    }
  },
  // 筛选分类收起和展开
  openTitle(e) {
    let index = e.currentTarget.dataset.index
    console.log(index, this.data.captionList[index].open)
    let open = 'captionList['+index+'].open'
    this.setData({
      [open]: !this.data.captionList[index].open
    })
  },
  
  // 筛选侧边弹窗选择
  selTag(e) {
    
    let _this = this
    let index = e.currentTarget.dataset.index
    let num = e.currentTarget.dataset.num
    let id = e.currentTarget.dataset.id
    let name = this.data.captionList[index].arr[num].name
    let charIndex = this.data.captionList[index].selectIndexArr.indexOf(name)
    
    // console.log(id, index)
    switch (index) {
      case 0:
        if(_this.data.brandId) {
          _this.setData({
            brandId: ''
          })
        } else {
          _this.setData({
            brandId: id
          })
        }
        break;
      case 1:
        if(_this.data.categoryId) {
          _this.setData({
            categoryId: ''
          })
        } else {
          _this.setData({
            categoryId: id
          })
        }
        break;
      case 2:
        if(_this.data.promotionsType) {
          _this.setData({
            promotionsType: ''
          })
        } else {
          _this.setData({
            promotionsType: id
          })
        }
      default:
        break;
    }
    
    // console.log(_this.data.brandId, _this.data.categoryId, _this.data.promotionsType)
    _this.searchGoods()

// 之前的点击筛选
//     if(charIndex === -1) {
//       switch (index) {
//         case 0:
//           _this.data.brandId = id
//           break;
//         case 1:
//           _this.data.categoryId = id
//           break;
//         case 2:
//           _this.data.promotionsType = id
//         default:
//           break;
//       }
//       this.data.captionList[index].selectIndexArr = ['默认']
//       let arr = [];
//       let obj = this.data.captionList[index].arr
//       for (let i in obj) {
//           arr.push(obj[i])
//       }
//       arr.map((item,index1)=>{
//         if(index == 0) {
//           index1 += 1
//         }
//         if(index1 == num) {
//           item.select = true
//         }else {
//           item.select = false
//         }
//       })
//       this.data.captionList[index].arr = arr
//       this.data.captionList[index].selectIndexArr.push(name)
//       _this.setData({
//         captionList : _this.data.captionList
//       })
// 
//       _this.searchGoods()
// 
//       return
//     }
//     if (charIndex !== -1) {
//       switch (index) {
//         case 0:
//           _this.data.brandId = ""
//           break;
//         case 1:
//           _this.data.categoryId = ""
//           break;
//         case 2:
//           _this.data.promotionsType = ""
//         default:
//           break;
//       }
//       this.data.captionList[index].selectIndexArr.splice(charIndex, 1)
//       this.data.captionList[index].arr[num].select = false
//       _this.setData({
//         captionList : _this.data.captionList
//       })
//       
//       _this.searchGoods()
// 
//       return
//     }
  },

  // 外层重置
  outresetFilter() {
    let _this = this
    _this.setData({
      brandId: '',
      categoryId: ''
    })

    let arr = [];
    let obj = this.data.filterCoverList.list
    for (let i in obj) {
        arr.push(obj[i])
    }

    arr.map((item, index) => {
      item.select = false
    })
    this.data.filterCoverList.list = arr
    
    let captionList = _this.data.captionList
    captionList.map((item, index) => {
      item.open = false
    })
    this.setData({
      filterCoverList: this.data.filterCoverList,
      captionList: captionList
    })

    _this.searchGoods()

  },

  // 重置筛选
  resetFilter() {
    let _this = this
    _this.setData({
      brandId: '',
      categoryId: '',
      promotionsType: ''
    })
    let captionList = _this.data.captionList
    captionList.map((item, index) => {
      item.open = false
    })
    this.setData({
      captionList: captionList
    })

    _this.searchGoods()

  },

  // 获取所有标签分类
  getArticleLabelList() {
    let _this = this
    App._post_form('article/activitytags',{},function(result) {
      console.log("获取所有标签分类",result)
      _this.setData({
        shareTag: result.data.tags,
      })
    })
  },

  // 分享商城tab点击
  selectTab(e) {
    let _this = this
    this.setData({
      filterIndex: 0
    })
    let index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index
    })
    if(index === 0) {
      _this.getArticleList()
      _this.getArticleLabelList()
      _this.setData({
        scrollHeight: _this.data.scrollHeight + 50,
      })
      wx.setNavigationBarTitle({
        title: "文章列表"
      })
      return
    }
    if(index === 1) {
      this.setData({
        shareTag: ['综合', '销量', '上架', '价格', '筛选'],
        scrollHeight: this.data.scrollHeight - 50,
      })
      wx.setNavigationBarTitle({
        title: "商品列表"
      })
      this.searchGoods();
      return
    }
  },

  // 价格等分类点击
  selectFilter(e) {
    let index = e.currentTarget.dataset.index
    if(!this.data.filter_alert && index === 4) {
      this.setData({
        filter_alert: true
      })
    }
    if(this.data.tabIndex === 1) {
      let _this = this,
        newSortType = '',
        newSortPrice = true;
      switch (index) {
        case 0:
          newSortType = "all"
          break;
        case 1:
          newSortType = "sales"
          break;
        case 2:
          newSortType = "shelves"
          break;
        case 3:
          newSortType = "price"
          newSortPrice = this.data.sortPrice ? false : true
          break;
        
        default:
          break;
      }
      if(index !== 4) {
        this.setData({
          list: {},
          isLoading: true,
          page: 1,
          sortType: newSortType,
          sortPrice: newSortPrice
        }, function() {
          // 获取商品列表
          _this.searchGoods();
        });
      }else {
        // 获取所有分类列表
        // 促销
        App._post_form('goods/promotions',{},function(result) {
          console.log("获取促销列表",result)
          // result.data.promotions.forEach((item,index) => {
          //   item.select = false
          // });
          
          _this.setData({
            'captionList[0].arr': _this.data.filterList[0],
            'captionList[1].arr': _this.data.filterList[1],
            'captionList[2].arr': result.data.promotions
          })
          // let list = _this.data.captionList
          // list.forEach((item, index) => {
          //   item.open = false
          // })
          // _this.setData({
          //   captionList: list
          // })
        })
      }
    } else {
      let id = e.currentTarget.dataset.tagid
      this.getArticleList(id)
    }
    this.setData({
      filterIndex: index
    })
  },

  whiteClick() {
    this.setData({
      filterTag_Index: ''
    })
  },

  filterAlertFalse() {
    this.setData({
      filter_alert: false
    })
  },

  goShareDetail(e) {
    wx.navigateTo({
      url: '/pages/article/detail/index?article_id=' + e.currentTarget.dataset.id
    });
  },

  /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList: function(isPage, page) {
    let _this = this;

    App._get('goods/lists', {
      page: page || 1,
      sortType: this.data.sortType,
      sortPrice: this.data.sortPrice ? 1 : 0,
      category_id: this.data.option.category_id || 0,
      search: this.data.option.search || '',
    }, function(result) {
      let resList = result.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 170,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function(e) {
    let _this = this,
      newSortType = e.currentTarget.dataset.type,
      newSortPrice = newSortType === 'price' ? 'true' : 'false';

    this.setData({
      list: {},
      isLoading: true,
      page: 1,
      sortType: newSortType,
      sortPrice: newSortPrice
    }, function() {
      // 获取商品列表
      _this.searchGoods();
    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState: function() {
    let _this = this;
    // _this.setData({
    //   showView: !_this.data.showView,
    //   arrange: _this.data.arrange ? "" : "arrange"
    // });
    if(_this.data.style === 0) {
      _this.setData({
        style: 1
      });
      return
    }
    _this.setData({
      style: 0
    });
    
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function() {
    // 已经是最后一页
    if(this.data.tabIndex === 1) {
      if (this.data.page >= this.data.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      }
      // 加载下一页列表
      this.searchGoods(true, ++this.data.page);
    }
    
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + App.getShareUrlParams()
    };
  },

  //点赞
  clickZan(e) {
    let index = e.currentTarget.dataset.index
    let url = ""
    let _this = this
    let articleData = this.data.shareList[index]
    if(articleData.islike == "yes") {
      url = 'article/unLike'
    }else {
      url = 'article/like'
    }
    let param = {
      article_id: articleData.article_id
    }
    App._get(url,param,function(result) {
      articleData.islike = articleData.islike == "yes" ? 'no' : 'yes'
      articleData.like_count = articleData.islike == "yes" ? articleData.like_count + 1 : articleData.like_count - 1
      _this.setData({
        shareList: _this.data.shareList
      })
    })
  },

  /**
   * 商品搜索
   */
  triggerSearch: function() {
    let pages = getCurrentPages();
    // 判断来源页面
    if (pages.length > 1 &&
      pages[pages.length - 2].route === 'pages/search/index') {
      wx.navigateBack();
      return;
    }
    // 跳转到商品搜索
    wx.navigateTo({
      url: '../search/index',
    })
  },

});