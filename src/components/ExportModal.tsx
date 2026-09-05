import React, { useState } from 'react';
import { GAS_TEMPLATES } from '../data/gasTemplates';
import { gasEngine } from '../services/gasEngine';
import { Code, Copy, Check, Download, X, FileCode2, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('Código.gs');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'files' | 'guide'>('files');

  if (!isOpen) return null;

  const currentContent = (selectedFile === 'Código.gs' || selectedFile === 'Code.gs')
    ? gasEngine.getCustomCodeGs()
    : ((GAS_TEMPLATES as any)[selectedFile] || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadAllZip = () => {
    const files = Object.entries(GAS_TEMPLATES).map(([fileName, content]) => {
      if (fileName === 'Código.gs' || fileName === 'Code.gs') {
        return [fileName, gasEngine.getCustomCodeGs()];
      }
      return [fileName, content];
    });
    files.forEach(([fileName, content]) => {
      const blob = new Blob([String(content)], { type: fileName.endsWith('.gs') ? 'text/javascript' : 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight m-0">
                Archivos para Google Apps Script & Google Sheets
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Archivos 100% operativos con enlace directo a las hojas de Google Sheets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-1 rounded-xl mr-2 border border-slate-700">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === 'files' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Archivos
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'guide' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guía de Enlace</span>
              </button>
            </div>

            <button
              onClick={downloadAllZip}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Todos</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'files' ? (
          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* File Explorer Sidebar */}
            <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1.5 overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest block mb-2">
                Archivos del Proyecto
              </span>
              {Object.keys(GAS_TEMPLATES).map(fileName => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    selectedFile === fileName
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <FileCode2 className={`w-4 h-4 ${selectedFile === fileName ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="truncate">{fileName}</span>
                </button>
              ))}
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80">
                <span className="text-xs font-mono font-bold text-amber-400">{selectedFile}</span>
                <button
                  onClick={handleCopy}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Archivo'}</span>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto bg-slate-950/40">
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {currentContent}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Diagnostic & Setup Guide */
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900 space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm mb-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>¿Por qué no cargaban los datos de tu Google Sheets?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cuando reemplazas los archivos HTML en Apps Script, es imprescindible que <code>Código.gs</code> contenga las funciones backend de servidor correspondientes y que la aplicación esté publicada como <strong>Nueva Implementación (Web App)</strong>. Si no se publica una nueva versión, Google Apps Script sigue ejecutando el código antiguo en caché.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Nombres de Pestañas en tu Google Sheet</span>
                </div>
                <p className="text-xs text-slate-400">
                  Verifica que tu hoja de Google Sheets contenga exactamente las siguientes pestañas:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4 font-mono">
                  <li><strong>Jugadores</strong>: Con columnas <em>Nombre, Equipo_Liga, Posicion, Valor, Estado, Puntos_J1, Goles_J1, PtsDef_J1...</em></li>
                  <li><strong>Alineaciones</strong>: Columnas <em>Equipo, Jornada, Jugador</em></li>
                  <li><strong>Equipos</strong> o <strong>Tokens</strong>: Columnas <em>Equipo, Token</em></li>
                  <li><strong>Fichajes</strong> y <strong>Draft</strong>: Para el registro de movimientos</li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Publicación Correcta en Apps Script</span>
                </div>
                <p className="text-xs text-slate-400">
                  Sigue estos pasos en el editor de Google Apps Script:
                </p>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4">
                  <li>Pega el contenido de <code>Código.gs</code> y de cada archivo <code>.html</code>.</li>
                  <li>Haz clic en <strong>Implementar &gt; Administrar implementaciones</strong> (Deploy &gt; Manage deployments).</li>
                  <li>Haz clic en el lápiz (Editar) y selecciona <strong>Versión: Nueva versión</strong>.</li>
                  <li>Asegúrate de que el acceso sea <strong>Cualquiera (Anyone)</strong>.</li>
                  <li>Pulsa <strong>Implementar</strong> y copia la URL de la Web App.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
