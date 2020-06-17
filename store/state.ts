export default {
  counter: 2,
  isPhone: false,
  locales: ['en', 'fr', 'cn'],
  locale: sessionStorage.lang || 'cn',
  cSize: 'small',   // 组件大小
  isCollapse: false,  // 菜单栏是否收缩
  username: '',
  productPlatformSelect: [],  // 产品平台选择
  adtypesSelect: [],  // 产品类型


  dealersPorductList: [],  // 经销商星卡产品列表接口
  merchantProductList: [],  // 经销商产品列表
  orderStatusList: [], // 订单状态列表
  shippingList: [],  // 快递公司列表

}
