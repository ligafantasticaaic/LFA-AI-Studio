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
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.gasUrl === 'string') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading gas-config.json:', e);
    }
    return {
      gasUrl: process.env.GAS_WEBAPP_URL || '',
      updatedAt: null,
      updatedBy: 'system'
    };
  }

  // Helper to persist GAS configuration
  function saveGasConfig(gasUrl: string, updatedBy = 'admin') {
    const cleanUrl = (gasUrl || '').trim();
    const config = {
      gasUrl: cleanUrl,
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

  // GET current centralized Google Apps Script Web App URL
  app.get('/api/gas-config', (req, res) => {
    const config = getGasConfig();
    res.json(config);
  });

  // POST update Google Apps Script Web App URL by admin
  app.post('/api/gas-config', (req, res) => {
    const { gasUrl, adminPassword } = req.body || {};
    if (adminPassword && adminPassword !== 'admin') {
      return res.status(401).json({ error: 'Contraseña de administrador incorrecta' });
    }
    if (typeof gasUrl !== 'string') {
      return res.status(400).json({ error: 'URL no válida' });
    }
    const saved = saveGasConfig(gasUrl, 'admin');
    res.json({ success: true, config: saved });
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
