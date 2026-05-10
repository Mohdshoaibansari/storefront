"use client"

import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
      className="bg-background min-h-screen pb-24"
    >
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-12 gap-x-20 relative"
        data-testid="product-container"
      >
        <div className="block w-full small:w-3/5 relative">
          <ImageGallery images={images} />
        </div>
        
        <div className="flex flex-col small:sticky small:top-32 small:py-0 small:w-2/5 w-full py-8 gap-y-10">
          <div className="flex flex-col gap-y-2">
             <span className="text-brand-primary uppercase tracking-[0.2em] font-semibold text-xs">
              Handcrafted Artistry
            </span>
            <ProductInfo product={product} />
          </div>

          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <div className="grid grid-cols-1 gap-y-4 py-8 border-y border-brand-accent/10">
            <div className="flex items-center gap-x-4 text-brand-accent/70 text-sm">
              <Truck size={20} strokeWidth={1.5} />
              <span>Free shipping on all orders over $150</span>
            </div>
            <div className="flex items-center gap-x-4 text-brand-accent/70 text-sm">
              <RefreshCcw size={20} strokeWidth={1.5} />
              <span>30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-x-4 text-brand-accent/70 text-sm">
              <ShieldCheck size={20} strokeWidth={1.5} />
              <span>Secure payments & artisanal quality guarantee</span>
            </div>
          </div>

          <ProductTabs product={product} />
          <ProductOnboardingCta />
        </div>
      </div>
      
      <div
        className="content-container mt-24 small:mt-40"
        data-testid="related-products-container"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-brand-primary uppercase tracking-[0.2em] font-semibold text-xs mb-2">
            Complete the Look
          </span>
          <h2 className="text-display-medium">You May Also Like</h2>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </motion.div>
  )
}

export default ProductTemplate
