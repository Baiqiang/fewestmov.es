<template>
  <div>
    <h3>{{ $t('user.insertions') }}</h3>
    <b-table
      striped
      hover
      :items="insertions"
      :fields="fields"
      :responsive="true"
      class="text-nowrap"
    >
      <template slot="link" slot-scope="data">
        <nuxt-link :to="'/if/' + data.item.hash">
          <b-button variant="warning" size="sm">
            <i class="material-icons">
              link
            </i>
          </b-button>
        </nuxt-link>
        <b-button variant="info" size="sm" @click="prepareForUpdate(data.item)">
          <i class="material-icons">edit</i>
        </b-button>
        <b-button variant="danger" size="sm" @click="prepareForRemove(data.item, data.index)">
          <i class="material-icons">delete</i>
        </b-button>
      </template>
      <template slot="name" slot-scope="data">
        <span class="text-monospace">{{ data.item.name || data.item.hash }}</span>
      </template>
      <template slot="status" slot-scope="data">
        {{ $t('if.status.' + data.value) }}
      </template>
      <template slot="createdAt" slot-scope="data">
        {{ data.value|formatTime }}
      </template>
    </b-table>
    <b-pagination-nav
      v-if="totalPage"
      v-model="currentPage"
      :number-of-pages="totalPage"
      base-url="/user/insertions/"
      use-router
    ></b-pagination-nav>
    <b-modal
      v-model="showUpdateModal"
      :title="$t('user.if.changeName')"
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
export default {
  head() {
    return {
      title: [this.$t('user.insertions'), this.$t('title')].join(' - ')
    }
  },
  data() {
    return {
      perPage: 50,
      toBeUpdated: null,
      toBeRemoved: null,
      toBeRemovedIndex: 0,
      name: '',
    }
  },
  async asyncData({ app, $axios, redirect, error, params}) {
    const page = params.page || 1
    try {
      const result = await $axios.$get('/user/insertions', {
        params: {
          page,
        }
      })
      result.currentPage = page
      return result
    } catch (e) {
      console.log(e)
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
    fields() {
      return [
        {
          key: 'link',
          label: '',
        },
        {
          key: 'name',
          label: this.$t('if.name.label'),
        },
        {
          key: 'scramble',
          label: this.$t('if.scramble.label'),
        },
        {
          key: 'status',
          label: this.$t('common.status'),
        },
        {
          key: 'createdAt',
          label: this.$t('common.created_at'),
        },
      ]
    }
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
        const result = await this.$axios.$delete(`/user/insertion/${this.toBeRemoved.hash}`)
        this.insertions.splice(this.toBeRemovedIndex, 1)
      } catch (e) {
        // do nothing
      }
    },
    async updateIF() {
      const toBeUpdated = this.toBeUpdated
      try {
        const result = await this.$axios.$post(`/user/insertion/${toBeUpdated.hash}`, {
          name: this.name
        })
        toBeUpdated.name = result.name
      } catch (e) {
        // do nothing
      }
    }
  }
}
</script>
