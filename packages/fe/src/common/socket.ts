import { io, Socket } from 'socket.io-client';

export default function createSocket() {
  const hostname = location.hostname;
  const url =
    process.env.NODE_ENV === 'production'
      ? '/'
      : `${hostname}:3000`;
  const socket: Socket = io(url, {
    autoConnect: false,
    transports: ['websocket'],
  });

  return socket;
}
