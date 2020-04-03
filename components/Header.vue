<template>
  <b-navbar toggleable="md" class="" sticky type="dark" variant="dark" tag="header" id="header">
    <b-navbar-brand to="/">
      <img src="~/assets/logo_color.svg" class="logo" alt="logo">
      <img src="~/assets/text_light.svg" class="logo-text" alt="Fewest Moves">
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/if" :active="$route.name && $route.name.slice(0, 2) === 'if'">{{ $t('if.title') }}</b-nav-item>
        <b-nav-item to="/sf" :active="$route.name && $route.name.slice(0, 2) === 'sf'">{{ $t('sf.title') }}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown :text="currentLanguage" right class="align-self-md-center">
          <b-dropdown-item v-for="{ code, name } in $store.state.locales" :key="code" @click="switchLocale(code)">{{ name }}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item to="/login" v-if="!$auth.loggedIn">{{ $t('header.login') }}</b-nav-item>
        <b-nav-item-dropdown right no-caret v-if="$auth.loggedIn">
          <template slot="button-content">
            <b-img class="avatar" fluid :src="$auth.user.avatarThumb" :alt="$auth.user.name"></b-img>
          </template>
          <template v-if="$auth.user.isAdmin">
            <b-dropdown-group :header="$t('admin.title')">
              <b-dropdown-item to="/admin/user" v-if="$auth.user.isAdmin">{{ $t('admin.user.title') }}</b-dropdown-item>
              <b-dropdown-item to="/admin/if" v-if="$auth.user.isAdmin">{{ $t('admin.if.title') }}</b-dropdown-item>
            </b-dropdown-group>
            <b-dropdown-divider></b-dropdown-divider>
          </template>
          <b-dropdown-item to="/user/if" >{{ $t('user.if') }}</b-dropdown-item>
          <b-dropdown-item to="/logout" >{{ $t('header.logout') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {

    }
  },
  computed: {
    currentLanguage() {
      return this.$store.state.locales.find(l => l.code === this.$store.state.locale).name
    }
  },
  methods: {
    switchLocale(code) {
      this.$cookies.set('locale', code, {
        path: '/',
        maxAge: 86400 * 365
      })
      this.$store.commit('SET_LANG', code)
      this.$i18n.locale = code
      moment.locale(code)
    }
  }
}
</script>

<style lang="less">
#header {
  /*height: 75px;*/
  z-index: 99;
  img.avatar {
    width: 36px;
    height: 36px;
  }
  img.logo {
    height: 40px;
  }
  img.logo-text {
    margin-left: 5px;
    height: 28px;
    vertical-align: bottom;
  }
}
</style>
