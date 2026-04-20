process.on('uncaughtException', (err) => {
  console.error('[CRITICAL_CRASH]', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED_REJECTION]', reason);
});

console.log('--- SERVER_BOOT_SEQUENCE_STARTED ---');

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`[BOOT] Directory: ${__dirname}`);

const app = express();
const PORT = process.env.PORT || 8080; // Use Cloud Run provided port or default to 8080

// Serve static files
const distPath = path.resolve(__dirname, 'dist');
console.log(`[BOOT] Looking for assets at: ${distPath}`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('[BOOT] Static serving enabled.');
}

app.get('/api/health', (req, res) => res.status(200).send('OK'));

app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>Server Active</h1><p>Building assets...</p>');
  }
});

import { WebSocketServer } from 'ws';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Initial State
let gates = [
  { id: 1, name: 'Gate 1', desc: 'North Main', status: 'Open', color: 'blue', wait: '3m', rate: 42, fill: 62, count: 3240 },
  { id: 2, name: 'Gate 2', desc: 'North East', status: 'Critical', color: 'red', wait: '11m', rate: 28, fill: 87, count: 4524 },
  { id: 3, name: 'Gate 3', desc: 'East Upper', status: 'Warning', color: 'amber', wait: '8m', rate: 31, fill: 83, count: 4316 },
  { id: 4, name: 'Gate 4', desc: 'South East', status: 'Open', color: 'blue', wait: '2m', rate: 55, fill: 38, count: 1976 },
  { id: 5, name: 'Gate 5', desc: 'South Main', status: 'Warning', color: 'amber', wait: '6m', rate: 38, fill: 71, count: 3692 },
  { id: 6, name: 'Gate 6', desc: 'South West', status: 'Critical', color: 'red', wait: '14m', rate: 19, fill: 91, count: 4732 },
  { id: 7, name: 'Gate 7', desc: 'West Lower', status: 'Open', color: 'blue', wait: '1m', rate: 61, fill: 33, count: 1716 },
  { id: 8, name: 'Gate 8', desc: 'North West', status: 'Open', color: 'blue', wait: '4m', rate: 44, fill: 58, count: 3016 },
];

let venue = { status: 'ACTIVE' };
let settings = { theme: 'dark', timezone: 'UTC+5:30' };

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  
  // Send initial state
  ws.send(JSON.stringify({
    type: 'INIT',
    payload: {
      gates,
      venue,
      settings,
      incidents: [], // Add mock incidents if needed
      alerts: { threshold: 85, pushEnabled: true, smsEnabled: true },
      flowData: [
        { time: '14:00', G1: 800, G2: 1200, G3: 1500, G4: 900, G5: 1100, G6: 1800, G7: 700, G8: 1000 },
        { time: '15:00', G1: 1500, G2: 2100, G3: 2400, G4: 1700, G5: 1900, G6: 3200, G7: 1300, G8: 1800 },
        { time: '16:00', G1: 2200, G2: 3200, G3: 3100, G4: 2500, G5: 2800, G6: 4500, G7: 2100, G8: 2600 },
        { time: '17:00', G1: 2800, G2: 4100, G3: 3800, G4: 3100, G5: 3500, G6: 5200, G7: 2900, G8: 3400 },
        { time: '18:00', G1: 3240, G2: 4524, G3: 4316, G4: 3800, G5: 4100, G6: 4732, G7: 3500, G8: 4000 },
      ]
    }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`[WS] Action: ${data.action}`);
      
      switch (data.action) {
        case 'EVACUATE':
          venue.status = 'EVACUATION_ACTIVE';
          broadcast({ type: 'VENUE_UPDATE', payload: venue });
          break;
        case 'CANCEL_EVACUATION':
          venue.status = 'ACTIVE';
          broadcast({ type: 'VENUE_UPDATE', payload: venue });
          break;
        case 'UPDATE_SETTINGS':
          settings = { ...settings, ...data.data };
          broadcast({ type: 'SETTINGS_UPDATE', payload: settings });
          break;
      }
    } catch (e) {
      console.error('[WS] Message error:', e);
    }
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

// Simulating live data updates
setInterval(() => {
  gates = gates.map(g => ({
    ...g,
    fill: Math.max(10, Math.min(98, g.fill + (Math.random() * 4 - 2))),
    rate: Math.max(5, Math.min(80, Math.round(g.rate + (Math.random() * 6 - 3))))
  }));
  broadcast({ type: 'GATES_UPDATE', payload: gates });
}, 5000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 STADIUM_FLOW_STABLE_SERVER_ON_PORT_${PORT}`);
});
