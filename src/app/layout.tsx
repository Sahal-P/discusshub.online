import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import React from "react";
import Provider from "@/components/Providers";
import Head from "next/head";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Discusshub",
  description:
    "A social news aggregation, content rating, and discussion website. Registered users submit content to the site such as links, text posts, images, and videos",
  generator: "Discusshub",
  applicationName: "Discusshub",
  referrer: "origin-when-cross-origin",
  keywords: ["Discusshub", "Discusshub.online", "Discusshub.asyncawait.online", "Discuss", "discussion", "website", "A social news aggregation", "content rating", "write"],
  authors: [{ name: "Sahal P" }, { name: "Sahal P", url: "https://sahal.host" }],
  colorScheme: "dark",
  creator: "Sahal P",
  publisher: "Sahal P",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://discusshub.asyncawait.online'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    title: 'Discusshub',
    description: 'A social news aggregation, content rating, and discussion website',
    url: 'https://discusshub.asyncawait.online',
    siteName: 'Discusshub',
    images: [
      {
        url: '/icon.png',
        width: 400,
        height: 400,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  twitter: {
    card: 'app', 
    title: 'DiscussHub - Your Discussion Platform',
    description: 'Engage in meaningful discussions on various topics with DiscussHub. A platform for sharing ideas and opinions.',
    images: {
      url: '/icon.png', 
      alt: 'DiscussHub Logo', 
    },
    app: {
      name: 'DiscussHub',
      id: {
        iphone: 'discusshub://iphone',
        ipad: 'discusshub://ipad',
        googleplay: 'discusshub://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google',
  },
};

const nunito = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        nunito.className
      )}
    >
      <Head>
        {/* Basic Metadata */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>DiscussHub - Your Discussion Platform</title>
        <meta
          name="description"
          content="Engage in meaningful discussions on various topics with DiscussHub. A platform for sharing ideas and opinions."
        />

        {/* Open Graph (Facebook) */}
        <meta
          property="og:title"
          content="DiscussHub - Your Discussion Platform"
        />
        <meta
          property="og:description"
          content="Engage in meaningful discussions on various topics with DiscussHub. A platform for sharing ideas and opinions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.discusshub.com" />
        <meta
          property="og:image"
          content="https://www.discusshub.com/og-image.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="DiscussHub - Your Discussion Platform"
        />
        <meta
          name="twitter:description"
          content="Engage in meaningful discussions on various topics with DiscussHub. A platform for sharing ideas and opinions."
        />
        <meta
          name="twitter:image"
          content="https://www.discusshub.com/twitter-card-image.jpg"
        />

        {/* Other Metadata */}
        <meta name="author" content="Your Name" />
        <meta
          name="keywords"
          content="discussion, platform, community, ideas, opinions"
        />
        <link rel="canonical" href="https://www.discusshub.com" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Provider>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}
          </div>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
