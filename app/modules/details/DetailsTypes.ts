export interface ProductDetailRouteParams {
  id: string;
}

export interface ProductDetailCartControlState {
  mode: 'add' | 'quantity';
  quantity: number;
  isMutating: boolean;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
}

export interface DetailSectionVisibility {
  hasTags: boolean;
  hasBrand: boolean;
  hasFulfillmentInfo: boolean;
  hasSpecifications: boolean;
  hasReviews: boolean;
  hasMetadata: boolean;
}

export interface UseDetailsReturn {
  productId: string;
  productDetail?: ProductDetail;
  cartControlState: ProductDetailCartControlState;
  cartErrorMessage?: string;
  heroImageUrls: readonly string[];
  selectedImageUrl: string;
  detailSectionVisibility: DetailSectionVisibility;
  isProductDetailLoading: boolean;
  isProductDetailUnavailable: boolean;
  shouldShowProductDetailError: boolean;
  productDetailErrorMessage: string;
  handleSelectImage: (imageUrl: string) => void;
  handleRetry: () => void;
  handleBackPress: () => void;
  handleAddToCart: () => void;
  handleIncrementCartQuantity: () => void;
  handleDecrementCartQuantity: () => void;
}
