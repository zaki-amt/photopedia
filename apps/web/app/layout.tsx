import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photopedia — The Platform for Visual Creators",
  description: "Discover, curate, and share high-resolution photography with a global community of visual artists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col bg-black text-[#ededed] font-sans selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
