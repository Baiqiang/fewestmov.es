import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatTime', time => {
  const m = moment(time)
  if (+new Date(time) < Date.now() - 86400000) {
    return m.format('YYYY-MM-DD HH:mm:ss')
  } else {
    return m.fromNow()
  }
})

Vue.filter('duration', nanoseconds => {
  const milliseconds = nanoseconds / 1e6
  const seconds = nanoseconds / 1e9
  const minutes = Math.floor(seconds / 60)
  if (seconds < 1) {
    return milliseconds + 'ms'
  }
  if (minutes < 1) {
    return seconds + 's'
  }
  return minutes + 'm' + Math.floor(seconds % 60) + 's'
})

export default ({ app, store }) => {
  moment.locale(app.i18n.locale)
}
