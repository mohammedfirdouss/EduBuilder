import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PWAProvider } from "@/components/pwa-provider"
import { CustomizationProvider } from "@/components/customization-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexProvider, ConvexReactClient } from "convex/react"

const inter = Inter({ subsets: ["latin"] })

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const metadata: Metadata = {
  title: "EduBuilder",
  description: "Enhanced interactive STEM demonstrations for Nigerian secondary school teachers",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PWAProvider>
            <CustomizationProvider>
              <ConvexProvider client={convex}>
                {children}
              </ConvexProvider>
            </CustomizationProvider>
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
