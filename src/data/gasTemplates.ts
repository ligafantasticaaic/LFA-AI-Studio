// Complete, production-ready Google Apps Script files for 1:1 deployment in GAS & Google Sheets

export const REDESIGNED_STYLESHEET_HTML = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  :root {
    --primary: #f59e0b; /* Amber Gold */
    --primary-glow: rgba(245, 158, 11, 0.25);
    --secondary: #10b981; /* Emerald */
    --accent: #f43f5e; /* Rose */
    --bg-dark: #090d16; /* Deep Onyx */
    --bg-card: #111827; /* Rich Slate Card */
    --bg-card-elevated: #1e293b;
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-highlight: rgba(245, 158, 11, 0.35);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --radius-xl: 18px;
    --radius-md: 10px;
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-display: 'Cabinet Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; }

  body {
    font-family: var(--font-sans);
    margin: 0;
    padding: 16px;
    background-color: var(--bg-dark);
    color: var(--text-main);
    line-height: 1.5;
    background-image: 
      radial-gradient(at 10% 10%, rgba(245, 158, 11, 0.06) 0px, transparent 50%),
      radial-gradient(at 90% 90%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
    background-attachment: fixed;
  }

  /* NAVEGACIÓN PROFESIONAL REDISEÑADA */
  .main-nav {
    background: rgba(17, 24, 39, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 8px 12px;
    border-radius: var(--radius-xl);
    margin: 0 auto 20px auto;
    max-width: 1240px;
    border: 1px solid var(--border-subtle);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  .main-nav a {
    color: var(--text-muted);
    text-decoration: none;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.88rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .main-nav a:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-1px);
  }

  .main-nav a.active {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #000 !important;
    font-weight: 800;
    box-shadow: 0 4px 14px var(--primary-glow);
  }

  .container {
    max-width: 1240px;
    margin: 0 auto;
    background-color: var(--bg-card);
    padding: 28px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-subtle);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  /* HEADINGS */
  .container > h1:first-child {
    font-family: var(--font-display);
    text-align: center;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fde68a, #f59e0b, #b45309);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 0;
    margin-bottom: 24px;
    text-transform: uppercase;
  }

  h2 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #f8fafc;
    border-left: 4px solid var(--primary);
    padding-left: 12px;
    margin-top: 36px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary);
    margin-top: 24px;
    margin-bottom: 12px;
  }

  /* SELECTORES Y FORMULARIOS */
  .selectors, #transferForm, #draftForm, .admin-card {
    background: var(--bg-card-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: 20px;
    margin-bottom: 24px;
  }

  .selectors {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    align-items: end;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .selectors label, .form-group label {
    font-size: 0.76rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .selectors select, .form-group select, .form-group input[type="text"], .form-group input[type="number"], .form-group input[type="password"] {
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--radius-md);
    background-color: #0b1120;
    color: #ffffff;
    font-size: 0.92rem;
    font-family: inherit;
    font-weight: 600;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.2s;
  }

  .selectors select:focus, .form-group select:focus, .form-group input:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-glow);
  }

  button[type="submit"], button.btn-primary, #refreshButton {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #000;
    height: 44px;
    padding: 0 24px;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.92rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 12px var(--primary-glow);
  }

  button[type="submit"]:hover, button.btn-primary:hover, #refreshButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.4);
    filter: brightness(1.1);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  /* TABLAS ULTRA-PREMIUM */
  .table-responsive-wrapper {
    overflow-x: auto;
    width: 100%;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-subtle);
    background: var(--bg-card-elevated);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.88rem;
  }

  th {
    background: rgba(0, 0, 0, 0.35);
    color: #f59e0b;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 0.74rem;
    letter-spacing: 0.08em;
    padding: 12px 14px;
    border-bottom: 2px solid rgba(245, 158, 11, 0.4);
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
  }

  tbody tr:hover td {
    background-color: rgba(255, 255, 255, 0.04);
  }

  /* BADGES DE POSICIÓN GLOW */
  .pos-portero { color: #fbbf24 !important; font-weight: 700; }
  .pos-defensa { color: #34d399 !important; font-weight: 700; }
  .pos-medio { color: #60a5fa !important; font-weight: 700; }
  .pos-delantero { color: #f87171 !important; font-weight: 700; }

  .numeric-cell, th.numeric-header {
    text-align: center;
    font-family: var(--font-mono);
  }

  .status-message {
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-weight: 700;
    font-size: 0.88rem;
    text-align: center;
  }

  .status-message.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #34d399;
  }

  .status-message.error, .error-message {
    background: rgba(244, 63, 94, 0.15);
    border: 1px solid rgba(244, 63, 94, 0.4);
    color: #fb7185;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .loading-indicator {
    font-size: 0.85rem;
    color: #f59e0b;
    font-weight: bold;
    display: none;
  }

  .rank-badge {
    font-size: 1.1rem;
    font-weight: 900;
  }
</style>`;

export const REDESIGNED_CODE_GS = `// ==========================================
// CÓDIGO GOOGLE APPS SCRIPT (Código.gs)
// Liga Fantástica de Fútbol
// Compatible con Google Sheets y Google Sites
// ==========================================

// Configuración y Constantes
var MAX_TEAM_VALUE = 200;
var MAX_DRAFT_PLAYERS_PER_TEAM = 11;
var WEEKLY_CONTRIBUTION = 1.5;
var TRANSFER_COST = 2;
var FREE_TRANSFERS_PER_TEAM = 3;
var ADMIN_PASSWORD = "admin";
var FIRST_CONTRIBUTION_JORNADA = 4; // Primera jornada con aportaciones semanales (configurable)

// Configuración de Notificaciones (Telegram y GitHub Actions)
var GITHUB_REPO = ""; // Repositorio GitHub (ej: "usuario/liga-fantastica")
var GITHUB_PAT = ""; // GitHub Personal Access Token con permiso de repo / contents
var TELEGRAM_BOT_TOKEN = ""; // Token del Bot de Telegram (@BotFather)
var TELEGRAM_CHAT_ID = ""; // ID del chat o grupo de Telegram (ej: -100xxxxxxxxxx)

/**
 * Función para enviar avisos de fichajes a Telegram y GitHub Actions
 */
function enviarAvisoTelegramYGitHub(equipo, jugadorEntra, jugadorSale, coste, jornada, tipo) {
  // 1. Notificación a GitHub Actions (repository_dispatch)
  if (GITHUB_REPO && GITHUB_PAT) {
    try {
      var ghUrl = "https://api.github.com/repos/" + GITHUB_REPO + "/dispatches";
      var ghPayload = {
        event_type: "fichaje_realizado",
        client_payload: {
          equipo: equipo,
          jugadorEntra: jugadorEntra,
          jugadorSale: jugadorSale,
          coste: String(coste) + " €",
          jornada: String(jornada),
          tipo: tipo || "Normal",
          timestamp: new Date().toISOString()
        }
      };
      UrlFetchApp.fetch(ghUrl, {
        method: "post",
        headers: {
          "Authorization": "Bearer " + GITHUB_PAT,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Google-Apps-Script-LFA"
        },
        payload: JSON.stringify(ghPayload),
        muteHttpExceptions: true
      });
    } catch (errGh) {
      Logger.log("Error llamando a GitHub Actions: " + errGh.message);
    }
  }

  // 2. Notificación directa a Telegram (inmediata sin esperar runners)
  var cleanTgToken = (typeof TELEGRAM_BOT_TOKEN !== "undefined" && TELEGRAM_BOT_TOKEN) ? String(TELEGRAM_BOT_TOKEN).trim() : "";
  var cleanTgChatId = (typeof TELEGRAM_CHAT_ID !== "undefined" && TELEGRAM_CHAT_ID) ? String(TELEGRAM_CHAT_ID).trim() : "";

  if (cleanTgToken && cleanTgChatId) {
    try {
      var lineas = [
        "🚨 *¡NUEVO FICHAJE EN LA LIGA FANTÁSTICA!* ⚽",
        "━━━━━━━━━━━━━━━━━━━━",
        "🏟 *Equipo:* " + equipo,
        "🟢 *Alta:* " + jugadorEntra,
        "🔴 *Baja:* " + jugadorSale,
        "💰 *Coste:* " + coste + " €",
        "📅 *Jornada:* J" + jornada,
        "📝 *Tipo:* " + (tipo || "Normal"),
        "━━━━━━━━━━━━━━━━━━━━",
        "🏆 _Liga Fantástica de Amigos_"
      ];
      var mensaje = lineas.join(String.fromCharCode(10));
      var tgUrl = "https://api.telegram.org/bot" + cleanTgToken + "/sendMessage";
      var tgResp = UrlFetchApp.fetch(tgUrl, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          chat_id: cleanTgChatId,
          text: mensaje,
          parse_mode: "Markdown"
        }),
        muteHttpExceptions: true
      });
      var respCode = tgResp.getResponseCode();
      var respText = tgResp.getContentText();
      Logger.log("Telegram (" + cleanTgChatId + ") response: " + respCode + " -> " + respText);

      // Si falla por formato Markdown (ej: guiones bajos o asteriscos en nombres), reintentamos en texto plano
      if (respCode >= 400 && respText.indexOf("parse") !== -1) {
        UrlFetchApp.fetch(tgUrl, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({
            chat_id: cleanTgChatId,
            text: mensaje.replace(/[*_]/g, "")
          }),
          muteHttpExceptions: true
        });
      }
    } catch (errTg) {
      Logger.log("Error enviando mensaje a Telegram: " + errTg.message);
    }
  }
}

