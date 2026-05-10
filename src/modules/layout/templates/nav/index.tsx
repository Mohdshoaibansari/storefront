import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import MegaMenu from "@modules/layout/components/mega-menu"
import { User, ShoppingBag, Search } from "lucide-react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"

export default async function Nav() {
  const categories = await listCategories()
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-20 mx-auto border-b duration-200 bg-white/80 backdrop-blur-lg border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center gap-x-6">
            <div className="h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <MegaMenu categories={categories} />
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="text-display-medium hover:text-brand-primary transition-colors duration-300 tracking-tighter"
              data-testid="nav-store-link"
            >
              Induvra
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
               <LocalizedClientLink
                className="hover:text-brand-primary transition-colors"
                href="/store"
              >
                <Search size={20} strokeWidth={1.5} />
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-brand-primary transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                <User size={20} strokeWidth={1.5} />
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-brand-primary flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} /> (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
