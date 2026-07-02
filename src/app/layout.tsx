import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { Agentation } from "agentation";
import Providers from "./Providers";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PU-iNCENT Dashboard | Startup Incubation Center",
  description: "Incubation Center Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background text-on-surface">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full overflow-hidden font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            <Sidebar />
            <TopNavbar />
            <main className="ml-[280px] pt-24 pb-12 px-margin-desktop h-full overflow-y-auto bg-background transition-colors duration-200">
              {children}
            </main>
            <Agentation />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