/**
 * Enrutador principal de páginas HTML y API JSON para Web App y GitHub Pages
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  
  // Si la app React (en GitHub Pages, Cloud Run o local) solicita datos via API JSON
  if (action) {
    var result = {};
    try {
      if (action === 'ping') {
        result = {
          success: true,
          message: 'Conexión con Google Sheets verificada correctamente',
          timestamp: new Date().toISOString()
        };
      } else if (action === 'getFullSync') {
        result = getFullSyncData();
      } else if (action === 'getTransferHistory' || action === 'getTransfers') {
        result = { success: true, data: getTransferHistory() };
      } else if (action === 'getDraftHistory' || action === 'getDraft') {
        result = { success: true, data: getDraftHistory() };
      } else if (action === 'getTeamNames') {
        result = { success: true, data: getTeamNames() };
      } else if (action === 'getTeamTokens' || action === 'getTokens') {
        result = { success: true, data: getTeamTokensData(), tokens: getTeamTokensData() };
      } else if (action === 'getMaxJornada') {
        result = { success: true, data: getMaxJornada() };
      } else if (action === 'getStandings') {
        var j = e.parameter.jornada || getMaxJornada();
        result = { success: true, data: getAllStandingsData(j) };
      } else if (action === 'getLineup') {
        var t = e.parameter.team || '';
        var j2 = e.parameter.jornada || getMaxJornada();
        result = { success: true, data: getTeamLineupData(t, j2) };
      } else if (action === 'getMercado') {
        result = { success: true, data: getPlayersForMercado() };
      } else if (action === 'getAccounting') {
        result = { success: true, data: getAccountingData() };
      } else {
        result = { error: 'Acción API no reconocida: ' + action };
      }
    } catch(err) {
      result = { error: err.toString() };
    }
    
    var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : '';
    var outputText = JSON.stringify(result);
    if (callback) {
      return ContentService.createTextOutput(callback + '(' + outputText + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(outputText)
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Navegación directa en navegador o incrustación en Google Sites
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'Index';
  var validPages = ['Index', 'Draft', 'Fichajes', 'Mercado', 'Premios', 'Graficas', 'Admin'];
  
  if (validPages.indexOf(page) === -1) {
    page = 'Index';
  }
  
  return HtmlService.createTemplateFromFile(page)
    .evaluate()
    .setTitle('Liga Fantástica - ' + page)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Enrutador POST para peticiones de mutación (Draft, Fichajes) desde la App
 */
