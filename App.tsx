
import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Settings, Share2, Download, Layers, ShieldCheck, Terminal, Github, Sparkles } from 'lucide-react';
import MermaidRenderer from './components/MermaidRenderer';
import SettingsModal from './components/SettingsModal';
import DiffModal from './components/DiffModal';
import { AppState, Theme } from './types';
import { INITIAL_CODE, STORAGE_KEY } from './constants';
import { fixMermaidCode } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    code: INITIAL_CODE,
    error: null,
    apiKey: localStorage.getItem(STORAGE_KEY),
    isSettingsOpen: false,
    isDiffOpen: false,
    aiFixedCode: null,
    isGenerating: false,
  });

  const handleEditorChange = (value: string | undefined) => {
    setState(prev => ({ ...prev, code: value || '' }));
  };

  const handleSaveKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setState(prev => ({ ...prev, apiKey: key, isSettingsOpen: false }));
  };

  const handleFixWithAI = async () => {
    if (!state.apiKey) {
      setState(prev => ({ ...prev, isSettingsOpen: true }));
      return;
    }

    if (!state.error) return;

    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const fixed = await fixMermaidCode(state.apiKey, state.code, state.error);
      setState(prev => ({ 
        ...prev, 
        aiFixedCode: fixed, 
        isDiffOpen: true,
        isGenerating: false 
      }));
    } catch (err: any) {
      alert(err.message);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const applyAIFix = () => {
    if (state.aiFixedCode) {
      setState(prev => ({
        ...prev,
        code: state.aiFixedCode || prev.code,
        isDiffOpen: false,
        aiFixedCode: null
      }));
    }
  };

  const exportAsImage = (type: 'svg' | 'png') => {
    const mermaidContainer = document.querySelector('.mermaid svg');
    if (!mermaidContainer) return;

    if (type === 'svg') {
      const svgData = new XMLSerializer().serializeToString(mermaidContainer);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      link.click();
    } else {
      // Basic PNG export by drawing to canvas
      const svgData = new XMLSerializer().serializeToString(mermaidContainer);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'diagram.png';
          link.click();
        }
      };
      img.src = url;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 font-inter">
      {/* Header */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Mermaid Architect
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4 bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => exportAsImage('svg')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
            >
              <Download className="w-3.5 h-3.5" /> SVG
            </button>
            <button 
              onClick={() => exportAsImage('png')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </button>
          </div>

          <button 
            onClick={() => setState(s => ({ ...s, isSettingsOpen: true }))}
            className={`p-2 rounded-xl transition-all relative ${state.apiKey ? 'text-slate-600 hover:bg-slate-100' : 'text-amber-600 bg-amber-50 hover:bg-amber-100 ring-2 ring-amber-200'}`}
          >
            <Settings className="w-5 h-5" />
            {!state.apiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          
          <a href="https://github.com/mermaid-js/mermaid" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 bg-slate-50">
        {/* Left Side: Editor */}
        <div className="w-1/2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Monaco</span>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="markdown"
              theme="light"
              value={state.code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                lineHeight: 22,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-1/2 flex flex-col relative overflow-hidden">
          <div className="flex-1 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200 overflow-hidden">
             <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                {state.error ? (
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full animate-pulse">Syntax Error</span>
                ) : (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-6 relative">
              <MermaidRenderer 
                code={state.code} 
                onError={(err) => setState(s => ({ ...s, error: err }))}
                onFixRequest={handleFixWithAI}
                isGenerating={state.isGenerating}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={state.isSettingsOpen} 
        onClose={() => setState(s => ({ ...s, isSettingsOpen: false }))}
        apiKey={state.apiKey}
        onSave={handleSaveKey}
      />

      <DiffModal 
        isOpen={state.isDiffOpen}
        onClose={() => setState(s => ({ ...s, isDiffOpen: false, aiFixedCode: null }))}
        oldCode={state.code}
        newCode={state.aiFixedCode || ''}
        onApply={applyAIFix}
      />

      {/* Footer Info */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 text-[10px] font-medium text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> API Secured Locally</span>
          <span>Mermaid.js v10.x</span>
        </div>
        <div>Built for Diagram Architects</div>
      </footer>
    </div>
  );
};

export default App;
