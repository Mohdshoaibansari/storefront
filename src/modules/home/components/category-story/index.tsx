"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CategoryStory = () => {
  const stories = [
    {
      title: "Handcrafted Pottery",
      description: "Timeless pieces shaped by master artisans, bringing the earth's soul to your table.",
      image: "/home/asset-3.jpg",
      link: "/categories/pottery",
      color: "bg-brand-muted"
    },
    {
      title: "Woven Traditions",
      description: "Intricate textiles that weave together centuries of heritage and modern comfort.",
      image: "/categories/asset-1.jpg",
      link: "/categories/textiles",
      color: "bg-[#F3F4F1]"
    },
    {
      title: "Artisanal Woodwork",
      description: "Naturally sourced wood, carved with precision to create functional art for your home.",
      image: "/categories/asset-2.jpg",
      link: "/categories/furniture",
      color: "bg-[#F9F7F2]"
    }
  ]

  return (
    <section className="py-24 small:py-32 overflow-hidden">
      <div className="content-container">
        <div className="flex flex-col items-center mb-16 text-center max-w-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary uppercase tracking-[0.3em] font-semibold text-xs mb-4"
          >
            The Artisanal Way
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-display-medium mb-6"
          >
            Stories Carved in Every Piece
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-accent/70 leading-relaxed"
          >
            At Induvra, we believe your home should tell a story. Every item in our collection is handcrafted by skilled artisans who pour their heritage and passion into every detail.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`group flex flex-col rounded-brand overflow-hidden transition-all duration-500 hover:shadow-premium ${story.color}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  fill
                />
              </div>
              <div className="p-8 flex flex-col gap-y-4">
                <Heading level="h3" className="text-2xl italic">{story.title}</Heading>
                <Text className="text-brand-accent/70 text-sm leading-relaxed">
                  {story.description}
                </Text>
                <LocalizedClientLink 
                  href={story.link}
                  className="mt-2 text-brand-primary font-semibold text-sm uppercase tracking-widest border-b border-transparent hover:border-brand-primary w-fit transition-all"
                >
                  Discover More
                </LocalizedClientLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryStory
