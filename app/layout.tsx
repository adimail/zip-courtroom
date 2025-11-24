import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Zip Courtroom | Director vs. Documentation Head",
  description:
    "The high-stakes, over-engineered rivalry between the Director and the Documentation Head. Solving the game of zip from linkedin has never been this litigious.",
  openGraph: {
    title: "Zip Courtroom | Director vs. Documentation Head",
    description:
      "Witness the petty legal battle between the Director and the Documentation Head. Who solves 'zip' faster? The court is now in session.",
    url: "https://zip-courtroom.vercel.app",
    siteName: "Zip Courtroom",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Zip Courtroom Verdict Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zip Courtroom | Director vs. Documentation Head",
    description:
      "Witness the petty legal battle between the Director and the Documentation Head. Who solves 'zip' faster? The court is now in session.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}