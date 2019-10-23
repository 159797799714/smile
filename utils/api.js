let baseUrl= 'https://market.pd-unixe.com/index.php?s=/api/'
module.exports = {
  name: "smilehome商城",
  siteroot: baseUrl, // 必填: api地址
  // siteroot: "http://192.168.31.141/code/api/web/", // 必填: api地址
  uniacid: "10001", // 此处为商城ID, 可在超管后台-商城列表中查看
  
  uploadImage: 'upload/image',                         // 图片上传
  
  // 首页
  articleHomeBanner: 'article/gethomebanners',         // 首页轮播图
  articleCategory: 'article/categorylist',             // 首页tab列表
  articlesbycategoryid: 'article/articlesbycategoryid',// 首页通过文章列表
  articleDetailing: 'article/detailing',               // 首页文章详情
  articleCommentunlike: 'article/commentunlike',       // 首页文章详情评论取消点赞
  articleCommentunlike: 'article/commentunlike',       // 首页文章详情评论点赞
  articleLike: 'article/like',                         // 首页文章详情点赞
  articleunLike: 'article/unLike',                     // 首页文章详情取消点赞
  articleUncollection: 'article/unCollection',         // 首页文章详情取消收藏
  articleUncollection: 'article/collection',           // 首页文章详情收藏
  articleAddcomments: 'article/addcomments',           // 首页文章评论
  
  // 优迷
  umiHomebanner: 'umi.homebanner/gethomebanners',      // 优迷首页轮播图
  umiArticleList: 'umi.article/list',                  // 优迷首页文章列表
  umiArticleFocusList: 'umi.article/focusList',        // 优迷首页关注列表
  umiCategoryList: 'umi.category/list',                // 优迷首页活动列表
  umiCategoryAllList: 'umi.category/allList',          // 优迷发布所有活动标签列表
  umiArticleRelease: 'umi.article/release',            // 优迷文章发布
  umiArticleLike: 'umi.article/like',                  // 优迷文章点赞
  umiArticleUnlike: 'umi.article/unLike',              // 优迷文章取消点赞
  umiArticleDetail: 'umi.article/detail',              // 优迷文章详情
  umiArticleDelete: 'umi.article/delete',              // 优迷文章删除
  umiArticleCollection: 'umi.article/collection',      // 优迷文章收藏
  umiArticleUncollection: 'umi.article/unCollection',  // 优迷文章取消收藏
  umiArticleAddcomments: 'umi.article/addcomments',    // 优迷文章评论
  umiArticleCommentLike: 'umi.article/commentlike',    // 优迷文章评论点赞
  umiArticleUnlike: 'umi.article/commentunlike',       // 优迷文章评论取消点赞
  umiArticleCommentreply: 'umi.article/commentreply',  // 优迷文章评论回复评论
  umiArticleReplyLike: 'umi.article/commentreplylike', // 优迷文章评论回复点赞
  umiArticleReplyUnlike: 'umi.article/commentreplyunlike', // 优迷文章评论回复取消点赞
  
  umiUserUnfocus: 'user.index/unFocus',                // 优迷用户取消关注
  umiUserFocuson: 'user.index/focusOn',                // 优迷用户关注
  umiUserFansHomePage: 'user.index/fansHomePage',      // 优迷用户主页信息
  
  // 商城
  flashOne: 'flashsale/getflashsalegoodsbyone',        // 商城首页一个限时购商品
  seckillOne: 'seckill/getseckillgoodsbyone',          // 一个拼团和秒杀商品
  luckdrawOne: 'luckydraw/getluckydrawgoodsbyone',     // 一个0元抽奖商品
  categoryList: 'category/goodscategorynew',           // 商城首页一级分类列表
  indexRecommendgoods: 'goods/recommendgoods',         // 商城首页推荐商品
  shopBanners: 'goods/gethomebanners',                 // 商城首页轮播图
  
  // 商品列表页
  goodLists: 'goods/goodlists',                        // 商品列表页搜索商品列表
  getBrands: 'brands/getbrands',                       // 品牌列表
  goodscategory: 'category/goodscategory',             // 商品分类列表
  
  articleBysearch: 'article/articlesbysearch',         // 搜索文章列表
  articleActivitytags: 'article/activitytags',         // 商品列表文章活动列表
  
  // 商品详情
  goodDetail: 'goods/detail',                          // 普通商品详情
  cartListnew: 'cart/listsnew',                        // 加入购物车
  orderBuyNowinventory: 'order/buyNowinventory',       // 检测库存
  orderBuynow: 'order/buyNow',                         // 生成订单/确认订单付款
  
  // 限时购
  
  
  
};