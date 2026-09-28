import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Sparkles, 
  Send, 
  GraduationCap, 
  BookOpen, 
  RotateCcw, 
  ExternalLink, 
  FileText, 
  Lightbulb, 
  Activity, 
  User, 
  Copy, 
  Check, 
  ArrowRight,
  Info,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    type: string;
    id: number;
    title: string;
    url: string;
  }>;
}

export default function AiAssistant() {
  const router = useRouter();
  const { q } = router.query;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am Dr. Prabh Deep Singh's AI Digital Twin. 

I have comprehensive knowledge of our lab's research in **Artificial Intelligence in Healthcare**, our published papers in clinical informatics, patent inventions in medical sensors, and funded projects. 

Feel free to ask me anything about our scientific findings, prospective graduate advising, teaching courses, or general inquiries on machine learning for medicine. How can I help you today?`,
      timestamp: 'Just now',
      sources: []
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleSlots, setScheduleSlots] = useState<any[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch live schedule slots
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/schedules`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setScheduleSlots(data);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll ONLY within the chat container, preventing the browser window from jumping to the footer
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle URL query pre-fill
  useEffect(() => {
    if (q && typeof q === 'string' && q.trim()) {
      handleSendPrompt(q);
    }
  }, [q]);

  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || loading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    let hasAddedAssistant = false;
    let accumulatedText = '';
    let receivedSources: Array<{ type: string; id: number; title: string; url: string }> = [];

    try {
      // Build history payload (last 6 messages)
      const historyPayload = newMessages
        .filter(m => m.id !== 'welcome')
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: promptText.trim(),
          history: historyPayload
        })
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
            if (data.type === 'sources') {
              receivedSources = data.sources || [];
              if (!hasAddedAssistant) {
                hasAddedAssistant = true;
                setLoading(false);
                setIsStreaming(true);
                const assistantMessage: Message = {
                  id: assistantId,
                  role: 'assistant',
                  content: '',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  sources: receivedSources
                };
                setMessages(prev => [...prev, assistantMessage]);
              } else {
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, sources: receivedSources } : m)
                );
              }
            } else if (data.type === 'chunk' && data.text) {
              accumulatedText += data.text;
              if (!hasAddedAssistant) {
                hasAddedAssistant = true;
                setLoading(false);
                setIsStreaming(true);
                const assistantMessage: Message = {
                  id: assistantId,
                  role: 'assistant',
                  content: accumulatedText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  sources: receivedSources
                };
                setMessages(prev => [...prev, assistantMessage]);
              } else {
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: accumulatedText } : m)
                );
              }
            }
          } catch (e) {
            // Buffer split parse error, safe to ignore
          }
        }
      }

      if (!hasAddedAssistant) {
        const fallbackMessage: Message = {
          id: assistantId,
          role: 'assistant',
          content: accumulatedText || 'Hello! I am Dr. Prabh Deep Singh. How can I assist you with your academic or research inquiries today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: receivedSources
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (err: any) {
      if (!hasAddedAssistant) {
        const errorMessage: Message = {
          id: assistantId,
          role: 'assistant',
          content: `I encountered a connection issue while synthesizing the answer (${err.message || 'Connection error'}). Please ensure the local backend is active.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: []
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I am Dr. Prabh Deep Singh's AI Digital Twin. 

I have comprehensive knowledge of our lab's research in **Artificial Intelligence in Healthcare**, our published papers in clinical informatics, patent inventions in medical sensors, and funded projects. 

How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestionPills = [
    "Can we meet on Monday between 2 PM to 4 PM?",
    "When are your open office hours for students?",
    "Tell me about your research in AI for healthcare",
    "What are your recent published papers?",
    "Explain your patent on biomedical sensor technology",
    "Are you accepting PhD or Master's students in your lab?"
  ];

  return (
    <>
      <Head>
        <title>Chat with Dr. Prabh Deep Singh — AI Digital Twin</title>
        <meta name="description" content="Engage in an intellectual conversation with the AI persona of Dr. Prabh Deep Singh." />
      </Head>

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-130px)] min-h-[640px]">
          
          {/* =========================================================================
              LEFT SIDEBAR: Professor Persona Profile
          ========================================================================== */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col justify-between academic-card p-5 overflow-y-auto">
            <div className="space-y-5">
              {/* Professor Profile Header (Centered & Stacked) */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-academic-border">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-scholar-teal/30 shadow-card bg-academic-subtle transition duration-300 group-hover:border-scholar-teal/60">
                    <img
                      src="/professor-photo.jpg"
                      alt="Dr. Prabh Deep Singh"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="Digital Twin Active"></span>
                </div>

                <div className="mt-3 space-y-1">
                  <h2 className="font-heading text-base font-bold text-ink-900 leading-tight">
                    Dr. Prabh Deep Singh
                  </h2>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-scholar-teal/10 text-scholar-teal border border-scholar-teal/20">
                      AI Digital Twin &bull; Lab Advisor
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500 font-sans pt-0.5">
                    Associate Professor of Computer Science
                  </p>
                </div>
              </div>



              {/* Persona Description */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-700 font-semibold">About This Digital Twin</h4>
                <p className="text-xs text-ink-600 leading-relaxed font-sans">
                  This virtual persona of Dr. Prabh Deep Singh is grounded in our lab's vector database of peer-reviewed papers, patents, research pillars, and course syllabi.
                </p>
              </div>

              {/* Research Pillars */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-700 font-semibold">Specialized Topics</h4>
                <div className="flex flex-wrap gap-1 text-xs">
                  <span className="badge-tag bg-academic-paper border border-academic-border text-ink-700 text-[11px] py-0.5">Clinical AI</span>
                  <span className="badge-tag bg-academic-paper border border-academic-border text-ink-700 text-[11px] py-0.5">Medical Imaging</span>
                  <span className="badge-tag bg-academic-paper border border-academic-border text-ink-700 text-[11px] py-0.5">Health Sensors</span>
                  <span className="badge-tag bg-academic-paper border border-academic-border text-ink-700 text-[11px] py-0.5">PhD Advising</span>
                  <span className="badge-tag bg-academic-paper border border-academic-border text-ink-700 text-[11px] py-0.5">Lab Grants</span>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-700 font-semibold">Conversation Starters</h4>
                <div className="space-y-1.5">
                  {suggestionPills.slice(0, 4).map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(pill)}
                      disabled={loading}
                      className="text-left w-full p-2 rounded-lg bg-academic-paper hover:bg-academic-subtle border border-academic-borderLight text-xs text-ink-700 transition font-sans line-clamp-2"
                    >
                      &bull; {pill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-academic-border flex items-center justify-between text-xs">
              <button
                onClick={handleClearChat}
                className="inline-flex items-center space-x-1.5 text-ink-500 hover:text-ink-900 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
              <Link href="/contact" className="text-scholar-teal hover:underline font-medium">
                Email Lab &rarr;
              </Link>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: Conversational Chat Thread (Expanded)
          ========================================================================== */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col academic-card overflow-hidden h-full">
            {/* Header / Status bar */}
            <div className="px-6 py-3.5 border-b border-academic-border bg-academic-card flex items-center justify-between">

              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <span className="font-heading text-base font-bold text-ink-900 block leading-none">
                    Office Hours Dialogue &bull; ProfAI
                  </span>
                  <span className="text-[11px] font-mono text-ink-500">
                    Model: Academic RAG Synthesis
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-scholar-teal/30 text-scholar-teal font-mono text-xs font-semibold transition cursor-pointer"
                  title="View Professor Timetable & Office Hours"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Timetable & Office Hours</span>
                </button>

                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 text-ink-400 hover:text-ink-800 hover:bg-academic-paper rounded-md transition text-xs flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-academic-bg/50">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-scholar-teal/30 shrink-0 shadow-sm mt-1 bg-academic-subtle">
                        <img
                          src="/professor-photo.jpg"
                          alt="Dr. Prabh Deep Singh"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )}


                    <div className={`max-w-3xl xl:max-w-4xl w-full group space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Name & Time */}
                      <div className={`flex items-center space-x-2 text-[11px] font-mono text-ink-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span>{isUser ? 'You' : 'Dr. Prabh Deep Singh'}</span>
                        <span>&bull;</span>
                        <span suppressHydrationWarning>{m.timestamp}</span>
                      </div>


                      {/* Message Bubble */}
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-scholar-navy text-white rounded-tr-none shadow-sm'
                            : 'bg-white border border-academic-border text-ink-800 rounded-tl-none shadow-card'
                        }`}
                      >
                        <div className="font-sans leading-relaxed text-sm">
                          {isUser ? (
                            <div className="whitespace-pre-wrap">{m.content}</div>
                          ) : m.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-ink-950" {...props} />,
                                em: ({ node, ...props }) => <em className="italic" {...props} />,
                                h1: ({ node, ...props }) => <h3 className="font-heading text-lg font-bold text-ink-950 mt-3 mb-1.5" {...props} />,
                                h2: ({ node, ...props }) => <h4 className="font-heading text-base font-bold text-ink-950 mt-2.5 mb-1" {...props} />,
                                h3: ({ node, ...props }) => <h5 className="font-heading text-sm font-bold text-ink-950 mt-2 mb-1" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-outside pl-5 space-y-1 mb-2.5" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-outside pl-5 space-y-1 mb-2.5" {...props} />,
                                li: ({ node, ...props }) => <li className="leading-relaxed pl-0.5" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote className="border-l-4 border-scholar-teal pl-3 py-1 my-2 italic text-ink-700 bg-scholar-teal/5 rounded-r" {...props} />
                                ),
                                code: ({ node, className, children, ...props }: any) => {
                                  const isBlock = className?.includes('language-');
                                  if (isBlock) {
                                    return (
                                      <pre className="bg-ink-900 text-ink-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2 border border-ink-800">
                                        <code {...props}>{children}</code>
                                      </pre>
                                    );
                                  }
                                  return (
                                    <code className="bg-ink-100 text-scholar-navy font-mono text-xs px-1.5 py-0.5 rounded border border-ink-200" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                table: ({ node, ...props }) => (
                                  <div className="overflow-x-auto my-3">
                                    <table className="min-w-full divide-y divide-academic-border border border-academic-border text-xs" {...props} />
                                  </div>
                                ),
                                th: ({ node, ...props }) => <th className="px-3 py-2 bg-academic-paper font-mono font-semibold text-ink-900 text-left" {...props} />,
                                td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-academic-border text-ink-700" {...props} />,
                                a: ({ node, ...props }) => (
                                  <a target="_blank" rel="noopener noreferrer" className="text-scholar-teal font-medium underline hover:text-scholar-tealDark" {...props} />
                                )
                              }}
                            >
                              {m.content}
                            </ReactMarkdown>
                          ) : (
                            <div className="flex items-center space-x-2 text-ink-500 py-1 text-xs font-mono">
                              <span className="w-2 h-2 rounded-full bg-scholar-teal animate-ping" />
                              <span>Preparing scholarly response...</span>
                            </div>
                          )}
                        </div>


                        {/* Citation Reference Cards */}
                        {m.sources && m.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-academic-borderLight space-y-2">
                            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-scholar-teal flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>Referenced Publications & Lab Records:</span>
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {m.sources.map((src, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={src.url || '/publications'}
                                  className="p-2 bg-academic-paper hover:bg-academic-subtle rounded-lg border border-academic-border flex items-start space-x-2 transition group/src"
                                >
                                  <FileText className="w-3.5 h-3.5 text-scholar-teal mt-0.5 shrink-0" />
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-ink-900 group-hover/src:text-scholar-teal truncate">
                                      {src.title}
                                    </p>
                                    <span className="text-[10px] font-mono text-ink-500 uppercase">
                                      {src.type} &rarr;
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (Copy) */}
                      <div className={`flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="text-[11px] text-ink-400 hover:text-ink-700 flex items-center space-x-1"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy response</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-ink-200 text-ink-700 flex items-center justify-center text-xs shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Thinking / Typing Animation */}
              {loading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-scholar-teal/30 shrink-0 shadow-sm bg-academic-subtle">
                    <img
                      src="/professor-photo.jpg"
                      alt="Dr. Prabh Deep Singh"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="bg-white border border-academic-border p-4 rounded-2xl rounded-tl-none shadow-card flex items-center space-x-2">

                    <span className="w-2 h-2 rounded-full bg-scholar-teal animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-scholar-teal animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-scholar-teal animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs text-ink-500 font-mono pl-2">Consulting research records & formulating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar & Suggested Prompts */}
            <div className="p-4 border-t border-academic-border bg-white space-y-3">
              {/* Suggestion Chips */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-mono text-ink-400 shrink-0">Prompts:</span>
                {suggestionPills.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(pill)}
                    disabled={loading}
                    className="px-2.5 py-1 bg-academic-paper hover:bg-academic-subtle border border-academic-border rounded-full text-ink-600 hover:text-ink-900 whitespace-nowrap transition text-xs font-sans"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Dr. Prabh Deep Singh anything about research, papers, or lab opportunities..."
                  className="flex-1 bg-academic-bg border border-academic-border rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-scholar-teal focus:bg-white transition"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-scholar-navy hover:bg-scholar-teal text-white p-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROFESSOR TIMETABLE & OFFICE HOURS MODAL
        ========================================================================== */}
        {showScheduleModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowScheduleModal(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-scholar-teal/10 text-scholar-teal flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      Dr. Prabh Deep Singh &bull; Weekly Timetable
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Official teaching schedules, lab sessions & open student advising hours
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Schedule List */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed font-sans">
                  <strong>Notice for Students:</strong> Please verify open advising slots below before requesting meetings. If an urgent physical signature is required and Dr. Singh is in class, please email with your student ID or contact the office below.
                </div>

                <div className="space-y-2.5">
                  {scheduleSlots.length === 0 ? (
                    <p className="text-xs text-slate-500 font-mono py-4 text-center">
                      Loading schedule details...
                    </p>
                  ) : (
                    scheduleSlots.map((slot: any) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
                          slot.is_available
                            ? 'bg-teal-50/70 border-[#0D9488]/30 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 uppercase tracking-wide">
                              {slot.day_of_week}
                            </span>
                            <span className="text-slate-400">&bull;</span>
                            <span className="font-mono text-slate-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{slot.start_time} – {slot.end_time}</span>
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-sm text-slate-900">
                            {slot.title}
                          </h4>

                          {slot.location && (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{slot.location}</span>
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 sm:text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${
                              slot.is_available
                                ? 'bg-[#0D9488] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {slot.is_available ? '✓ Open for Students' : 'Busy / Class'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Contact Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4 text-slate-600 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>satishsingh.singh101@gmail.com</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-emerald-700">7814545199 (Urgent / Emergency)</span>
                  </span>
                </div>

                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
