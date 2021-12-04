import { Server } from 'socket.io';
import LRU from 'lru-cache';
import { IncomingMessage } from 'http';
import { createHash } from 'crypto';

const caches = new LRU();

function getIpLimitCountKey(ip: string) {
  return `${ip}/limitCount`;
}

function generateConnectionCode(request: IncomingMessage): string {
  const message = `${Object.values(request.headers).join('-')}-${
    request.socket.remoteAddress
  }-${Date.now()}`;
  const hash = createHash('sha256').update(message).digest();
  const offset = hash.readUInt8(31) & 16;
  return hash.readUInt32BE(offset).toString().slice(-8);
}

const io = new Server({
  transports: ['websocket'],
});

io.on('connection', (socket) => {
  const ip = socket.request.socket.remoteAddress as string;
  // 10 秒内表明身份是遥控器还是显示器，否则断开连接
  const timeoutIdForAuthentication = setTimeout(() => {
    if (socket.connected) {
      socket.disconnect(true);
    }
  }, 10000);

  socket.on('authentication', (data, ack) => {
    if (typeof data !== 'object') {
      // 数据错误
      ack({ ok: false, msg: '数据格式错误' });
      return;
    }

    // 控制器请求连接显示器，显示器请求获取连接码

    if (data.character === 'controller') {
      // 连接为控制器，每分钟仅允许尝试连接 30 次，防止暴力猜连接码

      const key = getIpLimitCountKey(ip);
      const limitCount = caches.get(key) as undefined | number;

      let isBlocked = false;
      if (limitCount === undefined) {
        // 设置缓存
        caches.set(key, 1, 60);
      } else if (limitCount > 30) {
        // 封禁十分钟
        caches.set(key, limitCount + 1, 10 * 60);
        isBlocked = true;
      } else {
        // 增加
        caches.set(key, limitCount + 1);
      }

      if (isBlocked) {
        socket.disconnect(true);
      } else {
        const code = String(data.code);

        if (!/^\d{8}$/.test(code)) {
          ack({ ok: false, msg: '连接码错误' });
          return;
        }

        const room = `room-${code}`;

        // 检查显示器是否存在
        io.to(room)
          .allSockets()
          .then((sockets) => {
            const size = sockets.size;

            if (size === 0) {
              // 不存在
              ack({ ok: false, msg: '该连接码对应的显示器不存在' });
            } else if (size === 2) {
              // 已被连接
              ack({ ok: false, msg: '已有遥控器连接到了该显示器' });
            } else {
              // 连接
              socket.join(room);
              socket.to(room).emit('join', {});

              socket.on('disconnect', () => {
                socket.to(room).emit('leave', {});
              });

              function forward(ev: string, data: any) {
                socket.to(room).emit(ev, data);
              }

              socket.on('updateConfig', (data) =>
                forward('updateConfig', data),
              );
              socket.on('scroll', (data) => forward('scroll', data));
              socket.on('updateContent', (data) =>
                forward('updateContent', data),
              );
              socket.on('switchScrollingStatus', (data) =>
                forward('switchScrollingStatus', data),
              );
              ack({ ok: true });
            }
          });
      }
    } else if (data.character === 'displayer') {
      // 连接为显示器
      // 生成连接码
      if (socket.rooms.size > 1) {
        ack({ ok: false, msg: '已加入房间' });
        return;
      }
      const code = generateConnectionCode(socket.request);
      const room = `room-${code}`;
      socket.join(room);

      socket.on('disconnect', () => {
        socket.to(room).emit('leave', {});
      });

      function forward(ev: string, data: any) {
        socket.to(room).emit(ev, data);
      }

      socket.on('syncConfig', (data) => forward('syncConfig', data));
      ack({ ok: true, data: { code } });
    }

    clearTimeout(timeoutIdForAuthentication);
  });
});

io.listen(3000);
