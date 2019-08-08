<template>
  <div>
    <h3>{{ $t('user.if') }}</h3>
    <div class="row">
      <div
        class="col-sm-12 col-md-6 col-lg-4 col-xl-3 py-3"
        v-for="(userIF, index) in ifs"
      >
       <UserIFSummary :userIF="userIF" operation @remove="prepareForRemove(userIF, index)" @update="prepareForUpdate(userIF)"></UserIFSummary>
      </div>
    </div>
    <b-pagination-nav
      v-if="totalPage"
      v-model="currentPage"
      :number-of-pages="totalPage"
      base-url="/user/if/"
      use-router
    ></b-pagination-nav>
    <b-modal
      v-model="showUpdateModal"
      :title="$t('user.changeName')"
      @show="name = toBeUpdated.name"
      @ok="updateIF"
      centered
    >
      <template slot="modal-footer" slot-scope="{ ok, cancel, hide }">
        <b-button size="sm" variant="success" @click="ok()">
          {{ $t('form.save') }}
        </b-button>
        <b-button size="sm" variant="secondary" @click="cancel()">
          {{ $t('form.cancel') }}
        </b-button>
      </template>
      <b-form-input v-model="name" autofocus></b-form-input>
    </b-modal>
    <b-modal
      v-model="showRemoveModal"
      :title="$t('form.deleteConfirm')"
      header-class="border-bottom-0"
      footer-class="border-top-0"
      body-class="p-0"
      @ok="removeIF"
      centered
    >
      <template slot="modal-footer" slot-scope="{ ok, cancel, hide }">
        <b-button size="sm" variant="danger" @click="ok()">
          {{ $t('form.delete') }}
        </b-button>
        <b-button size="sm" variant="secondary" @click="cancel()">
          {{ $t('form.cancel') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { perPage } from '~/config/if'
import UserIFSummary from '~/components/UserIFSummary'

export default {
  head() {
    return {
      title: [this.$t('user.if'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage: perPage,
      toBeUpdated: null,
      toBeRemoved: null,
      toBeRemovedIndex: 0,
      name: '',
    }
  },
  async asyncData({ app, $axios, redirect, error, params}) {
    const page = params.page || 1
    try {
      const result = await $axios.$get('/user/if', {
        params: {
          page,
        }
      })
      result.currentPage = page
      return result
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          app.$auth.setUser(null)
          return redirect('/login')
        }
      }
      error({
        statusCode: 500
      })
    }
  },
  computed: {
    showUpdateModal: {
      get() {
        return !!this.toBeUpdated
      },
      set() {
        this.toBeUpdated = null
      }
    },
    showRemoveModal: {
      get() {
        return !!this.toBeRemoved
      },
      set() {
        this.toBeRemoved = null
      }
    },
    totalPage() {
      return Math.ceil(this.total / this.perPage)
    },
  },
  methods: {
    prepareForRemove(userIF, toBeRemovedIndex) {
      this.toBeRemoved = userIF
      this.toBeRemovedIndex = toBeRemovedIndex
    },
    prepareForUpdate(userIF) {
      this.toBeUpdated = userIF
    },
    async removeIF() {
      try {
        const result = await this.$axios.$delete(`/user/if/${this.toBeRemoved.hash}`)
        this.ifs.splice(this.toBeRemovedIndex, 1)
      } catch (e) {
        // do nothing
      }
    },
    async updateIF() {
      const toBeUpdated = this.toBeUpdated
      try {
        const result = await this.$axios.$post(`/user/if/${toBeUpdated.hash}`, {
          name: this.name
        })
        toBeUpdated.name = result.name
      } catch (e) {
        // do nothing
      }
    }
  },
  components: {
    UserIFSummary
  }
}
</script>
