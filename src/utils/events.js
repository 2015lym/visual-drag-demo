// 编辑器自定义事件
const events = {
  redirect(url) {
    if (url) {
      // window.location.href = url
      console.log('跳转路径： ', url)
      window.parent.postMessage({ type: 'goPage', data: url }, '*')
    }
  },

  alert(msg) {
    if (msg) {
      // eslint-disable-next-line no-alert
      alert(msg)
    }
  },
}

const mixins = {
  methods: events,
}

const eventList = [
  {
    key: 'redirect',
    label: '跳转事件',
    event: events.redirect,
    param: '',
  },
  {
    key: 'alert',
    label: 'alert 事件',
    event: events.alert,
    param: '',
  },
]

export { mixins, events, eventList }
