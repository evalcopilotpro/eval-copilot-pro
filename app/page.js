'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: '📋',
    agent: 'PRD Analyst',
    color: '#0D9488',
    title: 'Parse Any PRD',
    desc: 'Drop in a PRD from Notion, Confluence, Google Docs, or plain text. The PRD Analyst extracts structured requirements, flags ambiguities, and identifies gaps — instantly.',
  },
  {
    icon: '✅',
    agent: 'Criteria Engine',
    color: '#7C3AED',
    title: 'Auto-Generate Acceptance Criteria',
    desc: 'Every requirement gets Gherkin-style acceptance criteria (Given/When/Then) with edge cases and priority scores. No more translating requirements by hand.',
  },
  {
    icon: '🧪',
    agent: 'Test Architect',
    color: '#DC2626',
    title: 'Executable Test Plans',
    desc: 'Acceptance criteria become real Playwright, Cypress, or Pytest test code — mapped back to requirements with full traceability. CI/CD-ready from day one.',
  },
  {
    icon: '🔮',
    agent: 'Quality Oracle',
    color: '#EA580C',
    title: 'PM-Readable Verdicts',
    desc: 'SHIP, HOLD, or BLOCK — with a quality score, per-requirement status, top risks, and a Slack-ready summary. Know exactly where you stand without reading a single test.',
  },
];

const STATS = [
  { value: '60%', label: 'of bugs trace to requirements misunderstanding' },
  { value: '4→1', label: 'handoffs eliminated in the quality loop' },
  { value: '<3s', label: 'from PRD paste to structured requirements' },
  { value: '0', label: 'API keys or accounts needed to try it' },
];

function FeatureCard({ feature, index }) {
  return (
    <div
      className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${feature.color}12` }}
        >
          {feature.icon}
        </div>
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider mb-1" style={{ color: feature.color }}>
            {feature.agent}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
      <div
        className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: feature.color }}
      />
    </div>
  );
}

function PipelineStep({ step, index, total }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{ background: `${step.color}15`, animation: `float 3s ease-in-out ${index * 0.4}s infinite` }}
      >
        {step.icon}
      </div>
      <span className="text-sm font-semibold text-gray-700">{step.name}</span>
      {index < total - 1 && (
        <svg width="24" height="12" viewBox="0 0 24 12" className="text-gray-300 mx-1">
          <path d="M0 6h20m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pipeline = [
    { icon: '📋', name: 'PRD Analyst', color: '#0D9488' },
    { icon: '✅', name: 'Criteria Engine', color: '#7C3AED' },
    { icon: '🧪', name: 'Test Architect', color: '#DC2626' },
    { icon: '🔮', name: 'Quality Oracle', color: '#EA580C' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #0D9488, #7C3AED)' }}>
              <span className="text-white font-bold">⚡</span>
            </div>
            <span className="font-bold text-gray-900">Eval Copilot PRO</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">How It Works</a>
            <Link
              href="/demo"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-28 pb-20 px-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-mono font-semibold text-teal-600 mb-6">
            100% LOCAL • NO API KEYS • INSTANT RESULTS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            From PRD to
            <br />
            <span className="gradient-text">Production Confidence</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Four AI agents parse your PRD, generate acceptance criteria, create executable tests, and deliver a ship/hold/block verdict — so you never ship blind again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-xl text-base font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}
            >
              🚀 Try the Pipeline Now
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              See How It Works
            </a>
          </div>

          {/* Pipeline visualization */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
            {pipeline.map((step, i) => (
              <PipelineStep key={i} step={step} index={i} total={pipeline.length} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Four Agents. One Pipeline.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Each agent has a clear domain. They pass structured context to each other — no human translation required.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500">Three steps. Zero setup. Real results.</p>
          </div>
          <div className="space-y-8">
            {[
              { num: '01', title: 'Paste Your PRD', desc: 'Drop in any product requirements document — from a polished Confluence page to rough notes in a Google Doc. The PRD Analyst parses it into structured, traceable requirements.', color: '#0D9488' },
              { num: '02', title: 'Watch the Pipeline Run', desc: 'Four agents process your PRD sequentially. Each one builds on the output of the last: requirements → acceptance criteria → test plans → quality verdict. Real-time logs show you exactly what\'s happening.', color: '#7C3AED' },
              { num: '03', title: 'Get Your Verdict', desc: 'The Quality Oracle delivers a SHIP, HOLD, or BLOCK verdict with a score, per-requirement status, top risks, and a Slack-ready summary you can paste directly into your team channel.', color: '#EA580C' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ background: step.color }}
                >
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 hero-gradient">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Built For PMs Who Own Quality</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Product Managers', desc: 'Get direct visibility into whether what shipped matches what you specified — without reading code or test scripts.', emoji: '🎯' },
              { title: 'Engineering Managers', desc: 'Reduce "requirements bugs" that cost $5K–$25K each to fix in production. Catch them before sprint planning.', emoji: '⚙️' },
              { title: 'QA Leads', desc: 'Stop spending 30% of your time translating PRDs into test cases. Focus on exploratory testing and edge cases.', emoji: '🔍' },
            ].map((persona, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{persona.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{persona.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{persona.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Try It Right Now</h2>
          <p className="text-gray-400 mb-8 text-lg">No signup. No API keys. Paste a PRD and see your quality verdict in seconds.</p>
          <Link
            href="/demo"
            className="inline-block px-10 py-4 rounded-xl text-lg font-bold text-navy transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6EE7B7, #0D9488)' }}
          >
            🚀 Launch the Pipeline
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-navy border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-xs"
              style={{ background: 'linear-gradient(135deg, #0D9488, #7C3AED)' }}>
              <span className="text-white font-bold">⚡</span>
            </div>
            <span className="text-sm text-gray-400">Eval Copilot PRO v2.0</span>
          </div>
          <div className="text-xs text-gray-500">
            Built by Anirudh Ravikumar • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
