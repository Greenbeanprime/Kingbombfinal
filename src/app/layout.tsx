import type { Metadata, Viewport } from "next";
import { Cinzel, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TabBar } from "@/components/NavLinks";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartBar } from "@/components/cart/CartBar";
import { orderingOn } from "@/data/menu";
import { SITE } from "@/lib/site";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a08",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "KINGBOMB | Late Night Food in Florida: Seafood Platters, Tacos & Pho",
    template: "%s | KINGBOMB",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "late night food Florida",
    "seafood platters",
    "Coastal Party Platters",
    "tacos",
    "pho",
    "catering",
    "late night delivery",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  image: `${SITE.url}${SITE.logo}`,
  description: SITE.description,
  servesCuisine: SITE.cuisines,
  slogan: SITE.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ordering = orderingOn();
  const shell = (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-gold-hi focus:px-4 focus:py-3 focus:font-display focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
      <TabBar />
      {ordering && <CartBar />}
    </>
  );

  return (
    <html lang="en" className={`${cinzel.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {ordering ? <CartProvider>{shell}</CartProvider> : shell}
      </body>
    </html>
  );
}
