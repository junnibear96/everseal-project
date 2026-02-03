'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  History,
  ChevronRight,
  Server,
  Globe,
  Database,
  Cpu,
  Key
} from 'lucide-react';

export default function LandingPage() {
  // Demo URLs (Generated for specific Mock DB state)
  // Backend Mock DB initializes with Counter: 0.
  // We use High Counter (100) for Valid.
  // We use Lower Counter (50) for Replay (after Valid is clicked, DB=100, so 50 <= 100 -> Replay).
  // Note: If user clicks Replay FIRST, it will pass (50 > 0). That's acceptable for a demo.

  // CMACs calculated manually based on generate_nfc_url.js output:
  // Ctr 100: 238,87... -> EE5795E6A98FC97E4A6EF4EF79F16728
  // Ctr 50:  83,46...  -> 532E81113C776594A0945E9E5D77AEB2

  const DEMO_LINKS = {
    VALID: '/verify?uid=042A5C9A1B3D80&ctr=100&cmac=EE5795E6A98FC97E4A6EF4EF79F16728',
    REPLAY: '/verify?uid=042A5C9A1B3D80&ctr=50&cmac=532E81113C776594A0945E9E5D77AEB2',
    INVALID: '/verify?uid=042A5C9A1B3D80&ctr=101&cmac=FAKE_CMAC_SIGNATURE_1234'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
              EverSeal
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#technology" className="hover:text-indigo-600 transition-colors">Technology</a>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center"
            >
              Admin Login <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6">
            <Globe className="w-3 h-3 mr-1" /> Blockchain Secured
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Immutable Trust via <br />
            <span className="text-indigo-600">Blockchain & NTAG 424 DNA</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            The world's most secure product authentication platform.
            Prevents counterfeiting using bank-grade AES-CMAC encryption and on-chain verification.
          </p>

          {/* Interactive Demo Buttons */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Try Live Simulation (No Hardware Required)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href={DEMO_LINKS.VALID}
                className="flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30"
              >
                Scan Valid Tag
              </Link>
              <Link
                href={DEMO_LINKS.REPLAY}
                className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/30"
              >
                Scan Replay Attack
              </Link>
              <Link
                href={DEMO_LINKS.INVALID}
                className="flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/30"
              >
                Scan Invalid Tag
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              *Tips: Click "Valid" first to set the chain state, then click "Replay" to test protection mechanism.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tech Stack Showcase */}
      <section id="technology" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Built with Modern Tech Stack</h2>
            <p className="text-slate-500 mt-2">Engineered for security, scalability, and performance.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'NestJS', icon: Server, color: 'text-red-600', bg: 'bg-red-50' },
              { name: 'Next.js', icon: Globe, color: 'text-slate-900', bg: 'bg-slate-100' },
              { name: 'PostgreSQL', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
              { name: 'AES-CMAC', icon: Key, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Docker', icon: BoxIcon, color: 'text-blue-500', bg: 'bg-blue-50' }, // Custom icon placeholder
              { name: 'Smart Contract', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((tech) => (
              <div key={tech.name} className={`${tech.bg} p-6 rounded-xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-default`}>
                <tech.icon className={`w-8 h-8 ${tech.color} mb-3`} />
                <span className="font-semibold text-slate-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={Lock}
              title="Bank-Grade Encryption"
              description="Utilizes AES-128 CMAC standard. The secret key never leaves the secure element of the NFC chip."
            />
            <FeatureCard
              icon={History}
              title="Anti-Replay Protection"
              description="Each tap generates a unique dynamic URL. Re-using an old link triggers an immediate security alert."
            />
            <FeatureCard
              icon={Database}
              title="Real-time Logging"
              description="Every interaction is immutably recorded on both our high-performance SQL database and the Blockchain."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <ShieldCheck className="w-10 h-10 text-indigo-500 mb-4" />
          <p className="mb-4">&copy; 2024 EverSeal Project. All rights reserved.</p>
          <p className="text-xs max-w-md">
            This project is a portfolio demonstration. Not for commercial use.
            "NTAG" is a trademark of NXP B.V.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Components
function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Helper Icon
function BoxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
