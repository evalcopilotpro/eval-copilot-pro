import './globals.css';
import { DM_Sans, DM_Mono } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata = {
  title: "Eval Copilot PRO — The PM's Quality Command Center",
  description: 'From PRD to production confidence. AI-powered pipeline that parses requirements, generates acceptance criteria, creates test plans, and delivers quality verdicts.',
  keywords: 'product management, QA, testing, PRD, acceptance criteria, AI, evaluation',
  openGraph: {
    title: 'Eval Copilot PRO',
    description: "The PM's Quality Command Center — PRD → Criteria → Tests → Verdict",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eval Copilot PRO',
    description: "The PM's Quality Command Center — PRD → Criteria → Tests → Verdict",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
