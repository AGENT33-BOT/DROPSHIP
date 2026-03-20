import { Metadata } from 'next'

interface Props {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://dropshippro.com'),
  title: {
    default: 'DropshipPro - Premium Products',
    template: '%s | DropshipPro',
  },
  description: 'Quality dropshipped products with fast shipping and excellent customer service.',
  keywords: ['dropshipping', 'premium products', 'electronics', 'fast shipping'],
  authors: [{ name: 'DropshipPro' }],
  creator: 'DropshipPro',
  publisher: 'DropshipPro',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dropshippro.com',
    siteName: 'DropshipPro',
    title: 'DropshipPro - Premium Products',
    description: 'Quality dropshipped products with fast shipping and excellent customer service.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DropshipPro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DropshipPro - Premium Products',
    description: 'Quality dropshipped products with fast shipping',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export function generateMetadata({ title, description, image, noIndex }: Props = {}): Metadata {
  return {
    ...defaultMetadata,
    title: title ? `${title} | DropshipPro` : defaultMetadata.title,
    description: description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title ? `${title} | DropshipPro` : defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : defaultMetadata.openGraph?.images,
    },
    robots: noIndex ? { index: false, follow: false } : defaultMetadata.robots,
  }
}
