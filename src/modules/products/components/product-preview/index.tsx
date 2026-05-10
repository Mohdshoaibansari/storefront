"use client"

import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <LocalizedClientLink href={`/products/${product.handle}`} className="group relative block">
        <div data-testid="product-wrapper" className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          
          <button 
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-primary hover:text-white shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              // Wishlist logic here
            }}
          >
            <Heart size={18} />
          </button>

          <div className="flex flex-col mt-4 gap-y-1">
            <Text className="text-brand-accent font-medium text-base tracking-tight group-hover:text-brand-primary transition-colors duration-300" data-testid="product-title">
              {product.title}
            </Text>
            <div className="flex items-center">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </motion.div>
  )
}
