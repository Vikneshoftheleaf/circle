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
<<<<<<< HEAD
        <AuthContextProvider>
            <main>{children}</main>
        <BottomNav />
=======
      <AuthContextProvider>
      <MaxWidthWrapper>
    
          <div className="flex">
            <SideNav />
            <main className="flex-1">{children}</main>
          </div>
    
        </MaxWidthWrapper>
        <BottomNav/>
>>>>>>> 96771c02b4bb0bd25a5cf5858cc482ff1a883496
        </AuthContextProvider>
      </body>
    </html>
  )
}
