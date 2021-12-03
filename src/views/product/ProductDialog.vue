<template>
  <el-form
    :model="productFormDialog"
    class="product-form"
    label-width="100px"
    :rules="productRules"
    size="small"
    ref="productDialogRef"
    :inline="true"
  >
    <el-row type="flex" align="middle" justify="center" class="row-bg">
      <el-col :span="12" style="text-align: center">
        <el-form-item prop="imgurl" style="margin-top: 20px">
          <el-upload
          :disabled="showDisabled"
            class="avatar-uploader"
            action="/api/file/upload"
            :headers="{
              Authorization
            }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgurl" :src="imgurl" class="product-image" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <p
          style="
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: rgb(0, 0, 0);
                line-height: 50px;
                text-align: left;
                font-size: 16px;
              "
        >
          基本信息
        </p>
        <!-- todo: 新增名称和商品sku -->
        <el-form-item label="商品sku:" prop="sku">
          <el-input
            :disabled="showDisabled"
            style="width: 198px"
            v-model="productFormDialog.sku"
            placeholder="请输入商品SKU"
          ></el-input>
        </el-form-item>
        <el-form-item class="item-block" v-if="showDisabled">
          <el-button type="primary">打印sku</el-button>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input
            style="width: 198px"
            :disabled="showDisabled"
            v-model="productFormDialog.name"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位:" prop="unit">
          <el-select
            filterable
            allow-create
            :disabled="showDisabled"
            default-first-option
            v-model="productFormDialog.unit"
            placeholder="请输入单位"
          >
            <el-option
              v-for="item in productUnit"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长:" prop="length">
          <el-input
            type="number"
            :disabled="showDisabled"
            v-model="productFormDialog.length"
            placeholder="请输入长"
          >
            <el-select
              v-model="productFormDialog.size_unit"
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
          <el-input
            type="number"
            :disabled="showDisabled"
            v-model="productFormDialog.width"
            placeholder="请输入宽"
          >
            <el-select
              v-model="productFormDialog.size_unit"
              slot="append"
              placeholder=""
            >
              <el-option label="cm" value="cm"></el-option>
              <el-option label="inch" value="inch"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="高:" prop="height">
          <el-input
            type="number"
            :disabled="showDisabled"
            v-model="productFormDialog.height"
            placeholder="请输入高"
          >
            <el-select
              v-model="productFormDialog.size_unit"
              slot="append"
              placeholder=""
            >
              <el-option label="cm" value="cm"></el-option>
              <el-option label="inch" value="inch"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="重量:" prop="weight">
          <el-input
            type="number"
            :disabled="showDisabled"
            v-model="productFormDialog.weight"
            placeholder="请输入重量"
          >
            <el-select
              v-model="productFormDialog.weight_unit"
              slot="append"
              placeholder=""
            >
              <el-option label="lbs" value="lbs"></el-option>
              <el-option label="kg" value="kg"></el-option>
              <el-option label="oz" value="oz"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div>
      <span
        style="
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #000;
              line-height: 50px;
            "
      >
        对应SKU:
      </span>
      <el-button
        @click="addSKURow"
        size="small"
        icon="el-icon-plus"
        style="float: right; margin-top: 10px; margin-right: 34px"
      ></el-button>
    </div>
    <el-row type="flex" class="shopSku" justify="space-between">
      <el-col :span="11">
        <el-form-item label="店铺名称:" prop="shopId">
          <el-select
            style="width: 314px; margin-bottom: 10px; height: 32px"
            v-for="(shopInfo, index) in productFormDialog.shopInfos"
            :key="index"
            clearable
            v-model="shopInfo.shopId"
            placeholder="请选择店铺名称"
            @change="changeShopName(shopInfo)"
          >
            <el-option
              v-for="(item, index) in shoplist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="11">
        <el-form-item label="店铺SKU:" prop="shopSku">
          <div>
            <el-input
              :disabled="showDisabled"
              style="width: 314px; margin-bottom: 10px"
              :placeholder="'SKU序号-' + (index + 1)"
              v-for="(item, index) in productFormDialog.shopInfos"
              :key="index"
              v-model="item.shopSku"
              class="input-with-select"
            >
              <el-button
                @click="delSKURow(index)"
                slot="append"
                icon="el-icon-minus"
                circle
              ></el-button>
            </el-input>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注:" label-width="50" prop="notes">
      <el-input
        :disabled="showDisabled"
        type="textarea"
        maxlength="300"
        style="width: 760px"
        rows="6"
        show-word-limit
        v-model="productFormDialog.notes"
        placeholder="请填写备注相关信息"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import Axios from '@/https/axios'
