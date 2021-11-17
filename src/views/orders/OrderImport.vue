<template>
  <div>
    <div class="importdiv">
      <div class="importdivitem">
        <div class="importdivitem-left">选择店铺</div>
        <div class="importdivitem-right">
          <el-select v-model="shopId">
            <el-option
              v-for="shop in shopList"
              :key="shop.id"
              :value="shop.id"
              :label="shop.seller"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- <div class="importdivitem">
          <div class="importdivitem-left">
            <img src="/img/download.png" alt="" />
          </div>
          <div class="importdivitem-right">
            <p class="p16">批量导入产品信息</p>
            <p class="p14">请使用Excel创建一个.xls文件，格式如下</p>
            <el-link type="primary" href="">点击下载模板</el-link>
          </div>
        </div> -->
      <div class="importdivitem">
        <div class="importdivitem-left">
          <img src="/img/upload.png" alt="" />
        </div>
        <div class="importdivitem-right">
          <p class="p16">上传已下载好的产品信息</p>
          <p class="p14">
            <!-- csv -->
            文件后缀名必须为xls或xlsx（即Excel格式）,文件大小不得大于2M，超过2M的请分批导入
          </p>
          <upload-excel-component
            v-if="!fileName"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <el-link type="primary">上传文件</el-link>
          </upload-excel-component>
          <div class="file-icon" v-else>
            <i class="el-icon-document"></i>
            <span class="filename">{{ fileName }}</span>
            <i class="el-icon-close" @click="clearFile"></i>
          </div>
        </div>
      </div>

      <div class="importdivitem1">
        <p class="pp"><i class="el-icon-info"></i>特别提示</p>
        <p class="p14">1、客户单号为空，默认为系统自动生成单号</p>
        <p class="p14">
          2、请勿修改表格格式和重复导入Excel表格，否则无法导入
        </p>
      </div>
      <div class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="importFile">导入</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getListShop } from '@/https/api'

import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  data() {
    return {
      shopList: [],
      shopId: '',
      fileName: ''
    }
  },
  created() {
    this._getListShop()
  },
  methods: {
    _getListShop() {
      getListShop().then(res => {
        this.shopList = res.data.records
        this.shopId = (this.shopList.length && this.shopList[0].id) || ''
      })
    },
    async handleSuccess({ results, header }) {
      console.log(results)
      this.results = results
      this.$emit('openSelectDialog', header)
      // 这里生成一个表格类型的选择器
    },

    importFile() {
      const data = {
        shopId: this.shopId,
        orders: this.results
      }
      this.$emit('importFile', data)
    },

    clearFile() {
      this.fileName = ''
    },
    close() {
      this.$emit('close')
      this.clearFile()
    },

    showFileName() {
      this.fileName = this.file.name
    },

    beforeUpload(file) {
      this.file = file
      const isLt2M = file.size / 1024 / 1024 < 2

      if (isLt2M) {
        return true
      }

      this.$message({
        message: '文件大于2M!',
        type: 'warning'
      })
      return false
    }
  },
  components: {
    UploadExcelComponent
  }
}
</script>

<style lang="less" scoped>
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

.file-icon {
  margin-top: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 20px;
    margin-right: 5px;
    &.el-icon-close {
      font-size: 16px;
      &:hover {
        color: #409eff;
      }
    }
  }
  span.filename {
    font-size: 16px;
    color: #999;
    margin-right: 10px;
  }
}
</style>
