
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, Wand2, Loader2 } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
  onError: (error: string | null) => void;
  onFixRequest: () => void;
  isGenerating: boolean;
}

// Global initialization
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code, onError, onFixRequest, isGenerating }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setSvg('');
        setLocalError(null);
        onError(null);
        return;
      }

      try {
        // Test parsing first
        await mermaid.parse(code);
        
        // If parsing succeeds, render
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setLocalError(null);
        onError(null);
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        const errorMsg = err.str || err.message || "Invalid Mermaid syntax";
        setLocalError(errorMsg);
        onError(errorMsg);
      }
    };

    const timeout = setTimeout(renderDiagram, 300);
    return () => clearTimeout(timeout);
  }, [code, onError]);

  if (localError) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-rose-900 mb-2">Syntax Error Detected</h3>
        <p className="text-rose-700 bg-rose-100/50 p-4 rounded-lg font-mono text-sm max-w-md break-words mb-6 border border-rose-200">
          {localError}
        </p>
        <button
          onClick={onFixRequest}
          disabled={isGenerating}
          className="flex items-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI is Thinking...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Fix with AI
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="mermaid w-full h-full p-4 overflow-auto flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidRenderer;
