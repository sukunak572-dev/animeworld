import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { ShieldCheck, FileText } from 'lucide-react';

export const LegalPage: React.FC<{ initialTab?: 'privacy' | 'terms' }> = ({ initialTab = 'privacy' }) => {
  const { currentPath } = useRouter();
  const [tab, setTab] = useState<'privacy' | 'terms'>(
    currentPath.includes('terms') ? 'terms' : initialTab
  );

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
              COMPLIANCE & GOVERNANCE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              Legal Documentation
            </h1>
          </div>

          <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded border border-white/10 text-xs">
            <button
              onClick={() => setTab('privacy')}
              className={`px-3 py-1.5 rounded transition-colors ${
                tab === 'privacy' ? 'bg-[#d4af37] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`px-3 py-1.5 rounded transition-colors ${
                tab === 'terms' ? 'bg-[#d4af37] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {tab === 'privacy' ? (
          <div className="p-8 bg-[#12141a] border border-white/10 rounded-lg space-y-6 text-neutral-300 text-sm font-light leading-relaxed">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              <span>Privacy Policy & Data Protection</span>
            </h2>
            <p className="text-xs font-mono text-neutral-500">Last Revised: October 2026</p>

            <h3 className="text-base font-semibold text-white pt-2">1. Data We Collect</h3>
            <p>
              When you authenticate with Google Sign-In, we store your unique identifier, email address, and avatar URL in isolated Google Cloud Firestore user partitions. We do not sell, rent, or trade personal data to third parties.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">2. Playback & Watchlist Telemetry</h3>
            <p>
              Your watchlist and viewing history are stored solely to deliver resume-playback functionality, bookmark synchronicity, and personalized recommendations across authenticated devices.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">3. Zero Third-Party Advertising Trackers</h3>
            <p>
              ANIMEVERSE operates a premium editorial model with zero surveillance advertising cookies, zero third-party behavioral pixels, and zero cross-site trackers.
            </p>
          </div>
        ) : (
          <div className="p-8 bg-[#12141a] border border-white/10 rounded-lg space-y-6 text-neutral-300 text-sm font-light leading-relaxed">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel'] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              <span>Terms of Service & Licensing</span>
            </h2>
            <p className="text-xs font-mono text-neutral-500">Last Revised: October 2026</p>

            <h3 className="text-base font-semibold text-white pt-2">1. Authorized Streaming License</h3>
            <p>
              ANIMEVERSE grants you a personal, non-transferable, non-exclusive license to stream authorized anime video works for non-commercial personal viewing. Circumventing digital rights management or redistributing stream assets is strictly prohibited.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">2. Intellectual Property</h3>
            <p>
              All video assets, character trademarks, musical scores, original audio dubs, and Japanese production materials are the exclusive property of their respective production committees and licensors.
            </p>

            <h3 className="text-base font-semibold text-white pt-2">3. Administrative Oversight</h3>
            <p>
              Administrative access to the ANIMEVERSE Control Center is strictly restricted to designated Google credentials verified via server-side allowlists. Unauthorized access attempts are monitored and permanently blocked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
