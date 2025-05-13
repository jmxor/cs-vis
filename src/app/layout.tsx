import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CS Vis',
  description: 'A simple visualizer for computer science concepts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
