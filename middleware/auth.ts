export default function (context: { route: { path: string; }; redirect: (arg0: string) => void; req: { headers: { [x: string]: any; }; }; userAgent: any; }) {
  // console.log("=======in====", context);
  // context.router.push('/signin')
  if (!sessionStorage.userToken && context.route.path !== "/signin") {
    context.redirect('/signin')
  }
  if (process.server && !context.req) return
  context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent
}


// export default function ({ userAgent, req, isHMR, app, store, route, params, error, redirect }) {
//   const defaultLocale = app.i18n.fallbackLocale
//   // If middleware is called from hot module replacement, ignore it
//   if (process.server && !req) return
//   userAgent = process.server ? req.headers['user-agent'] : navigator.userAgent
//   // if (isHMR) { return }
//   // Get locale from params
//   // const locale = params.lang || defaultLocale
//   const locale = store.state.locale
//   if (!store.state.locales.includes(locale)) {
//     return error({ message: 'This page could not be found.', statusCode: 404 })
//   }
//   // Set locale
//   store.commit('SET_LANG', locale)
//   app.i18n.locale = store.state.locale
//   console.log('===locale1===', locale, defaultLocale, route.fullPath);
//   // If route is /<defaultLocale>/... -> redirect to /...
//   if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
//     const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
//     const re = new RegExp(toReplace)
//     console.log('===locale===', locale);
//     console.log('===route.fullPath===', route.fullPath);
//     return redirect(
//       route.fullPath.replace(re, '/')
//     )
//   }
// }