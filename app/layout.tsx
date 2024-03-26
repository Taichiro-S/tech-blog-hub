import type { Metadata } from 'next'
import '@/app/global.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Tech Blog Hub',
  description: 'A hub for tech blogs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-stone-900 text-white p-4">
            <div className="flex container mx-auto px-4 py-6">
              <h1 className="text-4xl font-bold">Tech Blog Hub</h1>
              {/* Munu bar aligned to right */}
              <nav className="flex items-center mx-10">
                <Link
                  href="/about"
                  className="text-white rounded bg-stone-900 px-3 py-2 hover:bg-stone-600 mx-6"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white rounded bg-stone-900 px-3 py-2 hover:bg-stone-600"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 flex-1">{children}</main>
          <footer className="bg-primary text-white">
            <div className="container mx-auto px-4 py-6">
              <p className="text-center">© 2021 Tech Blog Hub</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
