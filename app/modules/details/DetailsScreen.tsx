import React, { useCallback, type FC } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { CustomButton, Spinner, Text } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import styleSheet from './DetailsStyles';
import useDetails from './useDetails';

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
    heroImageUrls,
    selectedImageUrl,
    detailSectionVisibility,
    isProductDetailLoading,
    isProductDetailUnavailable,
    shouldShowProductDetailError,
    productDetailErrorMessage,
    handleSelectImage,
    handleRetry,
    handleBackPress
  } = useDetails();

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
      <View style={styles.centeredState}>
        <Spinner />
        <Text style={styles.stateTitle}>{Strings.Details.loadingTitle}</Text>
        <Text style={styles.stateMessage}>{Strings.Details.loadingMessage}</Text>
      </View>
    );
  }

  if (isProductDetailUnavailable) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>{Strings.Details.unavailableTitle}</Text>
        <Text style={styles.stateMessage}>{Strings.Details.unavailableMessage}</Text>
        {renderStateActions()}
      </View>
    );
  }

  if (shouldShowProductDetailError || !productDetail) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>{Strings.Details.errorTitle}</Text>
        <Text style={styles.stateMessage}>{productDetailErrorMessage}</Text>
        {renderStateActions()}
      </View>
    );
  }

  return (
    <View style={styles.screenView}>
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

        <CustomButton
          enableDebounce={false}
          style={styles.footerButton}
          title={Strings.Details.backButton}
          variant="outline"
          onPress={handleBackPress}
        />
      </ScrollView>
    </View>
  );
};

export default DetailScreen;
