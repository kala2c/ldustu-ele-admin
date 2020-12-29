import eleAdminState from '../../state'

const { body } = document
const WIDTH = 992 // 参考bootstrap的响应式宽度设计

export default {
  watch: {
    $route() {
      if (this.device === 'mobile' && this.sidebar.opened) {
        eleAdminState.closeSidebar({ withoutAnimation: false })
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
      eleAdminState.toggleDevice('mobile')
      eleAdminState.closeSidebar({ withoutAnimation: true })
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
        eleAdminState.toggleDevice(isMobile ? 'mobile' : 'desktop')
        if (isMobile) {
          eleAdminState.closeSidebar({ withoutAnimation: true })
        }
      }
    }
  }
}
