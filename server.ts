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
      gasUrl: process.env.GAS_WEBAPP_URL || '',
      firstContributionJornada: 4,
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
    const config = {
      ...current,
      ...newValues,
      gasUrl: (newValues.gasUrl !== undefined ? newValues.gasUrl : current.gasUrl || '').trim(),
      firstContributionJornada: typeof newValues.firstContributionJornada === 'number'
        ? Math.max(1, Math.min(38, newValues.firstContributionJornada))
        : current.firstContributionJornada || 4,
      customClubStyles: Array.isArray(newValues.customClubStyles)
        ? newValues.customClubStyles
        : current.customClubStyles || [],
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
    const { adminPassword, ...dataToSave } = req.body || {};
    if (adminPassword && adminPassword !== 'admin') {
      return res.status(401).json({ error: 'Contraseña de administrador incorrecta' });
    }
    const saved = saveGasConfig(dataToSave, 'admin');
    res.json({ success: true, config: saved });
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
    if (!telegramBotToken || !telegramChatId) {
      return res.status(400).json({ error: 'Falta Bot Token de Telegram o Chat ID del grupo.' });
    }

    const message = `🚨 *¡PRUEBA DE FICHAJE EN LA LIGA FANTÁSTICA!* ⚽\n━━━━━━━━━━━━━━━━━━━━\n🏟 *Equipo:* ${sample.equipo}\n🟢 *Alta:* ${sample.jugadorEntra}\n🔴 *Baja:* ${sample.jugadorSale}\n💰 *Coste:* ${sample.coste} €\n📅 *Jornada:* J${sample.jornada}\n📝 *Tipo:* ${sample.tipo}\n━━━━━━━━━━━━━━━━━━━━\n✅ _Conexión Apps Script / Telegram verificada correctamente._`;

    try {
      const tgResp = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId.trim(),
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const tgData = await tgResp.json();
      if (tgData.ok) {
        return res.json({ success: true, message: '¡Mensaje de prueba enviado con éxito al grupo de Telegram!' });
      }
      return res.status(400).json({ error: `Telegram error (${tgData.error_code}): ${tgData.description}` });
    } catch (err: any) {
      return res.status(500).json({ error: `Error al enviar a Telegram: ${err.message}` });
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
