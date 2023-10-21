import { Play } from "next/font/google";
import "./globals.css";
import "../styles/clock.css";
import "react-toastify/dist/ReactToastify.css";

const play = Play({ weight: "700", display: "swap", subsets: ["latin"] });

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
