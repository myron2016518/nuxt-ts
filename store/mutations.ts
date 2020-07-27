export function INCREMENT(state: { counter: number }) {
  state.counter++
}

export function PCORPHONE(state: { isPhone: any }, bool: any) {
  state.isPhone = bool
}


export function SET_LANG(state: { locales: string | any[]; locale: any }, locale: any) {
  if (state.locales.includes(locale)) {
    state.locale = locale
    sessionStorage.lang = locale
  }
}

export function SET_COLLAPSE(state: { isCollapse: any }, bool: any) {
  state.isCollapse = bool
}
export function SET_USERNAME(state: { username: any }, name: any) {
  state.username = name
}
export function SET_PPSELECT(state: { productPlatformSelect: any }, porlist: any) {
  state.productPlatformSelect = porlist
}
export function SET_SNPPSELECT(state: { snppSelect: any }, porlist: any) {
  state.snppSelect = porlist
}
export function SET_ADTYPESELECT(state: { adtypesSelect: any }, porlist: any) {
  state.adtypesSelect = porlist
}
export function SET_DEVICESELECT(state: { deviceSelect: any }, porlist: any) {
  state.deviceSelect = porlist
}
export function SET_PRICEPRODUCTSELECT(state: { priceProductSelect: any }, porlist: any) {
  state.priceProductSelect = porlist
}
export function SET_MERCHANTSELECT(state: { merchantSelect: any }, porlist: any) {
  state.merchantSelect = porlist
}
export function SET_DIAGPRODUCTLIST(state: { diagProductList: any }, porlist: any) {
  state.diagProductList = porlist
}




export function SET_DEALERSPORDUCTLIST(state: { dealersPorductList: any }, porlist: any) {
  state.dealersPorductList = porlist
}
export function SET_MERCHANTPL(state: { merchantProductList: any }, porlist: any) {
  state.merchantProductList = porlist
}
export function SET_ORDERSTATUSLIST(state: { orderStatusList: any }, porlist: any) {
  state.orderStatusList = porlist
}
export function SET_SHIPPINGLIST(state: { shippingList: any }, porlist: any) {
  state.shippingList = porlist
}
