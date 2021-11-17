<template>
  <div class="packagebox">
    <div class="packagebox-title">
      <p>单个包裹信息</p>
      <el-button
        type="primary"
        size="small"
        @click="addpackage"
        icon="el-icon-plus"
        >添加</el-button
      >
    </div>
    <div style="margin-bottom: 20px">
      <el-form
        :model="packageForm"
        class="package-form"
        label-width="110px"
        :rules="packageRules"
        ref="packageForm"
        :inline="true"
      >
        <el-table :data="packageForm.goods" border class="product-table">
          <el-table-column prop="name" label="物品名" width="150px">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请选择物品信息',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-select
                  @change="value => productSelect(value, scope.$index)"
                  placeholder
                  v-model="scope.row.name"
                >
                  <el-option
                    v-for="(item, index) in products"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量" width="100px">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入数量',
                    trigger: 'blur'
                  },
                  { type: 'number', message: '必须为数字值' }
                ]"
              >
                <el-input
                  v-model.number="scope.row.count"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unit-weight" label="单位重量" width="100px">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  { required: true, message: '请输入数量', trigger: 'blur' }
                ]"
              >
                {{ scope.row['weight'] }} /
                {{ scope.row['weight_unit'] }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalweight" label="合计重量" width="100px">
            <template slot-scope="scope">
              {{ scope.row['weight'] * scope.row['count'] || '' }} /
              {{ scope.row['weight_unit'] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="totalweight"
            label="上传条形码"
            width="100px"
            :key="barcode"
          >
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  { required: true, message: '请输入数量', trigger: 'blur' }
                ]"
              >
                <wms-upload
                  class="upload-demo"
                  @handleSuccess="
                    response => handleSuccess(response, scope.row)
                  "
                  :limit="1"
                >
                  <el-button
                    v-if="!scope.row.barcode"
                    size="mini"
                    type="primary"
                  >
                    点击上传
                  </el-button>
                  <template v-else>
                    <p class="text">已上传</p>
                    <el-button size="mini" type="primary">重新上传</el-button>
                  </template>
                </wms-upload>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="services" label="增值服务" width="350px">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请选择增值服务',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-cascader
                  :options="servicesModelCascader"
                  :props="{ multiple: true }"
                  v-model="scope.row.services"
                  clearable
                ></el-cascader>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="备注">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入备注信息',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  type="textarea"
                  v-model="scope.row.desc"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
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
    <div>
      <el-form
        :model="packageForm"
        class="package-form"
        label-width=""
        :rules="packageRules"
        ref="packageForm"
        :inline="true"
      >
        <el-form-item label="预计包裹数目:" prop="count" style="width: 48%">
          <el-input
            v-model.number="packageForm.count"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="单个包裹重量:" prop="weight" style="width: 48%">
          <el-input
            v-model="packageForm.weight"
            placeholder="请输入货值"
          ></el-input>
        </el-form-item>
        <p class="title-desc">预计单个包裹尺寸：</p>
        <div class="form-item-custom">
          <el-form-item label="长:" prop="length">
            <el-input v-model="packageForm.length" placeholder="请输入长">
              <el-select
                v-model="packageForm.size_unit"
                slot="append"
                placeholder=""
                size="mini"
              >
                <el-option label="cm" value="cm"></el-option>
                <el-option label="inch" value="inch"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="宽:" prop="width">
            <el-input v-model="packageForm.width" placeholder="请输入宽">
              <el-select
                v-model="packageForm.size_unit"
                slot="append"
                placeholder=""
              >
                <el-option label="cm" value="cm"></el-option>
                <el-option label="inch" value="inch"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="高:" prop="height">
            <el-input v-model="packageForm.height" placeholder="请输入高">
              <el-select
                v-model="packageForm.size_unit"
                slot="append"
                placeholder=""
              >
                <el-option label="cm" value="cm"></el-option>
                <el-option label="inch" value="inch"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <p class="title-desc">备注：</p>
          <el-form-item prop="desc" class="remark-item">
            <el-input type="textarea" v-model="packageForm.desc"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Axios from '@/https/axios'
import WmsUpload from '@/components/common/WmsUpload.vue'
export default {
  components: { WmsUpload },
  props: ['packageForm', 'warehouseactive'],
  data() {
    return {
      packageRules: {},
      products: [],
      servicesModel: {},
      barcode: ''
    }
  },
  created() {
    this.getProducts()
    this.handleWarsehouseChange()
  },
  computed: {
    servicesModelCascader() {
      try {
        return this.servicesModel.others.map(x => {
          return {
            value: x.id,
            label: x.name,
            children: x.details.map(c => ({
              value: c.id,
              label: `$${c.unitprice}/${c.title}`
            }))
          }
        })
      } catch (err) {
        return []
      }
    }
  },
  methods: {
    async handleWarsehouseChange() {
      const res = await Axios.fetchGet(
        `/seller/getContract?id=${this.warehouseactive.id}`
      )
      this.servicesModel = res.data
    },
    async getProducts() {
      const productsRes = await Axios.fetchGet('/iteminfo/search?sku=&name=')
      this.products = productsRes.data.content.map(x => ({
        label: x.name,
        value: x.openid,
        sku: x.sku,
        weight: x.weight,
        weight_unit: x.weight_unit,
        barcode: ''
      }))
    },
    addpackage() {
      this.packageForm.goods.push({
        name: '',
        count: 0,
        weight: 0,
        totalweight: 0,
        describe: '',
        barcode: ''
      })
    },
    productSelect(uid, index) {
      const product = this.products.find(x => x.value === uid)
      this.packageForm.goods[index].weight = product.weight
      this.packageForm.goods[index].weight_unit = product.weight_unit
      this.packageForm.goods[index].sku = product.sku
      this.packageForm.goods[index].id = product.value
      this.packageForm.goods[index].barcode = product.barcode
    },
    deleteRow(index) {
      this.packageForm.goods.splice(index, 1)
    },
    handleSuccess(response, row) {
      row.barcode = response.data
      this.barcode = response.data
    },
    confirmSuccess() {
      this.$emit(
        'confirmSuccess',
        this.products,
        this.servicesModelCascader
      )
    }
  }
}
</script>

<style lang="less" scoped>
.packagebox {
  width: 100%;
  p.text {
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    color: #999;
  }
  .title-desc {
    color: #333333;
    margin-bottom: 10px;
    color: #000;
    line-height: 30px;
  }
  .form-item-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .packagebox-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    p {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      position: relative;
      margin-left: 15px;
    }
    p::before {
      content: '';
      width: 4px;
      height: 14px;
      background: #298eff;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -15px;
    }
  }
  .package-form {
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
}
</style>
