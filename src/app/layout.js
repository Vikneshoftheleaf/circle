import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { Inter, Roboto } from 'next/font/google';
import Provider from '@/components/themeProvider';
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
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SpeedInsights />
        <Analytics />

        <AuthContextProvider>
          <Provider>
            <div className='flex justify-between'>
              <div className=''>
                <SideNav />
              </div>
              <div className='w-full'>
                <main>{children}</main>
                <BottomNav />
              </div>
            </div>
          </Provider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
