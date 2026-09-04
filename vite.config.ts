import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function gasConfigPlugin(): Plugin {
  const CONFIG_PATH = path.join(process.cwd(), 'gas-config.json');

  function getGasConfig() {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.gasUrl === 'string') {
          return parsed;
        }
      }
    } catch (e) {}
    return {
      gasUrl: process.env.GAS_WEBAPP_URL || '',
      updatedAt: null,
      updatedBy: 'system'
    };
  }

  function saveGasConfig(gasUrl: string) {
    const config = {
      gasUrl: (gasUrl || '').trim(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
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
              const saved = saveGasConfig(data.gasUrl || '');
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