function doPost(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  var postData = {};
  if (e && e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch(err) {
      postData = e.parameter || {};
    }
  } else if (e && e.parameter) {
    postData = e.parameter;
  }
  if (!action && postData.action) action = postData.action;

  var result = {};
  try {
    if (action === 'draft') {
      result = processDraftSelection(postData.team, postData.token, postData.player);
    } else if (action === 'transfer') {
      result = processMultipleTransfers(postData.team, postData.token, postData.jornada, postData.transfers);
    } else {
      result = { error: 'Acción POST no reconocida: ' + action };
    }
  } catch(err) {
    result = { error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper para localizar hojas por múltiples variantes de nombre (sin importar mayúsculas o acentos)
 */
function findSheet(ss, candidates) {
  if (!ss) return null;
  // 1. Coincidencia exacta directa
  for (var i = 0; i < candidates.length; i++) {
    var direct = ss.getSheetByName(candidates[i]);
    if (direct) return direct;
  }
  var allSheets = ss.getSheets();
  var cleanCandidates = candidates.map(function(c) {
    return String(c).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
  });
  // 2. Coincidencia exacta normalizada
  for (var s = 0; s < allSheets.length; s++) {
    var rawName = allSheets[s].getName();
    var cleanName = rawName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    for (var k = 0; k < cleanCandidates.length; k++) {
      if (cleanName === cleanCandidates[k]) {
        return allSheets[s];
      }
    }
  }
  // 3. Coincidencia parcial (solo para nombres específicos de más de 5 caracteres para evitar falsos positivos)
  for (var s2 = 0; s2 < allSheets.length; s2++) {
    var rawName2 = allSheets[s2].getName();
    var cleanName2 = rawName2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    for (var k2 = 0; k2 < cleanCandidates.length; k2++) {
      if (cleanCandidates[k2].length >= 6 && (cleanName2.indexOf(cleanCandidates[k2]) !== -1 || cleanCandidates[k2].indexOf(cleanName2) !== -1)) {
        return allSheets[s2];
      }
    }
  }
  return null;
}

/**
 * Helper para obtener sincronización completa en una sola llamada (Ultra-rápido en < 500ms)
 */
function getFullSyncData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Equipos y Tokens (1 sola lectura de rango)
  var sheetTeams = findSheet(ss, ['Equipos', 'Tokens', 'Teams', 'Clubs', 'Equipos_Tokens']);
  var teams = [];
  var tokens = [];
  if (sheetTeams) {
    var tData = sheetTeams.getDataRange().getValues();
    for (var i = 1; i < tData.length; i++) {
      var tName = tData[i][0] ? String(tData[i][0]).trim() : '';
      if (tName !== '') {
        teams.push(tName);
        var tToken = tData[i][1] ? String(tData[i][1]).trim() : '';
        if (tToken) {
          tokens.push({ team: tName, token: tToken });
        }
      }
    }
  }
  teams.sort();
  
  // 2. Jugadores (1 sola lectura de rango con todos sus puntos)
  var sheetJug = findSheet(ss, ['Jugadores', 'Players', 'Futbolistas', 'Lista_Jugadores']);
  var players = [];
  var maxJ = 1;
  if (sheetJug) {
    var jData = sheetJug.getDataRange().getValues();
    if (jData.length > 0) {
      // Localizar fila de cabeceras (por si hay título en fila 0)
      var headerRowIdx = 0;
      for (var hr = 0; hr < Math.min(5, jData.length); hr++) {
        var rowStr = jData[hr].join(' ').toLowerCase();
        if (rowStr.indexOf('equipo') !== -1 || rowStr.indexOf('posic') !== -1 || rowStr.indexOf('puntos') !== -1) {
          headerRowIdx = hr;
          break;
        }
      }
      var headers = jData[headerRowIdx];
      var pCols = {};
      var gCols = {};
      var dCols = {};
      
      for (var c = 0; c < headers.length; c++) {
        var h = String(headers[c]).trim();
        var matchP = h.match(/^Puntos_J([0-9]+)$/i);
        if (matchP) {
          var jNum = parseInt(matchP[1], 10);
          pCols[jNum] = c;
          if (jNum > maxJ) maxJ = jNum;
        }
        var matchG = h.match(/^Goles_J([0-9]+)$/i);
        if (matchG) gCols[parseInt(matchG[1], 10)] = c;
        var matchD = h.match(/^(?:PtsDef|PDef)_J([0-9]+)$/i);
        if (matchD) dCols[parseInt(matchD[1], 10)] = c;
      }
      
      for (var r = headerRowIdx + 1; r < jData.length; r++) {
        var name = String(jData[r][0] || '').trim();
        if (!name) continue;
        
        var totalPts = 0;
        var jPoints = {};
        var jGoals = {};
        var jDef = {};
        
        for (var jIdx in pCols) {
          var colIdx = pCols[jIdx];
          var rawVal = jData[r][colIdx];
          if (rawVal !== '' && rawVal !== null && rawVal !== undefined && !isNaN(Number(rawVal))) {
            var numVal = Number(rawVal);
            jPoints[jIdx] = numVal;
            totalPts += numVal;
          }
        }
        for (var gIdx in gCols) {
          var gVal = jData[r][gCols[gIdx]];
          if (gVal !== '' && !isNaN(Number(gVal))) jGoals[gIdx] = Number(gVal);
        }
        for (var defIdx in dCols) {
          var defVal = jData[r][dCols[defIdx]];
          if (defVal !== '' && !isNaN(Number(defVal))) jDef[defIdx] = Number(defVal);
        }
        
        players.push({
          name: name,
          realTeam: String(jData[r][1] || '').trim(),
          position: String(jData[r][2] || 'Medio').trim(),
          value: Number(jData[r][3]) || 0,
          status: String(jData[r][4] || 'Disponible').trim(),
          totalPoints: parseFloat(totalPts.toFixed(2)),
          jornadasPoints: jPoints,
          jornadasGoals: jGoals,
          jornadasDef: jDef
        });
      }
    }
  }
  
  // 3. Alineaciones (1 sola lectura de rango)
  var sheetAl = findSheet(ss, ['Alineaciones', 'Alineacion', 'Lineups', 'Plantillas', 'Alineaciones_Equipos']);
  var lineups = [];
  if (sheetAl) {
    var alData = sheetAl.getDataRange().getValues();
    for (var a = 1; a < alData.length; a++) {
      if (alData[a][0] && alData[a][2]) {
        var aJornada = Number(alData[a][1]) || 1;
        if (aJornada > maxJ) maxJ = aJornada;
        lineups.push({
          teamName: String(alData[a][0]).trim(),
          jornada: aJornada,
          playerName: String(alData[a][2]).trim(),
          realTeam: String(alData[a][3] || '').trim(),
          position: String(alData[a][4] || '').trim(),
          value: Number(alData[a][5]) || 0
        });
      }
    }
  }

  // 4. Historial de Fichajes (1 sola lectura de rango flexible)
  var sheetFichajes = findSheet(ss, [
    'Historial_Fichajes',
    'Historial de Fichajes',
    'Historial del Fichaje',
    'Historial Fichajes',
    'Fichajes',
    'Transfers',
    'Fichaje',
    'Mercado Fichajes'
  ]);
  var transfers = [];
  if (sheetFichajes) {
    var fData = sheetFichajes.getDataRange().getValues();
    if (fData.length > 1) {
      // Localizar fila de cabeceras
      var fHeaderRowIdx = 0;
      for (var fhr = 0; fhr < Math.min(5, fData.length); fhr++) {
        var fRowStr = fData[fhr].join(' ').toLowerCase();
        if (fRowStr.indexOf('equipo') !== -1 || fRowStr.indexOf('sale') !== -1 || fRowStr.indexOf('entra') !== -1 || fRowStr.indexOf('jugador') !== -1) {
          fHeaderRowIdx = fhr;
          break;
        }
      }

      var fHeaders = fData[fHeaderRowIdx].map(function(h) { 
        return String(h).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      });
      var colFDate = -1, colFTeam = -1, colFJor = -1, colFOut = -1, colFIn = -1, colFCost = -1, colFType = -1;
      
      for (var c = 0; c < fHeaders.length; c++) {
        var fh = fHeaders[c];
        if (fh.indexOf('fecha') !== -1 || fh.indexOf('hora') !== -1 || fh.indexOf('time') !== -1 || fh.indexOf('marca') !== -1 || fh.indexOf('timestamp') !== -1) {
          colFDate = c;
        } else if (fh.indexOf('cost') !== -1 || fh.indexOf('precio') !== -1 || fh.indexOf('fee') !== -1 || fh.indexOf('importe') !== -1 || fh.indexOf('tarifa') !== -1) {
          colFCost = c;
        } else if (fh.indexOf('sale') !== -1 || fh.indexOf('out') !== -1 || fh.indexOf('saliente') !== -1 || fh.indexOf('baja') !== -1) {
          colFOut = c;
        } else if (fh.indexOf('entra') !== -1 || fh.indexOf('in') !== -1 || fh.indexOf('entrante') !== -1 || fh.indexOf('alta') !== -1 || fh.indexOf('fichaje') !== -1) {
          colFIn = c;
        } else if (fh === 'equipo' || fh === 'team' || fh === 'club' || (fh.indexOf('equipo') !== -1 && fh.indexOf('liga') === -1 && fh.indexOf('real') === -1)) {
          colFTeam = c;
        } else if (fh.indexOf('jornada') !== -1 || fh.indexOf('jor') !== -1 || fh === 'j') {
          colFJor = c;
        } else if (fh.indexOf('tipo') !== -1 || fh.indexOf('type') !== -1 || fh.indexOf('motivo') !== -1) {
          colFType = c;
        }
      }
      
      if (colFDate === -1) colFDate = 0;
      if (colFTeam === -1) colFTeam = 1;
      if (colFJor === -1) colFJor = 2;
      if (colFOut === -1) colFOut = 3;
      if (colFIn === -1) colFIn = 4;
      if (colFCost === -1 && fHeaders.length > 5) colFCost = 5;
      if (colFType === -1 && fHeaders.length > 6) colFType = 6;
      
      for (var f = fHeaderRowIdx + 1; f < fData.length; f++) {
        var row = fData[f];
        var fTeam = colFTeam !== -1 && row[colFTeam] !== undefined ? String(row[colFTeam]).trim() : '';
        var fOut = colFOut !== -1 && row[colFOut] !== undefined ? String(row[colFOut]).trim() : '';
        var fIn = colFIn !== -1 && row[colFIn] !== undefined ? String(row[colFIn]).trim() : '';
        
        if (fTeam || fOut || fIn) {
          var rawDate = colFDate !== -1 ? row[colFDate] : '';
          var dateStr = '';
          if (rawDate instanceof Date) {
            dateStr = Utilities.formatDate(rawDate, Session.getScriptTimeZone() || "GMT+1", "dd/MM/yyyy, HH:mm'h'");
          } else if (rawDate) {
            dateStr = String(rawDate);
          }
          
          var rawFCost = colFCost !== -1 && row[colFCost] !== undefined ? String(row[colFCost]).replace(/[^0-9.,-]/g, '').replace(',', '.') : '0';
          var fCost = parseFloat(rawFCost) || 0;
          var fJor = colFJor !== -1 && row[colFJor] !== '' ? Number(row[colFJor]) : 1;
          var fType = colFType !== -1 && row[colFType] ? String(row[colFType]).trim() : 'Normal';
          
          transfers.push({
            timestamp: dateStr,
            team: fTeam,
            jornada: isNaN(fJor) ? 1 : fJor,
            playerOut: fOut,
            playerIn: fIn,
            cost: isNaN(fCost) ? 0 : fCost,
            type: fType
          });
        }
      }
    }
  }

  // 5. Historial de Draft (1 sola lectura de rango flexible)
  var sheetDraft = findSheet(ss, [
    'Historial_Draft',
    'Historial del Draft',
    'Historial de Draft',
    'Historial Draft',
    'Draft_Historial',
    'Elecciones Draft',
    'Draft',
    'Draft Inicial'
  ]);
  var drafts = [];
  if (sheetDraft) {
    var dData = sheetDraft.getDataRange().getValues();
    if (dData.length > 1) {
      // Localizar fila de cabeceras
      var dHeaderRowIdx = 0;
      for (var dhr = 0; dhr < Math.min(5, dData.length); dhr++) {
        var dRowStr = dData[dhr].join(' ').toLowerCase();
        if (dRowStr.indexOf('equipo') !== -1 || dRowStr.indexOf('jugador') !== -1 || dRowStr.indexOf('nombre') !== -1) {
          dHeaderRowIdx = dhr;
          break;
        }
      }

      var dHeaders = dData[dHeaderRowIdx].map(function(h) { 
        return String(h).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      });
      var colDDate = -1, colDTeam = -1, colDPlayer = -1, colDRealTeam = -1, colDPos = -1, colDVal = -1;
      
      for (var d = 0; d < dHeaders.length; d++) {
        var dh = dHeaders[d];
        if (dh.indexOf('fecha') !== -1 || dh.indexOf('hora') !== -1 || dh.indexOf('time') !== -1 || dh.indexOf('marca') !== -1 || dh.indexOf('timestamp') !== -1) {
          colDDate = d;
        } else if (dh.indexOf('equipo_liga') !== -1 || dh.indexOf('real') !== -1 || dh.indexOf('equiporeal') !== -1 || dh === 'club') {
          colDRealTeam = d;
        } else if (dh.indexOf('jugador') !== -1 || dh.indexOf('player') !== -1 || dh.indexOf('nombre') !== -1 || dh.indexOf('futbolista') !== -1 || dh.indexOf('eleccion') !== -1) {
          colDPlayer = d;
        } else if (dh === 'equipo' || dh === 'team' || (dh.indexOf('equipo') !== -1 && dh.indexOf('real') === -1 && dh.indexOf('liga') === -1)) {
          colDTeam = d;
        } else if (dh.indexOf('posic') !== -1 || dh.indexOf('pos') !== -1 || dh.indexOf('demarcacion') !== -1) {
          colDPos = d;
        } else if (dh.indexOf('valor') !== -1 || dh.indexOf('val') !== -1 || dh.indexOf('precio') !== -1 || dh.indexOf('millones') !== -1) {
          colDVal = d;
        }
      }
      
      if (colDDate === -1) colDDate = 0;
      if (colDTeam === -1) colDTeam = 1;
      if (colDPlayer === -1) colDPlayer = 2;
      if (colDRealTeam === -1 && dHeaders.length > 3) colDRealTeam = 3;
      if (colDPos === -1 && dHeaders.length > 4) colDPos = 4;
      if (colDVal === -1 && dHeaders.length > 5) colDVal = 5;
      
      // Catálogo maestro de jugadores en memoria para autocompletar si la hoja no incluye club/pos/valor
      var pCatalogMap = {};
      players.forEach(function(pl) { pCatalogMap[pl.name.toLowerCase()] = pl; });

      for (var dr = dHeaderRowIdx + 1; dr < dData.length; dr++) {
        var dRow = dData[dr];
        var dTeam = colDTeam !== -1 && dRow[colDTeam] !== undefined ? String(dRow[colDTeam]).trim() : '';
        var dPlayer = colDPlayer !== -1 && dRow[colDPlayer] !== undefined ? String(dRow[colDPlayer]).trim() : '';
        
        if (dTeam || dPlayer) {
          var rawDDate = colDDate !== -1 ? dRow[colDDate] : '';
          var dDateStr = '';
          if (rawDDate instanceof Date) {
            dDateStr = Utilities.formatDate(rawDDate, Session.getScriptTimeZone() || "GMT+1", "dd/MM/yyyy, HH:mm'h'");
          } else if (rawDDate) {
            dDateStr = String(rawDDate);
          }
          
          var dReal = colDRealTeam !== -1 && dRow[colDRealTeam] !== undefined ? String(dRow[colDRealTeam]).trim() : '';
          var dPos = colDPos !== -1 && dRow[colDPos] !== undefined ? String(dRow[colDPos]).trim() : '';
          var rawDVal = colDVal !== -1 && dRow[colDVal] !== undefined ? String(dRow[colDVal]).replace(/[^0-9.,-]/g, '').replace(',', '.') : '0';
          var dVal = parseFloat(rawDVal) || 0;
          
          // Autocompletar datos del jugador si están vacíos
          if ((!dReal || !dPos || dVal === 0) && dPlayer) {
            var refP = pCatalogMap[dPlayer.toLowerCase()];
            if (refP) {
              if (!dReal) dReal = refP.realTeam;
              if (!dPos) dPos = refP.position;
              if (dVal === 0) dVal = refP.value;
            }
          }

          drafts.push({
            timestamp: dDateStr,
            team: dTeam,
            playerName: dPlayer,
            realTeam: dReal,
            position: dPos || 'Medio',
            value: isNaN(dVal) ? 0 : dVal
          });
        }
      }
    }
  }

  return {
    success: true,
    maxJornada: maxJ,
    teams: teams,
    tokens: tokens,
    players: players,
    lineups: lineups,
    transfers: transfers,
    drafts: drafts,
    syncedAt: new Date().toISOString()
  };
}

/**
 * Helper para obtener tokens de equipos
 */
function getTeamTokensData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findSheet(ss, ['Equipos', 'Tokens', 'Teams', 'Clubs', 'Equipos_Tokens']);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var tName = data[i][0] ? String(data[i][0]).trim() : '';
    var tToken = data[i][1] ? String(data[i][1]).trim() : '';
    if (tName) {
      list.push({ team: tName, token: tToken });
    }
  }
  return list;
}

/**
 * Helper para incluir archivos en templates HTML
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Obtener lista de equipos registrados
 */
function getTeamNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Equipos') || ss.getSheetByName('Tokens');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var teams = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]).trim() !== '') {
      teams.push(String(data[i][0]).trim());
    }
  }
  return teams.sort();
}

/**
 * Obtener la jornada máxima activa según la hoja de Jugadores
 */
function getMaxJornada() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Jugadores');
  if (!sheet) return 5;
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var maxJ = 0;
  for (var c = 0; c < headers.length; c++) {
    var match = String(headers[c]).match(/Puntos_J([0-9]+)/i);
    if (match) {
      var jNum = parseInt(match[1], 10);
      if (jNum > maxJ) maxJ = jNum;
    }
  }
  return maxJ > 0 ? maxJ : 5;
}

/**
 * Validar Token de un equipo
 */
function validateTeamToken(teamName, token) {
  if (!teamName || !token) return false;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Tokens');
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var t = String(data[i][0]).trim().toLowerCase();
    var tok = String(data[i][1]).trim();
    if (t === String(teamName).trim().toLowerCase() && tok === String(token).trim()) {
      return true;
    }
  }
  return false;
}

/**
 * Obtener alineación y puntos detallados de un equipo en una jornada
 */
function getTeamLineupData(teamName, jornada) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAlineaciones = ss.getSheetByName('Alineaciones');
  var sheetJugadores = ss.getSheetByName('Jugadores');
  
  if (!sheetAlineaciones || !sheetJugadores) {
    return { players: [], totalPoints: '0.00', totalValue: '0', totalGoals: 0, totalDefensivePoints: 0, error: 'Hojas no encontradas.' };
  }
  
  var alData = sheetAlineaciones.getDataRange().getValues();
  var jugData = sheetJugadores.getDataRange().getValues();
  
  // Mapear Jugadores
  var jugHeaders = jugData[0];
  var pCol = -1, gCol = -1, dCol = -1, valCol = -1, teamCol = -1, posCol = -1;
  
  for (var c = 0; c < jugHeaders.length; c++) {
    var h = String(jugHeaders[c]).trim();
    if (h.toLowerCase() === 'equipo_liga') teamCol = c;
    if (h.toLowerCase() === 'posicion') posCol = c;
    if (h.toLowerCase() === 'valor') valCol = c;
    if (h === 'Puntos_J' + jornada) pCol = c;
    if (h === 'Goles_J' + jornada) gCol = c;
    if (h === 'PtsDef_J' + jornada || h === 'PDef_J' + jornada) dCol = c;
  }
  
  var playersMap = {};
  for (var j = 1; j < jugData.length; j++) {
    var name = String(jugData[j][0]).trim();
    if (name) {
      playersMap[name] = {
        realTeam: teamCol !== -1 ? String(jugData[j][teamCol]) : '',
        position: posCol !== -1 ? String(jugData[j][posCol]) : '',
        value: valCol !== -1 ? Number(jugData[j][valCol]) || 0 : 0,
        points: pCol !== -1 ? jugData[j][pCol] : '',
        goals: gCol !== -1 ? jugData[j][gCol] : '',
        pDef: dCol !== -1 ? jugData[j][dCol] : ''
      };
    }
  }
  
  var teamPlayers = [];
  var totPoints = 0, totValue = 0, totGoals = 0, totDef = 0;
  
  for (var a = 1; a < alData.length; a++) {
    var aTeam = String(alData[a][0]).trim();
    var aJor = Number(alData[a][1]);
    var aPlayer = String(alData[a][2]).trim();
    
    if (aTeam.toLowerCase() === String(teamName).trim().toLowerCase() && aJor === Number(jornada)) {
      var pInfo = playersMap[aPlayer] || { realTeam: '', position: '', value: 0, points: '', goals: '', pDef: '' };
      
      teamPlayers.push({
        name: aPlayer,
        realTeam: pInfo.realTeam,
        position: pInfo.position,
        value: pInfo.value,
        points: pInfo.points,
        goals: pInfo.goals,
        pDef: pInfo.pDef
      });
      
      if (typeof pInfo.points === 'number') totPoints += pInfo.points;
      if (typeof pInfo.value === 'number') totValue += pInfo.value;
      if (typeof pInfo.goals === 'number') totGoals += pInfo.goals;
      if ((pInfo.position === 'Portero' || pInfo.position === 'Defensa') && typeof pInfo.pDef === 'number') {
        totDef += pInfo.pDef;
      }
    }
  }
  
  var positionOrder = { 'Portero': 1, 'Defensa': 2, 'Medio': 3, 'Delantero': 4 };
  teamPlayers.sort(function(x, y) {
    return (positionOrder[x.position] || 99) - (positionOrder[y.position] || 99) || x.name.localeCompare(y.name);
  });
  
  return {
    players: teamPlayers,
    totalPoints: totPoints.toFixed(2),
    totalValue: totValue.toFixed(0),
    totalGoals: totGoals,
    totalDefensivePoints: totDef
  };
}

/**
 * Obtener todos los datos de clasificaciones (Semanal, General, Goleador, Menos Goleado)
 */
function getAllStandingsData(jornada) {
  var maxJ = getMaxJornada();
  var j = Number(jornada) || maxJ;
  var teams = getTeamNames();
  
  var weeklyScores = {};
  var generalScores = {};
  var goalsScores = {};
  var defScores = {};
  
  teams.forEach(function(t) {
    weeklyScores[t] = 0;
    generalScores[t] = 0;
    goalsScores[t] = 0;
    defScores[t] = 0;
  });
  
  for (var jIdx = 1; jIdx <= maxJ; jIdx++) {
    teams.forEach(function(t) {
      var d = getTeamLineupData(t, jIdx);
      var pts = parseFloat(d.totalPoints) || 0;
      var gls = Number(d.totalGoals) || 0;
      var dfs = Number(d.totalDefensivePoints) || 0;
      
      if (jIdx === j) {
        weeklyScores[t] = pts;
      }
      if (jIdx <= maxJ) {
        generalScores[t] += pts;
        goalsScores[t] += gls;
        defScores[t] += dfs;
      }
    });
  }
  
  var weekly = teams.map(function(t) { return { teamName: t, score: (weeklyScores[t] || 0).toFixed(2) }; })
                    .sort(function(a, b) { return parseFloat(b.score) - parseFloat(a.score); });
                    
  var general = teams.map(function(t) { return { teamName: t, score: (generalScores[t] || 0).toFixed(2) }; })
                     .sort(function(a, b) { return parseFloat(b.score) - parseFloat(a.score); });
                     
  var mostGoals = teams.map(function(t) { return { teamName: t, score: goalsScores[t] || 0 }; })
                       .sort(function(a, b) { return Number(b.score) - Number(a.score); });
                       
  var leastConceded = teams.map(function(t) { return { teamName: t, score: defScores[t] || 0 }; })
                           .sort(function(a, b) { return Number(a.score) - Number(b.score); });
                           
  return {
    weekly: weekly,
    general: general,
    mostGoals: mostGoals,
    leastConceded: leastConceded,
    maxJornada: maxJ
  };
}

/**
 * Obtener jugadores para el Mercado
 */
function getPlayersForMercado() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Jugadores');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var pCols = [];
  
  for (var c = 0; c < headers.length; c++) {
    if (String(headers[c]).indexOf('Puntos_J') === 0) pCols.push(c);
  }
  
  var players = [];
  for (var i = 1; i < data.length; i++) {
    var name = String(data[i][0]).trim();
    if (!name) continue;
    
    var totalPts = 0;
    pCols.forEach(function(col) {
      var val = Number(data[i][col]);
      if (!isNaN(val)) totalPts += val;
    });
    
    players.push({
      name: name,
      realTeam: String(data[i][1] || ''),
      position: String(data[i][2] || ''),
      value: Number(data[i][3]) || 0,
      status: String(data[i][4] || 'Disponible'),
      totalPoints: parseFloat(totalPts.toFixed(2))
    });
  }
  return players;
}

/**
 * Obtener datos de contabilidad y premios
 */
