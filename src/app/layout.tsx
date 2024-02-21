import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Kaung Min Khant",
    default: "Kaung Min Khant",
  },
  description: "Check out my smart portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <div className="flex h-svh flex-col">
            <NavBar />
            {/* <div className="flex flex-col"> */}
            <main className="mx-auto max-w-3xl flex-grow px-3">{children}</main>
            <Footer />
            {/* </div> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
