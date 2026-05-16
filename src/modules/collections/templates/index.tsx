import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const [categories, { collections }] = await Promise.all([
    listCategories(),
    listCollections(),
  ])

  return (
    <div className="flex flex-col small:flex-row small:items-start py-12 content-container">
      <RefinementList 
        sortBy={sort} 
        categories={categories}
        collections={collections}
        collectionId={collection.id}
      />
      <div className="w-full">
        <div className="flex flex-col mb-12 gap-y-2">
           <span className="text-brand-primary uppercase tracking-[0.2em] font-semibold text-xs">
            Artisanal Collection
          </span>
          <h1 className="text-display-medium">{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
