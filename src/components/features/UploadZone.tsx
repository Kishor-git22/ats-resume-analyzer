import { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { extractTextFromPdf } from '../../lib/pdfExtract';

interface UploadZoneProps {
  onSubmit: (resumeText: string, jobDescription?: string) => void;
  isProcessing: boolean;
}

type Mode = 'upload' | 'paste';

const MAX_CHARS = 30_000;
const MIN_CHARS = 100;

const UploadZone = ({ onSubmit, isProcessing }: UploadZoneProps) => {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('app_uploadMode') as Mode) || 'upload';
  });
  const [text, setText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('app_uploadMode', mode);
  }, [mode]);

  const handleFile = async (file: File) => {
    setError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported. Use the "Paste text" tab for other formats.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF is too large (max 10 MB).');
      return;
    }

    setFileName(file.name);
    setIsExtracting(true);
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted.slice(0, MAX_CHARS));
    } catch (err) {
      const code = err instanceof Error ? err.message : 'PDF_INVALID';
      if (code === 'PDF_NO_TEXT') {
        setError(
          'Couldn\'t extract text — this looks like a scanned/image PDF. Switch to "Paste text" instead.',
        );
      } else {
        setError("That doesn't look like a valid PDF. Try a different file.");
      }
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    setError(null);
    const trimmed = text.trim();
    if (trimmed.length < MIN_CHARS) {
      setError(`Need at least ${MIN_CHARS} characters of resume text.`);
      return;
    }
    onSubmit(trimmed, jobDescription.trim() || undefined);
  };

  const charCount = text.length;
  const overLimit = charCount > MAX_CHARS;
  const canSubmit = charCount >= MIN_CHARS && !overLimit && !isProcessing && !isExtracting;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full overflow-y-auto no-scrollbar pb-8 px-1">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-1.5 mb-6 p-1 rounded-xl glass-panel max-w-[320px] w-full mx-auto">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`w-full min-h-[38px] py-1.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
            mode === 'upload'
              ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-sm'
              : 'text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`w-full min-h-[38px] py-1.5 rounded-lg text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
            mode === 'paste'
              ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-sm'
              : 'text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
          }`}
        >
          Paste text
        </button>
      </div>

      {/* Dropzone / textarea */}
      {mode === 'upload' ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-2xl p-10 sm:p-14 transition-all duration-250 ${
            isDragging
              ? 'glass-panel-heavy border-[#1d1d1f]/15 dark:border-[#f5f5f7]/25 shadow-md'
              : 'glass-panel hover:glass-panel-heavy'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col items-center gap-4 text-center">
            {fileName ? (
              <>
                <FileText
                  size={48}
                  className="text-[#1d1d1f] dark:text-[#f5f5f7]"
                  strokeWidth={1.4}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-medium text-[#1d1d1f] dark:text-[#f5f5f7] break-all">
                    {fileName}
                  </span>
                  {isExtracting ? (
                    <span className="text-sm text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60 animate-soft-pulse">
                      Extracting text…
                    </span>
                  ) : (
                    <span className="text-sm text-[#1d1d1f]/60 dark:text-[#f5f5f7]/60">
                      {charCount.toLocaleString()} characters extracted · click to replace
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <UploadCloud
                  size={48}
                  className="text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70"
                  strokeWidth={1.4}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Drop your resume PDF here, or click to browse
                  </span>
                  <span className="text-sm text-[#1d1d1f]/50 dark:text-[#f5f5f7]/50">
                    PDF only · max 10 MB · text is never stored
                  </span>
                </div>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="w-full rounded-2xl glass-input overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your full resume text here…"
            className="w-full h-64 p-5 sm:p-6 bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] font-light placeholder:text-[#1d1d1f]/45 dark:placeholder:text-[#f5f5f7]/30 resize-none focus:outline-none text-sm sm:text-base leading-relaxed no-scrollbar"
            style={{ fontFamily: "'Kanit', sans-serif" }}
          />
          <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-[#1d1d1f]/10 dark:border-[#f5f5f7]/10 text-xs text-[#1d1d1f]/60 dark:text-[#f5f5f7]/50 uppercase tracking-widest bg-black/5 dark:bg-black/20">
            <span>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
            </span>
            <span>{charCount < MIN_CHARS ? `${MIN_CHARS - charCount} more needed` : 'Ready'}</span>
          </div>
        </div>
      )}

      {/* Job Description (Optional) */}
      <div className="mt-4 w-full rounded-2xl glass-input overflow-hidden">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the Job Description here (Optional) — helps the AI tailor the review…"
          className="w-full h-32 p-5 sm:p-6 bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] font-light placeholder:text-[#1d1d1f]/45 dark:placeholder:text-[#f5f5f7]/30 resize-none focus:outline-none text-sm sm:text-base leading-relaxed no-scrollbar"
          style={{ fontFamily: "'Kanit', sans-serif" }}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md p-4 text-sm text-red-800 dark:text-red-200">
          <AlertCircle size={20} className="shrink-0 mt-0.5" strokeWidth={1.6} />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-3 rounded-xl px-10 py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px]"
          style={{
            background:
              'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
            boxShadow:
              '0px 2px 4px rgba(181, 1, 167, 0.15), inset 0 1px 0.5px rgba(255, 255, 255, 0.3)',
            outline: '1.5px solid rgba(255, 255, 255, 0.65)',
            outlineOffset: '-2.5px',
          }}
        >
          <Sparkles size={18} strokeWidth={1.8} />
          {isProcessing ? 'Reviewing…' : 'Review my resume'}
        </button>
      </div>
    </div>
  );
};

export default UploadZone;
