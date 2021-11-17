<template>
  <el-dialog title="详情" :visible.sync="dialogVisible" width="70%">
    <div>
      <el-form :inline="true" v-model="reviewDetail" ref="reviewDetail">
        <p class="review-form-section">
          123入库批次号：{{ ifempty(reviewDetail.batckNumber) }}
        </p>
        <p class="review-form-section">预报商品信息：</p>
        <el-table border fit :data="reviewDetail.packs">
          <el-table-column label="参考码">
            <template slot-scope="scope">
              <span>{{ ifempty(scope.row.id) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="包裹数">
            <template slot-scope="scope">
              <span>{{ ifempty(scope.row.count) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="包裹明细及请求服务项目">
            <!-- <template slot-scope="scope">
              <span>{{ ifempty(scope.row.services) }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span>{{ ifempty(scope.row.desc) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="review-form-section">商品总数汇总：</p>
        <el-form-item style="width: 48%; margin-bottom: 0px">
          <el-input
            placeholder="没有数据"
            v-model="reviewDetail.sku"
            readonly=""
          >
            <template slot="prepend">SKU</template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 48%; margin-bottom: 0px">
          <el-input
            placeholder="没有数据"
            v-model="reviewDetail.count"
            readonly
          >
            <template slot="prepend">数量</template>
          </el-input>
        </el-form-item>
        <p class="review-form-section">备注：</p>
        <el-input
          type="textarea"
          :rows="4"
          readonly
          resize="none"
          placeholder="没有数据"
          v-model="reviewDetail.note"
        >
        </el-input>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        style="justify-content: flex-end"
        type="primary"
        @click="dialogVisible = false"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Axios from '@/https/axios'
// composition API
// options api
export default {
  data() {
    return {
      dialogVisible: false,
      reviewDetail: {}
    }
  },
  methods: {
    _getForecastDetail(id) {
      Axios.fetchGet(`/biz/firstpass/${id}`).then(res => {
        this.dialogVisible = true
        this.reviewDetail = res.data
        console.log(this.reviewDetail, 'reviewDetail')
      })
    },
    openDialogVisible(id) {
      this._getForecastDetail(id)
    },
    ifempty(value) {
      return value || '--'
    }
  }
}
</script>

<style></style>
