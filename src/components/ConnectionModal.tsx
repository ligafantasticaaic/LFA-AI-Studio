import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Github, 
  Globe, 
  HelpCircle, 
  Copy, 
  Check, 
  Server, 
  Database,
  Unlink,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { gasEngine } from '../services/gasEngine';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'github' | 'sites' | 'troubleshoot'>('connect');
  const [gasUrlInput, setGasUrlInput] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    latencyMs?: number;
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const isConnected = gasEngine.isRemoteConnected();
  const currentUrl = gasEngine.getGasUrl();
  const lastSyncTime = gasEngine.getLastSyncTime();

  useEffect(() => {
    if (isOpen) {
      setGasUrlInput(currentUrl);
      setTestResult(null);
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestConnection = async () => {
    if (!gasUrlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor, pega la URL de la Aplicación Web de Google Apps Script.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await gasEngine.testConnection(gasUrlInput);
    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      gasEngine.setGasUrl(gasUrlInput);
    }
  };

  const handleSaveAndSync = async () => {
    if (!gasUrlInput.trim()) return;

    gasEngine.setGasUrl(gasUrlInput);
    setIsSyncing(true);
    setTestResult(null);

    const result = await gasEngine.syncFromRemote(gasUrlInput);
    setIsSyncing(false);

    if (result.success) {
      setTestResult({
        success: true,
        message: result.message
      });
      if (onSyncComplete) onSyncComplete();
    } else {
      setTestResult({
        success: false,
        message: result.message
      });
    }
  };

  const handleDisconnect = () => {
    gasEngine.setGasUrl('');
    setGasUrlInput('');
    setTestResult({
      success: true,
      message: 'Desconectado de la Web App remota. La app vuelve al modo local seguro.'
    });
    if (onSyncComplete) onSyncComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                Conectar Google Sheets & Despliegue
              </h2>
              <p className="text-xs text-slate-400">
                Enlace con tu hoja de cálculo, GitHub Pages y Google Sites
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'connect'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Enlazar Google Sheets</span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'github'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Subir a GitHub Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('sites')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'sites'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Google Sites</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'troubleshoot'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Permisos & Ayuda</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {/* TAB 1: CONNECT GOOGLE SHEETS */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isConnected
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div>
                    <h4 className="font-bold text-sm">
                      {isConnected ? 'Enlazado con tu Web App de Google Sheets' : 'Modo Local Activo (Sin URL enlazada)'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isConnected 
                        ? `Última sincronización: ${lastSyncTime || 'Recientemente'}`
                        : 'Introduce la URL para sincronizar clasificaciones, jugadores y fichajes en vivo.'}
                    </p>
                  </div>
                </div>

                {isConnected && (
                  <button
                    onClick={handleDisconnect}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Desconectar</span>
                  </button>
                )}
              </div>

              {/* URL Input Form */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  URL de la Aplicación Web (Google Apps Script):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={gasUrlInput}
                    onChange={(e) => setGasUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting || !gasUrlInput.trim()}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Server className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isTesting ? 'Probando...' : 'Probar'}</span>
                    </button>

                    <button
                      onClick={handleSaveAndSync}
                      disabled={isSyncing || !gasUrlInput.trim()}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{isSyncing ? 'Sincronizando...' : 'Guardar y Sincronizar'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Esta es la URL que te genera Google Apps Script al pulsar <strong className="text-amber-400">Implementar &gt; Nueva implementación &gt; Aplicación web</strong>.
                </p>
              </div>

              {/* Feedback messages */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-in fade-in ${
                  testResult.success 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.latencyMs !== undefined && (
                      <p className="text-[10px] opacity-75 mt-1">Tiempo de respuesta: {testResult.latencyMs} ms</p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick instructions */}
              <div className="border border-slate-800/80 bg-slate-950/40 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ¿Cómo obtener tu URL en Google Apps Script? (30 segundos)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>
                    Abre tu hoja de cálculo y ve a <strong className="text-white">Extensiones &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Asegúrate de haber pegado el código de <strong className="text-amber-400">Código.gs</strong> (puedes copiarlo desde el botón <em>Código Apps Script</em> en la cabecera).
                  </li>
                  <li>
                    Arriba a la derecha, haz clic en el botón azul <strong className="text-white">Implementar</strong> y elige <strong className="text-white">Nueva implementación</strong>.
                  </li>
                  <li>
                    Configura:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-400">
                      <li>Tipo: <strong className="text-white">Aplicación web</strong></li>
                      <li>Ejecutar como: <strong className="text-white">Yo (tu cuenta de Google)</strong></li>
                      <li>Quién tiene acceso: <strong className="text-amber-400">Cualquier usuario (Anyone)</strong> <span className="text-[10px] text-amber-500/80">(¡imprescindible para que conecte!)</span></li>
                    </ul>
                  </li>
                  <li>
                    Haz clic en <strong className="text-white">Implementar</strong> y copia la <strong className="text-white">URL de la aplicación web</strong> que termina en <code className="text-amber-400 font-mono">/exec</code>.
                  </li>
                  <li>
                    Pégala en el campo de arriba y pulsa <strong className="text-amber-400">Guardar y Sincronizar</strong>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB PAGES */}
          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Github className="w-4 h-4 text-amber-400" />
                  Despliegue automático y gratuito en GitHub Pages
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hemos configurado el proyecto para que sea 100% compatible con GitHub Pages:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-2">
                  <li>Rutas relativas activadas (<code className="text-amber-400 font-mono">base: './'</code> en Vite).</li>
                  <li>Flujo automático creado en <code className="text-amber-400 font-mono">.github/workflows/deploy.yml</code>.</li>
                  <li>Alojamiento gratuito, ultrarrápido y seguro de por vida.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Pasos para publicar en GitHub Pages:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                    <h5 className="font-bold text-white text-xs">Exportar a GitHub</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      En el menú superior de Google AI Studio, pulsa en los 3 puntos o en <strong>Settings &gt; Export to GitHub</strong> (o descarga el ZIP y súbelo a tu repo).
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                    <h5 className="font-bold text-white text-xs">Activar GitHub Pages</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      En tu repositorio de GitHub, ve a la pestaña <strong>Settings &gt; Pages</strong>. En <strong>Source</strong>, selecciona <strong className="text-amber-400">GitHub Actions</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
                    <h5 className="font-bold text-white text-xs">¡Tu Web Online!</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      El workflow compila automáticamente en 1 minuto y te dará una URL pública tipo: <code className="text-amber-400 text-[10px]">https://usuario.github.io/liga-fantastica/</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Archivo GitHub Actions creado:</span>
                  <button
                    onClick={() => handleCopy(`name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`, 'ghworkflow')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedSection === 'ghworkflow' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'ghworkflow' ? 'Copiado' : 'Copiar YAML'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 overflow-x-auto max-h-36">
                  {`.github/workflows/deploy.yml (Incluido y listo para usar)`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE SITES */}
          {activeTab === 'sites' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-emerald-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ¿Google Sites es válido? ¡Sí, 100% compatible!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google Sites te permite incrustar cualquier contenido mediante <strong className="text-white">Insertar &gt; Mediante URL</strong>. Tienes dos formas excelentes de usarlo:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opción 1 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Globe className="w-4 h-4" />
                    <span>Opción A: Incrustar la App React (Recomendada)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Una vez que tengas la URL de GitHub Pages (o la URL de preview de AI Studio / Cloud Run):
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                    <li>En tu Google Site, pulsa <strong className="text-white">Insertar</strong> a la derecha.</li>
                    <li>Selecciona <strong className="text-white">Mediante URL</strong>.</li>
                    <li>Pega tu enlace de GitHub Pages.</li>
                    <li>Elige <strong className="text-amber-400">Página entera</strong>.</li>
                  </ol>
                  <div className="text-[11px] bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-400">
                    💡 <em>Ventaja:</em> Tus amigos verán esta interfaz gráfica moderna con campo táctico, estadísticas y animaciones fluidas sin límites.
                  </div>
                </div>

                {/* Opción 2 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>Opción B: Incrustar Apps Script Directo</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Si pegaste el nuevo <code className="text-amber-400">Código.gs</code> y los HTMLs en Google Apps Script:
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                    <li>Copia la URL de tu Web App (<code className="text-amber-400 text-[10px]">.../exec?page=Index</code>).</li>
                    <li>En Google Site, haz clic en <strong className="text-white">Insertar &gt; Mediante URL</strong>.</li>
                    <li>Pega la URL de tu Web App de Apps Script.</li>
                    <li>Como nuestro script incluye <code className="text-amber-400 text-[10px]">ALLOWALL</code>, Google Sites lo muestra inmediatamente.</li>
                  </ol>
                  <div className="text-[11px] bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-400">
                    💡 <em>Ventaja:</em> No necesitas hosting adicional; corre directamente en la infraestructura de Google.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TROUBLESHOOTING */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-white text-sm">Problemas frecuentes y soluciones</h4>

                <div className="space-y-3 text-xs">
                  <div className="border-l-2 border-amber-400 pl-3 space-y-1">
                    <p className="font-bold text-slate-200">1. ¿Por qué dice "No se pudo contactar con la Web App"?</p>
                    <p className="text-slate-400">
                      Causa más común: En Google Apps Script, al crear la implementación web, no se eligió <strong>"Cualquiera" (Anyone)</strong> en "¿Quién tiene acceso?". Si se deja en "Solo yo", el navegador bloqueará la conexión por falta de autorización.
                    </p>
                  </div>

                  <div className="border-l-2 border-amber-400 pl-3 space-y-1">
                    <p className="font-bold text-slate-200">2. He cambiado Código.gs pero la Web App no actualiza</p>
                    <p className="text-slate-400">
                      En Google Apps Script, cada vez que editas código debes hacer: <strong>Implementar &gt; Administrar implementaciones &gt; Editar (icono lápiz) &gt; Versión: Nueva versión &gt; Implementar</strong>.
                    </p>
                  </div>

                  <div className="border-l-2 border-amber-400 pl-3 space-y-1">
                    <p className="font-bold text-slate-200">3. ¿Cómo sé si la sincronización ha funcionado?</p>
                    <p className="text-slate-400">
                      El indicador en la cabecera pasará a verde con el texto <strong>"Sheets Enlazado"</strong> y los nombres de tus equipos y jugadores reales de la hoja aparecerán en todos los selectores de la aplicación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isConnected ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                URL guardada en tu navegador
              </span>
            ) : (
              <span>Puedes usar la app en modo local o enlazar con Sheets en cualquier momento</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
