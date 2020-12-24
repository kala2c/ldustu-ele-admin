<style lang="scss">

</style>

<template>
  <el-select v-model="selectValue" :disabled="disabled">
   <template slot="empty">
     <div style="position:absolute; top: 0; z-index: 99; padding:10px; box-sizing: border-box; background: #fff">
       <el-input v-model="keyword" placeholder="搜索..."></el-input></div><div style="height: 50px"></div>
     <p style="text-align: center; color: #aaa; font-size: 14px">没有数据...</p>
     </template>
   <div style="position:absolute; top: 0; z-index: 99; padding:10px; box-sizing: border-box; background: #fff">
     <el-input v-model="keyword" placeholder="搜索..."></el-input></div><div style="height: 50px"></div>
   <el-option v-for="option in optionsShow" :key="option[valueKey]" :label="option[labelKey]" :value="option[valueKey]"></el-option>
   </el-select>
</template>

<script>
export default  {
  props: {
    options: {
      type: Array,
      default: function () {
        return []
      }
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    value: {
      type: String|Number|Array
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'handleModel'
  },
  data: function() {
    return {
      keyword: '',
      selectValue: ''
    }
  },
  created: function() {
    this.selectValue = this.value
  },
  watch: {
    value: function(val) {
      this.selectValue = val
    },
    selectValue: function (val) {
      this.$emit('handleModel', val)
    }
  },
  computed: {
    optionsShow: function () {
      var _this = this
      return this.options.filter(function (t) {
        return t[_this.labelKey].indexOf(_this.keyword) > -1
      })
    }
  }
}
</script>
