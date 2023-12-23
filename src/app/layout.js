import './globals.css'
import { Inter } from 'next/font/google'
export const metadata = {
  title: 'Circle',
  description: "The Friend's Network",
}
import SideNav from '@/components/sidnav'
import BottomNav from '@/components/bottom-nav'
import MaxWidthWrapper from '@/components/maxwithwrapper'
import { AuthContextProvider } from '@/context/authcontext'
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <AuthContextProvider>
            <main>{children}</main>
        <BottomNav />

        </AuthContextProvider>
      </body>
    </html>
  )
}
