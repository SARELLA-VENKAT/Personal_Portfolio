import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarella Venkat — Full-Stack Developer & AI Builder",
  description:
    "Sarella Venkat builds fast, modern web apps and AI-integrated systems. Freelance Full-Stack Developer & CS (AI/ML) student based in Hyderabad, India.",
  keywords: ["Sarella Venkat", "full-stack developer", "AI developer", "React developer", "TypeScript", "Supabase", "Hyderabad"],
  authors: [{ name: "Sarella Venkat" }],
  creator: "Sarella Venkat",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sarella Venkat — Full-Stack Developer & AI Builder",
    description: "Sarella Venkat builds fast, modern web apps and AI-integrated systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarella Venkat — Full-Stack Developer & AI Builder",
    description: "I build modern web apps and AI-powered digital products.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sarella Venkat",
              jobTitle: "Full-Stack Developer & AI Builder",
              email: "venkatsarella12@gmail.com",
              telephone: "+91-6305210365",
              address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
              sameAs: [
                "https://linkedin.com/in/venkat-sarella-01b645333",
                "https://github.com/SARELLA-VENKAT",
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistMono.className} min-h-screen bg-white text-black antialiased`}>{children}</body>
    </html>
  );
}
