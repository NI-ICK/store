import type { Metadata } from "next"
import { NavBar } from '@/components/NavBar/NavBar'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: "Store",
  description: "Ecommerce website project",
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
