// Open a WebSocket connection to the backend and call onUpdate
// whenever a fresh quote snapshot arrives from the server.
export function connectSocket(onUpdate) {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${location.host}`);

  ws.onopen    = () => console.log('Live prices connected');
  ws.onclose   = () => console.warn('Live prices disconnected');
  ws.onerror   = (e) => console.error('WebSocket error', e);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event === 'snapshot') onUpdate(data);
    } catch (_) {}
  };

  return ws;
}
