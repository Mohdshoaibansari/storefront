"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heading, Text } from "@modules/common/components/ui"
import { Quote } from "lucide-react"

const Testimonials = () => {
  const testimonials = [
    {
      text: "The quality of the pottery is exceptional. You can really feel the artisan's touch in every curve and glaze. It's transformed my dining space.",
      author: "Elena R.",
      role: "Interior Designer"
    },
    {
      text: "Induvra's commitment to preserving traditional crafts is what drew me in. The textiles are rich in heritage and incredibly soft. Simply beautiful.",
      author: "Julian M.",
      role: "Sustainable Living Advocate"
    },
    {
      text: "I've never seen such attention to detail in home decor. Each piece feels like it was made specifically for my home. A truly premium experience.",
      author: "Sophia L.",
      role: "Homeowner"
    }
  ]

  return (
    <section className="py-24 small:py-32 bg-white">
      <div className="content-container">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-brand-primary uppercase tracking-[0.3em] font-semibold text-xs mb-4">
            Testimonials
          </span >
          <Heading level="h2" className="text-display-medium italic">What Our Circle Says</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-6"
            >
              <Quote size={32} className="text-brand-primary/20 mb-6" />
              <Text className="text-brand-accent/80 italic text-lg leading-relaxed mb-8">
                "{t.text}"
              </Text>
              <div className="flex flex-col gap-y-1">
                <Text className="font-semibold text-brand-accent">{t.author}</Text>
                <Text className="text-brand-accent/50 text-xs uppercase tracking-widest">{t.role}</Text>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
