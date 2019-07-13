export default function ({ isHMR, app, store, req }) {
  if (isHMR) {
    return
  }

  if (req) {
    let locale = app.$cookies.get('locale')
    if (!locale) {
      for (const language of (req.headers['accept-language'] || '').split(',')) {
        const _locale = language.split(';')[0]
        if (store.state.locales.find(l => l.code === _locale)) {
          locale = _locale
          break
        }
      }
    }
    if (locale) {
      store.commit('SET_LANG', locale)
      app.i18n.locale = store.state.locale
    }
  }
}
