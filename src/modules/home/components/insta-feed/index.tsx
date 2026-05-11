"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heading, Text } from "@modules/common/components/ui"
import { Camera } from "lucide-react"

const InstaFeed = () => {
  const images = [
    "/home/asset-1.jpg",
    "/home/asset-2.jpg",
    "/banners/asset-2.jpg",
    "/banners/asset-3.jpg",
    "/categories/asset-3.jpg",
    "/products/asset-3.jpg"
  ]

  return (
    <section className="py-24 small:py-32 bg-brand-muted/30">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-y-6">
          <div className="flex flex-col gap-y-2">
            <span className="text-brand-primary uppercase tracking-[0.3em] font-semibold text-xs mb-2 flex items-center gap-x-2">
              <Camera size={14} /> @induvra_home
            </span>
            <Heading level="h2" className="text-display-medium tracking-tight">Handcrafted in Real Homes</Heading>
          </div>
          <Text className="text-brand-accent/60 max-w-sm mb-1 leading-relaxed">
            Share your space with us using #InduvraHome for a chance to be featured in our artisanal gallery.
          </Text>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square overflow-hidden rounded-brand group cursor-pointer"
            >
              <Image
                src={img}
                alt={`Instagram Feed ${i + 1}`}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                fill
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstaFeed
