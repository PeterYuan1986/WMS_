<template>
  <div class="keys-select">
    <div class="items" v-for="label in labelKeys" :key="label.key">
      <p class="label">
        {{ label.key }} <span class="label-name">( {{ label.title }} )</span
        >:
      </p>
      <el-select v-model="label.value" placeholder="请选择">
        <el-option
          v-for="item in headers"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <div class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>

<script>
import { labelKeys } from './orderUtil'
export default {
  props: {
    headers: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      labelKeys
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.labelKeys)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.items {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  p.label {
    width: 40%;
    font-size: 18px;
    font-weight: bold;
    margin-right: 30px;
    .label-name {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
