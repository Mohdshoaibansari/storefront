"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import SortProducts, { SortOptions } from "./sort-products"
import { Text, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type RefinementListProps = {
  sortBy: SortOptions
  categories?: HttpTypes.StoreProductCategory[]
  collections?: HttpTypes.StoreCollection[]
  categoryId?: string
  collectionId?: string
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ 
  sortBy, 
  categories, 
  collections, 
  categoryId, 
  collectionId,
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <aside className="w-full small:w-fit py-4 small:px-0 small:min-w-[250px] small:mr-16">
      <div className="flex flex-row small:flex-col gap-x-8 gap-y-10 overflow-x-auto no-scrollbar pb-4 small:pb-0">
        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-col gap-y-4 min-w-[150px] small:min-w-0">
            <Heading level="h3" className="text-xs font-bold uppercase tracking-widest text-brand-accent/50">
              Categories
            </Heading>
            <ul className="flex flex-row small:flex-col gap-x-4 gap-y-3 whitespace-nowrap small:whitespace-normal">
              <li>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.delete("category_id")
                    router.push(`${pathname}?${params.toString()}`)
                  }}
                  className={clx(
                    "text-sm hover:text-brand-primary transition-colors text-left",
                    !categoryId ? "text-brand-primary font-semibold" : "text-brand-accent/70"
                  )}
                >
                  All Categories
                </button>
              </li>
              {categories.filter(c => !c.parent_category_id).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setQueryParams("category_id", category.id)}
                    className={clx(
                      "text-sm hover:text-brand-primary transition-colors text-left",
                      categoryId === category.id ? "text-brand-primary font-semibold" : "text-brand-accent/70"
                    )}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Collections Filter */}
        {collections && collections.length > 0 && (
          <div className="flex flex-col gap-y-4 min-w-[150px] small:min-w-0">
            <Heading level="h3" className="text-xs font-bold uppercase tracking-widest text-brand-accent/50">
              Collections
            </Heading>
            <ul className="flex flex-row small:flex-col gap-x-4 gap-y-3 whitespace-nowrap small:whitespace-normal">
              <li>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.delete("collection_id")
                    router.push(`${pathname}?${params.toString()}`)
                  }}
                  className={clx(
                    "text-sm hover:text-brand-primary transition-colors text-left",
                    !collectionId ? "text-brand-primary font-semibold" : "text-brand-accent/70"
                  )}
                >
                  All Collections
                </button>
              </li>
              {collections.map((collection) => (
                <li key={collection.id}>
                  <button
                    onClick={() => setQueryParams("collection_id", collection.id)}
                    className={clx(
                      "text-sm hover:text-brand-primary transition-colors text-left",
                      collectionId === collection.id ? "text-brand-primary font-semibold" : "text-brand-accent/70"
                    )}
                  >
                    {collection.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sort Filter */}
        <div className="min-w-[150px] small:min-w-0">
          <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        </div>
      </div>
    </aside>
  )
}

export default RefinementList
