import { WebSocketServer } from 'ws';
import type {Shape} from "@repo/types";

interface RoomType {
    roomId: string,
    shapes: Shape[]
}

const wss = new WebSocketServer({ port: 8080 });

const room: RoomType[] = [];


// Below is boilerplate code
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});