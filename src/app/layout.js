import { Inter } from "next/font/google";
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Mapa App",
  description: "Mapa App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
