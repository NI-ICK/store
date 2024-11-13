import { Metadata } from "next"
import { NavBar } from '@/components/NavBar/NavBar'
import '@/styles/globals.scss'
import axios from "axios"

export const metadata: Metadata = {
  title: "Store",
  description: "Ecommerce website project",
}

axios.defaults.baseURL = process.env.WEBSITE_URL

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
