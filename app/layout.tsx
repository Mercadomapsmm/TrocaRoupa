import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrocaRoupa - Provador Virtual com Inteligência Artificial',
  description: 'Vista roupas e acessórios em pessoas reais para homens, mulheres e crianças em múltiplos ângulos com caimento ultra-realista.',
  openGraph: {
    title: 'TrocaRoupa - Provador Virtual com Inteligência Artificial',
    description: 'Vista roupas e acessórios em pessoas reais para homens, mulheres e crianças em múltiplos ângulos com caimento ultra-realista.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrocaRoupa - Provador Virtual com Inteligência Artificial',
    description: 'Vista roupas e acessórios em pessoas reais para homens, mulheres e crianças em múltiplos ângulos com caimento ultra-realista.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
