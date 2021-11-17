import { fetchGet, fetchPost } from './axios'

// 获取卖家店铺列表
export const getListShop = () => {
  return fetchGet('/seller/shop/listShop')
}

// 导入平台订单
export const importOrders = data => {
  return fetchPost('/seller/secondpass/ext/importOrders', data)
}
