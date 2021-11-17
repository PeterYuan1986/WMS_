<template>
  <el-upload
    class="upload-demo"
    action="/api/file/upload"
    :headers="{
      Authorization
    }"
    :show-file-list="false"
    :file-list="fileList"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :limit="limit"
    :on-exceed="handleExceed"
    accept=".pdf,.png,.jpg,.jepg"
  >
    <slot></slot>
  </el-upload>
</template>

<script>
export default {
  props: {
    fileList: {
      type: Array
    },
    limit: {
      type: Number,
      default: null
    }
  },
  computed: {
    Authorization() {
      return window.localStorage.getItem('wms_auth_access_token')
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$emit('handleSuccess', response, file, fileList)
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    }
  }
}
</script>

<style></style>
