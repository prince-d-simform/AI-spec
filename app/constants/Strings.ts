import { I18n } from '../translations';

/**
 * An object that represents a mapping of keys to string values.
 * @interface
 */
interface KeyStringValueMap {
  [key: string]: string;
}

/**
 * Freezes an object conforming to the KeyStringValueMap interface.
 * @function
 * @param {T} strings - The object to be frozen.
 * @returns {T} The frozen object.
 */
const freezeStringsObject = <T extends KeyStringValueMap>(strings: T): T => Object.freeze(strings);

/**
 * An object that contains all of the possible error messages that can be returned by the API.
 * @readonly
 * @enum {string}
 */
const APIError = freezeStringsObject({
  somethingWentWrong: I18n.t('apiError:somethingWentWrong'),
  networkError: I18n.t('apiError:networkError'),
  serverError: I18n.t('apiError:serverError'),
  timeoutError: I18n.t('apiError:timeoutError'),
  clientError: I18n.t('apiError:clientError'),
  cancelError: I18n.t('apiError:cancelError'),
  connectionError: I18n.t('apiError:connectionError'),
  unexpectedError: I18n.t('apiError:unexpectedError'),
  cancelSagaError: I18n.t('apiError:cancelSagaError'),
  error: I18n.t('apiError:error')
});

/**
 * A collection of error messages for the Yup validation schema.
 * @type {Object}
 */
const YupError = freezeStringsObject({
  requireEmailError: I18n.t('yupError:requireEmailError'),
  invalidEmailError: I18n.t('yupError:invalidEmailError'),
  requirePasswordError: I18n.t('yupError:requirePasswordError'),
  lengthPasswordError: I18n.t('yupError:lengthPasswordError'),
  lowercasePasswordError: I18n.t('yupError:lowercasePasswordError'),
  uppercasePasswordError: I18n.t('yupError:uppercasePasswordError'),
  specialPasswordError: I18n.t('yupError:specialPasswordError'),
  digitPasswordError: I18n.t('yupError:digitPasswordError')
});

const Home = freezeStringsObject({
  homeScreenTitle: I18n.t('home:title'),
  details: I18n.t('home:details'),
  signIn: I18n.t('home:signIn'),
  lightTheme: I18n.t('home:lightTheme'),
  darkTheme: I18n.t('home:darkTheme'),
  discoverProducts: I18n.t('home:discoverProducts'),
  findSomething: I18n.t('home:findSomething'),
  categoryAll: I18n.t('home:categoryAll'),
  categoryLoadError: I18n.t('home:categoryLoadError'),
  categoryProductsLoadError: I18n.t('home:categoryProductsLoadError'),
  categoryProductsLoading: I18n.t('home:categoryProductsLoading'),
  emptyStateAll: I18n.t('home:emptyStateAll'),
  retryCategories: I18n.t('home:retryCategories'),
  retryCategoryProducts: I18n.t('home:retryCategoryProducts'),
  emptyState: I18n.t('home:emptyState'),
  productLoadError: I18n.t('home:productLoadError'),
  productLoading: I18n.t('home:productLoading'),
  productRefreshError: I18n.t('home:productRefreshError'),
  pricePrefix: I18n.t('home:pricePrefix'),
  retryProducts: I18n.t('home:retryProducts')
});

const Tabs = freezeStringsObject({
  homeLabel: I18n.t('tabs:homeLabel'),
  cartLabel: I18n.t('tabs:cartLabel'),
  profileLabel: I18n.t('tabs:profileLabel')
});

