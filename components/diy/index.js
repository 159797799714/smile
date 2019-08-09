Component({

  options: {

  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    diyItems: Object,
    scrollTopDist: String
  },
  methods: {
    onParentEvent: function (event) {
      // 自定义组件触发事件时提供的detail对象，用来获取子组件传递来的数据
      var id = event.detail;
      console.log('子组件传递来的数据 id:', id);
      // 其他操作...
      // 传值给page的index这个父组件
      this.triggerEvent('indexParentEvent', id)
    }  
  }
  

})