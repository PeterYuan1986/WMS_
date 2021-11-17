<template>
  <div class="forecaststorage-container" v-loading="loading">
    <div class="title">
      <i class="fa fa-bookmark"></i>
      <p>批次信息</p>
    </div>
    <div class="">
      <el-form
        :model="storageFrom"
        class="storage-form"
        label-width="110px"
        :rules="storageRules"
        ref="storageFrom"
        :inline="true"
      >
        <!-- 所有仓库列表 -->
        <el-form-item label="接受仓库:" prop="warsehouse" style="width: 40%">
          <!-- <span>{{ storageFrom.warsehouse }}</span> -->
          <span>{{ storageFrom.name }}</span>
        </el-form-item>
        <el-form-item label="物流信息:" prop="logistic" style="width: 40%">
          <el-input
            v-model="storageFrom.logistic"
            placeholder="运送物流或手动填写"
          ></el-input>
        </el-form-item>
        <el-form-item label="物流单号:" prop="lognumber" style="width: 40%">
          <el-input
            v-model="storageFrom.lognumber"
            placeholder="请填写物流单号"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="desc" style="width: 40%">
          <el-input
            type="textarea"
            v-model="storageFrom.desc"
            placeholder="请填写物流单号"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="title">
      <i class="fa fa-bookmark"></i>
      <p>批次信息汇总</p>
    </div>
    <div style="padding-bottom: 20px">
      <el-form
        :model="storageFrom"
        class="storage-form"
        label-width="110px"
        ref="storageFrom"
        :inline="true"
        style="width: 80%"
      >
        <div
          style="display: flex; justify-content: flex-end; margin-bottom: 20px"
        >
          <el-button
            type="primary"
            size="small"
            @click="addproduct"
            icon="el-icon-plus"
            >添加包裹</el-button
          >
        </div>
        <el-table
          :data="storageFrom.packs"
          border
          show-summary
          class="product-table"
        >
          <el-table-column label="序号" width="75px">
            <template slot-scope="scope">
              <div>
                <span>{{ ifempty(scope.$index + 1) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="包裹数" width="100px">
            <template slot-scope="scope">
              <div>
                <span>{{ ifempty(scope.row.count) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="包裹信息" width="600px">
            <template slot-scope="scope">
              <table class="table">
                <tr>
                  <th>商品名</th>
                  <th>单个包裹尺寸</th>
                  <th>数量</th>
                  <th>增值服务</th>
                  <th>备注</th>
                </tr>
                <tr v-for="item in scope.row.goods" :key="item.id">
                  <td>{{ _renderItemName(item.name) }}</td>
                  <td>
                    <p>长：{{ scope.row.length }} {{ scope.row.size_unit }}</p>
                    <p>宽：{{ scope.row.width }} {{ scope.row.size_unit }}</p>
                    <p>高：{{ scope.row.height }} {{ scope.row.size_unit }}</p>
                  </td>
                  <td>{{ item.count }}</td>
                  <td>
                    <div
                      class="services"
                      v-for="(serves, index) in item.services"
                      :key="index"
                    >
                      <p class="serve-title">
                        {{ _renderItemServe(serves[0], 'title') }}：
                      </p>
                      <div>
                        <p
                          class="serve-list"
                          v-for="serve in serves.filter((v, i) => i > 0)"
                          :key="serve"
                        >
                          {{ _renderItemServe(serves[0], serve) }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.desc }}</td>
                </tr>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="费用" width="75px">
            <template slot-scope="scope">
              <div>
                <span>{{ ifempty(scope.row.price) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div>
                <span>{{ ifempty(scope.row.desc) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="deleteRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>

    <el-dialog
      title="单个包裹信息"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="handleClose"
    >
      <single-package-info
        ref="singlePackageInfoRef"
        :packageForm="packageForm"
        :warehouseactive="warehouseactive"
        @confirmSuccess="confirmSuccess"
      ></single-package-info>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addpackage1"
          >添加包裹</el-button
        >
      </span>
    </el-dialog>
    <br />
    <div style="padding-left: 35px">
      <el-button size="small" type="primary" @click="handleForecast"
        >预报</el-button
      >
    </div>

    <!-- TODO: 整体增加提交接口:  /api/seller/firstpass/forecast 预报 -->
  </div>
</template>

<script>
import SinglePackageInfo from './SinglePackageInfo.vue'
import Axios from '@/https/axios'
const initPacks = {
  count: null,
  weight: null,
  length: null,
  size_unit: 'cm',
  width: null,
  height: null,
  goods: [{ name: '' }]
}
const initStroage = {
  warsehouse: '',
  logistic: '',
  lognumber: '',
  packs: []
}
export default {
  components: {
    // CrudSelect
    SinglePackageInfo
  },
  created() {
    this.init()
  },
  props: ['warehouseactive'],
  data() {
    return {
      loading: false,
      storageFrom: {
        warsehouse: '',
        name: '',
        logistic: '',
        lognumber: '',
        packs: []
      },
      packageForm: JSON.parse(JSON.stringify(initPacks)),
      storageRules: {
        warsehouse: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        logistic: [{ required: true, message: '请选择物流', trigger: 'blur' }]
      },
      cangkus: [
        { label: '联邦快递', value: 'FedEx' },
        { label: '敦豪', value: 'DHL' },
        { label: '天地快运', value: 'TNT' },
        { label: '联合包裹', value: 'UPS' },
        { label: '中国邮政', value: 'EMS' },
        { label: '民航快递', value: 'CAE' },
        { label: '中铁快运', value: 'CRE' },
        { label: '顺丰速运', value: 'SF' }
      ],
      dialogVisible: false,
      products: [],
      servicesModel: {}
    }
  },
  methods: {
    async init() {
      this.storageFrom.warsehouse = this.warehouseactive.id
      this.storageFrom.name = this.warehouseactive.seller
    },
    ifempty(value) {
      return value || '--'
    },
    async handleForecast() {
      const { packs, ...res } = this.storageFrom
      await Axios.fetchPut('/seller/firstpass/forecast', {
        id: this.warehouseactive.id,
        ...res,
        packs: packs.map(({ goods, ...x }) => {
          return {
            ...x,
            goods: goods.map(c => {
              return {
                ...c,
                services:
                  c && c.services ? c.services.map(a => a.slice(-1)[0]) : []
              }
            })
          }
        })
      })
        .then(() => {
          this.$refs.storageFrom.resetFields()
          this.packageForm = JSON.parse(JSON.stringify(initPacks))
          this.storageFrom = JSON.parse(JSON.stringify(initStroage))
          this.storageFrom.warsehouse = this.warehouseactive.id
          this.$message.success('预报入库成功！')
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    addproduct() {
      if (!this.storageFrom.warsehouse) {
        return this.$message.warning('请先选择接受仓库')
      }
      this.packageForm = JSON.parse(JSON.stringify(initPacks))
      this.dialogVisible = true
    },
    deleteRow(index) {
      this.storageFrom.packs.splice(index, 1)
    },
    handleClose(done) {
      done()
    },
    addpackage() {
      this.packageForm.goods.push({
        name: '',
        count: 0,
        weight: 0,
        totalweight: 0,
        describe: ''
      })
    },
    addpackage1() {
      this.storageFrom.packs.push(this.packageForm)
      this.packageForm = JSON.parse(JSON.stringify(initPacks))
      this.$refs.singlePackageInfoRef.confirmSuccess()
      this.dialogVisible = false
    },
    confirmSuccess(products, servicesModelCascader) {
      this.products = products
      this.servicesModelCascader = servicesModelCascader
    },
    _renderItemName(name) {
      const currentProduct = this.products.find(
        product => product.value === name
      )
      return currentProduct && currentProduct.label
    },
    _renderItemServe(serve, title) {
      const currentServe = this.servicesModelCascader.find(
        model => model.value === serve
      )
      let lable = ''
      if (title === 'title') {
        lable = currentServe.label
      } else {
        for (let j = 0; j < currentServe.children.length; j++) {
          const _serve = currentServe.children[j]
          if (_serve.value === title) {
            lable = _serve.label
          }
        }
      }
      return lable
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.forecaststorage-container {
  width: 100%;
  // height: 100%;
  background: #ffffff;
  min-height: 100%;
  .title {
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
    padding-left: 30px;
    i {
      color: #2f8ffb;
      margin-right: 10px;
    }
    p {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #303030;
      line-height: 50px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #888;
      }
    }
  }
  .storage-form {
    padding: 20px 20px 0px 35px;
    /deep/.el-form-item {
      margin-right: 20px;
      .el-form-item__content {
        width: calc(100% - 110px);
        .avatar-uploader {
          // border: 1px dashed #d9d9d9;
          .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .el-upload:hover {
            border-color: #409eff;
          }
        }
        .el-input {
          .el-input__inner {
            padding: 0 0px 0 10px;
          }
          /deep/.el-input-group__append {
            .el-select {
              .el-input {
                .el-input__inner {
                  padding: 0 0 0 8px;
                }
                .el-input__suffix {
                  display: none;
                }
              }
            }
          }
        }
        .el-select {
          width: 100%;
        }
      }
    }
    .product-table {
      /deep/.el-table__header-wrapper {
        .el-table__header {
          thead {
            tr {
              background-color: #f8f8f8;
              th {
                background-color: #f8f8f8;
              }
            }
          }
        }
      }
      /deep/.el-table__body-wrapper {
        .el-table__body {
          .el-table__row {
            .cell {
              .el-form-item {
                margin: 0;
                width: 100%;
                .el-form-item__content {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 0px;
    // background: #dbdbdb;
    // margin-left: 30px;
    // margin-right: 30px;
    margin-top: 10px;
    margin-bottom: 20px;
    border: 1px dashed #dbdbdb;
  }
}
/deep/.el-input-group__append {
  width: 35px;
}

.table {
  width: 100%;
  tr {
    border-bottom: 1px solid #ddd;
    &:last-child {
      border: none;
    }
  }
  th,
  td {
    text-align: center;
    border-right: 1px solid #ddd;
    &:last-child {
      border: none;
    }
  }
}

.services {
  display: flex;
  align-items: center;
  .serve-title {
    width: 100px;
  }
}
</style>
