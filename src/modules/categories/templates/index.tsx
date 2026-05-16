import { notFound } from "next/navigation"
import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const [categories, { collections }] = await Promise.all([
    listCategories(),
    listCollections(),
  ])

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-12 content-container"
      data-testid="category-container"
    >
      <RefinementList 
        sortBy={sort} 
        categories={categories}
        collections={collections}
        categoryId={category.id}
      />
      <div className="w-full">
        <div className="flex flex-col mb-12 gap-y-2">
          <div className="flex flex-row text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary gap-2">
            {parents &&
              parents.map((parent) => (
                <span key={parent.id} className="flex gap-2">
                  <LocalizedClientLink
                    className="hover:text-brand-accent"
                    href={`/categories/${parent.handle}`}
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  <span>/</span>
                </span>
              ))}
            <span>{category.name}</span>
          </div>
          <h1 className="text-display-medium" data-testid="category-page-title">{category.name}</h1>
        </div>
        
        {category.description && (
          <div className="mb-12 text-base-regular text-brand-accent/70 max-w-2xl">
            <p>{category.description}</p>
          </div>
        )}

        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
