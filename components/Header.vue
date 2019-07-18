<template>
  <b-navbar :toggleable="false" class="position-fixed w-100" type="dark" variant="dark" tag="header" id="header">
    <b-navbar-brand to="/">
      {{ $t('common.home') }}
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/if" :active="$route.name && $route.name.slice(0, 2) === 'if'">{{ $t('if.title') }}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto align-items-center">
        <b-nav-item-dropdown :text="currentLanguage" right>
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
          <b-dropdown-item to="/user/insertions" >{{ $t('user.insertions') }}</b-dropdown-item>
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
  height: 60px;
  z-index: 99;
  img.avatar {
    width: 32px;
    height: 32px;
  }
}
</style>
