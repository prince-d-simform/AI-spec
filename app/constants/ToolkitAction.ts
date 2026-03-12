/**
 * A list of all the possible toolkit actions that can be taken by the user.
 * @type {Object}
 */
export default Object.freeze({
  signin: 'auth/signin',
  getAllProducts: 'products/getAllProducts',
  getProductDetail: 'products/getProductDetail',
  getCategoryProducts: 'products/getCategoryProducts',
  getProductCategories: 'products/getProductCategories',
  createCart: 'cart/createCart',
  updateCart: 'cart/updateCart',
  addProductToCart: 'cart/addProductToCart',
  incrementCartProduct: 'cart/incrementCartProduct',
  decrementCartProduct: 'cart/decrementCartProduct',
  removeCartProduct: 'cart/removeCartProduct'
});
