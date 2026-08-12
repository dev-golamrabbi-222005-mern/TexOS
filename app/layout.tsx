import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'TexOS - RMG Worker Safety & Digital Production Tracking',
  description: 'Digital platform for Bangladesh Ready-Made Garments industry worker safety grievances and real-time bundle production tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
