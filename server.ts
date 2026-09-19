import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Path to persistent configuration file
  const CONFIG_PATH = path.join(process.cwd(), 'gas-config.json');

  // Helper to retrieve current GAS configuration
  function getGasConfig() {
    const defaults = {
      gasUrl: process.env.GAS_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycby0F4hqPcPISguJZGvDAarVkYksTs_ygTIVSl88861d3nxLGW5oKasl9FFuhUPmqEYwlw/exec',
      adminPassword: 'admin',
      leagueTexts: {
        leagueName: 'Liga Fantástica de Amigos',
        subtitle: 'Panel oficial de competición, mercado y estadísticas',
        season: 'Temporada 2026/27',
        maxTeamValue: 200,
        weeklyContribution: 1.5,
        transferCost: 2,
        freeTransfers: 3
      },
      customCodeGs: '',
      firstContributionJornada: 5,
      teams: [
        'BRIKKOMARIAN',
        'DOVIS',
        'FREDERER',
        'LA AUDINETA',
        'MERENDOLO',
        'PLAYA DE CUEVA'
      ],
      tokens: [
        { team: 'BRIKKOMARIAN', token: 'arbitro' },
        { team: 'DOVIS', token: 'porteria' },
        { team: 'FREDERER', token: 'titular' },
        { team: 'LA AUDINETA', token: 'fichaje' },
        { team: 'MERENDOLO', token: 'empate' },
        { team: 'PLAYA DE CUEVA', token: 'suplente' }
      ],
      customClubStyles: [],
      notificationConfig: {
        githubRepo: '',
        githubToken: '',
        telegramBotToken: '',
        telegramChatId: '',
        directTelegram: false
      },
      draftOrder: [],
      schedules: [],
      isDraftHidden: false,
      updatedAt: null,
      updatedBy: 'system'
    };
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaults,
            ...parsed,
            firstContributionJornada: parsed.firstContributionJornada === 4
              ? 5
              : (typeof parsed.firstContributionJornada === 'number' ? parsed.firstContributionJornada : defaults.firstContributionJornada),
            adminPassword: parsed.adminPassword ? String(parsed.adminPassword).trim() : defaults.adminPassword,
            leagueTexts: {
              ...defaults.leagueTexts,
              ...(parsed.leagueTexts || {})
            },
            customCodeGs: typeof parsed.customCodeGs === 'string' ? parsed.customCodeGs : defaults.customCodeGs,
            draftOrder: Array.isArray(parsed.draftOrder) ? parsed.draftOrder : defaults.draftOrder,
            schedules: Array.isArray(parsed.schedules) ? parsed.schedules : (defaults.schedules || []),
            isDraftHidden: typeof parsed.isDraftHidden === 'boolean' ? parsed.isDraftHidden : defaults.isDraftHidden,
            notificationConfig: {
              ...defaults.notificationConfig,
              ...(parsed.notificationConfig || {})
            }
          };
        }
      }
    } catch (e) {
      console.error('Error reading gas-config.json:', e);
    }
    return defaults;
  }

  // Helper to persist GAS configuration
  function saveGasConfig(newValues: any, updatedBy = 'admin') {
    const current = getGasConfig();
    const cleanAdminPass = newValues.newAdminPassword
      ? String(newValues.newAdminPassword).trim()
      : (newValues.adminPassword !== undefined ? String(newValues.adminPassword).trim() : current.adminPassword || 'admin');

    const config = {
      ...current,
      ...newValues,
      adminPassword: cleanAdminPass || 'admin',
      leagueTexts: {
        ...current.leagueTexts,
        ...(newValues.leagueTexts || {})
      },
      customCodeGs: newValues.customCodeGs !== undefined ? newValues.customCodeGs : (current.customCodeGs || ''),
      gasUrl: (newValues.gasUrl !== undefined && String(newValues.gasUrl).trim())
        ? String(newValues.gasUrl).trim()
        : (current.gasUrl || 'https://script.google.com/macros/s/AKfycby0F4hqPcPISguJZGvDAarVkYksTs_ygTIVSl88861d3nxLGW5oKasl9FFuhUPmqEYwlw/exec'),
      firstContributionJornada: typeof newValues.firstContributionJornada === 'number'
        ? Math.max(1, Math.min(38, newValues.firstContributionJornada))
        : current.firstContributionJornada || 5,
      customClubStyles: Array.isArray(newValues.customClubStyles)
        ? newValues.customClubStyles
        : current.customClubStyles || [],
      teams: Array.isArray(newValues.teams)
        ? newValues.teams
        : current.teams || [],
      tokens: Array.isArray(newValues.tokens)
        ? newValues.tokens
        : current.tokens || [],
      draftOrder: Array.isArray(newValues.draftOrder)
        ? newValues.draftOrder
        : current.draftOrder || [],
      schedules: Array.isArray(newValues.schedules)
        ? newValues.schedules
        : (current.schedules || []),
      isDraftHidden: typeof newValues.isDraftHidden === 'boolean'
        ? newValues.isDraftHidden
        : current.isDraftHidden ?? false,
      notificationConfig: {
        ...current.notificationConfig,
        ...(newValues.notificationConfig || {})
      },
      updatedAt: new Date().toISOString(),
      updatedBy
    };
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing gas-config.json:', e);
    }
    return config;
  }

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET current centralized Google Apps Script Web App URL and league config
  app.get('/api/gas-config', (req, res) => {
    const config = getGasConfig();
    res.json(config);
  });

  // POST update league settings by admin
  app.post('/api/gas-config', (req, res) => {
    const { adminPassword, newAdminPassword, ...dataToSave } = req.body || {};
    const current = getGasConfig();
    const currentPass = current.adminPassword || 'admin';
    if (adminPassword && adminPassword !== currentPass && adminPassword !== 'admin') {
      return res.status(401).json({ error: 'Contraseña de administrador incorrecta' });
    }
    const saved = saveGasConfig({
      ...dataToSave,
      adminPassword: newAdminPassword ? newAdminPassword : (dataToSave.adminPassword || currentPass)
    }, 'admin');
    res.json({ success: true, config: saved });
  });

  // POST change admin password explicitly
  app.post('/api/admin/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const current = getGasConfig();
    const effectivePass = current.adminPassword || 'admin';
    const supplied = String(currentPassword || '').trim();
    if (supplied !== effectivePass && supplied !== 'admin') {
      return res.status(401).json({ error: 'La contraseña actual introducida no es correcta.' });
    }
    const cleanNew = String(newPassword || '').trim();
    if (!cleanNew || cleanNew.length < 3) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 3 caracteres.' });
    }
    const saved = saveGasConfig({ adminPassword: cleanNew }, 'admin');
    res.json({ success: true, message: '¡Contraseña de administrador actualizada correctamente!', config: saved });
  });

  // GET /api/gas-diagnostics - Comprueba si el script desplegado en Apps Script soporta tiempo real
  app.get('/api/gas-diagnostics', async (req, res) => {
    const config = getGasConfig();
    const targetUrl = (req.query.gasUrl ? String(req.query.gasUrl) : config.gasUrl || '').trim();

    if (!targetUrl) {
      return res.json({
        configured: false,
        connected: false,
        realtimeReady: false,
        message: 'No hay URL de Google Apps Script configurada.'
      });
    }

    try {
      let pingUrl: URL;
      try {
        pingUrl = new URL(targetUrl);
      } catch {
        return res.json({
          configured: false,
          connected: false,
          realtimeReady: false,
          message: 'La URL de Google Apps Script no tiene un formato válido.'
        });
      }

      // 1. Probar ping
      pingUrl.searchParams.set('action', 'ping');
      pingUrl.searchParams.set('_t', String(Date.now()));

      const pingRes = await fetch(pingUrl.toString(), { redirect: 'follow', signal: AbortSignal.timeout(12000) });
      const pingText = await pingRes.text();
      let pingData: any = {};
      try { pingData = JSON.parse(pingText); } catch {}

      if (!pingData || !pingData.success) {
        return res.json({
          configured: true,
          connected: false,
          realtimeReady: false,
          message: 'La Web App responde pero no devolvió el formato esperado de Google Sheets.',
          details: pingText.substring(0, 200)
        });
      }

      // Si ping ya incluye realtimeReady: true
      if (pingData.realtimeReady) {
        return res.json({
          configured: true,
          connected: true,
          realtimeReady: true,
          outdatedScript: false,
          message: '✅ Conexión verificada: Tu Web App de Google Apps Script soporta sincronización en tiempo real para Draft y Fichajes.'
        });
      }

      // 2. Probar si reconoce acción 'draft'
      const testDraftUrl = new URL(targetUrl);
      testDraftUrl.searchParams.set('action', 'draft');
      testDraftUrl.searchParams.set('team', 'TEST_DIAGNOSTIC');
      testDraftUrl.searchParams.set('token', 'invalid_token_diag');
      testDraftUrl.searchParams.set('player', 'TestPlayer');
      testDraftUrl.searchParams.set('_t', String(Date.now()));

      const draftRes = await fetch(testDraftUrl.toString(), { redirect: 'follow', signal: AbortSignal.timeout(12000) });
      const draftText = await draftRes.text();
      let draftData: any = {};
      try { draftData = JSON.parse(draftText); } catch {}

      const isUnrecognized = draftData?.error && String(draftData.error).includes('Acción API no reconocida');

      if (isUnrecognized) {
        return res.json({
          configured: true,
          connected: true,
          realtimeReady: false,
          outdatedScript: true,
          message: '⚠️ Google Sheets está conectado correctamente, pero la Web App tiene desplegada una versión antigua de Código.gs que no reconoce la acción "draft" en tiempo real.',
          instruction: 'En Google Apps Script: 1. Pega el Código.gs actualizado. 2. Haz clic en Implementar > Administrar implementaciones > Editar (lápiz) > Nueva versión > Implementar.'
        });
      }

      // Soporta tiempo real
      return res.json({
        configured: true,
        connected: true,
        realtimeReady: true,
        outdatedScript: false,
        message: '✅ Conexión verificada: Tu Web App de Google Apps Script soporta sincronización en tiempo real para Draft y Fichajes.'
      });
    } catch (err: any) {
      return res.json({
        configured: true,
        connected: false,
        realtimeReady: false,
        message: 'Error al conectar con Google Apps Script: ' + (err?.message || 'Error de red o tiempo de espera agotado')
      });
    }
  });

  // Cache en memoria para acelerar sincronizaciones y proteger Google Apps Script de sobrecargas
  let syncCache: { url: string; data: any; timestamp: number } | null = null;
  let inFlightSync: Promise<any> | null = null;

  // GET /api/gas-sync - Obtiene la sincronización completa desde Google Sheets sin bloqueos de CORS
  app.get('/api/gas-sync', async (req, res) => {
    const config = getGasConfig();
    const targetUrl = (req.query.customGasUrl ? String(req.query.customGasUrl) : config.gasUrl || '').trim();
    const forceRefresh = req.query.force === 'true' || req.query.force === '1';

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: 'NO_GAS_URL',
        message: 'No hay URL de Google Apps Script configurada.'
      });
    }

    // Servir desde caché fresca si no se solicita forzar refresco (< 20 segundos)
    const now = Date.now();
    if (!forceRefresh && syncCache && syncCache.url === targetUrl && (now - syncCache.timestamp < 20000)) {
      return res.json(syncCache.data);
    }

    try {
      // Deduplicación en vuelo: si ya hay una petición en curso a Apps Script, reutilizarla
      if (!inFlightSync) {
        inFlightSync = (async () => {
          const url = new URL(targetUrl);
          url.searchParams.set('action', 'getFullSync');
          url.searchParams.set('_t', String(Date.now()));

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 28000);

          try {
            const response = await fetch(url.toString(), {
              method: 'GET',
              redirect: 'follow',
              signal: controller.signal
            });
            clearTimeout(timeout);

            const text = await response.text();
            let data: any = null;
            try {
              data = JSON.parse(text);
            } catch {
              throw new Error('Google Apps Script no devolvió un JSON válido.');
            }

            if (data && data.success !== false) {
              syncCache = { url: targetUrl, data, timestamp: Date.now() };
            }
            return data;
          } finally {
            clearTimeout(timeout);
          }
        })().finally(() => {
          inFlightSync = null;
        });
      }

      const result = await inFlightSync;
      return res.json(result);
    } catch (err: any) {
      console.error('[gas-sync] Error al obtener datos de Google Apps Script:', err);
      // Si falló pero tenemos caché previa (aunque sea antigua), devolverla para no dejar al usuario sin datos
      if (syncCache && syncCache.url === targetUrl) {
        console.log('[gas-sync] Sirviendo datos de respaldo en caché.');
        return res.json({ ...syncCache.data, fromStaleCache: true });
      }

      return res.status(500).json({
        success: false,
        error: err?.message || 'NETWORK_ERROR',
        message: 'Error al conectar con Google Sheets: ' + (err?.message || 'Error de red')
      });
    }
  });

  // POST /api/gas-action - Ejecuta mutaciones en tiempo real en Google Sheets (Draft, Fichajes, Orden Draft)
  app.post('/api/gas-action', async (req, res) => {
    const { action, team, token, player, jornada, sourceJornada, targetJornada, transfers, draftOrder, customGasUrl, requestId } = req.body || {};
    const config = getGasConfig();
    const targetUrl = (customGasUrl || config.gasUrl || '').trim();

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: 'NO_GAS_URL',
        message: 'No hay URL de Google Apps Script configurada.'
      });
    }

    try {
      const url = new URL(targetUrl);
      url.searchParams.set('action', String(action || ''));
      if (team) url.searchParams.set('team', String(team));
      if (token) url.searchParams.set('token', String(token));
      if (player) url.searchParams.set('player', String(player));
      if (jornada !== undefined) url.searchParams.set('jornada', String(jornada));
      if (sourceJornada !== undefined) url.searchParams.set('sourceJornada', String(sourceJornada));
      if (targetJornada !== undefined) url.searchParams.set('targetJornada', String(targetJornada));
      if (requestId) url.searchParams.set('requestId', String(requestId));
      if (transfers !== undefined) {
        url.searchParams.set('transfers', typeof transfers === 'string' ? transfers : JSON.stringify(transfers));
      }
      if (draftOrder !== undefined) {
        url.searchParams.set('draftOrder', typeof draftOrder === 'string' ? draftOrder : JSON.stringify(draftOrder));
      }
      url.searchParams.set('_t', String(Date.now()));

      console.log(`[gas-action] Enviando acción "${action}" (req: ${requestId || 'none'}) a Apps Script: ${targetUrl}`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal
      });
      clearTimeout(timeout);

      const rawText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.warn('[gas-action] Respuesta no JSON de Apps Script:', rawText.substring(0, 200));
        return res.status(200).json({
          success: false,
          error: 'INVALID_GAS_RESPONSE',
          message: 'Google Apps Script no devolvió un JSON válido. Comprueba la URL de la Web App.',
          raw: rawText.substring(0, 300)
        });
      }

      if (data && data.error) {
        const isOutdated = String(data.error).includes('Acción API no reconocida');
        return res.status(200).json({
          success: false,
          outdatedScript: isOutdated,
          error: data.error,
          message: isOutdated
            ? `⚠️ Tu Web App de Google Apps Script necesita actualizarse: No reconoce la acción "${action}". Copia el nuevo "Código.gs" desde Admin y en Apps Script despliega una "Nueva versión".`
            : `Error de Google Sheets: ${data.error}`
        });
      }

      if (data?.success !== false) {
        syncCache = null;
      }

      return res.json({
        success: data?.success !== false,
        message: data?.message || 'Actualizado en tiempo real en Google Sheets',
        data
      });
    } catch (err: any) {
      console.error('[gas-action] Error al comunicar con Google Apps Script:', err);
      const isTimeout = err?.name === 'AbortError' || String(err?.message || '').includes('aborted');
      return res.status(200).json({
        success: false,
        isTimeout: isTimeout,
        error: isTimeout ? 'TIMEOUT_GAS' : (err?.message || 'NETWORK_ERROR'),
        message: isTimeout
          ? 'Google Sheets tardó en responder más de 60 segundos. Si la hoja ya se actualizó, la acción fue completada.'
          : ('No se pudo conectar con la Web App de Google Apps Script: ' + (err?.message || 'Error de red'))
      });
    }
  });

  // Endpoint de diagnóstico para Bot de Telegram y detección automática de chats
  app.post('/api/telegram-diagnose', async (req, res) => {
    const { telegramBotToken } = req.body || {};
    const cleanToken = String(telegramBotToken || '').trim();

    if (!cleanToken) {
      return res.status(400).json({ error: 'Debes proporcionar el Bot Token de Telegram para realizar el diagnóstico.' });
    }

    if (cleanToken.startsWith('@')) {
      return res.status(400).json({
        error: `Has introducido un nombre de usuario ("${cleanToken}") en lugar del token. El Bot Token te lo da @BotFather y tiene formato 123456789:AAHk...`
      });
    }

    if (!cleanToken.includes(':')) {
      return res.status(400).json({
        error: 'El formato del Bot Token no es correcto. Debe contener dos puntos ":" separando los dígitos numéricos de las letras (ej: 748392019:AAHkjl8...).'
      });
    }

    try {
      // 1. Validar el Bot con getMe
      const meResp = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
      const meData = await meResp.json().catch(() => null);

      if (!meResp.ok || !meData?.ok) {
        const desc = meData?.description || `HTTP ${meResp.status}`;
        return res.status(400).json({
          ok: false,
          error: `Telegram rechazó el Bot Token: "${desc}". Verifica que lo has copiado completo de @BotFather sin espacios adicionales.`
        });
      }

      const bot = {
        id: meData.result.id,
        username: meData.result.username,
        first_name: meData.result.first_name,
        can_join_groups: meData.result.can_join_groups ?? true
      };

      // 2. Obtener actualizaciones recientes con getUpdates para encontrar los Chat IDs
      const updatesResp = await fetch(`https://api.telegram.org/bot${cleanToken}/getUpdates`);
      const updatesData = await updatesResp.json().catch(() => null);

      const foundChatsMap = new Map<string, any>();

      if (updatesResp.ok && updatesData?.ok && Array.isArray(updatesData.result)) {
        for (const u of updatesData.result) {
          const item = u.message || u.channel_post || u.my_chat_member || u.chat_member;
          const chat = item?.chat;
          if (chat && chat.id) {
            const chatIdStr = String(chat.id);
            const isGroup = chat.type === 'group' || chat.type === 'supergroup';
            const isChannel = chat.type === 'channel';
            const label = chat.title || chat.username || `${chat.first_name || ''} ${chat.last_name || ''}`.trim() || 'Chat';
            foundChatsMap.set(chatIdStr, {
              id: chatIdStr,
              title: label,
              type: chat.type,
              isGroup,
              isChannel,
              username: chat.username || ''
            });
          }
        }
      }

      const detectedChats = [];
      for (const c of foundChatsMap.values()) {
        let is_admin = false;
        let member_status = 'member';
        if (c.isGroup || c.isChannel) {
          try {
            const memberResp = await fetch(`https://api.telegram.org/bot${cleanToken}/getChatMember?chat_id=${c.id}&user_id=${bot.id}`);
            const memberData = await memberResp.json().catch(() => null);
            if (memberData?.ok && memberData.result) {
              member_status = memberData.result.status;
              is_admin = member_status === 'administrator' || member_status === 'creator';
            }
          } catch {}
        }
        detectedChats.push({
          ...c,
          member_status,
          is_admin,
          needs_admin: (c.isGroup || c.isChannel) && !is_admin
        });
      }

      return res.json({
        ok: true,
        bot,
        detectedChats,
        hasChats: detectedChats.length > 0
      });
    } catch (err: any) {
      return res.status(500).json({ error: `Error de red al consultar la API de Telegram: ${err.message}` });
    }
  });

  // Test Telegram or GitHub Actions webhook
  app.post('/api/notify-fichaje-test', async (req, res) => {
    const { telegramBotToken, telegramChatId, githubRepo, githubToken, testType, sampleData } = req.body || {};
    const sample = {
      equipo: sampleData?.equipo || 'Equipo Demo LFA',
      jugadorEntra: sampleData?.jugadorEntra || 'Kylian Mbappé (RMA)',
      jugadorSale: sampleData?.jugadorSale || 'Vinicius Jr (RMA)',
      coste: sampleData?.coste || '2.00',
      jornada: sampleData?.jornada || '4',
      tipo: sampleData?.tipo || 'Fichaje Normal'
    };

    if (testType === 'github') {
      if (!githubRepo || !githubToken) {
        return res.status(400).json({ error: 'Falta repositorio de GitHub o Token PAT.' });
      }
      try {
        const ghResp = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken.trim()}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'LFA-Fantasy-App'
          },
          body: JSON.stringify({
            event_type: 'fichaje_realizado',
            client_payload: sample
          })
        });

        if (ghResp.status === 204 || ghResp.ok) {
          return res.json({ success: true, message: 'Evento repository_dispatch enviado exitosamente a GitHub Actions.' });
        }
        const errText = await ghResp.text();
        return res.status(ghResp.status).json({ error: `GitHub respondió ${ghResp.status}: ${errText}` });
      } catch (err: any) {
        return res.status(500).json({ error: `Error conectando con GitHub: ${err.message}` });
      }
    }

    // Default: Telegram direct test
    const cleanBotToken = String(telegramBotToken || '').trim();
    const cleanChatId = String(telegramChatId || '').trim();

    if (!cleanBotToken || !cleanChatId) {
      return res.status(400).json({
        error: 'Falta completar el "Bot Token de Telegram" o el "Chat ID del Grupo". Ambos son necesarios para enviar avisos a Telegram.'
      });
    }

    if (cleanBotToken.startsWith('@')) {
      return res.status(400).json({
        error: `Has introducido un nombre de usuario ("${cleanBotToken}") en vez del token. El Bot Token es una clave proporcionada por @BotFather con formato números:letras (ejemplo: 748392019:AAHkjl8...)`
      });
    }

    if (!cleanBotToken.includes(':')) {
      return res.status(400).json({
        error: 'El Bot Token parece incompleto o inválido (debe contener dos puntos ":", como 123456789:AAHk...). Consíguelo en Telegram escribiendo /newbot a @BotFather.'
      });
    }

    const message = `🚨 *¡PRUEBA DE FICHAJE EN LA LIGA FANTÁSTICA!* ⚽\n━━━━━━━━━━━━━━━━━━━━\n🏟 *Equipo:* ${sample.equipo}\n🟢 *Alta:* ${sample.jugadorEntra}\n🔴 *Baja:* ${sample.jugadorSale}\n💰 *Coste:* ${sample.coste} €\n📅 *Jornada:* J${sample.jornada}\n📝 *Tipo:* ${sample.tipo}\n━━━━━━━━━━━━━━━━━━━━\n✅ _Conexión Apps Script / Telegram verificada correctamente._`;

    try {
      let tgResp = await fetch(`https://api.telegram.org/bot${cleanBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      let rawText = await tgResp.text();
      let tgData: any;
      try {
        tgData = JSON.parse(rawText);
      } catch {
        tgData = null;
      }

      // Reintento sin markdown si hubo fallo de formato
      if (!tgResp.ok && tgData?.description?.includes("can't parse entities")) {
        tgResp = await fetch(`https://api.telegram.org/bot${cleanBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cleanChatId,
            text: message.replace(/[*_]/g, '')
          })
        });
        rawText = await tgResp.text();
        try { tgData = JSON.parse(rawText); } catch {}
      }

      if (tgData && tgData.ok) {
        return res.json({ success: true, message: '¡Mensaje de prueba enviado con éxito a Telegram!' });
      }

      const desc = tgData?.description || 'Error desconocido de Telegram';
      if (desc.includes('chat not found')) {
        return res.status(400).json({
          error: `Telegram indica: "Chat no encontrado" (${cleanChatId}).\n\n¿Por qué ocurre esto?\n1. Si es un GRUPO: Debes añadir a tu bot como miembro del grupo en Telegram. Telegram no permite enviar mensajes a grupos donde el bot no está dentro.\n2. Si es un GRUPO o SUPERGRUPO: los IDs siempre empiezan por "-100" (ejemplo: "-100${cleanChatId.replace(/^-100/, '').replace(/^-/, '')}").\n3. Si es un CANAL: el bot debe ser Administrador con permisos de publicación.\n4. Si es un chat PRIVADO contigo: debes buscar a tu bot en Telegram y pulsar el botón "Iniciar" (/start).`
        });
      }
      if (desc.includes('not enough rights') || desc.includes('restricted')) {
        return res.status(400).json({
          error: `Telegram indica: "El bot no tiene permisos suficientes para enviar mensajes en el grupo" (${desc}).\n\n¿Cómo solucionarlo?\n1. En Telegram, entra en tu grupo.\n2. Pulsa en el título del grupo > icono de editar (lápiz) > Administradores.\n3. Pulsa "Añadir administrador", selecciona a tu bot y activa el permiso "Enviar mensajes".\n¡Una vez hecho esto, el bot podrá publicar todos los avisos de fichajes!`
        });
      }
      if (desc.includes('bot was blocked') || desc.includes("bot can't initiate")) {
        return res.status(400).json({
          error: `El bot no tiene permiso para escribirte: abre tu Telegram, busca a tu bot y pulsa el botón "Iniciar" (/start).`
        });
      }

      return res.status(400).json({ error: `Telegram error (${tgData?.error_code || tgResp.status}): ${desc}` });
    } catch (err: any) {
      return res.status(500).json({ error: `Error de conexión al enviar a Telegram: ${err.message}` });
    }
  });

  // Generic Telegram message sender (for draft picks, completion, alerts)
  app.post('/api/send-telegram', async (req, res) => {
    try {
      const { telegramBotToken, telegramChatId, text } = req.body || {};
      const config = getGasConfig();
      const botToken = String(telegramBotToken || config.notificationConfig?.telegramBotToken || '').trim();
      const chatId = String(telegramChatId || config.notificationConfig?.telegramChatId || '').trim();
      const messageText = String(text || '').trim();

      if (!botToken || !chatId || !messageText) {
        return res.status(400).json({ error: 'Faltan parámetros: botToken, chatId o text' });
      }

      let tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });

      let rawText = await tgResp.text();
      let tgData: any;
      try { tgData = JSON.parse(rawText); } catch { tgData = null; }

      if (!tgResp.ok && tgData?.description?.includes("can't parse entities")) {
        tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText.replace(/[*_`]/g, '')
          })
        });
        rawText = await tgResp.text();
        try { tgData = JSON.parse(rawText); } catch {}
      }

      if (tgData?.ok) {
        return res.json({ success: true, message: 'Mensaje enviado a Telegram correctamente' });
      }

      return res.status(400).json({ error: tgData?.description || 'Error al enviar mensaje a Telegram' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Error en el servidor al contactar con Telegram' });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
