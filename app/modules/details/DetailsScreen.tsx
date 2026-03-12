import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, type FC } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { CustomButton, CustomHeader, Spinner, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { scale } from '../../theme';
import styleSheet from './DetailsStyles';
import useDetails from './useDetails';
import type {
  DetailSectionVisibility,
  ProductDetail,
  ProductDetailCartControlState
} from './DetailsTypes';

/**
 * Formats a date for shopper-facing display.
 *
 * @param {string} value - The raw date string.
 * @returns {string} The formatted date string.
 */
function formatDateValue(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString();
}

type DetailsStyles = ReturnType<typeof styleSheet>;
type RenderDetailRow = (label: string, value?: string | number | null) => React.ReactElement | null;

interface ProductContentProps {
  styles: DetailsStyles;
  productDetail: ProductDetail;
  heroImageUrls: readonly string[];
  selectedImageUrl: string;
  detailSectionVisibility: DetailSectionVisibility;
  renderDetailRow: RenderDetailRow;
  handleSelectImage: (imageUrl: string) => void;
}

interface CartFooterProps {
  styles: DetailsStyles;
  cartControlState: ProductDetailCartControlState;
  cartErrorMessage?: string;
  handleAddToCart: () => void;
  handleIncrementCartQuantity: () => void;
  handleDecrementCartQuantity: () => void;
}

/**
 * Renders the product-detail content body after loading succeeds.
 *
 * @param {ProductContentProps} props - Product content props.
 * @returns {React.ReactElement} Product content.
 */
function renderProductContent({
  styles,
  productDetail,
  heroImageUrls,
  selectedImageUrl,
  detailSectionVisibility,
  renderDetailRow,
  handleSelectImage
}: ProductContentProps): React.ReactElement {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        {selectedImageUrl ? (
          <Image resizeMode="cover" source={{ uri: selectedImageUrl }} style={styles.heroImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{Strings.Details.imageUnavailable}</Text>
          </View>
        )}

        {heroImageUrls.length > 1 ? (
          <ScrollView
            horizontal
            contentContainerStyle={styles.thumbnailRow}
            showsHorizontalScrollIndicator={false}
          >
            {heroImageUrls.map((imageUrl) => (
              <Pressable
                accessibilityRole="button"
                key={imageUrl}
                style={[
                  styles.thumbnailButton,
                  selectedImageUrl === imageUrl ? styles.thumbnailButtonSelected : undefined
                ]}
                onPress={() => handleSelectImage(imageUrl)}
              >
                <Image
                  resizeMode="cover"
                  source={{ uri: imageUrl }}
                  style={styles.thumbnailImage}
                />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.title}>{productDetail.title}</Text>

        <View style={styles.summaryMetaRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{productDetail.category}</Text>
          </View>
          {productDetail.brand ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{productDetail.brand}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {Strings.Home.pricePrefix}
            {productDetail.price.toFixed(2)}
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {productDetail.discountPercentage.toFixed(0)}
              {Strings.Details.discountSuffix}
            </Text>
          </View>
        </View>

        <View style={styles.dataPairRow}>
          <View style={styles.dataPair}>
            <Text style={styles.dataPairLabel}>{Strings.Details.ratingLabel}</Text>
            <Text style={styles.dataPairValue}>{productDetail.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.dataPair}>
            <Text style={styles.dataPairLabel}>{Strings.Details.stockLabel}</Text>
            <Text style={styles.dataPairValue}>{productDetail.stock}</Text>
          </View>
          <View style={styles.dataPair}>
            <Text style={styles.dataPairLabel}>{Strings.Details.availabilityLabel}</Text>
            <Text style={styles.dataPairValue}>{productDetail.availabilityStatus}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{Strings.Details.descriptionTitle}</Text>
        <Text style={styles.sectionText}>{productDetail.description}</Text>
      </View>

      {detailSectionVisibility.hasTags ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{Strings.Details.tagsTitle}</Text>
          <View style={styles.tagRow}>
            {productDetail.tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {detailSectionVisibility.hasFulfillmentInfo ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{Strings.Details.fulfillmentTitle}</Text>
          {renderDetailRow(Strings.Details.shippingLabel, productDetail.shippingInformation)}
          {renderDetailRow(Strings.Details.warrantyLabel, productDetail.warrantyInformation)}
          {renderDetailRow(Strings.Details.returnPolicyLabel, productDetail.returnPolicy)}
          {renderDetailRow(
            Strings.Details.minimumOrderQuantityLabel,
            productDetail.minimumOrderQuantity
          )}
        </View>
      ) : null}

      {detailSectionVisibility.hasSpecifications ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{Strings.Details.specificationsTitle}</Text>
          {detailSectionVisibility.hasBrand
            ? renderDetailRow(Strings.Details.brandLabel, productDetail.brand)
            : null}
          {renderDetailRow(Strings.Details.categoryLabel, productDetail.category)}
          {renderDetailRow(Strings.Details.skuLabel, productDetail.sku)}
          {renderDetailRow(Strings.Details.weightLabel, productDetail.weight)}
          {renderDetailRow(Strings.Details.widthLabel, productDetail.dimensions.width)}
          {renderDetailRow(Strings.Details.heightLabel, productDetail.dimensions.height)}
          {renderDetailRow(Strings.Details.depthLabel, productDetail.dimensions.depth)}
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          {Strings.Details.reviewsTitle} ({productDetail.reviews.length})
        </Text>
        {detailSectionVisibility.hasReviews ? (
          productDetail.reviews.map((review) => (
            <View key={`${review.reviewerEmail}-${review.date}`} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{review.reviewerName}</Text>
                <Text style={styles.reviewRating}>{review.rating.toFixed(1)} ★</Text>
              </View>
              <Text style={styles.reviewDate}>{formatDateValue(review.date)}</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.sectionText}>{Strings.Details.noReviews}</Text>
        )}
      </View>

      {detailSectionVisibility.hasMetadata ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{Strings.Details.metadataTitle}</Text>
          {renderDetailRow(
            Strings.Details.createdAtLabel,
            formatDateValue(productDetail.meta.createdAt)
          )}
          {renderDetailRow(
            Strings.Details.updatedAtLabel,
            formatDateValue(productDetail.meta.updatedAt)
          )}
          {renderDetailRow(Strings.Details.barcodeLabel, productDetail.meta.barcode)}
          {renderDetailRow(Strings.Details.qrCodeLabel, productDetail.meta.qrCode)}
        </View>
      ) : null}
    </ScrollView>
  );
}

/**
 * Renders the sticky cart footer for Product Detail.
 *
 * @param {CartFooterProps} props - Cart footer props.
 * @returns {React.ReactElement} Cart footer.
 */
function renderCartFooter({
  styles,
  cartControlState,
  cartErrorMessage,
  handleAddToCart,
  handleIncrementCartQuantity,
  handleDecrementCartQuantity
}: CartFooterProps): React.ReactElement {
  return (
    <View style={styles.cartFooter}>
      {cartErrorMessage ? <Text style={styles.cartErrorText}>{cartErrorMessage}</Text> : null}
      {cartControlState.mode === 'add' ? (
        <CustomButton
          loading={cartControlState.isMutating}
          title={Strings.Details.addToCartButton}
          onPress={handleAddToCart}
        />
      ) : (
        <View style={styles.quantityFooterWrap}>
          <Pressable
            accessibilityLabel={
              cartControlState.quantity <= 1
                ? Strings.Details.removeFromCartButton
                : Strings.Details.decreaseQuantityButton
            }
            accessibilityRole="button"
            disabled={cartControlState.isMutating}
            hitSlop={scale(8)}
            style={[
              styles.quantityActionButton,
              cartControlState.isMutating ? styles.quantityActionDisabled : undefined
            ]}
            onPress={handleDecrementCartQuantity}
          >
            <Ionicons
              color={styles.quantityActionIcon.color}
              name={cartControlState.quantity <= 1 ? 'trash-outline' : 'remove'}
              size={scale(20)}
            />
          </Pressable>
          <View style={styles.quantityValueWrap}>
            <Text style={styles.quantityValueText}>{cartControlState.quantity}</Text>
            <Text style={styles.quantityValueLabel}>{Strings.Cart.quantityLabel}</Text>
          </View>
          <Pressable
            accessibilityLabel={Strings.Details.increaseQuantityButton}
            accessibilityRole="button"
            disabled={cartControlState.isMutating}
            hitSlop={scale(8)}
            style={[
              styles.quantityActionButton,
              cartControlState.isMutating ? styles.quantityActionDisabled : undefined
            ]}
            onPress={handleIncrementCartQuantity}
          >
            {cartControlState.isMutating ? (
              <Spinner color={styles.quantityActionIcon.color} size="small" />
            ) : (
              <Ionicons color={styles.quantityActionIcon.color} name="add" size={scale(20)} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

/**
 * Product Detail screen.
 *
 * Renders a marketplace-style product detail experience with dedicated loading,
 * error, unavailable, and success states.
 *
 * @returns {React.ReactElement} The rendered Product Detail screen.
 */
const DetailScreen: FC = (): React.ReactElement => {
  const { styles } = useTheme(styleSheet);
  const {
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
  } = useDetails();

  const renderHeader = useCallback(
    () => (
      <CustomHeader
        customLeftView={
          <Pressable
            accessibilityLabel={Strings.Details.backButton}
            accessibilityRole="button"
            hitSlop={scale(8)}
            style={styles.headerActionButton}
            onPress={handleBackPress}
          >
            <Ionicons color={styles.headerActionIcon.color} name="arrow-back" size={scale(20)} />
          </Pressable>
        }
        customRightView={<View style={styles.headerRightSpacer} />}
        title={Strings.Details.detailsScreenTitle}
      />
    ),
    [
      handleBackPress,
      styles.headerActionButton,
      styles.headerActionIcon.color,
      styles.headerRightSpacer
    ]
  );

  const renderStateActions = useCallback(
    () => (
      <View style={styles.stateActions}>
        <CustomButton title={Strings.Details.retryButton} onPress={handleRetry} />
        <CustomButton
          enableDebounce={false}
          title={Strings.Details.backButton}
          variant="outline"
          onPress={handleBackPress}
        />
      </View>
    ),
    [handleBackPress, handleRetry, styles.stateActions]
  );

  const renderDetailRow = useCallback(
    (label: string, value?: string | number | null): React.ReactElement | null => {
      if (value === undefined || value === null || value === '') {
        return null;
      }

      return (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{String(value)}</Text>
        </View>
      );
    },
    [styles.detailLabel, styles.detailRow, styles.detailValue]
  );

  if (isProductDetailLoading) {
    return (
      <View style={styles.screenView}>
        {renderHeader()}
        <View style={styles.centeredState}>
          <Spinner />
          <Text style={styles.stateTitle}>{Strings.Details.loadingTitle}</Text>
          <Text style={styles.stateMessage}>{Strings.Details.loadingMessage}</Text>
        </View>
      </View>
    );
  }

  if (isProductDetailUnavailable) {
    return (
      <View style={styles.screenView}>
        {renderHeader()}
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>{Strings.Details.unavailableTitle}</Text>
          <Text style={styles.stateMessage}>{Strings.Details.unavailableMessage}</Text>
          {renderStateActions()}
        </View>
      </View>
    );
  }

  if (shouldShowProductDetailError || !productDetail) {
    return (
      <View style={styles.screenView}>
        {renderHeader()}
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>{Strings.Details.errorTitle}</Text>
          <Text style={styles.stateMessage}>{productDetailErrorMessage}</Text>
          {renderStateActions()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenView}>
      {renderHeader()}
      {renderProductContent({
        styles,
        productDetail,
        heroImageUrls,
        selectedImageUrl,
        detailSectionVisibility,
        renderDetailRow,
        handleSelectImage
      })}
      {renderCartFooter({
        styles,
        cartControlState,
        cartErrorMessage,
        handleAddToCart,
        handleIncrementCartQuantity,
        handleDecrementCartQuantity
      })}
    </View>
  );
};

export default DetailScreen;
