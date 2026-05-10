import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
      limit: 4,
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="content-container py-24 small:py-32">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Text className="text-brand-primary uppercase tracking-[0.2em] font-semibold text-xs">
            Our Collection
          </Text>
          <Heading level="h2" className="text-display-medium tracking-tight">
            {collection.title}
          </Heading>
        </div>
        <InteractiveLink 
          href={`/collections/${collection.handle}`}
          className="text-brand-accent hover:text-brand-primary transition-colors font-medium border-b border-brand-accent hover:border-brand-primary pb-1"
        >
          Explore All
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-4 gap-x-8 gap-y-16">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
