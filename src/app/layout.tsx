import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ItemModal } from "@/components/ItemModal";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Richie Rich — Kota, Worsroll & Shawarma | Order Online",
    template: "%s · Richie Rich",
  },
  description:
    "Richie Rich Kota & Shisa Kitchen, Pretoria CBD. Private school kotas from R40, worsrolls from R25, shawarmas, wrap kotas & share boxes. Pay with Yoco, Ozow or PayFast — WhatsApp receipt lands instantly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable}`}>
      <body className="bg-coal text-cream font-body antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <ItemModal />
        </CartProvider>
      </body>
    </html>
  );
}
