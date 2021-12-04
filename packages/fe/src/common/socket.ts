import { io, Socket } from 'socket.io-client';

export default function createSocket() {
  const search = new URLSearchParams(location.search);
  const url =
    process.env.NODE_ENV === 'production'
      ? '/'
      : (search.get('mobile') === '1' ? 'ws://192.168.0.101:3000' : 'ws://localhost:3000');
  const socket: Socket = io(url, {
    autoConnect: false,
    transports: ['websocket'],
  });

  return socket;
}
