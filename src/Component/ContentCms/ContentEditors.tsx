import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { MeditationStep } from './contentStore';


// ─────────────────────────────────────────────
// RICH TEXT EDITOR (Article)
// ─────────────────────────────────────────────
interface RichTextEditorProps {
  initialValue?: string; // ✅ edit এ existing HTML load করবে
  onChange?: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = '', onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // ✅ Edit এ existing content load
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, []);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { label: 'B', title: 'Bold', action: () => exec('bold'), style: 'font-black' },
    { label: 'I', title: 'Italic', action: () => exec('italic'), style: 'italic' },
    { label: 'U', title: 'Underline', action: () => exec('underline'), style: 'underline' },
    { label: 'H1', title: 'Heading 1', action: () => exec('formatBlock', '<h1>') },
    { label: 'H2', title: 'Heading 2', action: () => exec('formatBlock', '<h2>') },
    { label: '• List', title: 'Bullet List', action: () => exec('insertUnorderedList') },
    { label: '1. List', title: 'Numbered List', action: () => exec('insertOrderedList') },
    {
      label: '🔗', title: 'Insert Link', action: () => {
        const url = prompt('Enter URL:');
        if (url) exec('createLink', url);
      }
    },
    { label: '—', title: 'Divider', action: () => exec('insertHorizontalRule') },
  ];

  return (
    <div className="border border-borderColor rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-[#FAF7F5] border-b border-borderColor px-3 py-2">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.title}
            onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
            title={btn.title}
            className={`px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#ECC3B44D] text-[#4A3A37] transition-colors cursor-pointer ${btn.style || ''}`}
          >
            {btn.label}
          </button>
        ))}
        {/* Image embed */}
        <label className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#ECC3B44D] text-[#4A3A37] transition-colors cursor-pointer" title="Embed Image">
          🖼️
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) exec('insertImage', URL.createObjectURL(file));
          }} />
        </label>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Start writing your article here..."
        className="min-h-[300px] p-5 outline-none text-sm leading-relaxed text-[#4A3A37] bg-white focus:bg-[#FDFBF9] transition-colors"
        style={{ fontFamily: 'inherit' }}
      />

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #d1d5db; pointer-events: none; }
        [contenteditable] h1 { font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0; }
        [contenteditable] h2 { font-size: 1.2rem; font-weight: 700; margin: 0.5rem 0; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] a { color: #8B6E91; text-decoration: underline; }
        [contenteditable] hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
        [contenteditable] img { max-width: 100%; border-radius: 12px; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────
// VIDEO UPLOAD
// ─────────────────────────────────────────────
interface VideoUploadProps {
  initialVideoUrl?: string;       // ✅ edit এ existing video
  initialVideoName?: string;
  initialVideoSize?: number;
  onVideoChange: (file: File | null, url: string | null) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  initialVideoUrl,
  initialVideoName,
  initialVideoSize,
  onVideoChange,
}) => {
  const [, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  const [videoName, setVideoName] = useState<string | null>(initialVideoName || null);
  const [videoSize, setVideoSize] = useState<number | null>(initialVideoSize || null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setVideoName(file.name);
    setVideoSize(file.size);
    onVideoChange(file, url);
  };

  const handleRemove = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setVideoName(null);
    setVideoSize(null);
    onVideoChange(null, null);
  };

  return (
    <div className="space-y-3">
      {videoUrl ? (
        <div className="relative rounded-3xl overflow-hidden border border-borderColor bg-black">
          <video src={videoUrl} controls className="w-full max-h-[400px] object-contain" />
          <button onClick={handleRemove} className="absolute top-3 right-3 bg-white text-red-400 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-50">
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/')) handleFile(f); }}
          className={`relative w-full h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer
            ${dragOver ? 'border-[#8B6E91] bg-[#FAF5FF]' : 'border-borderColor bg-[#FAF7F5] hover:bg-[#F2F1EE]'}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9810FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <p className="text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Drag & Drop Video</p>
          <p className="text-xs text-gray-400 mt-1">or click to browse</p>
          <p className="text-[10px] text-gray-300 mt-1">MP4, MOV, AVI supported</p>
          <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
      )}

      {(videoName) && (
        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-xs font-bold text-[#00A63E] truncate">{videoName}</span>
          {videoSize && <span className="text-[10px] text-gray-400 ml-auto shrink-0">{(videoSize / (1024 * 1024)).toFixed(1)} MB</span>}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MEDITATION EDITOR
// ─────────────────────────────────────────────
interface MeditationEditorProps {
  initialSteps?: MeditationStep[];
  initialAudioUrl?: string;
  initialAudioName?: string;
  initialBgMusicUrl?: string;
  initialBgMusicName?: string;
  onChange?: (data: {
    steps: MeditationStep[];
    audioFile: File | null;
    audioUrl: string | null;
    audioFileName: string | null;
    bgMusicFile: File | null;
    bgMusicUrl: string | null;
    bgMusicFileName: string | null;
  }) => void;
}

export const MeditationEditor: React.FC<MeditationEditorProps> = ({
  initialSteps = [{ id: 1, instruction: '', duration: 30 }],
  initialAudioUrl,
  initialAudioName,
  initialBgMusicUrl,
  initialBgMusicName,
  onChange,
}) => {
  const [steps, setSteps] = useState<MeditationStep[]>(initialSteps);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [audioFileName, setAudioFileName] = useState<string | null>(initialAudioName || null);
  const [bgMusicFile, setBgMusicFile] = useState<File | null>(null);
  const [bgMusicUrl, setBgMusicUrl] = useState<string | null>(initialBgMusicUrl || null);
  const [bgMusicFileName, setBgMusicFileName] = useState<string | null>(initialBgMusicName || null);

  const notify = (newSteps = steps, newAudioFile = audioFile, newAudioUrl = audioUrl, newAudioFileName = audioFileName, newBgFile = bgMusicFile, newBgUrl = bgMusicUrl, newBgName = bgMusicFileName) => {
    onChange?.({ steps: newSteps, audioFile: newAudioFile, audioUrl: newAudioUrl, audioFileName: newAudioFileName, bgMusicFile: newBgFile, bgMusicUrl: newBgUrl, bgMusicFileName: newBgName });
  };

  const addStep = () => {
    const updated = [...steps, { id: Date.now(), instruction: '', duration: 30 }];
    setSteps(updated);
    notify(updated);
  };

  const removeStep = (id: number) => {
    const updated = steps.filter(s => s.id !== id);
    setSteps(updated);
    notify(updated);
  };

  const updateStep = (id: number, field: keyof MeditationStep, value: string | number) => {
    const updated = steps.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSteps(updated);
    notify(updated);
  };

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFile(file); setAudioUrl(url); setAudioFileName(file.name);
      notify(steps, file, url, file.name);
    }
  };

  const handleBgMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgMusicFile(file); setBgMusicUrl(url); setBgMusicFileName(file.name);
      notify(steps, audioFile, audioUrl, audioFileName, file, url, file.name);
    }
  };

  const totalSeconds = steps.reduce((a, s) => a + s.duration, 0);

  return (
    <div className="space-y-6">

      {/* Audio uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Voice Guide */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase block">Guided Voice Audio</label>
          <label className={`flex items-center gap-3 p-4 rounded-2xl border border-dashed cursor-pointer transition-colors ${audioUrl ? 'border-[#8B6E91] bg-[#FAF5FF]' : 'border-borderColor bg-[#FAF7F5] hover:bg-[#F2F1EE]'}`}>
            <div className="w-10 h-10 rounded-xl bg-white border border-borderColor flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B6E91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="min-w-0">
              {audioFileName ? (
                <><p className="text-xs font-bold text-[#8B6E91] truncate">{audioFileName}</p><p className="text-[10px] text-gray-400">{audioFile ? (audioFile.size / (1024 * 1024)).toFixed(1) + ' MB' : 'Existing file'}</p></>
              ) : (
                <><p className="text-xs font-bold text-subTitleColor">Upload Voice Guide</p><p className="text-[10px] text-gray-400">MP3, WAV, M4A</p></>
              )}
            </div>
            <input type="file" accept="audio/*" className="hidden" onChange={handleAudio} />
          </label>
          {/* ✅ Audio preview if existing */}
          {audioUrl && <audio src={audioUrl} controls className="w-full mt-1 h-8" />}
        </div>

        {/* BG Music */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase block">
            Background Music <span className="text-gray-300 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <label className={`flex items-center gap-3 p-4 rounded-2xl border border-dashed cursor-pointer transition-colors ${bgMusicUrl ? 'border-[#8B6E91] bg-[#FAF5FF]' : 'border-borderColor bg-[#FAF7F5] hover:bg-[#F2F1EE]'}`}>
            <div className="w-10 h-10 rounded-xl bg-white border border-borderColor flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B6E91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div className="min-w-0">
              {bgMusicFileName ? (
                <><p className="text-xs font-bold text-[#8B6E91] truncate">{bgMusicFileName}</p><p className="text-[10px] text-gray-400">{bgMusicFile ? (bgMusicFile.size / (1024 * 1024)).toFixed(1) + ' MB' : 'Existing file'}</p></>
              ) : (
                <><p className="text-xs font-bold text-subTitleColor">Upload Music</p><p className="text-[10px] text-gray-400">MP3, WAV, M4A</p></>
              )}
            </div>
            <input type="file" accept="audio/*" className="hidden" onChange={handleBgMusic} />
          </label>
          {bgMusicUrl && <audio src={bgMusicUrl} controls className="w-full mt-1 h-8" />}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase">Meditation Steps</label>
          <span className="text-[10px] text-gray-400">Total: {totalSeconds}s ({Math.ceil(totalSeconds / 60)} min)</span>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="bg-[#FAF7F5] border border-borderColor rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[#8B6E91]/10 border border-[#8B6E91]/20 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[10px] font-black text-[#8B6E91]">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={step.instruction}
                  onChange={(e) => updateStep(step.id, 'instruction', e.target.value)}
                  placeholder="e.g. Breathe in slowly through your nose..."
                  className="w-full bg-white border border-borderColor rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8B6E91]/20 placeholder:text-gray-300"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-medium">Duration:</span>
                  <input type="number" value={step.duration} onChange={(e) => updateStep(step.id, 'duration', Number(e.target.value))} min={1} className="w-16 bg-white border border-borderColor rounded-lg px-2 py-1 text-xs outline-none text-center focus:ring-2 focus:ring-[#8B6E91]/20" />
                  <span className="text-[10px] text-gray-400">seconds</span>
                </div>
              </div>
              {steps.length > 1 && (
                <button onClick={() => removeStep(step.id)} className="text-red-300 hover:text-red-400 mt-1 cursor-pointer"><Trash2 size={14} /></button>
              )}
            </div>
          ))}
        </div>

        <button onClick={addStep} className="w-full flex items-center justify-center gap-2 border border-dashed border-borderColor rounded-2xl py-3 text-[10px] font-extrabold tracking-[2px] text-subTitleColor uppercase hover:bg-[#FAF7F5] transition-colors cursor-pointer">
          <Plus size={12} /> Add Step
        </button>
      </div>
    </div>
  );
};