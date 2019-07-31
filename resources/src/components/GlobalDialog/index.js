import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { Dialog } from 'element-ui'

export default Vue.extend({
  store,
  name: 'GlobalDialog',
  data() {
    return {
      visible: false,
    }
  },
  props: {
    ...Dialog.props,
    content: [String, Function],
    footer: Function,
    on: Object,
  },
  mounted() {
    const vm = new Vue({ router })
    // 路由变化时，关掉弹窗
    this.unwatchRoute = vm.$watch('$route', () => {
      this.visible = false
    })
    this.visible = true
  },
  beforeDestroy() {
    this.unwatchRoute()
  },
  methods: {
    clean() {
      this.$destroy()
      const parentNode = this.$el.parentNode
      parentNode && parentNode.removeChild(this.$el)
    },
  },
  render(h) {
    let { content, footer } = this
    if (content) {
      content = (typeof this.content === 'string')
        ? this.content
        : this.content(h)
    }
    footer = footer && (<template slot="footer">{this.footer(h)}</template>)

    return h('el-dialog', {
      props: {
        ...this.$props,
        visible: this.visible,
      },
      on: {
        ...this.on,
        closed: this.clean,
        'update:visible': (val) => (this.visible = val),
      },
      ref: 'globalDialog',
    }, [content, footer])
  },
})