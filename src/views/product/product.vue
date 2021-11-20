<template>
  <div>
    <no-page
      :searchForm="filters"
      :options="options"
      @handleFilter="handleFilter"
      @handleCurrentChange="handleCurrentChange"
      @handleBitchDispatch="handleBitchDispatch"
    >
      <template v-slot:filter>
        <el-form-item label="SKU:" prop="sku">
          <el-input
            class="filter-item input-normal"
            v-model="filters.sku"
            placeholder="请输入库存量单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名:" prop="name">
          <el-input
            class="filter-item input-normal"
            v-model="filters.name"
            placeholder="请输入商品名"
          ></el-input>
        </el-form-item>
      </template>

      <template v-slot:table-menu-right>
        <el-button-group>
          <el-button
            size="mini"
            class="filter-item"
            @click="handleAdd"
            type="primary"
            icon="icon iconfont icon-jia"
            >添加
          </el-button>
          <el-button
            size="mini"
            class="filter-item"
            @click="handleimport"
            type="primary"
            plain
            icon="icon iconfont icon-jichutubiao-"
            >导入
          </el-button>
        </el-button-group>
      </template>

      <template v-slot:table>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" width="75">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖家SKU">
          <template slot-scope="scope">
            <div>
              <span>{{$ifempty(scope.row.sku) }}</span>
              <!-- <el-popover
                placement="right-start"
                title=""
                trigger="hover"
                :visible-arrow="false"
              >
                <div class="countdiv">
                  <div
                    class="countitem"
                    v-for="(n, index) in scope.row.shopInfos"
                    :key="index"
                  >
                    <p>{{ n.shop_id }}：</p>
                    <p>{{ n.shop_sku }}</p>
                  </div>
                </div>
                <i class="el-icon-question" slot="reference"></i>
              </el-popover> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="getImageUrl(scope.row.imgurl)" class="small-iamge" />
          </template>
        </el-table-column>
        <el-table-column label="店铺SKU">
          <template slot-scope="scope">
            <span>{{
             $ifempty(
                get(scope, 'row.shopInfos', [])
                  .map(x => x.shop_sku)
                  .join(',')
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{$ifempty(scope.row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="100">
          <template slot-scope="scope">
            <span>{{$ifempty(scope.row.unit) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量" width="100">
          <template slot-scope="scope">
            <span
              >{{$ifempty(scope.row.weight) }} /
              {{ scope.row.weight && scope.row.weight_unit }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="尺寸">
          <template slot-scope="scope">
            <p>
              长： {{$ifempty(scope.row.length) }}
              {{$ifempty(scope.row.size_unit) }}
            </p>
            <p>
              宽： {{$ifempty(scope.row.width) }}
              {{$ifempty(scope.row.size_unit) }}
            </p>
            <p>
              高：{{$ifempty(scope.row.height) }}
              {{$ifempty(scope.row.size_unit) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span>{{$ifempty(scope.row.notes) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              title="编辑"
              type="success"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <template>
              <el-button
                title="删除"
                type="danger"
                size="mini"
                @click="handleDeleteClick(scope.row)"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </no-page>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleEditDialogClose"
    >
      <product-dialog
        :productForm="productForm"
        @close="dialogVisible = false"
        ref="productDialogRef"
      ></product-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="批量导入"
      :visible.sync="importdialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <div class="importdiv">
        <div class="importdivitem">
          <div class="importdivitem-left">
            <img src="/img/download.png" alt="" />
          </div>
          <div class="importdivitem-right">
            <p class="p16">批量导入产品信息</p>
            <p class="p14">请使用Excel创建一个.xls文件，格式如下</p>
            <el-link type="primary" href="">点击下载模板</el-link>
          </div>
        </div>
        <div class="importdivitem">
          <div class="importdivitem-left">
            <img src="/img/upload.png" alt="" />
          </div>
          <div class="importdivitem-right">
            <p class="p16">上传已下载好的产品信息</p>
            <p class="p14">
              文件后缀名必须为xls或xlsx（即Excel格式）,文件大小不得大于2M，超过2M的请分批导入
            </p>
            <upload-excel-component
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
            >
              <el-link type="primary"> 上传文件</el-link>
            </upload-excel-component>
          </div>
        </div>
        <div class="importdivitem1">
          <p class="pp"><i class="el-icon-info"></i>特别提示</p>
          <p class="p14">1、客户单号为空，默认为系统自动生成单号</p>
          <p class="p14">
            2、请勿修改表格格式和重复导入Excel表格，否则无法导入
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import noPage from '@/components/noPage/noPage.vue'
import { mapState } from 'vuex'
import { get, cloneDeep } from 'loadsh'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import Axios from '@/https/axios'
import productService from '../../services/productService'
import ProductDialog from './ProductDialog.vue'

export const initProductForm = {
  shopInfos: [{ shop_id: '' }],
  unit: null,
  name: null,
  length: null,
  size_unit: 'cm',
  width: null,
  height: null,
  weight: null,
  weight_unit: 'lbs',
  notes: null
}
export default {
  components: { noPage, UploadExcelComponent, ProductDialog },

  data() {
    return {
      editForm: { name: null, size_unit: '1', width: '' },
      importdialogVisible: false,
      dialogVisible: false,
      options: [
        {
          isDefault: 1,
          value: 'delete',
          label: '删除'
        }
      ],

      imgurl: '',
      title: '',
      productUnit: [
        {
          value: '条',
          label: '件'
        },
        {
          value: '条',
          label: '条'
        },
        {
          value: '个',
          label: '个'
        }
      ],
      shoplist: [],
      productForm: cloneDeep(initProductForm)
    }
  },
  computed: {
    ...mapState('noPage', {
      pagination: state => state.pagination
    }),

    filters: {
      get() {
        return this.$store.state.noPage.filters
      },
      set(value) {
        console.log({ value })
        this.$store.commit('noPage/updateMessage', value)
      }
    }
  },
  beforeMount() {
    this.$store.commit('noPage/setApi', '/iteminfo/search')
  },
  methods: {
    get,
    getImageUrl(imgurl) {
      if (imgurl) {
        return '/api/file/?key=' + imgurl
      }
      return null
    },
    submitForm() {
      if (this.title === '添加新商品') {
        this.$refs.productDialogRef.addItem()
      }

      if (this.title === '编辑产品') {
        this.$refs.productDialogRef.updateItem()
      }
    },
    handleimport() {
      this.importdialogVisible = true
    },
    handleEdit(row) {
      this.productForm = row
      this.title = '编辑产品'
      if (!this.productForm.shopInfos || !this.productForm.shopInfos.length) {
        this.productForm.shopInfos = [{ shopId: '', shopSku: '' }]
      }
      this.dialogVisible = true
    },
    delSKURow(index) {
      this.productForm.shopInfos.splice(index, 1)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '文件大于1M!',
        type: 'warning'
      })
      return false
    },
    async handleDeleteClick(item) {
      this.$confirm('是否确定删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await productService.deleteItem({ openid: item.openid })
        console.log('Request cancled', item)
        this.$store.dispatch('noPage/init')
        this.$message.success('删除成功')
      })
    },
    async handleSuccess({ results, header }) {
      console.log({ results, header })
      // this.tableHeader = header
      await Axios.fetchPost(
        '/iteminfo/addBatch',
        results.map(x => {
          return {
            height: x['高'],
            length: x['长'],
            name: x['商品名称'],
            notes: x['备注'],
            size_unit: x['尺寸单位'],
            sku: x.SKU,
            unit: x['商品单位'],
            weight: x['重量'],
            weight_unit: x['重量单位'],
            width: x['宽']
          }
        })
      )
      this.$store.dispatch('noPage/init')
      this.importdialogVisible = false
      this.$message.success('添加成功')
    },
    handleAdd() {
      this.productForm = cloneDeep(initProductForm)
      this.title = '添加新商品'
      this.dialogVisible = true
    },

    handleClose(done) {
      done()
    },
    handleEditDialogClose(done) {
      this.productForm = cloneDeep(initProductForm)
      done()
    },
    handleFilter(value) {
      this.$store.dispatch('noPage/init')
    },
    handleCancleRequest() {},
    async handleBitchDispatch(key, array) {
      console.log(key, array)
      if (!array.length) this.$message.warning('请选择要批量操作的行')
      this.$confirm('是否确定删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await Axios.axios(
          `/iteminfo/batchDel?${array.map(x => 'ids=' + x.openid).join('&')}`,
          {
            method: 'delete'
          }
        )
        this.$store.dispatch('noPage/init')
        this.$message.success('添加成功')
      })
    },
    handleCurrentChange(object) {
      console.log(object)
    }
  }
}
</script>

<style lang="less" scoped>
.small-iamge {
  display: block;
  margin: 0 auto;
  max-width: 100px;
  max-height: 100px;
}

.el-dialog__body {
  padding: 20px 10px;
}
/deep/.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__header {
      padding: 10px 20px 10px;
      background: #efefef;
    }

    .el-dialog__body {
      padding: 20px 20px;
    }

    .el-dialog__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #b9b9b925;
    }
  }
}

/deep/.el-form-item {
  .el-form-item__content {
    .avatar-uploader {
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
  }
}
.product-form {
  /deep/.el-form-item {
    margin-right: 0px;
    .el-form-item__content {
      // width: calc(100% - 100px);
      .avatar-uploader .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 340px;
        height: 350px;
        line-height: 350px;
        text-align: center;
      }
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
    }
  }
}
.col-label {
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  padding-right: 10px;
}
.importdiv {
  padding: 0px 30px;
  box-sizing: border-box;
  .importdivitem {
    width: 100%;
    height: 130px;
    background: rgba(47, 143, 251, 0.05);
    border: 1px solid rgba(47, 143, 251, 0.2);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .importdivitem-left {
      height: 100%;
      width: 20%;
      border-right: 1px solid #2f8efb2f;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .importdivitem-right {
      // height: 100%;
      width: 75%;
      .p16 {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #666666;
        line-height: 24px;
      }
      .p14 {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        line-height: 24px;
      }
      /deep/.upload-demo {
        display: flex;
        align-items: center;
        ul {
          li {
            margin: 0;
            .el-upload-list__item-name {
              color: #409eff;
            }
          }
        }
      }
    }
  }
  .importdivitem1 {
    width: 100%;
    height: 130px;
    background: rgba(251, 167, 47, 0.1);
    border: 1px solid rgba(251, 167, 47, 0.2);
    border-radius: 5px;
    padding: 20px;
    box-sizing: border-box;
    .pp {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
      line-height: 30px;
      i {
        color: #fba72f;
        font-size: 18px;
        margin-right: 5px;
      }
    }
    .p14 {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
      line-height: 24px;
      text-indent: 20px;
    }
  }
  .importsuccess {
    margin-left: 50%;
    transform: translateX(-50%);
    img {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .importstatu {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
      text-align: center;
    }
    .listinfo {
      margin-left: 50%;
      transform: translateX(-50%);
      width: 401px;
      height: 60px;
      background: rgba(47, 143, 251, 0.05);
      border: 1px solid rgba(47, 143, 251, 0.2);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      p {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #666666;
        line-height: 24px;
        span {
          font-weight: 400;
        }
      }
      .green {
        color: #30ac2d;
      }
      .red {
        color: #e82424;
      }
    }
  }
  .importerror {
    margin-left: 50%;
    transform: translateX(-50%);
    img {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .importstatu {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
      text-align: center;
    }
    .listinfo {
      margin-left: 50%;
      transform: translateX(-50%);
      width: 830px;
      height: 290px;
      background: rgba(47, 143, 251, 0.05);
      border: 1px solid rgba(47, 143, 251, 0.2);
      border-radius: 5px;
      padding: 20px;
      box-sizing: border-box;
      .listinfoitem {
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px dashed rgba(47, 143, 251, 0.2);
        p {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #666666;
          line-height: 24px;
          margin-right: 50px;
          span {
            font-weight: 400;
          }
        }
        .green {
          color: #30ac2d;
        }
        .red {
          color: #e82424;
        }
      }
      .pp {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        line-height: 30px;
        i {
          color: #e82424;
          font-size: 18px;
          margin-right: 5px;
        }
      }
      .errorlist {
        width: 100%;
        height: 240px;
        overflow: auto;
        p {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #e82424;
          line-height: 24px;
        }
      }
    }
  }
}
.shopSku {
  /deep/.el-form-item__label {
    text-align: left;
  }
}
</style>
