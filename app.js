/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
const tabBarLinks = [
  'pages/index/index',
  'pages/shopping-mall/index',
  'pages/flow/index',
  'pages/user/index'
];

// 工具类
const util = require('./utils/util.js');
// 需要登录的url列表
const apiNeedLogin= require('./utils/apiNeedLogin.js');

App({

  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
  },

  // api地址
  api_root: '',
  siteInfo: require('./utils/api.js'),
  
  // 调用登录的次数
  count: 0,
  
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function(e) {
    // 设置api地址
    this.setApiRoot();
    // 小程序主动更新
    this.updateManager();
    // 小程序启动场景
    this.onStartupScene(e.query)
  },

  /**
   * 小程序启动场景
   */
  onStartupScene: function(query) {
    
    // 获取场景值
    let scene = this.getSceneData(query);
    // 记录推荐人id
    let refereeId = query.referee_id ? query.referee_id : scene.uid;
    refereeId > 0 && (this.saveRefereeId(refereeId));
  },

  /**
   * 记录推荐人id
   */
  saveRefereeId: function(refereeId) {
    if (!wx.getStorageSync('referee_id'))
      wx.setStorageSync('referee_id', refereeId);
  },

  /**
   * 获取场景值(scene)
   */
  getSceneData: function(query) {
    return query.scene ? util.scene_decode(query.scene) : {};
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    // 获取小程序基础信息
    this.getWxappBase();
  },

  /**
   * 设置api地址
   */
  setApiRoot: function() {
    this.api_root = this.siteInfo.siteroot;
  },

  /**
   * 获取小程序基础信息
   */
  getWxappBase: function(callback) {
    let App = this;
    App._get('wxapp/base', {}, function(result) {
      // 记录小程序基础信息
      wx.setStorageSync('wxapp', result.data.wxapp);
      callback && callback(result.data.wxapp);
    });
  },

  /**
   * 执行用户登录
   */
  doLogin: function() {
    // 保存当前页面
    this.count = this.count + 1
    console.log(this.count)
    let pages = getCurrentPages();
    console.log('dologin函数', pages.length)
    // if (pages.length) {
    //   let currentPage = pages[pages.length - 1];
    //   "pages/login/login" != currentPage.route &&
    //     wx.setStorageSync("currentPage", currentPage);
    // }
    // if(this.count < 2) {
      console.log('进来了', this.count)
      // 跳转授权页面
      wx.navigateTo({
        url: "/pages/login/login"
      });  
    // }
    // setTimeout(function() {
    //   this.count = 0
    // }, 500)
  },

  /**
   * 当前用户id
   */
  getUserId: function() {
    return wx.getStorageSync('user_id');
  },

  /**
   * 显示成功提示框
   */
  showSuccess: function(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success: function() {
        callback && (setTimeout(function() {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError: function(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success: function(res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },
  
  getSystemInfo: function(obj) {
    wx.getSystemInfo({
      success: function (res) {
        // 屏幕宽度、高度
        console.log('设备信息', res.statusBarHeight)
        obj.cb(res.statusBarHeight) 
      }
   })
  },
  
  detectUrl(url) {
    return apiNeedLogin.indexOf(url)
  },
  
  /**
   * get请求
   */
  _get: function(url, data, success, fail, complete, check_login) {
    
    let App = this,
      isLogin= this.detectUrl(url) === -1,  // 等于-1时不需要登录
      token= wx.getStorageSync('token'),
      isDefault= token ? token === '6d96b9408fe75c9da42fd4d1b9582993': true;  // 是否是默认账号
    // 构造请求参数
    data = data || {};
    if(!isLogin && isDefault) {
      console.log('get进来了else, ')
      App.doLogin();
    } else {
      console.log('get 进来了else')
      
      wx.showNavigationBarLoading();
      data.wxapp_id = App.siteInfo.uniacid;
      data.token = token? token: '6d96b9408fe75c9da42fd4d1b9582993'
      // 构造get请求
      let request = function() {
        wx.request({
          url: App.api_root + url,
          header: {
            'content-type': 'application/json'
          },
          data: data,
          success: function(res) {
            if (res.statusCode !== 200 || typeof res.data !== 'object') {
              console.log(res);
              App.showError('网络请求出错');
              return false;
            }
            if (res.data.code === -1) {
              // 登录态失效, 重新登录
              wx.hideNavigationBarLoading();
              App.doLogin();
            } else if (res.data.code === 0) {
              App.showError(res.data.msg, function() {
                fail && fail(res);
              });
              return false;
            } else {
              success && success(res.data);
            }
          },
          fail: function(res) {
            App.showError(res.errMsg, function() {
              fail && fail(res);
            });
          },
          complete: function(res) {
            wx.hideNavigationBarLoading();
            // setTimeout(function () {
            //   wx.hideLoading()
            // }, 500)
            complete && complete(res);
          },
        });
      };
      // 判断是否需要验证登录
      check_login ? App.doLogin(request) : request();
    }
    
  },

  /**
   * post提交
   */
  _post_form: function(url, data, success, fail, complete, isShowNavBarLoading) {
    let App = this,
      isLogin= this.detectUrl(url) === -1,  // 等于-1时不需要登录
      token= wx.getStorageSync('token'),
      isDefault= token ? token === '6d96b9408fe75c9da42fd4d1b9582993': true;  // 是否是默认账号
    // 构造请求参数
    data = data || {};
    if(!isLogin && isDefault) {
      console.log('post的if')
      App.doLogin();
    } else {
      console.log('post的else')
      isShowNavBarLoading || true;
      data.wxapp_id = App.siteInfo.uniacid;
      data.token = wx.getStorageSync('token');
      
      // 在当前页面显示导航条加载动画
      if (isShowNavBarLoading == true) {
        wx.showNavigationBarLoading();
      }
      wx.request({
        url: App.api_root + url,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        data: data,
        success: function(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            App.showError('网络请求出错');
            return false;
          }
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            wx.hideNavigationBarLoading();
            App.doLogin();
            return false;
          } else if (res.data.code === 0) {
            App.showError(res.data.msg, function() {
              fail && fail(res);
            });
            return false;
          }
          success && success(res.data);
        },
        fail: function(res) {
          // console.log(res);
          App.showError(res.errMsg, function() {
            fail && fail(res);
          });
        },
        complete: function(res) {
          wx.hideNavigationBarLoading();
          // setTimeout(function () {
          //   wx.hideLoading()
          // }, 500)
          complete && complete(res);
        }
      });
    }
    
    
  },

  /**
   * 验证是否存在user_info
   */
  validateUserInfo: function() {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 小程序主动更新
   */
  updateManager: function() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },

  /**
   * 获取tabBar页面路径列表
   */
  getTabBarLinks: function() {
    return tabBarLinks;
  },

  /**
   * 跳转到指定页面
   * 支持tabBar页面
   */
  navigationTo: function(url) {
    if (!url || url.length == 0) {
      return false;
    }
    let tabBarLinks = this.getTabBarLinks();
    // tabBar页面
    if (tabBarLinks.indexOf(url) > -1) {
      wx.switchTab({
        url: '/' + url
      });
    } else {
      // 普通页面
      wx.navigateTo({
        url: '/' + url
      });
    }
  },

  /**
   * 记录formId
   */
  saveFormId: function(formId) {
    let App = this;
    console.log('saveFormId');
    if (formId === 'the formId is a mock one') {
      return false;
    }
    App._post_form('wxapp.formId/save', {
      formId: formId
    }, null, null, null, false);
  },

  /**
   * 生成转发的url参数
   */
  getShareUrlParams(params) {
    let app = this;
    return util.urlEncode(Object.assign({
      referee_id: app.getUserId()
    }, params));
  },
  
  getSystemInfo(f) {
    wx.getSystemInfo({
      success: function(res) {
        f.cb(res);
      }
    });
  },
  goBack(num) {
    wx.navigateBack({
      delta: num
    })
  }

});


//动态获取导航栏高度
// wx.getSystemInfo({
//     success: function (res) {
//       // this.globalData.statusBarHeight = res.statusBarHeight
//       console.log(res.statusBarHeight, 'statusBarHeight');
//     }
//      
// })