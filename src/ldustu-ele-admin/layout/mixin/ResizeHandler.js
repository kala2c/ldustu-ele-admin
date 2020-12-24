import store from '@/store'

const { body } = document
const WIDTH = 992 // 参考bootstrap的响应式宽度设计

export default {
  watch: {
    $route(route) {
      console.log(route)
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('layout/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('layout/toggleDevice', 'mobile')
      store.dispatch('layout/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // 混合中的方法以$_开头
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('layout/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('layout/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
