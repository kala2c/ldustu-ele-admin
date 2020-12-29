<style lang="scss">

</style>

<template>
  <div>
    <el-upload
        :disabled="disable"
        action="/third/upload"
        accept="image/*"
        :file-list="fileList"
        list-type="picture-card"
        :multiple="multiple"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove">
      <i v-if="!disable" class="el-icon-plus"></i>
    </el-upload>
    <el-link v-if="!disable && fileList.length && !orderShow" type="primary" icon="el-icon-edit"
             @click="orderShow = true">排序
    </el-link>
    <el-link v-if="!disable && fileList.length && orderShow" type="primary" icon="el-icon-check"
             @click="orderShow = false">完成
    </el-link>
    <div class="hidden-xs" style="width: 150px; height: 170px; position: relative" v-if="qrcode && !disable">
      <img style="width: 150px; height: 150px" :src="'/up/qrcode/'+token" alt="">
      <span
          style="display: inline-block; position: absolute; top: 150px; left: 0; width: 100%; height: 20px; text-align: center; line-height: 0">扫码上传</span>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt=""
           style="max-height: 100%; max-width: 100%; text-align: center; vertical-align: middle">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    },
    picture: {
      type: Array,
      default: function() {
        return []
      }
    },
    default: {
      type: Array,
      default: function() {
        return []
      }
    },
    qrcode: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      fileList: [],
      token: '',
      dialogImageUrl: '',
      dialogVisible: false,
      orderShow: false
    }
  },
  watch: {
    default: function(val) {
      var self = this
      for (var i = 0; i < val.length; i ++) {
        var url = val[i]
        var find = self.fileList.filter(function (t) {
          return t.url === url || (t.response && t.response.data.path === url)
        })
        if (find.length < 1) {
          self.fileList.push({
            name: url.split('/').reverse()[0],
            url: url,
          })
        }
      }
    },
    orderShow: function (show) {
      if (show) {
        this.showOrder()
      }
    }
  },
  created: function() {
    if (this.qrcode) {
      this._loadQrcode()
    }
  },
  mounted: function() {
    if (this.disable) {
      // 隐藏+号
      $('.el-upload.el-upload--picture-card').hide()
    } else {

    }
  },
  methods: {
    handleChange(file, fileList) {
    },
    handleSuccess(res, file) {
      this.picture.push(res.data.path)
    },
    handleRemove(file) {
      var path = file.response && file.response.data.path || file.url
      // 从picture中删除
      var idx1 = this.picture.indexOf(path)
      if (idx1 > -1) {
        this.picture.splice(idx1, 1)
      }
      // 从fileList中删除
      var idx2 = this._findFile(path)
      if (idx2 > -1) {
        this.fileList.splice(idx2, 1)
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /**
     * 在fileList查找文件
     * @param url 文件url
     * @return number 文件在数组中的下标
     * @private
     */
    _findFile(url) {
      var idx = -1
      for (var i = 0; i < this.fileList.length; i ++) {
        var file = this.fileList[i]
        if (file.url === url || (file.response && file.response.data.path === url)) {
          idx = i
          break
        }
      }
      return idx
    },
    _loadQrcode() {
      this.token = $qy.randStr(10)
      this._getQrCodePicture()
    },
    _getQrCodePicture() {
      $.get('/up/mobile/read/'+this.token, res => {
        if (res.data.picture) {
          res.data.picture.split(',').forEach(url => {
            // 添加到picture中 组件数据
            if (this.picture.indexOf(url) < 0) this.picture.push(url)
            // 添加到fileList中 展示数据
            if (this._findFile(url) < 0) {
              this.fileList.push({
                name: url.split('/').reverse()[0],
                url: url,
              })
            }
          })
        }
        setTimeout(() => {
          this._getQrCodePicture()
        }, 1000)
      })
    },
    showOrder() {
      var _this = this
      var arrowLeft = document.querySelectorAll('.left-arrow')
      arrowLeft.forEach(t => t.remove())
      var arrowRight = document.querySelectorAll('.right-arrow')
      arrowRight.forEach(t => t.remove())
      var ulList = document.querySelector('.el-upload-list.el-upload-list--picture-card')
      ulList.childNodes.forEach((li, index) => {
        li.style.position = 'relative'
        var left = document.createElement('div')
        left.setAttribute('class', 'left-arrow')
        left.innerText = '<'
        left.style.position = 'absolute'
        left.style.left = '5px'
        left.style.top = '50%'
        left.style.background = '#fff';
        (function (obj, m) {
          left.onclick = function () {
            if (m < 1) return false
            var tmp = _this.picture.splice(m, 1)[0]
            _this.picture.splice(m-1, 0, tmp)
            var tmp2 = _this.fileList.splice(m, 1)[0]
            _this.fileList.splice(m-1, 0, tmp2)
            _this.showOrder()
          }
        })(left, index)
        var right = document.createElement('span')
        right.setAttribute('class', 'right-arrow')
        right.innerText = '>'
        right.style.position = 'absolute'
        right.style.right = '5px'
        right.style.top = '50%'
        right.style.background = '#fff';
        (function (obj, m) {
          right.onclick = function () {
            if (m >= _this.fileList.length-2) return false
            var tmp = _this.picture.splice(m, 1)[0]
            _this.picture.splice(m+1, 0, tmp)
            var tmp2 = _this.fileList.splice(m, 1)[0]
            _this.fileList.splice(m+1, 0, tmp2)
            _this.showOrder()
          }
        })(right, index)
        li.appendChild(left)
        li.appendChild(right)
      })
    }
  }
}
</script>
