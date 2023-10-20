import type { Metadata } from "next";
import { Play } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { validThemes } from "@/lib/Constants";

const play = Play({ weight: "700", display: "swap", subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: { theme: string };
}) {
  const headersList = headers();
  const subDomain =
    (headersList.get("host") &&
      headersList.get("host")?.split(".")?.[0].toLowerCase()) ||
    "dark";
  const currentTheme = validThemes[subDomain as keyof typeof validThemes];

  return {
    title: `Clock | ${
      currentTheme ? subDomain[0].toUpperCase() + subDomain.slice(1) : "Dark"
    }`,
    description: "Multi-tenant demo",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={play.className}>{children}</body>
    </html>
  );
}
