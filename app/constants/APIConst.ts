/**
 * A constant freezing object that contains the paths to the API endpoint url.
 * @type {Object}
 */
export default Object.freeze({
  signin: '/login',
  products: '/products',
  productDetail: '/products/{id}',
  productsByCategory: '/products/category/{slug}',
  productCategories: '/products/categories'
});
