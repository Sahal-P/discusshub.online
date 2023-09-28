import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import React from "react";
import  Provider  from "@/components/Providers";

export const metadata = {
  title: "Discusshub",
  description:
    "A social news aggregation, content rating, and discussion website. Registered users submit content to the site such as links, text posts, images, and videos",
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