const Cart = freezeStringsObject({
  screenTitle: I18n.t('cart:screenTitle'),
  emptyTitle: I18n.t('cart:emptyTitle'),
  emptyMessage: I18n.t('cart:emptyMessage'),
  errorTitle: I18n.t('cart:errorTitle'),
  errorMessage: I18n.t('cart:errorMessage'),
  retryButton: I18n.t('cart:retryButton'),
  summaryTitle: I18n.t('cart:summaryTitle'),
  totalProductsLabel: I18n.t('cart:totalProductsLabel'),
  totalQuantityLabel: I18n.t('cart:totalQuantityLabel'),
  subtotalLabel: I18n.t('cart:subtotalLabel'),
  discountedSubtotalLabel: I18n.t('cart:discountedSubtotalLabel'),
  discountAmountLabel: I18n.t('cart:discountAmountLabel'),
  taxLabel: I18n.t('cart:taxLabel'),
  shippingLabel: I18n.t('cart:shippingLabel'),
  grandTotalLabel: I18n.t('cart:grandTotalLabel'),
  unavailableValue: I18n.t('cart:unavailableValue'),
  productIdLabel: I18n.t('cart:productIdLabel'),
  unitPriceLabel: I18n.t('cart:unitPriceLabel'),
  lineTotalLabel: I18n.t('cart:lineTotalLabel'),
  discountedLineTotalLabel: I18n.t('cart:discountedLineTotalLabel'),
  quantityLabel: I18n.t('cart:quantityLabel'),
  discountLabel: I18n.t('cart:discountLabel'),
  invalidProductMessage: I18n.t('cart:invalidProductMessage')
});

const Details = freezeStringsObject({
  detailsScreenTitle: I18n.t('details:title'),
  loadingTitle: I18n.t('details:loadingTitle'),
  loadingMessage: I18n.t('details:loadingMessage'),
  errorTitle: I18n.t('details:errorTitle'),
  errorMessage: I18n.t('details:errorMessage'),
  unavailableTitle: I18n.t('details:unavailableTitle'),
  unavailableMessage: I18n.t('details:unavailableMessage'),
  retryButton: I18n.t('details:retryButton'),
  backButton: I18n.t('details:backButton'),
  descriptionTitle: I18n.t('details:descriptionTitle'),
  tagsTitle: I18n.t('details:tagsTitle'),
  fulfillmentTitle: I18n.t('details:fulfillmentTitle'),
  specificationsTitle: I18n.t('details:specificationsTitle'),
  reviewsTitle: I18n.t('details:reviewsTitle'),
  metadataTitle: I18n.t('details:metadataTitle'),
  brandLabel: I18n.t('details:brandLabel'),
  categoryLabel: I18n.t('details:categoryLabel'),
  skuLabel: I18n.t('details:skuLabel'),
  stockLabel: I18n.t('details:stockLabel'),
  availabilityLabel: I18n.t('details:availabilityLabel'),
  discountLabel: I18n.t('details:discountLabel'),
  ratingLabel: I18n.t('details:ratingLabel'),
  weightLabel: I18n.t('details:weightLabel'),
  minimumOrderQuantityLabel: I18n.t('details:minimumOrderQuantityLabel'),
  shippingLabel: I18n.t('details:shippingLabel'),
  warrantyLabel: I18n.t('details:warrantyLabel'),
  returnPolicyLabel: I18n.t('details:returnPolicyLabel'),
  widthLabel: I18n.t('details:widthLabel'),
  heightLabel: I18n.t('details:heightLabel'),
  depthLabel: I18n.t('details:depthLabel'),
  createdAtLabel: I18n.t('details:createdAtLabel'),
  updatedAtLabel: I18n.t('details:updatedAtLabel'),
  barcodeLabel: I18n.t('details:barcodeLabel'),
  qrCodeLabel: I18n.t('details:qrCodeLabel'),
  imageUnavailable: I18n.t('details:imageUnavailable'),
  noReviews: I18n.t('details:noReviews'),
  discountSuffix: I18n.t('details:discountSuffix'),
  addToCartButton: I18n.t('details:addToCartButton'),
  increaseQuantityButton: I18n.t('details:increaseQuantityButton'),
  decreaseQuantityButton: I18n.t('details:decreaseQuantityButton'),
  removeFromCartButton: I18n.t('details:removeFromCartButton')
});

const Profile = freezeStringsObject({
  screenTitle: I18n.t('profile:screenTitle'),
  emptyTitle: I18n.t('profile:emptyTitle'),
  emptyMessage: I18n.t('profile:emptyMessage')
});

const Auth = freezeStringsObject({
  hintEmail: I18n.t('auth:hintEmail'),
  hintPassword: I18n.t('auth:hintPassword'),
  btnSignIn: I18n.t('auth:btnSignIn')
});

/**
 * Exporting all the strings in one object..
 * Separate string object like Home, Details & Auth etc...
 * base on your modules dir structure
 * @type {Object.<string, Record<string, string>>}
 */
export default Object.freeze({
  APIError,
  YupError,
  Home,
  Tabs,
  Cart,
  Details,
  Profile,
  Auth
});
