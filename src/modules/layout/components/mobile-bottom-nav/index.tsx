"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Home, Search, ShoppingBag, User } from "lucide-react"
import { useParams } from "next/navigation"

const MobileBottomNav = () => {
  const { countryCode } = useParams()

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-t flex items-center justify-around small:hidden z-[99]">
      <LocalizedClientLink href="/" className="flex flex-col items-center gap-y-1 text-brand-accent hover:text-brand-primary transition-colors">
        <Home size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </LocalizedClientLink>
      
      <LocalizedClientLink href="/store" className="flex flex-col items-center gap-y-1 text-brand-accent hover:text-brand-primary transition-colors">
        <Search size={20} />
        <span className="text-[10px] font-medium">Search</span>
      </LocalizedClientLink>
      
      <LocalizedClientLink href="/cart" className="flex flex-col items-center gap-y-1 text-brand-accent hover:text-brand-primary transition-colors">
        <ShoppingBag size={20} />
        <span className="text-[10px] font-medium">Cart</span>
      </LocalizedClientLink>
      
      <LocalizedClientLink href="/account" className="flex flex-col items-center gap-y-1 text-brand-accent hover:text-brand-primary transition-colors">
        <User size={20} />
        <span className="text-[10px] font-medium">Account</span>
      </LocalizedClientLink>
    </div>
  )
}

export default MobileBottomNav
