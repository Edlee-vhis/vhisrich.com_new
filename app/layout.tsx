import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VHISRich.com | 2025 香港自願醫保 VHIS 比較 + 扣稅計算',
  description: '即時比較香港 VHIS 醫療保險計劃，計算稅務扣減，搵最適合你嘅方案。每日更新，無推銷。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
