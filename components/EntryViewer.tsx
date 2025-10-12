'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { decryptContent } from '@/lib/encryption';
import { useEncryptionKey } from '@/lib/EncryptionKeyContext';

interface Entry {
  id: string;
  date: string;
  wordCount: number;
  encryptedContent: string;
}

interface EntryViewerProps {
  entry: Entry;
  onBack: () => void;
}

export function EntryViewer({ entry, onBack }: EntryViewerProps) {
  const { encryptionKey } = useEncryptionKey();
  const [decryptedContent, setDecryptedContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState('sans');

  // Load font preference
  useEffect(() => {
    const saved = localStorage.getItem('diary-font');
    if (saved) setFontFamily(saved);
  }, []);

  useEffect(() => {
    // Reset state when entry changes
    setDecryptedContent('');
    setError(null);

    if (!entry || !encryptionKey) return;

    try {
      const decrypted = decryptContent(entry.encryptedContent, encryptionKey);
      setDecryptedContent(decrypted);
    } catch (err: any) {
      setError(`Decryption failed: ${err.message || err}`);
    }
  }, [entry?.id, encryptionKey]);

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-bg-lcd/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded text-primary transition-all flex items-center gap-2 font-mono text-sm hover:shadow-glow-cyan"
        >
          <span>←</span> [BACK]
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
          {formattedDate}
        </h1>
        <p className="text-primary/60 font-mono text-sm">{entry.wordCount} words</p>
      </div>

      {/* Content */}
      <div className="bg-bg-card border border-primary/20 rounded-xl p-6 min-h-[400px] shadow-glow-cyan">
        {error && (
          <div className="bg-error/20 border border-error rounded-lg p-4 text-error font-mono text-sm">
            {error}
          </div>
        )}

        {!error && decryptedContent && (
          <div
            className={`prose prose-invert max-w-none ${
              fontFamily === 'sans'
                ? 'font-sans'
                : fontFamily === 'serif'
                  ? 'font-serif'
                  : 'font-mono'
            }`}
          >
            <div className="text-primary leading-relaxed text-base">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 whitespace-pre-wrap text-primary">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-primary drop-shadow-[0_0_2px_rgba(0,229,255,0.3)]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic text-primary/90">{children}</em>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-primary">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-primary">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1 text-primary">{children}</li>,
                }}
              >
                {decryptedContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!error && !decryptedContent && (
          <div className="text-primary/50 font-mono text-sm">No content to display</div>
        )}
      </div>
    </div>
  );
}
