/**
 * Transport object describing package dimensions for a remote product.
 */
export interface RemoteProductDimensions {
  depth: number;
  height: number;
  width: number;
}

/**
 * Transport object describing one remote review entry.
 */
export interface RemoteProductReview {
  comment: string;
  date: string;
  rating: number;
  reviewerEmail: string;
  reviewerName: string;
}

/**
 * Transport metadata returned for a remote product.
 */
export interface RemoteProductMeta {
  barcode: string;
  createdAt: string;
  qrCode: string;
  updatedAt: string;
}

/**
 * Raw product item returned by the `/products` endpoint.
 */
export interface RemoteProductRecord {
  availabilityStatus: string;
  brand?: string;
  category: string;
  description: string;
  dimensions: RemoteProductDimensions;
  discountPercentage: number;
  id: number;
  images: string[];
  meta: RemoteProductMeta;
  minimumOrderQuantity: number;
  price: number;
  rating: number;
  returnPolicy: string;
  reviews: RemoteProductReview[];
  shippingInformation: string;
  sku: string;
  stock: number;
  tags: string[];
  thumbnail: string;
  title: string;
  warrantyInformation: string;
  weight: number;
}

/**
 * Successful response payload for the all-products endpoint.
 */
export interface RemoteProductsResponse {
  limit: number;
  message?: string;
  products: RemoteProductRecord[];
  skip: number;
  total: number;
}

/**
 * Successful response payload for the category-products endpoint.
 */
export interface RemoteCategoryProductsResponse extends RemoteProductsResponse {}

/**
 * Successful response payload for the product-detail endpoint.
 */
export interface RemoteProductDetailResponse extends RemoteProductRecord {
  message?: string;
}
