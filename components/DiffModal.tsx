
import React from 'react';
import { X, Check, RotateCcw, Wand2 } from 'lucide-react';
import ReactDiffViewer from 'react-diff-viewer-continued';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldCode: string;
  newCode: string;
  onApply: () => void;
}

const DiffModal: React.FC<DiffModalProps> = ({ isOpen, onClose, oldCode, newCode, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 lg:p-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Wand2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Review AI Fix</h2>
              <p className="text-sm text-slate-500">Compare the broken syntax with the AI's suggested correction.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-slate-50">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner min-h-full">
            <ReactDiffViewer
              oldValue={oldCode}
              newValue={newCode}
              splitView={true}
              leftTitle="Your Broken Code"
              rightTitle="AI Suggestion"
              useDarkTheme={false}
              styles={{
                variables: {
                  light: {
                    diffViewerBackground: '#ffffff',
                    addedBackground: '#f0fdf4',
                    addedColor: '#166534',
                    removedBackground: '#fef2f2',
                    removedColor: '#991b1b',
                    wordAddedBackground: '#dcfce7',
                    wordRemovedBackground: '#fee2e2',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reject Suggestion
          </button>
          <button
            onClick={onApply}
            className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Check className="w-4 h-4" />
            Apply AI Fix
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiffModal;
