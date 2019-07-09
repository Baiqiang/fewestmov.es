export const state = () => ({
  locales: [
    {
      code: 'zh-CN',
      name: '简体中文',
    },
    {
      code: 'en',
      name: 'English',
    },
  ],
  locale: 'en',
})

export const actions = {
  async nuxtServerInit(state, { app, req, store }) {
    if (req.user) {
      app.$auth.setUser(req.user.profile)
    }
    const locale = app.$cookies.get('locale')
    if (locale) {
      store.commit('SET_LANG', locale)
      app.i18n.locale = locale
    }
  }
}

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.find(l => l.code === locale)) {
      state.locale = locale
    }
  }
}
