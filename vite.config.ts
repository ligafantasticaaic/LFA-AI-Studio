import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function gasConfigPlugin(): Plugin {
  const CONFIG_PATH = path.join(process.cwd(), 'gas-config.json');

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
    } catch (e) {}
    return defaults;
  }

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
    } catch (e) {}
    return config;
  }

  return {
    name: 'gas-config-api',
    configureServer(server) {
      server.middlewares.use('/api/gas-config', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(getGasConfig()));
          return;
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const { adminPassword, ...dataToSave } = data;
              if (adminPassword && adminPassword !== 'admin') {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Contraseña incorrecta' }));
                return;
              }
              const saved = saveGasConfig(dataToSave, 'admin');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, config: saved }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }
        next();
      });

      server.middlewares.use('/api/notify-fichaje-test', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { telegramBotToken, telegramChatId, githubRepo, githubToken, testType, sampleData } = JSON.parse(body || '{}');
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
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Falta repositorio de GitHub o Token PAT.' }));
                  return;
                }
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
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: 'Evento repository_dispatch enviado exitosamente a GitHub Actions.' }));
                  return;
                }
                const errText = await ghResp.text();
                res.statusCode = ghResp.status;
                res.end(JSON.stringify({ error: `GitHub respondió ${ghResp.status}: ${errText}` }));
                return;
              }

              // Telegram direct test
              if (!telegramBotToken || !telegramChatId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Falta Bot Token de Telegram o Chat ID del grupo.' }));
                return;
              }

              const message = `🚨 *¡PRUEBA DE FICHAJE EN LA LIGA FANTÁSTICA!* ⚽\n━━━━━━━━━━━━━━━━━━━━\n🏟 *Equipo:* ${sample.equipo}\n🟢 *Alta:* ${sample.jugadorEntra}\n🔴 *Baja:* ${sample.jugadorSale}\n💰 *Coste:* ${sample.coste} €\n📅 *Jornada:* J${sample.jornada}\n📝 *Tipo:* ${sample.tipo}\n━━━━━━━━━━━━━━━━━━━━\n✅ _Conexión Apps Script / Telegram verificada correctamente._`;

              const tgResp = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: telegramChatId.trim(),
                  text: message,
                  parse_mode: 'Markdown'
                })
              });

              const tgData = await tgResp.json() as any;
              res.setHeader('Content-Type', 'application/json');
              if (tgData.ok) {
                res.end(JSON.stringify({ success: true, message: '¡Mensaje de prueba enviado con éxito al grupo de Telegram!' }));
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: `Telegram error (${tgData.error_code}): ${tgData.description}` }));
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: `Error al procesar: ${err.message}` }));
            }
          });
          return;
        }
        next();
      });

      server.middlewares.use('/api/health', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), gasConfigPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
