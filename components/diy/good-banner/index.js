const App = getApp();

Component({
  externalClasses: ['good-banner'],
  options: {

  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    play_icon: {
      type: String,
      value: 'block'
    },
    videoUrl: String,
    bgUrl: String,
    
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    duration: 1500, // 滑动动画时长

    imgHeights: [], // 图片的高度
    imgCurrent: 0, // 当前banne所在滑块指针
  },
  onReady() {
    this.videoCtx = wx.createVideoContext('myVideo')  //根据id绑定
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    videoPlay() {
      console.log(this)
      this.triggerEvent('videoPlay', 'none')
    }
  }

})