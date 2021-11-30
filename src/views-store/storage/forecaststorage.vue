<template>
  <div class="forecaststorage-container">
    <el-form
      :model="storageFrom"
      size="small"
      :rules="storageRules"
      ref="storageFrom"
    >
      <div class="title">
        <i class="fa fa-bookmark"></i>
        <p>批次预报信息</p>
      </div>
      <div class="">
        <el-form-item
          label="入库批次号:"
          prop="warsehouse"
          style="width: 100%; margin-top: 10px"
        >
          <span v-if="id">{{ id }}</span>
        </el-form-item>
      </div>
      <div style="padding-bottom: 20px">
        <p class="table-header">预报物品信息:</p>
        <el-table
          :data="storageFrom.packs"
          border
          :summary-method="getSummaries"
          show-summary
          sum-text="总计包裹:"
          class="product-table"
        >
          <el-table-column label="参考码" width="300px">
            <template slot-scope="scope">
              <div>
                <span>{{ $ifempty(scope.row.id) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="包裹数" prop="count" width="150px">
          </el-table-column>
          <el-table-column label="包裹信息" width="275px">
            <template slot-scope="scope">
              <div>
                <p>
                  单个包裹尺寸： <br />
                  长：{{ scope.row.length }}/{{ scope.row.size_unit }}
                  <br />
                  宽：{{ scope.row.width }}/{{ scope.row.size_unit }}
                  <br />
                  高：{{ scope.row.width }}/{{ scope.row.size_unit }}
                </p>
                <p>
                  增值服务：{{
                    $ifempty(
                      scope.row.goods
                        .reduce((a, b) => {
                          return [...a, ...b.services.map(x => x.title)]
                        }, [])
                        .join('')
                    )
                  }}
                </p>
                <!-- <p>
                  包裹处理费：{{
                   $ifempty(
                      scope.row.goods.reduce((a, b) => {
                        return (
                          a +
                          b.services
                            .map((x) => x.unitprice)
                            .reduce((c, d) => c + d, 0)
                        )
                      }, 0)
                    )
                  }}
                </p> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div>
                <span>{{ $ifempty(scope.row.desc) }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="padding-bottom: 20px" class="product-collect">
        <p class="table-header">商品总数汇总:</p>
        <el-row
          type="flex"
          :key="key"
          align="center"
          v-for="(item, key) in Object.keys(packageList)"
        >
          <el-col class="header" :span="4">SKU:</el-col>
          <el-col :span="7" :offset="1">{{ item }}</el-col>
          <el-col class="header" :span="4">数量:</el-col>
          <el-col :span="7" :offset="1">{{ packageList[item] }}</el-col>
        </el-row>
      </div>

      <div style="padding-bottom: 20px" class="product-collect">
        <p class="table-header">备注:</p>
        <el-row type="flex" align="center">
          <el-col class="header" :span="4">备注:</el-col>
          <el-col :span="19" :offset="1">{{ storageFrom.desc }}</el-col>
        </el-row>
      </div>

      <div class="title">
        <i class="fa fa-bookmark"></i>
        <p>货物入库</p>
      </div>
      <br />
      <el-form-item prop="warsehouse" style="width: 100%">
        <el-radio-group size="small" v-model="packType">
          <el-radio-button :label="false">按包裹数目入库</el-radio-button>
          <el-radio-button :label="true">按SKU入库</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 按照包裹入库 packType: false-->
      <div v-if="!packType">
        <el-table
          :data="storageFrom.packs"
          border
          :summary-method="getSummaries"
          show-summary
          sum-text="总计包裹:"
          class="product-table"
        >
          <el-table-column label="参考码" width="300px">
            <template slot-scope="scope">
              <div>
                <span>{{ $ifempty(scope.row.id) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="包裹数" prop="count" width="150px">
          </el-table-column>
          <el-table-column label="包裹明细及请求服务信息" width="275px">
            <template slot-scope="scope">
              <div>
                <p :key="index" v-for="(item, index) in scope.row.goods">
                  单个包裹信息： {{ item.sku }}*{{ item.count }}
                </p>
                <p>
                  增值服务：{{
                    $ifempty(
                      scope.row.goods
                        .reduce((a, b) => {
                          return [...a, ...b.services.map(x => x.title)]
                        }, [])
                        .join('')
                    )
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实收包裹数">
            <template slot-scope="scope">
              <el-form-item>
                <el-input
                  v-model.number="scope.row.realCount"
                  style="width: 100px"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 按照sku入库 -->
      <div v-else>
        <el-radio :label="false" v-model="goodType">手动入库</el-radio>
        <el-radio :label="true" v-model="goodType">扫描入库</el-radio>

        <el-button
          type="primary"
          style="float: right; margin: 0 20px 10px 0"
          @click="handleSkuAdd"
          size="small"
          v-if="!goodType"
          icon=" icon iconfont icon-jia"
          >添加SKU</el-button
        >
        <br />
        <br />

        <el-table
          v-if="storageFrom.skuList.length || showSkuRecordDetail"
          :data="storageFrom.skuList"
          border
          class="product-table"
        >
          <el-table-column label="SKU" width="300px">
            <template slot-scope="scope">
              <el-form-item style="margin: 0">
                <div v-if="scope.row.disabled">{{ scope.row.sku }}</div>
                <!-- products -->
                <el-select
                  v-else
                  v-model="scope.row.sku"
                  size="small"
                  @change="
                    val => {
                      selectedItemSku(val, scope)
                    }
                  "
                >
                  <el-option
                    v-for="item in products"
                    :key="item.id"
                    :label="item.sku"
                    :value="item.sku"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="数目" width="150px">
            <template slot-scope="scope">
              <el-form-item style="margin: 0">
                <span>{{ scope.row.number || 0 }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="实收数目" width="275px">
            <template slot-scope="scope">
              <el-form-item style="margin: 0">
                <el-input v-model="scope.row.count"> </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="warning"
                @click="handleDeleteSku(scope)"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-input
          v-if="goodType && !showSkuRecordDetail"
          type="textarea"
          style="width: 60%"
          v-model="skuRecords"
          :rows="15"
        >
        </el-input>
        <div style="margin: 10px 0">
          <el-button
            type="primary"
            size="medium"
            v-if="goodType"
            @click="handleSkuRecords"
            >{{ showSkuRecordDetail ? '编辑' : '确认' }}</el-button
          >
        </div>
        <br />
      </div>

      <br />
      <br />

      <div v-for="sku in Object.keys(skuListForServiceIdObj)" :key="sku">
        <p class="table-header">sku: {{ sku }}</p>
        <el-row type="flex">
          <el-col
            :span="8"
            class="table-header"
            :key="index"
            v-for="(item, index) in serviceList"
          >
            <el-row type="flex">
              <el-col>
                <el-checkbox-group
                  v-model="skuListForServiceIdObj[sku]"
                  @change="$forceUpdate()"
                >
                  <el-checkbox :label="item.id"
                    >{{ item.serviceName }}: {{ item.title }} / ${{
                      item.unitprice
                    }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <br /><br />

      <el-button type="primary" @click="handleSubmit" size="small"
        >入库</el-button
      >
      <el-button size="small">取消</el-button>

      <br /><br />
    </el-form>
  </div>
</template>

<script>
import Axios from '@/https/axios'
export default {
  data() {
    return {
      showSkuRecordDetail: false,
      skuRecords: '',
      packageList: {},
      skuListForServiceIdObj: {},
      storageFrom: {
        warsehouse: '',
        logistics: '',
        shipmentNo: '',
        skuList: [],
        packages: [
          {
            code: 'BHKFDSDSKFFHD',
            count: 300,
            size: '8KU001*100',
            serve: '商品贴标$0.2/个',
            deal: '$2/包裹',
            price: 100,
            barcode: ''
          }
        ]
      },
      storageRules: {
        warsehouse: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        logistics: [{ required: true, message: '请选择物流', trigger: 'blur' }]
      },
      packageRules: {},
      serviceList: [],
      dialogVisible: false,
      products: [],
      packType: false, // 入库类型,默认按包裹入库 sku入库为true
      goodType: false, // 入库商品类型 扫码入库为 true
      selectedIndexs: []
    }
  },
  computed: {
    id() {
      return this.$router.currentRoute.query.id
    }
  },
  created() {
    // 做三件事 获取服务列表信息
    this.getItem()
  },

  methods: {
    async _getServiceList() {
      const res = await Axios.fetchGet(
        `/warehouse/firstpass/getContract?id=${this.id}`
      )
      try {
        res.data.others.forEach(serve => {
          serve.details.forEach(item => {
            item.serviceName = serve.name
            this.serviceList.push(item)
          })
        })
      } catch (err) {
        console.log(err)
      }
    },
    handleSkuRecords() {
      if (this.showSkuRecordDetail) {
        this.showSkuRecordDetail = !this.showSkuRecordDetail
        this.skuRecords = ''
        return
      }
      if (!this.skuRecords) {
        return this.$message.error('无扫描记录')
      }
      try {
        const skuList = this.skuRecords.split('\n')
        this.showSkuRecordDetail = true
        const obj = {}
        skuList
          .filter(x => !!x)
          .map(x => x.trim().toLocaleLowerCase())
          .forEach(x => {
            if (obj[x]) {
              obj[x] += 1
            } else {
              obj[x] = 1
            }
          })
        const newArr = Object.keys(obj).map(x => ({
          sku: x,
          number: obj[x],
          count: obj[x],
          disabled: true
        }))
        this.storageFrom.skuList = this.storageFrom.skuList.concat(newArr)
        for (let i = 0, l = this.storageFrom.skuList.length; i < l; i++) {
          const c_item = this.storageFrom.skuList[i]
          for (let j = i + 1; j < l; j++) {
            const n_item = this.storageFrom.skuList[j]
            if (n_item && n_item && c_item.sku === n_item.sku) {
              // 数量加一 删除 j
              c_item.number++
              this.storageFrom.skuList.splice(j, 1)
              j--
            }
          }
        }
        this.storageFrom.skuList.forEach(item => {
          if (!this.skuListForServiceIdObj[item.sku]) {
            this.storageFrom.skuList[item.sku] = []
            this.$set(this.skuListForServiceIdObj, item.sku, [])
          }
        })
      } catch (err) {
        this.$message.error('解析扫描入库失败')
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计包裹:'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 个'
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    async getItem() {
      if (this.id) {
        const item = await Axios.fetchGet(`/biz/firstpass/${this.id}`)
        this.storageFrom = item.data
        this.storageFrom.skuList = []
        this.storageFrom.packs.forEach(x => {
          x.goods.forEach(item => {
            this.packageList[item.sku] = this.packageList[item.sku] || 0
            this.packageList[item.sku] += x.count * item.count
            this.skuListForServiceIdObj[item.sku] = item.services.map(
              serve => serve.id
            )
            item.shopItemVos.forEach(shop => {
              const product = {
                id: shop.shopId,
                sku: shop.shopSku
              }
              this.products.push(product)
            })
            // 渲染默认的skuList

            this.storageFrom.skuList.push({
              sku: item.sku,
              number: x.count * item.count,
              count: '',
              id: item.goodId,
              disabled: true
            })
          })
        })
        // 储存默认值
        this.initDate = JSON.stringify({
          skuList: this.storageFrom.skuList,
          skuListForServiceIdObj: this.skuListForServiceIdObj
        })
      }
      console.log(this.storageFrom.skuList)
      this._getServiceList()
    },
    handleCheckedChange(sku) {
      this.$set(
        this.skuListForServiceIdObj,
        sku,
        this.skuListForServiceIdObj[sku]
      )
    },
    handleSkuAdd() {
      this.storageFrom.skuList.push([])
    },
    handleDeleteSku(scope) {
      this.storageFrom.skuList.splice(scope.$index, 1)
      delete this.skuListForServiceIdObj[scope.row.sku]
      this.$forceUpdate()
    },
    selectedItemSku(value, scope) {
      const index = scope.$index
      if (this.selectedIndexs.includes(index)) {
        // 包含则说明已经存在    只改变
        const list = Object.keys(this.skuListForServiceIdObj)
        const key = list[index]
        delete this.skuListForServiceIdObj[key]
      } else {
        this.selectedIndexs.push(index)
      }
      this.$set(this.skuListForServiceIdObj, value, [])
    },
    _resetForecastType() {
      // 切换手动入库类型时，重置为默认选项
      const initDate = JSON.parse(this.initDate)
      this.skuRecords = ''
      this.storageFrom.skuList = initDate.skuList.slice()
      this.skuListForServiceIdObj = initDate.skuListForServiceIdObj
    },
    handleSubmit() {
      const params = {
        goodType: this.goodType,
        id: this.id,
        type: this.packType
      }
      // 这里是包裹入库
      if (!this.packType) {
        // 处理下验证 是否所以的realCount都存在，并且都等于count
        const isError = this.storageFrom.packs.some(
          pack => pack.realCount !== pack.count
        )
        if (isError) {
          this.$alert('实收数目与应收数目不等')
          return
        }
        params.packs = this.storageFrom.packs.map(pack => {
          return {
            count: pack.count,
            id: pack.id,
            services: []
          }
        })
      } else {
        // 商品入库
        const goods = this.storageFrom.skuList.map(x => ({
          count: x.count,
          id: x.id ? x.id : this._renderProductId(x.sku, x),
          sku: x.sku,
          services: this._renderSkuServices(x.sku)
        }))
        params.goods = goods
      }
      this.$confirm(
        '本批次，卖家有服务请求，如已操作请点击确认，否则请点击返回',
        '提示',
        {
          confirmButtonText: '入库',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        Axios.fetchPost('/warehouse/firstpass/forecast', params).then(res => {
          if (res.code === 1) {
            this.$message.success(res.data)
          }
        })
      })
    },
    _renderProductId(sku, x) {
      console.log(x)
      return this.products.find(product => product.sku === sku).id
    },
    _renderSkuServices(sku) {
      const _arr = []
      const serviceIds = this.skuListForServiceIdObj[sku]
      this.serviceList.forEach(service => {
        serviceIds.forEach(id => {
          if (service.id === id) {
            _arr.push(service)
          }
        })
      })
      return _arr
    },
    _handleSkuRecords(skuRecords) {
      const arr = skuRecords.split('\n').filter(item => !!item)
      const lastSku = arr[arr.length - 1]
      // 判断这个值是否存在 lastSku中 即 this.products
      if (!this.products.map(item => item.sku).includes(lastSku)) {
        this.$alert(`该 SKU：${lastSku} 不存在`).then(() => {
          arr.pop()
          this.skuRecords = arr.join('\n') + '\n'
        })
      }
    }
  },
  watch: {
    skuRecords(nv) {
      if (nv.endsWith('\n')) {
        // 当有换行的时候，进行判断处理
        this._handleSkuRecords(nv)
      }
    },
    goodType() {
      this._resetForecastType()
    }
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.table-header {
  font-size: 14px;
  color: #606266;
  padding: 5px 0;
}
.product-collect {
  color: #606266;
  font-size: 14px;
  .el-row {
    border: 1px solid #d9d9d9;
    height: 45px;
    line-height: 45px;
  }
  .header {
    background: #f1f1f1;
    text-align: center;
  }
}
.forecaststorage-container {
  padding: 0 30px;
  width: 100%;
  // height: 100%;
  background: #ffffff;
  min-height: 100%;
  .title {
    &::before {
      content: '';
      width: 30px;
      height: 50px;
      background: #f8f8f8;
      margin-left: -30px;
    }
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
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
    margin-top: 20px;
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
          .el-input-group__append {
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

  .packagebox {
    width: 100%;
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
}
</style>
