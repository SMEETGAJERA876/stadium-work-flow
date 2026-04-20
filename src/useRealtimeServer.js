// ─────────────────────────────────────────────────────
// useRealtimeServer.js — WebSocket hook for StadiumFlow
// ─────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS_URL = window.location.hostname === 'localhost' ? 'ws://localhost:3001' : `${protocol}//${window.location.host}`;

export function useRealtimeServer() {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gates, setGates] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [venue, setVenue] = useState({ status: 'ACTIVE' });
  const [alerts, setAlerts] = useState({ threshold: 85, pushEnabled: true, smsEnabled: true });
  const [settings, setSettings] = useState({ theme: 'dark', timezone: 'UTC+5:30' });
  const [flowData, setFlowData] = useState([]);

  useEffect(() => {
    let ws;
    let reconnectTimer;

    function connect() {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Connected to StadiumFlow server');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          switch (type) {
            case 'INIT':
              setGates(payload.gates);
              setIncidents(payload.incidents);
              setVenue(payload.venue);
              setAlerts(payload.alerts);
              setSettings(payload.settings);
              setFlowData(payload.flowData || []);
              break;
            case 'GATES_UPDATE':
              setGates(payload);
              break;
            case 'INCIDENTS_UPDATE':
              setIncidents(payload);
              break;
            case 'INCIDENT_NEW':
              setIncidents((prev) => [payload, ...prev]);
              break;
            case 'VENUE_UPDATE':
              setVenue(payload);
              break;
            case 'ALERTS_UPDATE':
              setAlerts(payload);
              break;
            case 'SETTINGS_UPDATE':
              setSettings(payload);
              break;
            case 'FLOW_UPDATE':
              setFlowData(payload);
              break;
          }
        } catch (e) {
          console.error('[WS] Parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('[WS] Disconnected. Reconnecting in 2s...');
        setConnected(false);
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  const send = useCallback((action, data = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...data }));
    }
  }, []);

  return { connected, gates, incidents, venue, alerts, settings, flowData, send };
}
