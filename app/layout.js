import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://catcoin-pfp-generator.pages.dev'),
  title: "Catcoin PFP Generator",
  description: "The official Catcoin Profile Picture Generator. Slide, Thud, and Meow!",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Catcoin PFP Generator",
    description: "The official Catcoin Profile Picture Generator. Create your custom Catcoin PFP with unique costumes, accessories, and more!",
    siteName: 'Catcoin PFP Generator',
    images: [
      {
        url: '/social-sharing.jpg',
        width: 1200,
        height: 630,
        alt: 'Catcoin PFP Generator Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Catcoin PFP Generator",
    description: "Create your custom Catcoin PFP! Slide, Thud, and Meow!",
    images: ['/social-sharing.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
