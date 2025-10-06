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
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{formattedDate}</h1>
        <p className="text-gray-400">{entry.wordCount} words</p>
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[400px]">
        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {!error && decryptedContent && (
          <div
            className={`prose prose-invert max-w-none ${
              fontFamily === 'sans' ? 'font-sans' :
              fontFamily === 'serif' ? 'font-serif' :
              'font-mono'
            }`}
          >
            <div className="text-gray-200 leading-relaxed text-lg">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 whitespace-pre-wrap">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1">{children}</li>
                  ),
                }}
              >
                {decryptedContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!error && !decryptedContent && (
          <div className="text-gray-500">
            No content to display
          </div>
        )}
      </div>
    </div>
  );
}
