import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learning With U — Making Learning Fun",
  description: "An educational platform for children with Special Educational Needs (SEN). AAC symbols, maths, English, art and more.",
  keywords: "SEN learning app UK, AAC symbols for children, SEN maths app, special educational needs",
  openGraph: {
    title: "Learning With U",
    description: "Making Learning Fun — SEN • Play • Learn • Grow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="h-full">
      <body className="min-h-full antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
