import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cormorant_Garamond, Jost } from "next/font/google"
import "styles/globals.css"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-headings",
  weight: ["400", "500", "600", "700"],
})

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${cormorantGaramond.variable} ${jost.variable}`}>
      <body className="font-body antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
