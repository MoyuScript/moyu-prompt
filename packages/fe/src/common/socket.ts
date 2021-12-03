import { io, Socket } from 'socket.io-client';

export default function createSocket() {
  const url =
    process.env.NODE_ENV === 'production'
      ? '/socket.io/'
      : 'ws://localhost:3000';
  const socket: Socket = io(url, {
    autoConnect: false,
    transports: ['websocket'],
  });

  return socket;
}
