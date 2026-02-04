'use client';

import { useState } from 'react';
import { useSession } from '@/lib/useSession';

const TYPES = [
  { value: 'love', label: '♥ Love it' },
  { value: 'feature', label: '+ Feature' },
  { value: 'bug', label: '! Bug' },
  { value: 'general', label: '? Other' },
];

export default function FeedbackForm() {
  const { address } = useSession();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('general');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async () => {
    if (message.trim().length < 5) return;
    setStatus('sending');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          walletAddress: address || null,
          contact: contact.trim() || null,
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setMessage('');
        setContact('');
        setTimeout(() => {
          setStatus('idle');
          setOpen(false);
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 px-4 border border-primary/20 rounded-lg text-primary/60 text-sm font-mono hover:border-primary/40 hover:text-primary/80 transition-colors"
      >
        [SEND FEEDBACK]
      </button>
    );
  }

  return (
    <div className="border border-primary/20 rounded-lg p-4 font-mono text-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-primary/80 font-bold">Feedback</span>
        <button onClick={() => setOpen(false)} className="text-primary/40 hover:text-primary/80">
          [x]
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1 border rounded text-xs transition-colors ${
              type === t.value
                ? 'border-primary text-primary'
                : 'border-primary/20 text-primary/50 hover:border-primary/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what you think..."
        rows={3}
        className="w-full bg-bg-darker border border-primary/20 rounded-lg p-3 text-primary/90 placeholder-primary/30 focus:border-primary/50 focus:outline-none resize-none"
      />

      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Twitter or email (optional)"
        className="w-full bg-bg-darker border border-primary/20 rounded-lg p-2 text-primary/90 placeholder-primary/30 focus:border-primary/50 focus:outline-none text-xs"
      />

      <button
        onClick={handleSubmit}
        disabled={message.trim().length < 5 || status === 'sending'}
        className="w-full py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-30 bg-primary text-bg-dark hover:bg-primary/90"
      >
        {status === 'sending'
          ? '[SENDING...]'
          : status === 'sent'
            ? '[SENT! THANK YOU]'
            : status === 'error'
              ? '[ERROR — TRY AGAIN]'
              : '[SEND]'}
      </button>
    </div>
  );
}