function getAccountingData() {
  var maxJ = getMaxJornada();
  var teams = getTeamNames();
  var numTeams = teams.length;
  
  var totalContributions = 0;
  var totalTransferFees = 0;
  var totalPrizeMoneyAwarded = 0;
  
  var teamBalance = {};
  teams.forEach(function(t) {
    teamBalance[t] = { contributions: 0, transferFees: 0, prizes: 0, balance: 0 };
  });

  // Calcular costes de fichajes desde la hoja de fichajes
  try {
    var ss = getSpreadsheet();
    var sheetF = findSheet(ss, ['Historial_Fichajes', 'Historial de Fichajes', 'Fichajes']);
    if (sheetF) {
      var fData = sheetF.getDataRange().getValues();
      var countsByTeam = {};
      teams.forEach(function(t) { countsByTeam[t.toLowerCase()] = 0; });

      for (var fi = 1; fi < fData.length; fi++) {
        var rowT = fData[fi];
        var tName = String(rowT[1] || '').trim();
        var rawC = rowT[5] !== undefined ? String(rowT[5]).replace(/[^0-9.,-]/g, '').replace(',', '.') : '0';
        var cost = parseFloat(rawC) || 0;
        var fType = String(rowT[6] || 'Normal').trim();

        // Buscar equipo
        var matchedT = null;
        for (var tk = 0; tk < teams.length; tk++) {
          if (teams[tk].toLowerCase() === tName.toLowerCase() || tName.toLowerCase().indexOf(teams[tk].toLowerCase()) !== -1) {
            matchedT = teams[tk];
            break;
          }
        }

        if (matchedT) {
          var isAbandon = fType.toLowerCase().indexOf('abandono') !== -1;
          if (cost > 0) {
            teamBalance[matchedT].transferFees += cost;
            totalTransferFees += cost;
            if (!isAbandon) countsByTeam[matchedT.toLowerCase()]++;
          } else if (!isAbandon) {
            if (countsByTeam[matchedT.toLowerCase()] >= 3) {
              teamBalance[matchedT].transferFees += 2;
              totalTransferFees += 2;
            }
            countsByTeam[matchedT.toLowerCase()]++;
          }
        }
      }
    }
  } catch(e) {
    // Salvaguarda
  }
  
  // Calcular aportes desde la jornada configurada
  for (var j = FIRST_CONTRIBUTION_JORNADA; j <= maxJ; j++) {
    totalContributions += (numTeams * WEEKLY_CONTRIBUTION);
    teams.forEach(function(t) {
      teamBalance[t].contributions += WEEKLY_CONTRIBUTION;
    });
    
    var weeklyRanking = getAllStandingsData(j).weekly;
    if (weeklyRanking.length > 0 && parseFloat(weeklyRanking[0].score) > 0) {
      var topScore = weeklyRanking[0].score;
      var winners = weeklyRanking.filter(function(x) { return x.score === topScore; });
      var totalPrize = numTeams * 1.0;
      var indPrize = totalPrize / winners.length;
      totalPrizeMoneyAwarded += totalPrize;
      
      winners.forEach(function(w) {
        if (teamBalance[w.teamName]) teamBalance[w.teamName].prizes += indPrize;
      });
    }
  }
  
  var details = teams.map(function(t) {
    var b = teamBalance[t];
    var bal = b.prizes - b.contributions - b.transferFees;
    return {
      team: t,
      contributions: b.contributions.toFixed(2),
      transferFees: b.transferFees.toFixed(2),
      prizes: b.prizes.toFixed(2),
      balance: bal.toFixed(2)
    };
  });
  
  var finalCaja = totalContributions + totalTransferFees - totalPrizeMoneyAwarded;
  var isFinalJornada = maxJ >= 38;
  var potToDistribute = Math.max(0, finalCaja);

  var is6Teams = numTeams === 6;
  var p1Pct = is6Teams ? 0.335 : 0.30;
  var p2Pct = is6Teams ? 0.255 : 0.23;
  var p3Pct = is6Teams ? 0.190 : 0.17;
  var pPenultPct = is6Teams ? 0.0 : 0.10;
  var pGoalsPct = is6Teams ? 0.110 : 0.10;
  var pDefPct = is6Teams ? 0.110 : 0.10;

  var standingsGen = getAllStandingsData(maxJ);
  var generalRanking = standingsGen.general || [];
  var goalsRanking = standingsGen.mostGoals || [];
  var defRanking = standingsGen.leastConceded || [];

  var finalPrizes = [];
  var teamFinalPrizes = {};
  teams.forEach(function(t) { teamFinalPrizes[t] = 0; });

  if (generalRanking.length > 0) {
    var t1 = generalRanking[0].teamName;
    var a1 = potToDistribute * p1Pct;
    teamFinalPrizes[t1] = (teamFinalPrizes[t1] || 0) + a1;
    finalPrizes.push({ type: '1ª Posición General', team: t1, percentage: (p1Pct * 100).toFixed(1) + '%', prize: a1.toFixed(2), categoryPrize: a1.toFixed(2) });
  }
  if (generalRanking.length > 1) {
    var t2 = generalRanking[1].teamName;
    var a2 = potToDistribute * p2Pct;
    teamFinalPrizes[t2] = (teamFinalPrizes[t2] || 0) + a2;
    finalPrizes.push({ type: '2ª Posición General', team: t2, percentage: (p2Pct * 100).toFixed(1) + '%', prize: a2.toFixed(2), categoryPrize: a2.toFixed(2) });
  }
  if (generalRanking.length > 2) {
    var t3 = generalRanking[2].teamName;
    var a3 = potToDistribute * p3Pct;
    teamFinalPrizes[t3] = (teamFinalPrizes[t3] || 0) + a3;
    finalPrizes.push({ type: '3ª Posición General', team: t3, percentage: (p3Pct * 100).toFixed(1) + '%', prize: a3.toFixed(2), categoryPrize: a3.toFixed(2) });
  }
  if (!is6Teams && generalRanking.length >= 4) {
    var tPenult = generalRanking[generalRanking.length - 2].teamName;
    var aPenult = potToDistribute * pPenultPct;
    teamFinalPrizes[tPenult] = (teamFinalPrizes[tPenult] || 0) + aPenult;
    finalPrizes.push({ type: 'Penúltima Posición General', team: tPenult, percentage: (pPenultPct * 100).toFixed(1) + '%', prize: aPenult.toFixed(2), categoryPrize: aPenult.toFixed(2) });
  }
  if (goalsRanking.length > 0) {
    var topG = goalsRanking[0].score;
    var winG = goalsRanking.filter(function(x) { return x.score === topG; });
    var totG = potToDistribute * pGoalsPct;
    var indG = totG / winG.length;
    winG.forEach(function(w) { teamFinalPrizes[w.teamName] = (teamFinalPrizes[w.teamName] || 0) + indG; });
    finalPrizes.push({ type: 'Equipo Más Goleador', team: winG.map(function(w) { return w.teamName; }).join(', '), percentage: (pGoalsPct * 100).toFixed(1) + '%', prize: totG.toFixed(2), categoryPrize: totG.toFixed(2) });
  }
  if (defRanking.length > 0) {
    var topD = defRanking[0].score;
    var winD = defRanking.filter(function(x) { return x.score === topD; });
    var totD = potToDistribute * pDefPct;
    var indD = totD / winD.length;
    winD.forEach(function(w) { teamFinalPrizes[w.teamName] = (teamFinalPrizes[w.teamName] || 0) + indD; });
    finalPrizes.push({ type: 'Equipo Menos Goleado', team: winD.map(function(w) { return w.teamName; }).join(', '), percentage: (pDefPct * 100).toFixed(1) + '%', prize: totD.toFixed(2), categoryPrize: totD.toFixed(2) });
  }

  var finalBalanceDetails = teams.map(function(t) {
    var b = teamBalance[t];
    var bal = b.prizes - b.contributions - b.transferFees;
    var pf = teamFinalPrizes[t] || 0;
    return {
      team: t,
      balanceJornadas: bal.toFixed(2),
      premioFinal: pf.toFixed(2),
      totalFinal: (bal + pf).toFixed(2)
    };
  }).sort(function(a, b) { return parseFloat(b.totalFinal) - parseFloat(a.totalFinal); });
  
  return {
    maxJornada: maxJ,
    numTeams: numTeams,
    totalContributions: totalContributions.toFixed(2),
    totalTransferFees: totalTransferFees.toFixed(2),
    totalPrizeMoneyAwarded: totalPrizeMoneyAwarded.toFixed(2),
    finalCajaBeforeFinalPrizes: finalCaja.toFixed(2),
    finalCajaAfterFinalPrizes: "0.00",
    teamBalanceDetails: details,
    finalPrizes: finalPrizes,
    finalBalanceDetails: finalBalanceDetails,
    isFinalJornada: isFinalJornada
  };
}

/**
 * Obtener jugadores de un equipo alineados en una jornada específica
 */
function getTeamPlayersForJornada(teamName, jornada) {
  var d = getTeamLineupData(teamName, jornada);
  return (d && d.players) ? d.players.map(function(p) { return p.name; }) : [];
}

/**
 * Obtener historial de fichajes
 */
function getTransferHistory() {
  var data = getFullSyncData();
  return data.transfers || [];
}

/**
 * Obtener historial del draft
 */
function getDraftHistory() {
  var data = getFullSyncData();
  return data.drafts || [];
}

/**
 * Procesar selección del Draft
 */
