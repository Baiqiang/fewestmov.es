<template>
   <b-card
      class="h-100 user-if-summary"
      v-if="!simple"
    >
    <b-card-title class="mb-1" v-if="!showUser && !simple">{{ userIF.name || '-' }}</b-card-title>
    <div class="mb-1">
      <b>{{ $t('if.scramble.label') }}: </b>{{ userIF.scramble }}
    </div>
    <div class="mb-1">
      <b>{{ $t('if.skeleton.label') }}: </b>{{ $t('if.skeleton.to', { length: formatAlgorithmToArray(userIF.skeleton).length, detail: formatCycleDetail(userIF.cycleDetail) }) }}<br>
    </div>
    <div class="mb-1">
      <b>{{ $t('if.cycles.label') }}: </b>
      <ul class="list-unstyled pl-3 mb-0">
        <li v-for="key in cycleKeys" v-if="userIF.cycles[key]">
          <b>{{ $t('if.cycles.' + key) }}</b>: {{ key === 'parity' ? $t('common.yes') : userIF.cycles[key] }}
        </li>
      </ul>
    </div>
    <div class="mb-1" v-if="userIF.status == 2 && userIF.result && userIF.result.fewest_moves">
      <b>{{ $t('if.fewestmoves') }}</b>: {{ userIF.result.fewest_moves }}
    </div>
    <div class="mb-1">
      <b>{{ $t('common.status') }}</b>: {{ $t('if.status.' + userIF.status) }}
    </div>
    <div class="mb-1">
      <b>{{ $t('common.created_at') }}</b>: {{ userIF.createdAt|formatTime }}
    </div>
    <div class="mb-1" v-if="showUser && userIF.userIFs.length">
      <ul class="list-unstyled mb-0">
        <li v-for="{ name, user } in userIF.userIFs">
          <NuxtLink :to="`/admin/user/${user.id}/if`">{{ user.name }}</NuxtLink>: {{ name || '-' }}
        </li>
      </ul>
    </div>
    <div slot="footer">
      <nuxt-link :to="'/if/' + userIF.hash">
        <b-button variant="warning" size="sm">
          <i class="material-icons">
            link
          </i>
        </b-button>
      </nuxt-link>
      <template v-if="operation">
        <b-button variant="info" size="sm" @click="update">
          <i class="material-icons">edit</i>
        </b-button>
        <b-button variant="danger" size="sm" @click="remove">
          <i class="material-icons">delete</i>
        </b-button>
      </template>
    </div>
  </b-card>
  <NuxtLink
    :to="'/if/' + userIF.hash"
    class="if-link"
    v-else
  >
    <b-card
      class="h-100 user-if-summary"
    >
      <div class="mb-1">
        <b>{{ $t('if.scramble.label') }}: </b>{{ userIF.scramble }}
      </div>
      <div :class="{ 'mb-1': userIF.status == 2 && userIF.result && userIF.result.fewest_moves }">
        <b>{{ $t('if.skeleton.label') }}: </b>{{ $t('if.skeleton.to', { length: formatAlgorithmToArray(userIF.skeleton).length, detail: formatCycleDetail(userIF.cycleDetail) }) }}<br>
      </div>
      <div v-if="userIF.status == 2 && userIF.result && userIF.result.fewest_moves">
        <b>{{ $t('if.fewestmoves') }}</b>: {{ userIF.result.fewest_moves }}
      </div>
    </b-card>
  </NuxtLink>
</template>

<script>
import { formatAlgorithmToArray } from '~/libs'
import { cycleKeys } from '~/config/if'

export default {
  props: {
    userIF: Object,
    showUser: {
      type: Boolean,
      default: false,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    operation: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      cycleKeys,
    }
  },
  methods: {
    formatAlgorithmToArray,
    formatCycleDetail(cycleDetail) {
      const detail = []
      cycleDetail.corner.filter(cycle => cycle.length > 1).forEach(cycle => {
        detail.push(cycle.length + 'C')
      })
      const twist = cycleDetail.corner.filter(cycle => cycle.length == 1).reduce((t, cycle) => cycle.length + t, 0)
      if (twist) {
        detail.push(twist + 'T')
      }
      cycleDetail.edge.filter(cycle => cycle.length > 1).forEach(cycle => {
        detail.push(cycle.length + 'E')
      })
      const flip = cycleDetail.edge.filter(cycle => cycle.length == 1).reduce((f, cycle) => cycle.length + f, 0)
      if (flip) {
        detail.push(flip + 'F')
      }
      cycleDetail.center.forEach(cycle => {
        detail.push(cycle.length + 'X')
      })
      return detail.join('')
    },
    update() {
      this.$emit('update')
    },
    remove() {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="less">
.if-link:hover {
  text-decoration: none;
}
.user-if-summary {
  background-color: #e4f7fa;
  color: #000;
}
</style>
