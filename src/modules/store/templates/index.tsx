import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  collectionId,
  categoryId,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  collectionId?: string
  categoryId?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const [categories, { collections }] = await Promise.all([
    listCategories(),
    listCollections(),
  ])

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-12 content-container"
      data-testid="category-container"
    >
      <RefinementList 
        sortBy={sort} 
        categories={categories} 
        collections={collections}
        categoryId={categoryId}
        collectionId={collectionId}
      />
      <div className="w-full">
        <div className="mb-12 flex flex-col gap-y-2">
          <span className="text-brand-primary uppercase tracking-[0.2em] font-semibold text-xs">
            Artisanal Store
          </span>
          <h1 className="text-display-medium" data-testid="store-page-title">All Products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collectionId}
            categoryId={categoryId}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
