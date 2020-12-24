<template>
  <el-select v-model="selectValue" :multiple="multiple">
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
export default {
  props: {
    remoteUrl: {
      type: String,
      default: ''
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    field: {
      type: String,
      default: 'search.like.name'
    },
    handle: {
      type: Function,
      default: undefined
    },
    params: {
      type: Object,
      default: function () {
        return {}
      }
    },
    value: {
      type: String|Number|Array
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultOptions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  model: {
    prop: 'value',
    event: 'handleModel'
  },
  data: function() {
    return {
      keyword: '',
      selectValue: '',
      optionsShow: []
    }
  },
  created: function() {
    this.loadOptions()
  },
  watch: {
    keyword: debounce(function(val) {
      this.loadOptions()
    }, 500),
    value: function(val) {
      this.selectValue = val
    },
    selectValue: function (val) {
      this.$emit('handleModel', val)
    },
    defaultOptions: function (val) {
      if (this.optionsShow.length < 1) {
        this.optionsShow = this.optionsShow.concat(val)
      }
    }
  },
  methods: {
    loadOptions: function () {
      var _this = this
      var param = {}
      if (this.keyword !== '') {
        param[this.field] = this.keyword
      }
      $.get(this.remoteUrl, $.extend(param, _this.params), function (res) {
        if (_this.handle) {
          _this.optionsShow = _this.handle(res)
        } else {
          _this.optionsShow = res.data
        }
      })
    }
  }
}
</script>
