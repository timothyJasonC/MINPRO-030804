import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { UserContextProvider } from './userContext';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Evently",
  description: "Evently is a platform for event management",
  icons: {
    icon: "/images/logo.svg"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <UserContextProvider>
          <Header />
          {children}
          <Footer />
        </UserContextProvider>
      </body>
    </html>
  );
}
