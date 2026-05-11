"use client"

import React, { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type MegaMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const MegaMenu: React.FC<MegaMenuProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState<HttpTypes.StoreProductCategory | null>(null)

  const parentCategories = categories.filter(c => !c.parent_category_id)

  return (
    <div className="hidden small:flex items-center h-full">
      <div className="flex gap-x-8 h-full">
        {parentCategories.slice(0, 6).map((category) => (
          <div
            key={category.id}
            className="h-full flex items-center"
            onMouseEnter={() => setActiveCategory(category)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="hover:text-brand-primary transition-colors duration-300 font-medium tracking-wide py-4"
            >
              {category.name}
            </LocalizedClientLink>

            <AnimatePresence>
              {activeCategory?.id === category.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full bg-white border-b shadow-premium z-50 overflow-hidden"
                >
                  <div className="content-container py-12 flex gap-x-24">
                    <div className="flex-1 grid grid-cols-3 gap-y-10 gap-x-8">
                      {category.category_children?.map((child) => (
                        <div key={child.id} className="flex flex-col gap-y-4">
                          <LocalizedClientLink
                            href={`/categories/${child.handle}`}
                            className="font-semibold text-brand-accent hover:text-brand-primary transition-colors"
                          >
                            {child.name}
                          </LocalizedClientLink>
                          {/* Placeholder for sub-children if needed */}
                        </div>
                      ))}
                    </div>
                    
                    <div className="w-1/3 relative aspect-[4/3] rounded-brand overflow-hidden group">
                      <Image
                        src="/categories/asset-1.jpg"
                        alt="Featured Category"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fill
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-display-medium mb-2">{category.name} Collection</p>
                        <LocalizedClientLink href={`/categories/${category.handle}`} className="underline underline-offset-4 font-medium">
                          Shop Now
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MegaMenu
