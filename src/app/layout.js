import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { Inter, Roboto, Poppins, Lato, Montserrat } from 'next/font/google';
import Provider from '@/components/themeProvider';
export const metadata = {
  title: 'Circle',
  description: "The Friend's Network",
  manifest: './manifest.json',
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

const monte = Montserrat(
  {
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext', 'vietnamese']
  })

const lato = Lato(
  {

    weight: ['100', '300', '400', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext'],


  }
)

const pop = Poppins(
  {
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    subsets: ['devanagari', 'latin', 'latin-ext']

  }
)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights />
        <Analytics />

        <AuthContextProvider>
          <Provider>

            <div className='flex justify-between'>
              <div className='h-screen'>
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

/*


*/
