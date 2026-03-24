import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "haleel.org - Practice BECE & WASSCE Past Questions Online",
  description:
    "Revise smarter, take mock exams, and track your performance. Ghana's top platform for JHS and SHS students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
