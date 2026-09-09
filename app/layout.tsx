import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";

/**
 * Relative Book Pro is the house face and is named first in --sans.
 * Commissioner is the fallback: a low-contrast grotesque with a full
 * Greek character set, which most Google faces lack.
 */
const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["greek", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "unbiased · Από τα πρακτικά των δημοτικών συμβουλίων",
    template: "%s · unbiased",
  },
  description:
    "Ιστορίες χτισμένες πάνω στα πρακτικά των δημοτικών συμβουλίων. Κάθε ισχυρισμός φέρει το σήμα της προέλευσής του.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className={commissioner.variable}>
      <body>{children}</body>
    </html>
  );
}
