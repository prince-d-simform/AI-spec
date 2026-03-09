/**
 * Raw category item returned by the DummyJSON catalog endpoint.
 */
export interface RemoteCategoryRecord {
  slug: string;
  name?: string;
  url?: string;
}

/**
 * Successful response payload for the product categories endpoint.
 */
export type ProductCategoryResponse = RemoteCategoryRecord[] & {
  message?: string;
};
