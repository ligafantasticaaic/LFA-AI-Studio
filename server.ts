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
      gasUrl: process.env.GAS_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbzcX9D9Y4xMbPB8FCimSeAeovjoQxDFkrpmZOO231MWSV0zqIliCq5drohxPiVJ53C-AA/exec',
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
      firstContributionJornada: 4,
      teams: [
        'BRIKKOMARIAN',
        'DOVIS',
        'FREDERER',
        'LA AUDINETA',
        'MERENDOLO',
        'PLAYA DE CUEVA'
      ],
      tokens: [
        { team: 'BRIKKOMARIAN', token: 'a81e9f12-4c22-44b2-9d21-9128aa90c811' },
        { team: 'DOVIS', token: 'b73d8a45-5e33-41c3-8e32-8239bb01d922' },
        { team: 'FREDERER', token: 'c64e7b56-6f44-42d4-9f43-7340cc12e033' },
        { team: 'LA AUDINETA', token: 'd55f6c67-7a55-43e5-af54-6451dd23f144' },
        { team: 'MERENDOLO', token: 'e46a5d78-8b66-44f6-b065-5562ee34a255' },
        { team: 'PLAYA DE CUEVA', token: 'f37b4e89-9c77-45a7-c176-4673ff45b366' }
      ],
      customClubStyles: [],
      notificationConfig: {
        githubRepo: '',
        githubToken: '',
        telegramBotToken: '',
        telegramChatId: '',
        directTelegram: false
      },
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
            adminPassword: parsed.adminPassword ? String(parsed.adminPassword).trim() : defaults.adminPassword,
            leagueTexts: {
              ...defaults.leagueTexts,
              ...(parsed.leagueTexts || {})
            },
            customCodeGs: typeof parsed.customCodeGs === 'string' ? parsed.customCodeGs : defaults.customCodeGs,
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
      gasUrl: (newValues.gasUrl !== undefined ? newValues.gasUrl : current.gasUrl || '').trim(),
      firstContributionJornada: typeof newValues.firstContributionJornada === 'number'
        ? Math.max(1, Math.min(38, newValues.firstContributionJornada))
        : current.firstContributionJornada || 4,
      customClubStyles: Array.isArray(newValues.customClubStyles)
        ? newValues.customClubStyles
        : current.customClubStyles || [],
      teams: Array.isArray(newValues.teams)
        ? newValues.teams
        : current.teams || [],
      tokens: Array.isArray(newValues.tokens)
        ? newValues.tokens
        : current.tokens || [],
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
      const tgResp = await fetch(`https://api.telegram.org/bot${cleanBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const rawText = await tgResp.text();
      let tgData: any;
      try {
        tgData = JSON.parse(rawText);
      } catch {
        return res.status(400).json({
          error: `Telegram rechazó la petición (HTTP ${tgResp.status}). Comprueba que el Bot Token es exactamente el que te entregó @BotFather y no tiene espacios ni caracteres extraños.`
        });
      }

      if (tgData && tgData.ok) {
        return res.json({ success: true, message: '¡Mensaje de prueba enviado con éxito a Telegram!' });
      }

      const desc = tgData?.description || 'Error desconocido de Telegram';
      if (desc.includes('chat not found')) {
        return res.status(400).json({
          error: `Chat no encontrado (${cleanChatId}). Asegúrate de haber iniciado conversación con el bot en Telegram o de haber añadido al bot como miembro/admin en tu grupo.`
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
