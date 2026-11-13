import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Send, Terminal, Trash2, User } from 'lucide-react';
import { DiagnosticMessage } from '../types/mill';
import { TranslationBundle } from '../i18n/translations';

interface DiagnosticsConsoleProps {
  t: TranslationBundle;
  messages: DiagnosticMessage[];
  onSubmitQuery: (query: string) => void;
  onClearLog: () => void;
}

export const DiagnosticsConsole: React.FC<DiagnosticsConsoleProps> = ({
  t,
  messages,
  onSubmitQuery,
  onClearLog,
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmitQuery(trimmed);
    setInput('');
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            {t.diagnostics.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearLog}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
          >
            <Trash2 className="w-3 h-3 text-rose-500" />
            <span>{t.diagnostics.clearLog}</span>
          </button>
          <span className="hidden sm:inline text-[10px] font-mono-tech font-semibold text-cyan-700 dark:text-cyan-400">
            {t.diagnostics.activeEngine}
          </span>
        </div>
      </div>

      {/* Diagnostic Stream */}
      <div
        ref={scrollRef}
        className="flex-1 p-3.5 overflow-y-auto space-y-3 min-h-[260px] max-h-[340px] text-xs"
      >
        {messages.map((msg) => {
          const isSystem = msg.sender === 'system';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 items-start ${isSystem ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isSystem
                    ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-700 dark:text-cyan-300'
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isSystem ? <Cpu className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-2.5 rounded-lg max-w-[88%] leading-relaxed border ${
                  isSystem
                    ? 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-900 dark:bg-cyan-700 border-slate-900 dark:border-cyan-600 text-white'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block mt-1 text-[10px] font-mono-tech ${
                    isSystem ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-cyan-100'
                  }`}
                >
                  {msg.timestamp}
                  {msg.meta ? ` · ${msg.meta}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Diagnostic Actions */}
      <div className="px-3 py-2 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
        {(
          [
            t.diagnostics.quickPrompts.analyzeRisk,
            t.diagnostics.quickPrompts.rootCause,
            t.diagnostics.quickPrompts.sopRecommendation,
            t.diagnostics.quickPrompts.simulateDrop,
          ] as string[]
        ).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSubmitQuery(prompt)}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-2.5 bg-white/95 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={t.diagnostics.inputPlaceholder}
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono-tech text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
        />
        <button
          type="button"
          onClick={handleSend}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.diagnostics.send}</span>
        </button>
      </div>
    </section>
  );
};
