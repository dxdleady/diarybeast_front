import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';

export const metadata: Metadata = {
  title: "DiaryBeast - Feed your beast, grow your mind",
  description: "Web3 gamified journaling app with your virtual pet companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
