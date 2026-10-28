import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Support',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
            INQUIRIES & SUPPORT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Contact ANIMEVERSE
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-light">
            Direct communication for viewer support, studio licensing submissions, or technical issues.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#12141a] border border-[#d4af37]/40 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out. A senior member of our curation and support team will respond to <strong className="text-white">{formData.email}</strong> within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', topic: 'Support', message: '' });
              }}
              className="px-4 py-2 bg-white/10 text-xs font-semibold rounded text-white"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 bg-[#12141a] border border-white/10 rounded-lg space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase font-mono text-neutral-400">Your Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kenji Tanaka"
                className="w-full bg-neutral-900 border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono text-neutral-400">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-neutral-900 border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono text-neutral-400">Department / Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Support">Viewer Support & Streaming Quality</option>
                <option value="Licensing">Studio Licensing & Content Distribution</option>
                <option value="Localization">Subtitles & Audio Translation Feedback</option>
                <option value="Press">Press & Editorial Partnerships</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-mono text-neutral-400">Your Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry with detail..."
                className="w-full bg-neutral-900 border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
