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
  async nuxtServerInit(state, { app, req, res, store, error }) {
    if (req.user) {
      const user = {
        ...req.user.dataValues
      }
      user.isAdmin = await req.user.hasRole('admin')
      user.roles = req.user.roles
      app.$auth.setUser(user)
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
