import CONFIG from "../config"
const shopCart = []

function getShopCart() {
  return shopCart
}

function addShopCart(data) {
  const shopCart = getShopCart()
  let item
  item = {
    key: data.key,
    name: data.name,
    sku: data.sku,
    price: data.price,
    number: data.number,
  }
  try {
    shopCart.push(item)
    return true
  } catch (error) {
    return false
  }
}

function deleteItemByIndex(index) {
  const shopCart = getShopCart()
  shopCart.splice(index, 1)
  return true
}

function deleteItemByKey(key) {
  if(typeof(key) != 'string') {
    return false
  }
  const shopCart = getShopCart()
  const findKey = (element) => element.key === key;
  shopCart.splice(shopCart.findIndex(findKey), 1)
  return true
}

function clearShopCart() {
  shopCart = []
}

module.exports = {
  getShopCart: getShopCart,
  deleteItemByIndex: deleteItemByIndex,
  deleteItemByKey: deleteItemByKey,
  addShopCart: addShopCart,
  clearShopCart: clearShopCart,
}