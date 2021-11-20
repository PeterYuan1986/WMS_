<template>
  <el-dialog title="详情" :visible.sync="dialogVisible" width="70%">
    <div>
      <el-form :inline="true" v-model="reviewDetail" ref="reviewDetail">
        <p class="review-form-section">
          入库批次号：{{ $ifempty(reviewDetail.batckNumber) }}
        </p>
        <p class="review-form-section">商品信息：</p>
        <el-table border fit :data="goodsList">
          <el-table-column label="sku">
            <template slot-scope="scope">
              <span>{{ $ifempty(scope.row.sku) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <span>{{ $ifempty(scope.row.count) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务项目" width="400px">
            <template slot-scope="scope">
              <p v-for="(service, index) in scope.row.services" :key="index">
                ${{ service.unitprice }}/{{ service.title }} -
                {{ service.desc }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span>{{ $ifempty(scope.row.desc) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="review-form-section">包裹信息：</p>
        <el-table border fit :data="reviewDetail.packs">
          <el-table-column label="数量">
            <template slot-scope="scope">
              <span>{{ $ifempty(scope.row.count) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="包裹信息">
            <template slot-scope="scope">
              <p>长：{{ scope.row.length }}</p>
              <p>宽：{{ scope.row.width }}</p>
              <p>高：{{ scope.row.height }}</p>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span>{{ $ifempty(scope.row.desc) }}</span>
            </template>
          </el-table-column>
        </el-table>
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
      reviewDetail: {},
      goodsList: []
    }
  },
  methods: {
    _getForecastDetail(id) {
      Axios.fetchGet(`/biz/firstpass/${id}`).then(res => {
        this.dialogVisible = true
        this.reviewDetail = res.data
        this.reviewDetail.packs.forEach(pack => {
          this.goodsList = [...this.goodsList, ...pack.goods]
        })
      })
    },
    openDialogVisible(id) {
      this.goodsList = []
      this._getForecastDetail(id)
    }
  }
}
</script>

<style lang="less" scoped>
.review-form-section {
  margin: 10px 0;
  color: #000;
}
</style>
