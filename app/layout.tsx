import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollThemeController } from "@/components/scroll-theme-controller";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "BBC Construction — We build toward the sky.",
  description:
    "BBC Construction designs, builds, and delivers landmark architecture. From first sketch to skyline, we raise what comes next.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} light theme-white antialiased`}
    >
      <body className="overflow-x-hidden bg-background font-sans text-foreground">
        <SmoothScroll>
          {children}
          <ScrollThemeController />
        </SmoothScroll>
      </body>
    </html>
  );
}
