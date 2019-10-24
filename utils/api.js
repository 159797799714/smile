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
  umiArticleArticlesbysearch: 'umi.article/articlesbysearch', // 优迷文章搜索
  
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
  
  // 普通商品
  goodDetail: 'goods/detail',                          // 普通商品详情
  cartListnew: 'cart/listsnew',                        // 加入购物车
  orderBuyNowinventory: 'order/buyNowinventory',       // 检测库存/ 限时购 / 普通商品/ 秒杀商品
  orderBuynow: 'order/buyNow',                         // 生成订单/确认订单付款/ 普通商品/ 限时购商品 / 秒杀
  
  // 限时购
  flashsaleCategorys: 'flashsale/categorys',           // 限时购分类
  flashsaleGoodsbycategoryid: 'flashsale/goodsbycategoryid', // 活动下商品列表
  flashsaleDetail: 'flashsale/detail',                 // 限时购商品详情
  flashsaleRemind: 'flashsale/remind',                 // 限时购提醒
  flashsaleCancelremind: 'flashsale/cancelremind',     // 限时购取消提醒
  
  // 秒杀
  seckillCategorys: 'seckill/categorys',               // 秒杀活动
  seckillGoodsbycategoryid: 'seckill/goodsbycategoryid',// 秒杀活动下商品列表
  seckillDetail: 'seckill/detail',                     // 秒杀商品详情
  seckillRemind: 'seckill/remind',                     // 秒杀提醒
  seckillCancelremind: 'seckill/cancelremind',         // 秒杀取消提醒
  
  // 拼团
  sharingCategoryList: 'sharing.index/index',          // 拼团首页分类列表
  sharingGoodslists: 'sharing.goods/lists',            // 拼团分类商品列表
  sharingGoodsdetail: 'sharing.goods/detail',          // 拼团商品详情
  sharingSettingGetAll: 'sharing.setting/getAll',      // 拼团规则设置
  sharingOrderBuyNowinventory: 'sharing.order/buyNowinventory', // 拼团检测库存
  sharingOrderCheckout: 'sharing.order/checkout',      // 拼团确认订单/获取订单详情
  sharingCommentListsnew: 'sharing.comment/listsnew',  // 拼团商品评论列表----------全部----最新-----有图
  sharingCommentDetail: 'sharing.comment/detail',      // 拼团商品评论详情
  sharingCommentReplylike: 'sharing.comment/replylike',// 拼团商品评论回复点赞
  sharingCommentReplyunLike: 'sharing.comment/replyunLike',// 拼团商品评论回复取消点赞
  sharingCommentUnlike: 'sharing.comment/unlike',      // 拼团商品评论取消点赞
  sharingCommentLike: 'sharing.comment/like',          // 拼团商品评论点赞
  sharingCommentReplyToReplyLike: 'sharing.comment/replyToReplyLike',   // 拼团商品评论回复—-对回复内容再回复---点赞
  sharingCommentReplyToReplyunLike: 'sharing.comment/replyToReplyunLike', // 拼团商品评论回复—-对回复内容再回复---取消点赞
  sharingCommentReplyToReply: 'sharing.comment/replyToReply',             // 拼团商品评论回复---对回复内容再回复
  
  // 拼团订单
  userOrderGoodsExpress: 'user.order/goodsExpress',          // 查看物流   
  
  // 零元抽奖
  luckydrawCategorys: 'luckydraw/categorys',                 // 零元抽奖分类列表
  luckydrawGoodsbycategoryid: 'luckydraw/goodsbycategoryid', // 零元抽奖活动下商品列表
  luckydrawDetail: 'luckydraw/detail',                       // 零元抽奖商品详情
  luckydrawRemind: 'luckydraw/remind',                       // 参与抽奖
  luckydrawLuckydrawwinsing: 'luckydraw/luckydrawwinsing',   // 往期中奖纪录
  luckydrawWinConfirm: 'luckydraw/winConfirm',               // 中奖提交确认
  luckydrawLuckydrawshare: 'luckydraw/luckydrawshare',       // 抽奖分享回调
  luckydrawMyLuckdraw: 'luckydraw/myLuckdraw',               // 我参与的0元抽奖
  
  // 购物车
  cartListsnew: 'cart/listsnew',                             // 购物车列表
  orderCart: 'order/cart',                                   // 购物车结算购买---使用优惠券--红包--订单总价动态变化
  
  // 普通订单
  userOrderDelete: 'user.order/delete',                      // 删除订单
  userOrderExpress: 'user.order/express',                    // 查看订单物流信息
  orderBuyNow: 'order/buyNow',                               // 单品直接购买---使用优惠券--红包--订单总价动态变化
  userOrderGoodsExpress: 'user.order/goodsExpress',          // 查看单个商品物流信息-新
  
  // 品牌专题
  theme_categoryBrandsThemeInfo: 'theme_category/brandsThemeInfo',   // 品牌专题
  // 用户中心
  userIndexWxCenter: 'user.index/wxCenter',            // 我的首页
  appCenterMyViews: 'app.center/myViews',               // 最近浏览
  appCenterGetuserinfo: 'app.center/getuserinfo',       // 获取用户个人信息
  appCenterModifypersonalinfo: 'app.center/modifypersonalinfo',// 修改个人用户信息
  appCenterMycollection: 'app.center/mycollection',     // 我的收藏
  appCenterMylikearticles: 'app.center/mylikearticles', // 个人中心我点赞的文章列表
  appCenterModifyWxUserInfo: 'app.center/modifyWxUserInfo', // 修改个性签名
  
  // 领券中心
  couponCouponCenter: 'coupon/couponCenter',            // 领券中心
  couponGethomebanners: 'coupon/gethomebanners',        // 领券中心轮播图
  
  // 我的粉丝
  userIndexMyFansList: 'user.index/myFansList',         // 我的粉丝列表
  userIndexUnFocus: 'user.index/unFocus',               // 我的粉丝取消关注
  userIndexFocusOn: 'user.index/focusOn',               // 优迷用户关注
  userIndexFansHomePage: 'user.index/fansHomePage',     // 粉丝个人主页
  
  // 我的关注
  userIndexMyFocusList: 'user.index/myFocusList',       // 我的关注列表
  userIndexUnFocus: 'user.index/unFocus',               // 我的关注列表取消关注
  
  // 协议
  agreementCategoryList: 'agreement_category/list',     // 所有协议分类
  agreementCategoryGetContentById: 'agreement_category/getContentById', // 通过协议分类ID获取协议内容
  agreementCategoryGetContentByName: 'agreement_category/getContentByName', // 通过协议名字搜索
  
  // 优惠券
  userCouponLists: 'user.coupon/lists',                 // 我的优惠券
  userCouponReceive: 'user.coupon/receive',             // 领取优惠券
  userCouponBanners: 'user.coupon/banners',             // 我的优惠券-广告图
  // 红包
  redenvelopeLists: 'redenvelope/lists',                // 新人注册-红包列表
  userRedenvelopeReceive: 'user.redenvelope/receive',   // 领取红包
  userRedenvelopeLists: 'user.redenvelope/lists',       // 我的红包（未使用--已使用--已过期）
  
  appCenterIntegralLogs: 'app.center/integralLogs',   // 积分明细
  
  
  
  
  
  
  
  
  
};