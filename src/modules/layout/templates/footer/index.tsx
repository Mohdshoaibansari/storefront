import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { Globe } from "lucide-react"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-brand-muted border-t border-ui-border-base w-full mt-24">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between py-24">
          <div className="flex flex-col gap-y-6 max-w-sm">
            <LocalizedClientLink
              href="/"
              className="text-display-medium hover:text-brand-primary transition-colors duration-300 tracking-tighter"
            >
              Induvra
            </LocalizedClientLink>
            <Text className="text-brand-accent/70 text-base leading-relaxed">
              Curating premium handcrafted home decor that tells a story. From our artisans to your home, we bring elegance and tradition together.
            </Text>
            <div className="flex gap-x-4">
              <Globe size={20} className="text-brand-accent hover:text-brand-primary transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="text-base-regular gap-10 md:gap-x-24 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-6">
                <Heading level="h3" className="text-lg font-bold uppercase tracking-widest text-brand-accent">
                  Shop
                </Heading>
                <ul
                  className="grid grid-cols-1 gap-y-3"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return null
                    }
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-brand-primary transition-colors"
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col gap-y-6">
              <Heading level="h3" className="text-lg font-bold uppercase tracking-widest text-brand-accent">
                Information
              </Heading>
              <ul className="grid grid-cols-1 gap-y-3">
                <li><LocalizedClientLink href="/about" className="hover:text-brand-primary transition-colors">Our Story</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/contact" className="hover:text-brand-primary transition-colors">Contact Us</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</LocalizedClientLink></li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-6">
              <Heading level="h3" className="text-lg font-bold uppercase tracking-widest text-brand-accent">
                Newsletter
              </Heading>
              <Text className="text-sm text-brand-accent/70">
                Join our list and get 10% off your first order.
              </Text>
              <div className="flex w-full max-w-xs border-b border-brand-accent py-2 group focus-within:border-brand-primary transition-colors">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-brand-accent/40" 
                />
                <button className="text-sm font-bold uppercase tracking-wider hover:text-brand-primary transition-colors">Join</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row w-full mb-16 justify-between items-center gap-y-6 py-8 border-t border-brand-accent/10 text-brand-accent/50">
          <Text className="text-sm">
            © {new Date().getFullYear()} Induvra. All rights reserved.
          </Text>
          <div className="flex gap-x-8 items-center">
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
