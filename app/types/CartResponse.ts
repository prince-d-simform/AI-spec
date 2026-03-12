export interface CartRequestProductInput {
  id: number;
  quantity: number;
}

export interface AddCartRequest {
  userId: number;
  products: CartRequestProductInput[];
}

export interface RemoteCartProductResponse {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice?: number;
  discountedTotal?: number;
  thumbnail: string;
}

export interface RemoteCartResponse {
  id: number;
  products: RemoteCartProductResponse[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  message?: string;
}
