export default {
  counter: 2,
  isPhone: false,
  locales: ['en', 'fr', 'cn'],
  locale: sessionStorage.lang || 'cn',
  cSize: 'small',   // 组件大小
  isCollapse: false,  // 菜单栏是否收缩
  username: '',
  productPlatformSelect: [],  // 产品平台选择
  snppSelect: [],  // sn产品平台选择
  adtypesSelect: [],  // 产品类型
  deviceSelect: [],  // 推送消息渠道列表
  priceProductSelect: [], // 定价列表-产品列表 选择
  merchantSelect: [], // 定价列表-经销商 选择
  diagProductList: [], // 定价列表-软件列表 所有 选择


  dealersPorductList: [],  // 经销商星卡产品列表接口
  merchantProductList: [],  // 经销商产品列表
  orderStatusList: [], // 订单状态列表
  shippingList: [],  // 快递公司列表

  country: 'foreign', // 国外 foreign （默认）， 国内 inland

  productList: [   // 官网产品列表
    { 'id': '1', 'name': 'THINKCAR 1S' },
    { 'id': '3', 'name': 'THINKDIAG' },
    { 'id': '4', 'name': 'THINKOBD 100' },
    { 'id': '5', 'name': 'THINKTOOL' },
    { 'id': '6', 'name': 'THINKPLUS' },
    { 'id': '7', 'name': 'THINKDIAG Extension Cable' },
    { 'id': '8', 'name': 'ThinkDriver' },
    { 'id': '11', 'name': 'THINKSCAN Series' },
  ],
}
