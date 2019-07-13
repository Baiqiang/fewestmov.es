import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatTime', time => {
  return moment(time).fromNow()
})

export default ({ app, store }) => {
  moment.locale(app.i18n.locale)
}
