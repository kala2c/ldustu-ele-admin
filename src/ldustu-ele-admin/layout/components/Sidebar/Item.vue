<template>
  <div style="display: inline-block">
    <template v-if="icon.indexOf('el-icon') > -1">
      <i :class="icon + ' sub-el-icon'" />
    </template>
    <template v-else>
      <svg-icon :icon-class="icon"></svg-icon>
    </template>
    <template v-if="title">
      <span slot='title'>{{title}}</span>
    </template>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
