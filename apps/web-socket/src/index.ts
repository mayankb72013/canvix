import { WebSocket, WebSocketServer } from 'ws';
import type { RoomType, Shape, WSMessage } from "@repo/types";
import dotenv from "dotenv"
import http from 'http'

dotenv.config();

const PORT = parseInt(process.env.PORT+"") || 8080;

const server = http.createServer();

const wss = new WebSocketServer({ server });

const rooms = new Map<string, RoomType>();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(msg) {
    const message: WSMessage = JSON.parse(msg.toString());

    if (message.messageType === "create-room") {
      let room = rooms.get(message.roomId);
      if (room) {
        ws.send(JSON.stringify({
          messageType: "error",
          error: "Room already exists"
        }))
      } else {
        let newSet: Set<WebSocket> = new Set();
        newSet.add(ws);

        rooms.set(message.roomId, {
          roomId: message.roomId,
          shapes: [],
          clients: newSet
        })

        newSet.forEach((x) => {
          x.send(JSON.stringify({
            messageType: "room-state",
            shapes: [],
            clients: newSet.size,
            roomId: message.roomId
          }))
        })
      }
    } else if (message.messageType === "join-room") {
      let room = rooms.get(message.roomId);
      if (room) {
        room?.clients.add(ws);

        room.clients.forEach((x) => {
          x.send(JSON.stringify({
            messageType: "room-state",
            shapes: room.shapes,
            clients: room.clients.size,
            roomId: message.roomId
          }))
        })

      } else {
        ws.send(JSON.stringify({
          messageType: "error",
          error: "No such room exists"
        }))
      }
    } else if (message.messageType === "room-state") {
      let room = rooms.get(message.roomId);
      if (room) {
        ws.send(JSON.stringify({
          messageType: "shapes",
          shapes: room?.shapes
        }))
      } else {
        ws.send(JSON.stringify({
          messageType: "error",
          error: "No such room exists"
        }))
      }
    } else if (message.messageType === "shape-operation") {
      let room = rooms.get(message.roomId);
      if (room !== undefined) {
        let shapes = room.shapes;


        if (message.payload.type === "insertion") {
          if (shapes.includes(message.payload.updatedShape, 0) === false) {
            shapes.push(message.payload.updatedShape);
          }
        } else if (message.payload.type === "updated") {
          shapes = shapes.map((s) => {
            if (s.id === message.payload.shapeId) {
              return message.payload.updatedShape;
            } else {
              return s;
            }
          })
        } else if (message.payload.type === "delete") {
          shapes = shapes?.filter((s) => {
            if (s.id === message.payload.shapeId)
              return false;
            return true;
          })
        }
        room.shapes = shapes;

        room.clients.forEach((x) => {
          if (x !== ws) {
            x.send(JSON.stringify({
              messageType: "shape-operation",
              payload: message.payload
            }))
          }
        })

      } else {
        ws.send(JSON.stringify({
          messageType: "error",
          error: "No such room exists"
        }))
      }

    } else if (message.messageType === "leave-room") {
      const room = rooms.get(message.roomId);
      room?.clients.delete(ws);
      if (room?.clients.size == 0) {
        rooms.delete(message.roomId);
      }

      if (room !== undefined) {
        room.clients.forEach((x) => {
          x.send(JSON.stringify({
            messageType: "clients",
            clients: room.clients.size
          }))
        })
      }
    }
  });

  ws.on("close", () => {
    rooms.forEach(room => {
      room.clients.delete(ws);
      if (room?.clients.size == 0) {
        rooms.delete(room.roomId);
      }

      room.clients.forEach((x) => {
        x.send(JSON.stringify({
          messageType: "clients",
          clients: room.clients.size
        }))
      })
    });
  });

  ws.send(JSON.stringify({
    messageType: "connected"
  }));
});

server.listen(PORT,() => {
  console.log("Server running on port", PORT);
});

/*

export interface RoomType {
    roomId: string,
    shapes: Shape[],
    clients: Set<WebSocket>
}

export interface WSMessage {
   roomId: string,
   messageType: MessageType,
   payload: any
}

export type MessageType = "create-room" | "join-room" | "room-state" | "shape-operation" | "leave-room";

export interface EventType {
    type: "updated" | "insertion" | "delete",
    shapeId: string,
    initialShape: Shape | undefined,
    updatedShape: Shape | undefined
}

*/

