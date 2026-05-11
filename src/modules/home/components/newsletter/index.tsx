"use client"

import React from "react"
import { Button, Heading, Text } from "@modules/common/components/ui"
import { motion } from "framer-motion"

const Newsletter = () => {
  return (
    <section className="py-24 bg-brand-muted/50 border-y border-brand-accent/5">
      <div className="content-container">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <Heading level="h2" className="text-display-medium mb-4">Join the Induvra Circle</Heading>
            <Text className="text-brand-accent/70 mb-10 leading-relaxed">
              Subscribe to receive updates on new artisanal drops, behind-the-scenes stories of our craftsmen, and exclusive early access to our seasonal sales.
            </Text>
            
            <form className="flex flex-col sm:flex-row gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-brand border border-brand-accent/10 focus:outline-none focus:border-brand-primary bg-white text-brand-accent transition-colors"
                required
              />
              <Button variant="primary" size="large" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <Text className="text-[10px] text-brand-accent/40 mt-4 uppercase tracking-widest">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </Text>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
