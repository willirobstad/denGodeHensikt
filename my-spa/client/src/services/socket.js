// Open a WebSocket connection to the backend and call onUpdate
// whenever a live price event arrives from Twelve Data
export function connectSocket(onUpdate) {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${location.host}`);

  ws.onopen    = () => console.log('Live prices connected');
  ws.onclose   = () => console.warn('Live prices disconnected');
  ws.onerror   = (e) => console.error('WebSocket error', e);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event === 'price') onUpdate(data);
    } catch (_) {}
  };

  return ws;
}
