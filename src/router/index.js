// /* global BigInt */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login.vue'
import Dashboard from '../components/dashboard.vue'
import Dashhome from '../components/dashhome.vue'
import AccoutSetting from '../views/acount/account-setting.vue'
// import Orders from '../views/orders/orders.vue'
import allorders from '../views/orders/allorders.vue'
import deleteorders from '../views/orders/deleteorders.vue'
import Storages from '../views/storage/storages.vue'
import forecaststorage from '../views/storage/forecaststorage.vue'
import bulkstorage from '../views/storage/bulkstorage.vue'
import allrecords from '../views/storage/allrecords.vue'
import recordsbin from '../views/storage/recordsbin.vue'
import returningbin from '../views/storage/returningbin.vue'
import shipmentbin from '../views/storage/shipmentbin.vue'
import directorder from '../views/storage/directorder.vue'
import returningstock from '../views/storage/returningstock.vue'
import batchorder from '../views/storage/batchorder.vue'
import totalorder from '../views/storage/totalorder.vue'
import orderrecycle from '../views/storage/orderrecycle.vue'
import fbashiping from '../views/storage/fbashiping.vue'
import tuning from '../views/storage/tuning.vue'
import clearinventory from '../views/storage/clearinventory.vue'
import inventoryrecord from '../views/storage/inventoryrecord.vue'
import operationflow from '../views/storage/operationflow.vue'
import Product from '../views/product/product.vue'
import ProductStore from '../views-store/product/product.vue'

import Warehouse from '../views/warehouse/warehouse.vue'
import allgoods from '../views/warehouse/allgoods.vue'
import deletegoods from '../views/warehouse/deletegoods.vue'
import sys from '../views/sys/index.vue'
import StoreInfo from '../views/sys/store-info.vue'
import Ht from '../views/sys/ht.vue'
import WarehouseList from '../views/warehouse-list/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '??????',
    component: Login
  },
  {
    path: '/dashhome',
    name: '??????',
    component: Dashboard,
    children: [
      {
        path: '/dashboard',
        name: '????????????',
        component: Dashhome
      },
      {
        path: '/account',
        name: '????????????',
        component: AccoutSetting
      },
      {
        path: '/product',
        name: '????????????',
        component: Product
      },
      {
        path: '/product-store',
        name: '????????????',
        component: ProductStore
      },
      {
        path: '/orders',
        name: '????????????',
        component: allorders,
        redirect: '/allorders',
        children: [
          {
            path: '/allorders',
            name: '????????????',
            component: allorders
          },
          {
            path: '/deleteorders',
            name: '????????????',
            component: deleteorders
          }
        ]
      },
      {
        path: '/storages',
        name: '????????????',
        component: Storages,
        children: [
          {
            path: '/sproduct',
            name: '??????????????????',
            component: Product
          },
          {
            path: '/storagedashboard',
            name: '????????????',
            component: Dashhome
          },
          {
            path: '/forecaststorage',
            name: '????????????',
            component: forecaststorage
          },
          {
            path: '/bulkstorage',
            name: '????????????',
            component: bulkstorage
          },
          {
            path: '/allrecords',
            name: '????????????',
            component: allrecords
          },
          {
            path: '/recordsbin',
            name: '???????????????',
            component: recordsbin
          },
          {
            path: '/otherstockrecord',
            name: '??????????????????',
            component: returningbin
          },
          {
            path: '/ordershipingrecord',
            name: '??????????????????',
            component: shipmentbin
          },
          {
            path: '/directorder',
            name: '????????????',
            component: directorder
          },
          {
            path: '/returningstock',
            name: '????????????',
            component: returningstock
          },
          {
            path: '/batchorder',
            name: '????????????',
            component: batchorder
          },
          {
            path: '/totalorder',
            name: '????????????',
            component: totalorder
          },
          {
            path: '/orderrecycle',
            name: '???????????????',
            component: orderrecycle
          },
          {
            path: '/fbashiping',
            name: 'FBA??????',
            component: fbashiping
          },
          {
            path: '/tuning',
            name: '??????',
            component: tuning
          },
          {
            path: '/clearinventory',
            name: '????????????',
            component: clearinventory
          },
          {
            path: '/inventoryrecord',
            name: '????????????',
            component: inventoryrecord
          },
          {
            path: '/operationflow',
            name: '????????????',
            component: operationflow
          }
        ]
      },
      {
        path: '/warehouse',
        name: '????????????',
        component: Warehouse,
        redirect: '/allgoods',
        children: [
          {
            path: '/allgoods',
            name: '????????????',
            component: allgoods
          },
          {
            path: '/deletegoods',
            name: '????????????',
            component: deletegoods
          }
        ]
      },
      {
        path: '/warehouse-list',
        name: '????????????',
        component: WarehouseList,
        children: [
          {
            path: '/allgoods',
            name: '?????????2???',
            component: allgoods
          },
          {
            path: '/deletegoods',
            name: '??????3??????',
            component: deletegoods
          }
        ]
      },
      {
        path: '/sys',
        name: '???????????? > ????????????',
        component: sys,
        children: [
          {
            path: '/store-info',
            name: '????????????',
            component: StoreInfo
          },
          {
            path: '/ht',
            name: '????????????',
            component: Ht
          }
        ]
      }
    ]
  }
]

// const routesForStore = [{
//   path: '/',
//   redirect: '/login'
// }]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // ??????????????????
  var islogin = true
  var token = window.localStorage.getItem('wms_auth_access_token')
  var expires = window.localStorage.getItem('wms_auth_expires')
  if (token && expires && Number(expires) > new Date().getTime()) {
    islogin = true
  } else {
    islogin = false
  }
  console.log(islogin)
  // ??????????????????????????????????????????????????????????????????????????????
  if (to.path === '/login' && !islogin) {
    return next()
  }
  if (to.path === '/login' && islogin && from.path !== '/dashboard') {
    return next('/dashboard')
  }
  // ??????????????????????????????????????????????????????
  if (!islogin) {
    return next('/login')
  } else {
    next()
  }
})

export default router
