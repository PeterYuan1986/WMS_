/* eslint-disable indent */
// const platform = true
export const labelKeys = [
  {
    key: 'externalId',
    value: 'Order Number',
    title: '订单号'
  },
  {
    key: 'city',
    value: 'Ship To City',
    title: '城市'
  },
  {
    key: 'country',
    value: 'Ship To Country',
    title: '国家'
  },
  {
    key: 'count',
    value: 'Quantity Ordered',
    title: '商品数量'
  },
  {
    key: 'name',
    value: 'Item Seller Part #',
    title: '商品名称'
  },
  {
    key: 'sku',
    value: 'Item Seller Part #',
    title: '商品sku'
  },
  {
    key: 'mainStreet',
    value: 'Ship To Address Line 1',
    title: '收件人地址1'
  },
  {
    key: 'orderDate',
    value: 'Order Date & Time',
    title: '下单时间'
  },
  {
    key: 'firstName',
    value: 'Ship To First Name',
    title: '收件人姓氏'
  },
  {
    key: 'lastName',
    value: 'Ship To LastName',
    title: '收件人名称'
  },
  {
    key: 'receiverPhone',
    value: 'Ship To Phone Number',
    title: '收件人电话'
  },
  {
    key: 'state',
    value: 'Ship To State',
    title: '州'
  },
  {
    key: 'subStreet',
    value: 'Address Line 2',
    title: '收件人地址2'
  },
  {
    key: 'zipcode',
    value: 'Ship To ZipCode',
    title: '编码'
  }
]

// 处理 导入订单的参数

export const _handleImportParams = (orders, labelKeys) => {
  console.log('order')
  const _arr = []
  orders.forEach(order => {
    const params = {}
    Object.keys(order).forEach(o => {
      labelKeys.forEach(label => {
        if (o === label.value) {
          params[label.key] = order[o]
        }
      })
    })
    console.log(params.orderDate, 'orderDate')
    params.orderDate = new Date(params.orderDate).toISOString()
    params.receiver = params.firstName + ' ' + params.lastName
    params.goods = [
      {
        count: params.count,
        name: params.name || params.sku,
        sku: params.sku
      }
    ]
    delete params.firstName
    delete params.lastName
    delete params.count
    delete params.name
    delete params.sku
    _arr.push(params)
  })
  // 处理goods的重复订单
  return _handleGoodsArray(_arr)
}

// 当 externalId 相同时
// 否则 goods.push()
const _handleGoodsArray = (arr) => {
  // 默认将arr的第一个放入空数组中
  const _arr = [arr[0]]
  for (let index = 1; index < arr.length; index++) {
    const arrItem = arr[index]
    _arr.forEach(_arrItem => {
      if (arrItem.externalId === _arrItem.externalId) {
        arrItem.goods.concat(_arrItem.goods)
        arr.splice(index, 1)
        index--
      } else {
        _arr.push(arrItem)
      }
    })
  }
  return _arr
}