import { cloneDeep } from 'loadsh'
import productService from '../../services/productService'
export default {
  props: {
    productForm: Object,
    showDisabled: Boolean
  },
  data() {
    return {
      productRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        sku: [{ required: true, message: '请输入商品SKU', trigger: 'blur' }],
        length: [{ required: false, message: '请输入商品长', trigger: 'blur' }],
        width: [{ required: false, message: '请输入商品宽', trigger: 'blur' }],
        height: [{ required: false, message: '请输入商品高', trigger: 'blur' }],
        weight: [
          { required: false, message: '请输入商品重量', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请选择商品单位', trigger: 'blur' }]
      },
      imgurl: '',
      shoplist: [],
      productUnit: [
        {
          key: 1,
          value: '条',
          label: '件'
        },
        {
          key: 2,
          value: '条',
          label: '条'
        },
        {
          key: 3,
          value: '个',
          label: '个'
        }
      ],
      productFormDialog: null
    }
  },
  computed: {
    Authorization() {
      return window.localStorage.getItem('wms_auth_access_token')
    }
  },
  created() {
    this.productFormDialog = cloneDeep(this.productForm)
    this.getShopList()
    const { imgurl } = this.productFormDialog
    this.imgurl = imgurl ? '/api/file/?key=' + imgurl : imgurl
  },
  methods: {
    changeShopName(shopInfo) {
      const shopItem = this.shoplist.find(
        shop => shop.value === shopInfo.shopId
      )
      shopInfo.shopName = shopItem.label
    },
    async getShopList() {
      const res = await Axios.fetchGet('/seller/shop/listShop')
      this.shoplist = res.data.records.map(x => ({
        label: x.name,
        value: x.id
      }))
      // this.options = res.records.map(x=>{})
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.imgurl = URL.createObjectURL(file.raw)
      this.productFormDialog.imgurl = res.data
    },
    addSKURow() {
      this.productFormDialog.shopInfos = this.productFormDialog.shopInfos || []
      this.productFormDialog.shopInfos.push({ shopId: '', shopSku: '' })
    },
    addItem() {
      this.$refs.productDialogRef.validate(async valid => {
        if (valid) {
          const {
            name,
            unit,
            sku,
            imgurl,
            length,
            height,
            width,
            weight_unit,
            size_unit,
            weight,
            notes,
            shopInfos
          } = this.productFormDialog

          try {
            await productService.addItem({
              name,
              unit,
              sku,
              imgurl,
              length,
              height,
              width,
              weight_unit,
              size_unit,
              weight,
              notes,
              shopInfos
            })
            this.dialogVisible = false
            this.$store.dispatch('noPage/init')
            this.$message.success('添加成功')
            this.$refs.productDialogRef.resetFields()
            // 关闭弹窗
            this.$emit('close')
          } catch (err) {
            this.$message.error(err.payload.message)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateItem() {
      this.$refs.productDialogRef.validate(async valid => {
        if (valid) {
          try {
            await this.updateList({
              ...this.productFormDialog
            })
            this.$store.dispatch('noPage/init')
            this.$emit('close')
            this.$refs.productDialogRef.resetFields()
            this.$message.success('修改完成')
          } catch (err) {
            this.$message.error(err)
          }
        }
      })
    },
    updateList(data) {
      const {
        height,
        length,
        imgurl,
        name,
        notes,
        shopInfos,
        size_unit,
        sku,
        unit,
        weight,
        weight_unit,
        width
      } = data
      return productService.updateItem(
        {
          height,
          imgurl,
          length,
          name,
          notes,
          shopInfos,
          size_unit,
          sku,
          unit,
          weight,
          weight_unit,
          width
        },
        data.openid
      )
    }
  },
  watch: {
    productForm(nv) {
      this.imgurl = nv.imgurl ? '/api/file/?key=' + nv.imgurl : nv.imgurl
    }
  }
}
</script>

<style scoped>
.product-image {
  display: block;
  max-width: 340px;
  max-height: 350px;
}
.item-block {
  padding-left: 100px;
  display: block !important;
}
</style>