function processDraftSelection(team, token, player) {
  if (!validateTeamToken(team, token)) {
    return { success: false, message: 'Token incorrecto o no autorizado para el equipo ' + team };
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAl = findSheet(ss, ['Alineaciones', 'Alineacion', 'Lineups', 'Plantillas']);
  var sheetDraft = findSheet(ss, [
    'Historial_Draft',
    'Historial del Draft',
    'Historial de Draft',
    'Historial Draft',
    'Draft_Historial',
    'Elecciones Draft',
    'Draft',
    'Draft Inicial'
  ]);
  
  if (!sheetDraft) {
    sheetDraft = ss.insertSheet('Historial del Draft');
    sheetDraft.appendRow(['Fecha/Hora', 'Equipo', 'Nombre_Jugador', 'Equipo_Liga', 'Posicion', 'Valor']);
  }
  
  var market = getPlayersForMercado();
  var pData = null;
  for (var i = 0; i < market.length; i++) {
    if (market[i].name.toLowerCase() === String(player).trim().toLowerCase()) {
      pData = market[i];
      break;
    }
  }
  
  var realTeam = pData ? pData.realTeam : '';
  var pos = pData ? pData.position : 'Medio';
  var val = pData ? pData.value : 0;
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+1', "dd/MM/yyyy, HH:mm'h'");
  sheetDraft.appendRow([nowStr, team, player, realTeam, pos, val]);
  
  if (sheetAl) {
    sheetAl.appendRow([team, 1, player, realTeam, pos, val]);
  }
  
  return { success: true, message: '¡Selección registrada correctamente! ' + player + ' fichado por ' + team + '.' };
}

/**
 * Procesar fichajes múltiples
 */
function processMultipleTransfers(team, token, jornada, transfers) {
  if (!validateTeamToken(team, token)) {
    return { success: false, message: 'Token incorrecto o no autorizado para el equipo ' + team };
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAl = findSheet(ss, ['Alineaciones', 'Alineacion', 'Lineups', 'Plantillas']);
  var sheetFichajes = findSheet(ss, [
    'Historial_Fichajes',
    'Historial de Fichajes',
    'Historial del Fichaje',
    'Historial Fichajes',
    'Fichajes',
    'Transfers',
    'Fichaje',
    'Mercado Fichajes'
  ]);
  
  if (!sheetFichajes) {
    sheetFichajes = ss.insertSheet('Historial de Fichajes');
    sheetFichajes.appendRow(['Fecha/Hora', 'Equipo', 'Jornada', 'Jugador Sale', 'Jugador Entra', 'Coste', 'Tipo']);
  }
  
  var market = getPlayersForMercado();
  var marketMap = {};
  market.forEach(function(m) { marketMap[m.name] = m; });
  
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT+1', "dd/MM/yyyy, HH:mm'h'");
  
  var previousTransfers = getTransferHistory();
  var teamNormalCount = previousTransfers.filter(function(t) { return t.team === team && t.type === 'Normal'; }).length;
  
  transfers.forEach(function(t) {
    var pOut = t.playerOut;
    var pIn = t.playerIn;
    var isAbandon = !!t.isAbandonment;
    var cost = 0;
    var type = isAbandon ? 'Abandono' : 'Normal';
    
    if (!isAbandon) {
      if (teamNormalCount >= FREE_TRANSFERS_PER_TEAM) {
        cost = TRANSFER_COST;
      }
      teamNormalCount++;
    }
    
    sheetFichajes.appendRow([nowStr, team, jornada, pOut, pIn, cost, type]);
    
    // Disparar aviso automático a Telegram y GitHub Actions
    try {
      enviarAvisoTelegramYGitHub(team, pIn, pOut, cost, jornada, type);
    } catch(errAviso) {
      Logger.log("Error al disparar aviso de fichaje: " + errAviso);
    }
    
    if (sheetAl) {
      var alData = sheetAl.getDataRange().getValues();
      for (var r = 1; r < alData.length; r++) {
        if (String(alData[r][0]).trim() === team && Number(alData[r][1]) === Number(jornada) && String(alData[r][2]).trim() === pOut) {
          var pInfo = marketMap[pIn] || { realTeam: '', position: 'Medio', value: 0 };
          sheetAl.getRange(r + 1, 3).setValue(pIn);
          sheetAl.getRange(r + 1, 4).setValue(pInfo.realTeam);
          sheetAl.getRange(r + 1, 5).setValue(pInfo.position);
          sheetAl.getRange(r + 1, 6).setValue(pInfo.value);
          break;
        }
      }
    }
  });
  
  return { success: true, message: 'Fichajes procesados correctamente en Google Sheets.' };
}
`;

export const GAS_TEMPLATES: Record<string, string> = {
  'Código.gs': REDESIGNED_CODE_GS,
  'Stylesheet.html': REDESIGNED_STYLESHEET_HTML,
  'Index.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Liga Fantástica - Clasificaciones</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>LIGA FANTÁSTICA</h1>
    
    <div class="selectors">
      <div class="form-group">
        <label for="teamSelect">Equipo (Ver Alineación)</label>
        <select id="teamSelect" onchange="loadLineup();"><option value="">Cargando equipos...</option></select>
      </div>
      <div class="form-group">
        <label for="jornadaSelect">Jornada (Ver Alineación)</label>
        <select id="jornadaSelect" onchange="loadLineup();"><option value="">Cargando jornadas...</option></select>
      </div>
      <button id="refreshButton" onclick="refreshStandings();">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        Actualizar
      </button>
      <div id="loading" class="loading-indicator">Cargando datos desde Google Sheets...</div>
    </div>

    <h2>Alineación y Puntos del Equipo</h2>
    <div id="teamError" class="error-message" style="display:none;"></div>
    <div class="table-responsive-wrapper">
      <table id="lineupTable">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Equipo Liga</th>
            <th class="numeric-header">Valor</th>
            <th class="numeric-header">Puntos (Jor.)</th>
            <th class="numeric-header">Goles (Jor.)</th>
            <th class="numeric-header">Pts.Def (Jor.)</th>
          </tr>
        </thead>
        <tbody id="lineupBody">
          <tr><td colspan="7" style="text-align:center; color:#94a3b8;">Selecciona un equipo y jornada para ver su alineación.</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="4" style="text-align:right; font-weight:bold;">Puntuación Total Jornada:</td><td id="totalPoints" class="numeric-cell" style="font-weight:bold; color:var(--primary);">-</td><td colspan="2"></td></tr>
          <tr><td colspan="4" style="text-align:right; font-weight:bold;">Valor Total Equipo:</td><td id="totalValue" class="numeric-cell" style="font-weight:bold;">-</td><td colspan="2"></td></tr>
          <tr><td colspan="4" style="text-align:right; font-weight:bold;">Goles Totales Equipo (Jor.):</td><td id="totalGoals" class="numeric-cell" style="font-weight:bold; color:var(--accent);">-</td><td colspan="2"></td></tr>
          <tr><td colspan="4" style="text-align:right; font-weight:bold;">Total Pts.Def. Equipo (Jor.):</td><td id="totalDefensivePoints" class="numeric-cell" style="font-weight:bold; color:var(--secondary);">-</td><td colspan="2"></td></tr>
        </tfoot>
      </table>
    </div>

    <div class="standings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 30px;">
      <div>
        <h2 id="weeklyStandingsTitle">Clasificación Jornada</h2>
        <div class="table-responsive-wrapper">
          <table id="weeklyStandingsTable">
            <thead><tr><th>#</th><th>Equipo</th><th class="numeric-header">Puntos</th></tr></thead>
            <tbody id="weeklyBody"></tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 id="generalStandingsTitle">Clasificación General</h2>
        <div class="table-responsive-wrapper">
          <table id="generalStandingsTable">
            <thead><tr><th>#</th><th>Equipo</th><th class="numeric-header">Puntos Totales</th></tr></thead>
            <tbody id="generalBody"></tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 id="mostGoalsTitle">Equipo Más Goleador</h2>
        <div class="table-responsive-wrapper">
          <table id="mostGoalsTable">
            <thead><tr><th>#</th><th>Equipo</th><th class="numeric-header">Goles Totales</th></tr></thead>
            <tbody id="goalsBody"></tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 id="leastConcededTitle">Equipo Menos Goleado</h2>
        <div class="table-responsive-wrapper">
          <table id="leastConcededTable">
            <thead><tr><th>#</th><th>Equipo</th><th class="numeric-header">Total Pts.Def</th></tr></thead>
            <tbody id="defBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      showLoading(true);
      google.script.run
        .withSuccessHandler(function(teams) {
          var sel = document.getElementById('teamSelect');
          sel.innerHTML = '<option value="">-- Selecciona Equipo --</option>';
          teams.forEach(function(t) { sel.innerHTML += '<option value="' + t + '">' + t + '</option>'; });
          
          google.script.run
            .withSuccessHandler(function(maxJ) {
              var jSel = document.getElementById('jornadaSelect');
              jSel.innerHTML = '';
              for (var i = 1; i <= maxJ; i++) {
                jSel.innerHTML += '<option value="' + i + '"' + (i === maxJ ? ' selected' : '') + '>Jornada ' + i + '</option>';
              }
              refreshStandings();
            })
            .getMaxJornada();
        })
        .getTeamNames();
    };

    function showLoading(show) {
      document.getElementById('loading').style.display = show ? 'inline-block' : 'none';
    }

    function refreshStandings() {
      showLoading(true);
      var jVal = document.getElementById('jornadaSelect').value || 1;
      google.script.run
        .withSuccessHandler(function(data) {
          showLoading(false);
          renderStandings('weeklyBody', data.weekly);
          renderStandings('generalBody', data.general);
          renderStandings('goalsBody', data.mostGoals);
          renderStandings('defBody', data.leastConceded);
          loadLineup();
        })
        .withFailureHandler(function(err) {
          showLoading(false);
          alert('Error al obtener datos: ' + err.message);
        })
        .getAllStandingsData(jVal);
    }

    function renderStandings(elementId, list) {
      var tbody = document.getElementById(elementId);
      if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Sin datos</td></tr>';
        return;
      }
      var medals = ['🥇', '🥈', '🥉'];
      tbody.innerHTML = list.map(function(item, idx) {
        var rank = medals[idx] || (idx + 1);
        return '<tr>' +
          '<td style="font-weight:bold;">' + rank + '</td>' +
          '<td style="font-weight:600;">' + item.teamName + '</td>' +
          '<td class="numeric-cell" style="font-weight:bold; color:var(--primary);">' + item.score + '</td>' +
        '</tr>';
      }).join('');
    }

    function loadLineup() {
      var team = document.getElementById('teamSelect').value;
      var jor = document.getElementById('jornadaSelect').value;
      if (!team || !jor) return;

      showLoading(true);
      google.script.run
        .withSuccessHandler(function(res) {
          showLoading(false);
          var tbody = document.getElementById('lineupBody');
          if (res.error) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#f87171;">' + res.error + '</td></tr>';
            return;
          }
          if (!res.players || res.players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay alineación registrada para este equipo en la J' + jor + '.</td></tr>';
            return;
          }
          
          tbody.innerHTML = res.players.map(function(p) {
            var posClass = 'pos-' + p.position.toLowerCase();
            return '<tr>' +
              '<td class="' + posClass + '">' + p.position + '</td>' +
              '<td style="font-weight:700;">' + p.name + '</td>' +
              '<td>' + p.realTeam + '</td>' +
              '<td class="numeric-cell">' + p.value + 'M€</td>' +
              '<td class="numeric-cell" style="font-weight:bold; color:var(--primary);">' + (p.points !== '' ? p.points : '-') + '</td>' +
              '<td class="numeric-cell" style="color:var(--accent);">' + (p.goals !== '' ? p.goals : '-') + '</td>' +
              '<td class="numeric-cell" style="color:var(--secondary);">' + (p.pDef !== '' ? p.pDef : '-') + '</td>' +
            '</tr>';
          }).join('');

          document.getElementById('totalPoints').innerText = res.totalPoints + ' pts';
          document.getElementById('totalValue').innerText = res.totalValue + ' M€';
          document.getElementById('totalGoals').innerText = res.totalGoals;
          document.getElementById('totalDefensivePoints').innerText = res.totalDefensivePoints;
        })
        .getTeamLineupData(team, jor);
    }
  </script>
</body>
</html>`,
  'Draft.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Draft Inicial de Jugadores</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>DRAFT INICIAL DE JUGADORES</h1>
    <form id="draftForm" onsubmit="submitDraft(event);">
      <div class="form-grid">
        <div class="form-group">
          <label for="draftTeamSelect">Selección de Equipo</label>
          <select id="draftTeamSelect" required><option value="">Cargando...</option></select>
        </div>
        <div class="form-group">
          <label for="draftTokenInput">Token de Equipo</label>
          <input type="password" id="draftTokenInput" placeholder="Token único del equipo" required>
        </div>
        <div class="form-group">
          <label for="draftPlayerSelect">Selección de Jugador (Disponibles)</label>
          <select id="draftPlayerSelect" required><option value="">Cargando...</option></select>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <button type="submit" id="draftSubmitBtn">Realizar Selección</button>
      </div>
      <div id="draftStatus" class="status-message" style="display:none;"></div>
    </form>

    <h2>Historial del Draft</h2>
    <div class="table-responsive-wrapper">
      <table id="draftHistoryTable">
        <thead>
          <tr><th>Fecha/Hora</th><th>Equipo</th><th>Nombre_Jugador</th><th>Equipo_Liga</th><th>Posicion</th><th class="numeric-header">Valor</th></tr>
        </thead>
        <tbody id="draftHistoryBody"></tbody>
      </table>
    </div>
  </div>

  <script>
    window.onload = function() {
      google.script.run
        .withSuccessHandler(function(teams) {
          var sel = document.getElementById('draftTeamSelect');
          sel.innerHTML = '<option value="">-- Selecciona Equipo --</option>';
          teams.forEach(function(t) { sel.innerHTML += '<option value="' + t + '">' + t + '</option>'; });
        })
        .getTeamNames();
        
      google.script.run
        .withSuccessHandler(function(players) {
          var sel = document.getElementById('draftPlayerSelect');
          sel.innerHTML = '<option value="">-- Selecciona Jugador --</option>';
          players.forEach(function(p) {
            sel.innerHTML += '<option value="' + p.name + '">' + p.name + ' (' + p.realTeam + ' - ' + p.position + ' - ' + p.value + 'M€)</option>';
          });
        })
        .getPlayersForMercado();
    };

    function submitDraft(e) {
      e.preventDefault();
      var team = document.getElementById('draftTeamSelect').value;
      var token = document.getElementById('draftTokenInput').value;
      var player = document.getElementById('draftPlayerSelect').value;
      var status = document.getElementById('draftStatus');

      status.style.display = 'block';
      status.className = 'status-message';
      status.innerText = 'Procesando selección...';

      google.script.run
        .withSuccessHandler(function(res) {
          status.className = 'status-message ' + (res.success ? 'success' : 'error');
          status.innerText = res.message;
        })
        .withFailureHandler(function(err) {
          status.className = 'status-message error';
          status.innerText = 'Error: ' + err.message;
        })
        .processDraftSelection(team, token, player);
    }
  </script>
</body>
</html>`,
  'Fichajes.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Gestión de Fichajes</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>GESTIÓN DE FICHAJES</h1>
    <form id="transferForm" onsubmit="submitTransfer(event);">
      <div class="form-grid">
        <div class="form-group">
          <label for="transferTeamSelect">Equipo</label>
          <select id="transferTeamSelect" required onchange="onTeamChanged();"><option value="">Cargando...</option></select>
        </div>
        <div class="form-group">
          <label for="transferTokenInput">Token de Equipo</label>
          <input type="password" id="transferTokenInput" placeholder="Introduce token" required>
        </div>
        <div class="form-group">
          <label for="transferJornadaSelect">Jornada para el Fichaje</label>
          <select id="transferJornadaSelect" required onchange="onTeamChanged();"></select>
        </div>
      </div>

      <div id="transferRowsContainer" style="margin-top: 20px;"></div>
      <div style="margin: 15px 0;">
        <button type="button" class="btn-primary" onclick="addTransferRow();" style="background:#10b981; color:#fff;">+ Añadir otro cambio</button>
      </div>

      <button type="submit" id="submitTransferBtn">Realizar Fichaje(s)</button>
      <div id="transferStatus" class="status-message" style="display:none;"></div>
    </form>
  </div>

  <script>
    var availablePlayers = [];
    var teamCurrentPlayers = [];

    window.onload = function() {
      google.script.run
        .withSuccessHandler(function(teams) {
          var sel = document.getElementById('transferTeamSelect');
          sel.innerHTML = '<option value="">-- Selecciona Equipo --</option>';
          teams.forEach(function(t) { sel.innerHTML += '<option value="' + t + '">' + t + '</option>'; });
          
          google.script.run
            .withSuccessHandler(function(maxJ) {
              var jSel = document.getElementById('transferJornadaSelect');
              jSel.innerHTML = '';
              for (var i = 1; i <= maxJ + 1; i++) {
                jSel.innerHTML += '<option value="' + i + '"' + (i === maxJ ? ' selected' : '') + '>Jornada ' + i + '</option>';
              }
              addTransferRow();
            })
            .getMaxJornada();
        })
        .getTeamNames();
    };

    function onTeamChanged() {
      var team = document.getElementById('transferTeamSelect').value;
      var jor = document.getElementById('transferJornadaSelect').value;
      if (!team || !jor) return;

      google.script.run
        .withSuccessHandler(function(players) {
          teamCurrentPlayers = players;
          updateDropdowns();
        })
        .getTeamPlayersForJornada(team, jor);

      google.script.run
        .withSuccessHandler(function(avail) {
          availablePlayers = avail;
          updateDropdowns();
        })
        .getPlayersForMercado();
    }

    function addTransferRow() {
      var container = document.getElementById('transferRowsContainer');
      var rowId = 'row_' + Date.now();
      var html = '<div id="' + rowId + '" class="form-grid" style="margin-bottom:12px; background:rgba(0,0,0,0.2); padding:12px; border-radius:8px;">' +
        '<div class="form-group"><label>Jugador que Sale</label><select class="player-out-select" required><option value="">Cargando...</option></select></div>' +
        '<div class="form-group"><label>Jugador que Entra</label><select class="player-in-select" required><option value="">Cargando...</option></select></div>' +
        '<div class="form-group" style="display:flex; align-items:center; gap:8px; padding-top:20px;"><label><input type="checkbox" class="abandon-check"> Abandona Liga (Gratis)</label></div>' +
      '</div>';
      container.insertAdjacentHTML('beforeend', html);
      updateDropdowns();
    }

    function updateDropdowns() {
      document.querySelectorAll('.player-out-select').forEach(function(sel) {
        var currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Selecciona Jugador Saliente --</option>';
        teamCurrentPlayers.forEach(function(p) {
          sel.innerHTML += '<option value="' + p + '"' + (p === currentVal ? ' selected' : '') + '>' + p + '</option>';
        });
      });

      document.querySelectorAll('.player-in-select').forEach(function(sel) {
        var currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Selecciona Jugador Entrante --</option>';
        availablePlayers.forEach(function(p) {
          sel.innerHTML += '<option value="' + p.name + '"' + (p.name === currentVal ? ' selected' : '') + '>' + p.name + ' (' + p.realTeam + ' - ' + p.value + 'M€)</option>';
        });
      });
    }

    function submitTransfer(e) {
      e.preventDefault();
      var team = document.getElementById('transferTeamSelect').value;
      var token = document.getElementById('transferTokenInput').value;
      var jor = document.getElementById('transferJornadaSelect').value;
      var status = document.getElementById('transferStatus');

      var transfers = [];
      document.querySelectorAll('#transferRowsContainer > div').forEach(function(row) {
        var pOut = row.querySelector('.player-out-select').value;
        var pIn = row.querySelector('.player-in-select').value;
        var isAbandon = row.querySelector('.abandon-check').checked;
        if (pOut && pIn) {
          transfers.push({ playerOut: pOut, playerIn: pIn, isAbandonment: isAbandon });
        }
      });

      if (transfers.length === 0) {
        alert('Por favor selecciona los jugadores a sustituir.');
        return;
      }

      status.style.display = 'block';
      status.className = 'status-message';
      status.innerText = 'Procesando fichaje...';

      google.script.run
        .withSuccessHandler(function(res) {
          status.className = 'status-message ' + (res.success ? 'success' : 'error');
          status.innerText = res.message;
        })
        .withFailureHandler(function(err) {
          status.className = 'status-message error';
          status.innerText = 'Error: ' + err.message;
        })
        .processMultipleTransfers(team, token, jor, transfers);
    }
  </script>
</body>
</html>`,
  'Mercado.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Mercado de Jugadores</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>MERCADO DE JUGADORES</h1>
    <div class="selectors">
      <input type="text" id="searchInput" placeholder="Buscar por nombre o club..." onkeyup="filterMarket();" style="max-width:300px;">
      <select id="posFilter" onchange="filterMarket();" style="max-width:200px;">
        <option value="">Todas las Posiciones</option>
        <option value="Portero">Porteros</option>
        <option value="Defensa">Defensas</option>
        <option value="Medio">Centrocampistas</option>
        <option value="Delantero">Delanteros</option>
      </select>
    </div>

    <div class="table-responsive-wrapper">
      <table id="marketTable">
        <thead>
          <tr><th>Posición</th><th>Nombre Jugador</th><th>Equipo Liga</th><th class="numeric-header">Valor</th><th class="numeric-header">Puntos Totales</th><th>Estado</th></tr>
        </thead>
        <tbody id="marketBody">
          <tr><td colspan="6" style="text-align:center;">Cargando mercado...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    var allPlayers = [];

    window.onload = function() {
      google.script.run
        .withSuccessHandler(function(players) {
          allPlayers = players;
          filterMarket();
        })
        .getPlayersForMercado();
    };

    function filterMarket() {
      var search = (document.getElementById('searchInput').value || '').toLowerCase();
      var pos = document.getElementById('posFilter').value;
      var tbody = document.getElementById('marketBody');

      var filtered = allPlayers.filter(function(p) {
        var matchSearch = p.name.toLowerCase().indexOf(search) !== -1 || p.realTeam.toLowerCase().indexOf(search) !== -1;
        var matchPos = !pos || p.position === pos;
        return matchSearch && matchPos;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No se encontraron futbolistas con ese filtro.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(function(p) {
        var posClass = 'pos-' + p.position.toLowerCase();
        return '<tr>' +
          '<td class="' + posClass + '">' + p.position + '</td>' +
          '<td style="font-weight:700;">' + p.name + '</td>' +
          '<td>' + p.realTeam + '</td>' +
          '<td class="numeric-cell">' + p.value + ' M€</td>' +
          '<td class="numeric-cell" style="font-weight:bold; color:var(--primary);">' + p.totalPoints + '</td>' +
          '<td><span style="padding:4px 8px; border-radius:6px; font-size:11px; font-weight:bold; background:' + (p.status === 'Fichado' ? 'rgba(245,158,11,0.2); color:#fbbf24;' : 'rgba(16,185,129,0.2); color:#34d399;') + '">' + p.status + '</span></td>' +
        '</tr>';
      }).join('');
    }
  </script>
</body>
</html>`,
  'Premios.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Contabilidad y Premios de la Liga</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>CONTABILIDAD Y PREMIOS DE LA LIGA</h1>
    
    <div id="accountingSummary" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:16px; margin-bottom:24px;">
      <div style="background:var(--bg-card-elevated); padding:16px; border-radius:12px; border:1px solid var(--border-subtle);">
        <span style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">Total Aportaciones:</span>
        <h3 id="totAportes" style="margin:6px 0 0 0; color:#10b981;">0.00 €</h3>
      </div>
      <div style="background:var(--bg-card-elevated); padding:16px; border-radius:12px; border:1px solid var(--border-subtle);">
        <span style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">Total Fichajes:</span>
        <h3 id="totFichajes" style="margin:6px 0 0 0; color:#3b82f6;">0.00 €</h3>
      </div>
      <div style="background:var(--bg-card-elevated); padding:16px; border-radius:12px; border:1px solid var(--border-subtle);">
        <span style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">Premios Entregados:</span>
        <h3 id="totPremios" style="margin:6px 0 0 0; color:#f43f5e;">0.00 €</h3>
      </div>
      <div style="background:var(--bg-card-elevated); padding:16px; border-radius:12px; border:1px solid var(--border-subtle);">
        <span style="font-size:11px; color:#94a3b8; font-weight:bold; text-transform:uppercase;">Bote Caja Acumulado:</span>
        <h3 id="totCaja" style="margin:6px 0 0 0; color:#f59e0b;">0.00 €</h3>
      </div>
    </div>

    <h2>Balance Actual por Equipo</h2>
    <div class="table-responsive-wrapper">
      <table id="teamBalanceTable">
        <thead>
          <tr><th>Equipo</th><th class="numeric-header">Aportes (€)</th><th class="numeric-header">Coste Fichajes (€)</th><th class="numeric-header">Premios Ganados (€)</th><th class="numeric-header">Balance Regular (€)</th></tr>
        </thead>
        <tbody id="balanceBody">
          <tr><td colspan="5" style="text-align:center;">Cargando balances...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <script>
    window.onload = function() {
      google.script.run
        .withSuccessHandler(function(acc) {
          document.getElementById('totAportes').innerText = acc.totalContributions + ' €';
          document.getElementById('totFichajes').innerText = acc.totalTransferFees + ' €';
          document.getElementById('totPremios').innerText = acc.totalPrizeMoneyAwarded + ' €';
          document.getElementById('totCaja').innerText = acc.finalCajaBeforeFinalPrizes + ' €';

          var tbody = document.getElementById('balanceBody');
          tbody.innerHTML = acc.teamBalanceDetails.map(function(t) {
            var isPos = parseFloat(t.balance) >= 0;
            return '<tr>' +
              '<td style="font-weight:700;">' + t.team + '</td>' +
              '<td class="numeric-cell">' + t.contributions + ' €</td>' +
              '<td class="numeric-cell">' + t.transferFees + ' €</td>' +
              '<td class="numeric-cell" style="color:#10b981; font-weight:bold;">' + t.prizes + ' €</td>' +
              '<td class="numeric-cell" style="font-weight:800; color:' + (isPos ? '#34d399' : '#f87171') + ';">' + t.balance + ' €</td>' +
            '</tr>';
          }).join('');
        })
        .getAccountingData();
    };
  </script>
</body>
</html>`,
  'Graficas.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Gráficas y Estadísticas</title>
  <?!= include('Stylesheet'); ?>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <h1>GRÁFICAS Y ESTADÍSTICAS</h1>
    
    <h2>Puntuaciones por Jornada</h2>
    <div style="background:var(--bg-card-elevated); padding:20px; border-radius:12px; margin-bottom:24px;">
      <canvas id="scoresChart" style="max-height:380px;"></canvas>
    </div>
  </div>

  <script>
    window.onload = function() {
      google.script.run
        .withSuccessHandler(function(data) {
          var ctx = document.getElementById('scoresChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: data.general.map(function(x) { return x.teamName; }),
              datasets: [{
                label: 'Puntos Totales Acumulados',
                data: data.general.map(function(x) { return parseFloat(x.score); }),
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: '#f59e0b',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { labels: { color: '#f8fafc' } } },
              scales: {
                x: { ticks: { color: '#94a3b8' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
              }
            }
          });
        })
        .getAllStandingsData();
    };
  </script>
</body>
</html>`,
  'Admin.html': `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>Panel de Administración</title>
  <?!= include('Stylesheet'); ?>
</head>
<body>
  <div class="container">
    <h1>PANEL DE ADMINISTRACIÓN</h1>
    
    <div id="adminAuth" class="selectors">
      <input type="password" id="adminPass" placeholder="Contraseña de administrador" style="max-width:250px;">
      <button onclick="checkAdmin();">Acceder al Panel</button>
      <span id="authError" style="color:#f87171; font-weight:bold; display:none;">Contraseña incorrecta</span>
    </div>

    <div id="adminContent" style="display:none; margin-top:24px;">
      <h2>Acciones de Gestión</h2>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <button class="btn-primary" onclick="alert('Funciones activas.');">Panel Operativo</button>
      </div>
    </div>
  </div>

  <script>
    function checkAdmin() {
      var pass = document.getElementById('adminPass').value;
      if (pass === 'admin') {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
      } else {
        document.getElementById('authError').style.display = 'inline';
      }
    }
  </script>
</body>
</html>`
};

/**
 * Genera el archivo Código.gs con los valores personalizados inyectados:
 * - Contraseña de Administrador
 * - Primera jornada de aportes
 * - Credenciales de Telegram (Bot Token y Chat ID)
 * - Credenciales de GitHub Actions (Repo y Token)
 * - Parámetros de liga (costes, aportaciones, transferencias)
 */
export function generateCustomGasCode(options?: {
  adminPassword?: string;
  firstContributionJornada?: number;
  githubRepo?: string;
  githubToken?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  maxTeamValue?: number;
  weeklyContribution?: number;
  transferCost?: number;
  freeTransfers?: number;
  customCodeGs?: string;
}): string {
  // Si el usuario guardó un Código.gs editado manualmente y no está vacío, respetarlo
  if (options?.customCodeGs && options.customCodeGs.trim().length > 100) {
    return options.customCodeGs;
  }

  let code = REDESIGNED_CODE_GS;

  if (options?.adminPassword !== undefined && options.adminPassword.trim()) {
    code = code.replace(
      /var ADMIN_PASSWORD = ".*?";/,
      `var ADMIN_PASSWORD = "${options.adminPassword.replace(/"/g, '')}";`
    );
  }

  const j = options?.firstContributionJornada ?? 4;
  code = code.replace(
    /var FIRST_CONTRIBUTION_JORNADA = \d+;/,
    `var FIRST_CONTRIBUTION_JORNADA = ${j};`
  );

  if (options?.maxTeamValue !== undefined) {
    code = code.replace(
      /var MAX_TEAM_VALUE = \d+;/,
      `var MAX_TEAM_VALUE = ${options.maxTeamValue};`
    );
  }

  if (options?.weeklyContribution !== undefined) {
    code = code.replace(
      /var WEEKLY_CONTRIBUTION = [\d.]+;/,
      `var WEEKLY_CONTRIBUTION = ${options.weeklyContribution};`
    );
  }

  if (options?.transferCost !== undefined) {
    code = code.replace(
      /var TRANSFER_COST = [\d.]+;/,
      `var TRANSFER_COST = ${options.transferCost};`
    );
  }

  if (options?.freeTransfers !== undefined) {
    code = code.replace(
      /var FREE_TRANSFERS_PER_TEAM = \d+;/,
      `var FREE_TRANSFERS_PER_TEAM = ${options.freeTransfers};`
    );
  }

  if (options?.githubRepo !== undefined) {
    code = code.replace(
      /var GITHUB_REPO = ".*?";/,
      `var GITHUB_REPO = "${options.githubRepo.replace(/"/g, '')}";`
    );
  }

  if (options?.githubToken !== undefined) {
    code = code.replace(
      /var GITHUB_PAT = ".*?";/,
      `var GITHUB_PAT = "${options.githubToken.replace(/"/g, '')}";`
    );
  }

  if (options?.telegramBotToken !== undefined) {
    code = code.replace(
      /var TELEGRAM_BOT_TOKEN = ".*?";/,
      `var TELEGRAM_BOT_TOKEN = "${options.telegramBotToken.replace(/"/g, '')}";`
    );
  }

  if (options?.telegramChatId !== undefined) {
    code = code.replace(
      /var TELEGRAM_CHAT_ID = ".*?";/,
      `var TELEGRAM_CHAT_ID = "${options.telegramChatId.replace(/"/g, '')}";`
    );
  }

  return code;
}
