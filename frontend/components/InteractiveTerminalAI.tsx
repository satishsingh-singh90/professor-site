import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { Sparkles, Send, Terminal, ArrowRight, CheckCircle2, CornerDownLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveTerminalAI() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(
    "Dr. Prabh Deep Singh's research integrates Deep Neural Architectures, Clinical Informatics, and Wearable Healthcare IoT to build trustworthy, real-time diagnostic systems."
  );
  const [activePrompt, setActivePrompt] = useState('Core Research');

  const samplePrompts = [
    { label: 'Core Research', text: "What are Dr. Prabh Deep Singh's primary research thrusts in Medical AI?" },
    { label: 'Patents & Sensors', text: "Summarize the key medical sensor patents and inventions developed by the lab." },
    { label: 'Doctoral Advising', text: "What areas is the lab currently recruiting PhD and research scholars for?" },
    { label: 'University & Role', text: "What is Dr. Singh's role and affiliation at Graphic Era Deemed to Be University?" },
  ];

  const handleQuery = async (queryText: string, promptLabel?: string) => {
    if (!queryText.trim() || loading) return;
    if (promptLabel) setActivePrompt(promptLabel);
    setLoading(true);
    setResponse('');
    let accumulated = '';

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText.trim(), history: [] })
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server returned ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'chunk' && data.text) {
              accumulated += data.text;
              setResponse(accumulated);
              setLoading(false); // as soon as tokens start arriving, render live text
            }
          } catch (e) {
            // buffer split, ignore
          }
        }
      }

      if (!accumulated) {
        setResponse("Dr. Prabh Deep Singh focuses on Multi-Modal Medical Diagnostics, Clinical Informatics, and Edge IoT Devices at Graphic Era Deemed to Be University.");
      }
    } catch (err) {
      setResponse("Dr. Prabh Deep Singh focuses on Multi-Modal Medical Diagnostics, Clinical Informatics, and Edge IoT Devices at Graphic Era Deemed to Be University.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-dark-900/90 border border-cyber-teal/30 p-6 sm:p-8 shadow-2xl shadow-cyber-teal/10 overflow-hidden group">
      {/* Ambient background glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyber-teal/15 rounded-full filter blur-3xl pointer-events-none group-hover:bg-cyber-teal/25 transition duration-700"></div>
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-cyber-purple/15 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Terminal Top Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>profai-twin-v2.0 // live terminal</span>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-teal/10 border border-cyber-teal/30 rounded-full text-[11px] font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyber-tealGlow animate-pulse"></span>
          <span>GEMINI 2.0 NEURAL CORE ACTIVE</span>
        </div>
      </div>

      {/* Interactive Sample Prompt Pills */}
      <div className="relative z-10 pt-5 space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Select Instant Prompt or Ask Freely:</p>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setQuestion(p.text);
                handleQuery(p.text, p.label);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${activePrompt === p.label
                ? 'bg-cyber-teal text-white shadow-glowTeal font-semibold'
                : 'bg-dark-800/80 hover:bg-dark-700 text-slate-300 border border-dark-700'
                }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Response Box */}
      <div className="relative z-10 my-5 bg-dark-950/80 border border-dark-700/90 rounded-2xl p-5 font-mono text-sm text-slate-200 min-h-[110px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-cyber-teal font-semibold">
            <CheckCircle2 className="w-4 h-4 text-cyber-tealGlow" />
            <span>PROFAI DIGITAL TWIN RESPONSE</span>
          </div>
          {loading ? (
            <div className="flex items-center space-x-3 py-4 text-cyan-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs">Synthesizing publications, patents, and faculty database...</span>
            </div>
          ) : (
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans font-normal">
              {response}
            </p>
          )}
        </div>

        <div className="pt-3 mt-3 border-t border-dark-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Trained on 45+ Papers, 8+ Patents & Curriculum Data</span>
          <Link href="/ai-assistant" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1">
            <span>Open Full AI Studio</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Input query form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery(question);
        }}
        className="relative z-10 flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask ProfAI anything about research, papers, teaching..."
          className="flex-1 bg-dark-950/90 border border-dark-700 focus:border-cyber-teal rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-teal font-sans transition"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-gradient-to-r from-cyber-teal to-cyber-cyan hover:opacity-90 disabled:opacity-50 text-dark-950 font-semibold px-5 py-3 rounded-xl text-sm flex items-center space-x-2 transition shadow-glowTeal shrink-0 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>
    </div>
  );
}
