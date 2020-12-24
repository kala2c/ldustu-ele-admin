<style lang="scss">

</style>

<template>
  <div class="page-bar">
    <el-pagination class="hidden-xs" background layout="sizes, prev, pager, next, jumper, ->, total"
                   :current-page.sync="$parent.commonQueryParams.nowPage"
                   :page-size.sync="$parent.commonQueryParams.pageSize"
                   :page-sizes="[10, 50, 100, 150]" :total="totalRows"
                   @size-change="pageSizeChangeHandle"
                   @current-change="pageChangeHandle" @prev-click="pageChangeHandle" @next-click="pageChangeHandle">
    </el-pagination>
    <el-pagination class="visible-xs-inline-block" background layout="prev, slot, next, jumper"
                   :current-page.sync="$parent.commonQueryParams.nowPage"
                   :page-size.sync="$parent.commonQueryParams.pageSize"
                   :total="totalRows"
                   :page-sizes="[10, 50, 100, 150]"
                   @current-change="pageChangeHandle" @prev-click="pageChangeHandle" @next-click="pageChangeHandle">
      <span style="text-align: center">{{ $parent.commonQueryParams.nowPage }}</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  computed: {
    totalRows: function () {
      return this.$parent.totalRows
    }
  },
  methods: {
    pageChangeHandle: function (page) {
      this.$parent.childPageBarChangePage(page)
    },
    pageSizeChangeHandle: function (pageSize) {
      this.$parent.childPageBarChange(1)
      this.$parent.childPageBarChangePageSize(pageSize)
    }
  }
}
</script>
