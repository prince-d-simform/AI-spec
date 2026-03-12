import { type RouteProp, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APIDispatch } from '../../configs';
import { ROUTES, Strings } from '../../constants';
import { CartActions, CartSelectors } from '../../redux/cart';
import { ProductsActions, ProductsSelectors } from '../../redux/products';
import { useAppDispatch, useAppSelector } from '../../redux/useRedux';
import { navigateBack } from '../../utils';
import type {
  DetailSectionVisibility,
  ProductDetailRouteParams,
  UseDetailsReturn
} from './DetailsTypes';
import type { RemoteProductDetailResponse } from '../../types';

type DetailsRouteProp = RouteProp<{ [ROUTES.Details]: ProductDetailRouteParams }, ROUTES.Details>;

/**
 * Screen-level hook for the Product Detail page.
 *
 * Owns route-driven detail loading, retry handling, image selection, and derived section visibility.
 *
 * @returns {UseDetailsReturn} Product Detail state and handlers.
 */
const useDetails = (): UseDetailsReturn => {
  const dispatch = useAppDispatch();
  const route = useRoute<DetailsRouteProp>();
  const { id } = route.params;
  const refProductDetailDispatch = useRef<APIDispatch<RemoteProductDetailResponse> | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const productDetail = useAppSelector(ProductsSelectors.getSelectedProductDetail);
  const isProductDetailLoading = useAppSelector(ProductsSelectors.getProductDetailLoading);
  const productDetailError = useAppSelector(ProductsSelectors.getProductDetailError);
  const isProductDetailUnavailable = useAppSelector(ProductsSelectors.getProductDetailUnavailable);
  const cartControlState = useAppSelector((state) =>
    CartSelectors.getProductDetailCartControlState(state, id)
  );
  const cartErrorMessage = useAppSelector(CartSelectors.getCartError)?.message?.trim();

  const handleFetchProductDetail = useCallback(
    (productId: string): void => {
      if (!productId.trim()) {
        return;
      }

      refProductDetailDispatch.current?.abort();
      refProductDetailDispatch.current = dispatch(
        ProductsActions.getProductDetailRequest({
          paths: { id: productId },
          shouldShowToast: false
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    handleFetchProductDetail(id);

    return () => {
      refProductDetailDispatch.current?.abort();
      dispatch(ProductsActions.clearProductDetailState());
    };
  }, [dispatch, handleFetchProductDetail, id]);

  const heroImageUrls = useMemo<readonly string[]>(() => {
    if (!productDetail) {
      return [];
    }

    const seenImages = new Set<string>();

    return [productDetail.thumbnail, ...productDetail.images]
      .map((imageUrl) => imageUrl.trim())
      .filter(Boolean)
      .filter((imageUrl) => {
        if (seenImages.has(imageUrl)) {
          return false;
        }

        seenImages.add(imageUrl);
        return true;
      });
  }, [productDetail]);

  useEffect(() => {
    setSelectedImageUrl(heroImageUrls[0] ?? '');
  }, [heroImageUrls]);

  const detailSectionVisibility = useMemo<DetailSectionVisibility>(
    () => ({
      hasTags: !!productDetail?.tags.length,
      hasBrand: !!productDetail?.brand,
      hasFulfillmentInfo:
        !!productDetail?.shippingInformation ||
        !!productDetail?.warrantyInformation ||
        !!productDetail?.returnPolicy ||
        Number.isFinite(productDetail?.minimumOrderQuantity),
      hasSpecifications:
        !!productDetail?.sku ||
        Number.isFinite(productDetail?.weight) ||
        Number.isFinite(productDetail?.dimensions.width) ||
        Number.isFinite(productDetail?.dimensions.height) ||
        Number.isFinite(productDetail?.dimensions.depth),
      hasReviews: !!productDetail?.reviews.length,
      hasMetadata:
        !!productDetail?.meta.barcode ||
        !!productDetail?.meta.qrCode ||
        !!productDetail?.meta.createdAt ||
        !!productDetail?.meta.updatedAt
    }),
    [productDetail]
  );

  const productDetailErrorMessage = useMemo<string>(
    () => productDetailError?.message?.trim() || Strings.Details.errorMessage,
    [productDetailError?.message]
  );

  const shouldShowProductDetailError = useMemo<boolean>(
    () => !isProductDetailLoading && !isProductDetailUnavailable && !!productDetailError,
    [isProductDetailLoading, isProductDetailUnavailable, productDetailError]
  );

  const handleSelectImage = useCallback((imageUrl: string): void => {
    setSelectedImageUrl(imageUrl);
  }, []);

  const handleRetry = useCallback((): void => {
    handleFetchProductDetail(id);
  }, [handleFetchProductDetail, id]);

  const handleBackPress = useCallback((): void => {
    navigateBack();
  }, []);

  const handleAddToCart = useCallback((): void => {
    dispatch(CartActions.addProductToCart({ productId: id }));
  }, [dispatch, id]);

  const handleIncrementCartQuantity = useCallback((): void => {
    dispatch(CartActions.incrementCartProduct({ productId: id }));
  }, [dispatch, id]);

  const handleDecrementCartQuantity = useCallback((): void => {
    if (cartControlState.quantity <= 1) {
      dispatch(CartActions.removeCartProduct({ productId: id }));
      return;
    }

    dispatch(CartActions.decrementCartProduct({ productId: id }));
  }, [cartControlState.quantity, dispatch, id]);

  return {
    productId: id,
    productDetail,
    cartControlState,
    cartErrorMessage,
    heroImageUrls,
    selectedImageUrl,
    detailSectionVisibility,
    isProductDetailLoading,
    isProductDetailUnavailable,
    shouldShowProductDetailError,
    productDetailErrorMessage,
    handleSelectImage,
    handleRetry,
    handleBackPress,
    handleAddToCart,
    handleIncrementCartQuantity,
    handleDecrementCartQuantity
  };
};

export default useDetails;
