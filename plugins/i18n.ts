import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default (par: { app: any, store: any }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  par.app.i18n = new VueI18n({
    locale: par.store.state.locale,
    fallbackLocale: sessionStorage.lang || 'cn',
    messages: {
      en: require('~/locales/en.json'),
      cn: require('~/locales/cn.json'),
      // fr: require('~/locales/fr.json')
    }
  })

  par.app.i18n.path = (link: any) => {
    if (par.app.i18n.locale === par.app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${par.app.i18n.locale}/${link}`
  }
}
