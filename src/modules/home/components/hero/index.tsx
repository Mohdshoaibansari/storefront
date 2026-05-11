"use client"

import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="h-[90vh] w-full relative overflow-hidden bg-brand-muted">
      <div className="absolute inset-0 z-0">
        <Image
          src="/banners/asset-1.jpg"
          alt="Induvra Lifestyle"
          className="object-cover"
          fill
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="content-container absolute inset-0 z-10 flex flex-col justify-center items-start text-white">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <Text className="text-white/90 uppercase tracking-[0.3em] font-semibold mb-4 text-sm">
            Handcrafted with Love
          </Text>
          <Heading
            level="h1"
            className="text-6xl md:text-8xl mb-6 leading-[1.1] font-headings italic"
          >
            Artistry for Your <br /> Living Spaces
          </Heading>
          <Text className="text-white/80 text-xl mb-10 max-w-lg leading-relaxed font-light">
            Discover a curated collection of artisanal home decor that brings timeless elegance and soul to every corner.
          </Text>
          <div className="flex gap-x-4">
            <LocalizedClientLink href="/store">
              <Button variant="primary" size="large" className="bg-white text-brand-accent hover:bg-brand-primary hover:text-white border-none shadow-premium transition-all duration-500">
                Shop Collection
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/about">
              <Button variant="secondary" size="large" className="bg-transparent text-white border-white hover:bg-white hover:text-brand-accent transition-all duration-500">
                Our Story
              </Button>
            </LocalizedClientLink>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-2"
      >
        <span className="w-px h-12 bg-white/30" />
        <span className="text-white/50 text-[10px] uppercase tracking-widest">Scroll</span>
      </motion.div>
    </div>
  )
}

export default Hero
