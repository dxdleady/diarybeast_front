'use client';

import { useState, useRef, useEffect } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const [fontFamily, setFontFamily] = useState('sans');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load font preference
  useEffect(() => {
    const saved = localStorage.getItem('diary-font');
    if (saved) setFontFamily(saved);
  }, []);

  // Save font preference
  const handleFontChange = (font: string) => {
    setFontFamily(font);
    localStorage.setItem('diary-font', font);
  };

  // Insert markdown formatting
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording');
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  // Transcribe audio using API
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Append transcribed text to current value
        const newText = value + (value ? '\n\n' : '') + data.text;
        onChange(newText);
      } else {
        alert('Transcription failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Transcription error');
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const fontNames = {
    sans: 'Sans',
    serif: 'Serif',
    mono: 'Mono',
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        {/* Formatting buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold transition-colors"
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm italic transition-colors"
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ', '')}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            title="List"
          >
            ≡
          </button>

          {/* Divider */}
          <div className="w-px bg-gray-600 mx-1"></div>

          {/* Audio recording button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            className={`px-3 py-1.5 rounded text-sm transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : isTranscribing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : isTranscribing ? 'Transcribing...' : 'Voice input'}
          >
            {isTranscribing ? '⏳' : isRecording ? '⏹️' : '🎤'}
          </button>

          {/* Recording indicator */}
          {isRecording && (
            <span className="text-xs text-red-400 flex items-center gap-1 animate-pulse">
              Recording...
            </span>
          )}
          {isTranscribing && (
            <span className="text-xs text-blue-400 flex items-center gap-1">
              Transcribing...
            </span>
          )}
        </div>

        {/* Font selector */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Font:</span>
          {Object.entries(fontNames).map(([key, name]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleFontChange(key)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                fontFamily === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-96 p-4 bg-gray-900 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${fonts[fontFamily as keyof typeof fonts]}`}
      />

      {/* Hint */}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Use **bold**, *italic*, or - lists | Click 🎤 for voice input
      </div>
    </div>
  );
}
