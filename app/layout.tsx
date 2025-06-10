import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PWAProvider } from "@/components/pwa-provider"
import { CustomizationProvider } from "@/components/customization-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

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
            <CustomizationProvider>{children}</CustomizationProvider>
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
