import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import companyInfo from '@/config/app_info.json'
import Script from 'next/script'
import ReduxProvider from '@/contexts/redux-provider'
import PublicProvider from '@/contexts/public-provider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4F46E5',
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(companyInfo.url),
  title: {
    template: `%s | ${companyInfo.name}`,
    default: companyInfo.name,
  },
  description: companyInfo.description,
  applicationName: companyInfo.name,
  authors: [{ name: companyInfo.author, url: companyInfo.url }],
  generator: 'Next.js',
  keywords: ['tq'],
  creator: companyInfo.author,
  publisher: companyInfo.author,
  category: 'system',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: companyInfo.url,
    siteName: companyInfo.name,
    title: companyInfo.name,
    description: companyInfo.description,
    images: [
      {
        url: `${companyInfo.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${companyInfo.name} - `,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: companyInfo.twitterHandle,
    creator: companyInfo.twitterHandle,
    title: companyInfo.name,
    description: companyInfo.description,
    images: [`${companyInfo.url}/twitter-image.jpg`],
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#4F46E5',
      },
    ],
  },

  manifest: `${companyInfo.url}/manifest.json`,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },

  alternates: {
    canonical: companyInfo.url,
    languages: {
      'en-US': `${companyInfo.url}/en-US`,
      'sw-KE': `${companyInfo.url}/sw-KE`,
    },
  },

  appleWebApp: {
    capable: true,
    title: companyInfo.name,
    statusBarStyle: 'black-translucent',
  },

  archives: [`${companyInfo.url}/archives`],
  assets: [`${companyInfo.url}/assets`],

  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="">
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: companyInfo.name,
              url: companyInfo.url,
              logo: companyInfo.logo,
              foundingDate: companyInfo.foundingYear,
              founders: [
                {
                  '@type': 'Person',
                  name: companyInfo.author,
                },
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: companyInfo.location,
                addressCountry: 'KE',
              },
              sameAs: [
                'https://www.facebook.com/chavfana',
                'https://www.twitter.com/chavfana',
                'https://www.linkedin.com/company/chavfana',
                'https://www.instagram.com/chavfana',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+254-798-116-710',
                contactType: 'customer service',
                availableLanguage: ['English', 'Swahili'],
              },
              description: companyInfo.description,
              potentialAction: {
                '@type': 'DownloadAction',
                target: [
                  'https://play.google.com/store/apps/details?id=com.nbotechlabs.tq.app',
                  'https://apps.apple.com/app/chavfana/idXXXXXXXXXX',
                ],
                name: 'Download TQ',
              },
            }),
          }}
        />

        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX'); 
            `,
          }}
        />
        <ReduxProvider>
          <PublicProvider>{children}</PublicProvider>
        </ReduxProvider>

        <div className="sr-only">
          <a href="/accessibility">Accessibility Statement</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </body>
    </html>
  )
}
