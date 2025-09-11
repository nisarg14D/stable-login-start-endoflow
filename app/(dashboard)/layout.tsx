import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';


const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ENDOFLOW Dental Management',
  description: 'Your AI-Powered Dental Practice OS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        {children}
      </body>
    </html>
  );
}