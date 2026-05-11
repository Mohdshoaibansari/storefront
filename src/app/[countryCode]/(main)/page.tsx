import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryStory from "@modules/home/components/category-story"
import Newsletter from "@modules/home/components/newsletter"
import Testimonials from "@modules/home/components/testimonials"
import InstaFeed from "@modules/home/components/insta-feed"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Induvra | Premium Handcrafted Home Decor",
  description:
    "Discover a curated collection of artisanal home decor, handcrafted with love and tradition. Shop Induvra for a modern premium aesthetic.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoryStory />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <Testimonials />
      <InstaFeed />
      <Newsletter />
    </>
  )
}
