import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business and Computing',
  description: 'Business and Computing Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald&family=Poppins&family=Roboto:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body className={`${styles.page} ${inter.className}`}>{children}</body>

    </html>
  )
}
