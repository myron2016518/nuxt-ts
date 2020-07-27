import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

export default () => {
  // Vue.use(Element, { locale })
  Vue.use(Element, { 'en': locale, 'zh-cn': zhLocale })

}
