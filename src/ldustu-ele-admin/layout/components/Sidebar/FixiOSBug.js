import { getState } from "../../../state"

export default {
  computed: {
    device() {
      return getState('app').device
    }
  },
  mounted() {
    // 在pad上打开，左侧菜单栏二级菜单点击后会弹出一次，在页面跳转之后。
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  }
}
