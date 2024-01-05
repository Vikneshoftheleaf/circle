import './globals.css'
import { Inter, Roboto } from 'next/font/google'
export const metadata = {
  title: 'Circle',
  description: "The Friend's Network",
}
import SideNav from '@/components/sidnav'
import BottomNav from '@/components/bottom-nav'
import MaxWidthWrapper from '@/components/maxwithwrapper'
import { AuthContextProvider } from '@/context/authcontext'
const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight:['100','300','400','500','700','900'],
  style: ['normal','italic'],
  subsets: ['latin'],
})
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>

        <AuthContextProvider>
          <div className='lg:grid lg:grid-cols-5 grid-cols-1'>
            <div className='lg:col-span-1'>
              <SideNav />
            </div>
            <div className='lg:col-span-4'>
              <main>{children}</main>
              <BottomNav />
            </div>

          </div>
        </AuthContextProvider>
      </body>
    </html>
  )
}
