const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      article_title: '',
      article_content: '',
      category_id: '',
      tags: '',
      address: '',
      address_latitude: '',
      address_longitude: '',
      uploaded: []
    },
    imgList: [],    // 已经选中上传成功的图片
    topicList: [],  // 活动分类
    index: 0,       // 选择器,
    url: 'umi.article/release', // 发表文章接口地址地址
  },
  
  submitDisable: false,
  onLoad(opt) {
    if(opt.activity_id) {
      this.setData({
        'formData.category_id': opt.activity_id,
        'formData.tags': opt.name
      })
    }
    console.log(this.data.formData.category_id)
    // 获取活动分类列表
    this.getTopicList()
  },
  // 获取活动分类列表
  getTopicList() {
    let _this= this;
    App._get('umi.category/allList', {}, function(res) {
      console.log(res.data.list)
      _this.setData({
        topicList: res.data.list
      })
    })
  },
   
  // 选择活动分类
  bindPickerChange: function(e) {
    let topicList= this.data.topicList,
      index= e.detail.value;
    console.log('picker发送选择改变，携带值为', topicList[index].category_id)
    
    this.setData({
      index: index,
      'formData.category_id': topicList[index].category_id,
      'formData.tags':  topicList[index].name
    })
  },
  // 选择地址
  chooseAddress() {
    let _this= this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res.address? res.address + res.name: '未选择具体位置')
        _this.setData({
          'formData.address': res.address? res.address + res.name: '未选择具体位置名称',
          'formData.address_latitude': res.latitude,
          'formData.address_longitude': res.longitude
        })
      }
    })
  },
  
  // 选择图片
  chooseImage: function() {
    let _this = this,
      imgList = _this.data.imgList,
      uploaded = _this.data.formData.uploaded;
    
    if(imgList.length >= 8) {
      App.showError('最多只能上传8张图片哦')
      return
    } else {
      // 选择图片
      wx.chooseImage({
        count: 8 - imgList.length,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 图片上传
          // POST 参数
          let params = {
            wxapp_id: App.siteInfo.uniacid,
            token: wx.getStorageSync('token')
          };
          let i = 0,
            patharr= [],
            idarr= [];
          const tempFilePaths = res.tempFilePaths
          tempFilePaths.map(function(filePath, fileIndex) {
            wx.uploadFile({
              url: App.api_root + 'upload/image',
              filePath: filePath,
              name: 'iFile',
              formData: params,
              success: function(res) {
                
                let data = JSON.parse(res.data).data
                patharr.push(data.file_path)
                idarr.push(data.file_id)
                _this.setData({
                  imgList: imgList.concat(patharr),
                  'formData.uploaded': uploaded.concat(idarr)
                });
              },
              fail() {
                App.showError('上传图片失败')
              },
              complete: function() {
                i++;
                if (tempFilePaths.length === i) {
                  // 所有文件上传完成
                  console.log('upload complete');
                }
              }
            })
            
          })
        },
        
      });
    }
  },
  /**
   * 删除图片
   */
  deleteImage: function(e) {
    console.log(e)
    let dataset = e.currentTarget.dataset,
      imgList = this.data.imgList,
      uploaded= this.data.formData.uploaded;
      imgList.splice(dataset.index, 1);
      uploaded.splice(dataset.index, 1)
    this.setData({
      imgList: imgList,
      'formData.uploaded': uploaded
    });
    console.log(imgList, uploaded)
  },
  
  
  /**
   * 表单提交
   */
  submit: function() {
    let _this = this,
      formData = _this.data.formData;

    // 判断是否重复提交
    if (_this.submitDisable === true) {
      return false;
    }
    
    console.log(formData);
    
    // 标题，内容，图片不能为空
    if(!formData.article_title) {
      App.showError('标题不能为空')
      return
    } else if(!formData.article_content) {
      App.showError('内容不能为空')
      return
    } else if(formData.uploaded.length < 1) {
      App.showError('请选择图片')
      return
    }
    wx.showLoading({
      title: '正在发布...',
      mask: true
    });
    
    // 表单提交按钮设为禁用 (防止重复提交)
    // _this.submitDisable = true;
    
    App._post_form(_this.data.url, {
        formData: JSON.stringify(formData)
      }, function(result) {
          if (result.code === 1) {
            App.showSuccess(result.msg, function() {
              wx.navigateBack({
                delta: 1
              })
            });
          } else {
            App.showError(result.msg);
          }
        },
        false,
        function() {
          wx.hideLoading();
          _this.submitDisable = false;
        });
  },
  
  // 标题
  bindTitleInput(e) {
    this.setData({
      'formData.article_title': e.detail.value
    })
  },
  // 内容
  bindContentInput(e) {
    this.setData({
      'formData.article_content': e.detail.value
    })
  },
  // 话题
  bindTopicInput(e) {
    this.setData({
      'formData.tags': e.detail.value
    })
  }

})