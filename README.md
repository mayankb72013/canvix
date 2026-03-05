# Canvix

A real-time collaborative drawing canvas built from scratch using the HTML Canvas API and WebSockets. Multiple users can join the same room and draw together — shapes, edits, and undo/redo operations all sync instantly across clients.

Built as a personal project to explore canvas rendering pipelines, 2D geometric transformations, and the architecture behind collaborative editing tools.

---

## Features

**Drawing tools**
- Freehand / pencil
- Rectangle, line, ellipse
- Bounding box selection
- Resize and rotate shapes
- Stroke color and width control

**Editing**
- Shape selection with resize handles
- Rotation support
- Accurate hit detection
- Event-based undo / redo (not snapshot-based)
- Flicker-free redraw pipeline

**Real-time collaboration**
- Room-based sessions — share a link, draw together
- Server-synchronized canvas state
- Shape operations broadcast via WebSockets
- New users receive the full canvas state on join
- Undo / redo propagates to all connected clients

---

## Tech Stack

| | |
|---|---|
| Frontend | React, TypeScript, HTML Canvas API |
| State management | Recoil |
| Backend | Node.js, WebSocket (`ws`) |
| Monorepo | Turborepo |
| Shared types | `packages/types` |

---

## Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/your-username/canvix.git
cd canvix
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Start the WebSocket server**
```bash
cd apps/websocket
pnpm dev
# Listening on ws://localhost:8080
```

**4. Start the frontend**
```bash
cd apps/web
pnpm dev
# Open http://localhost:3000
```

---

## How It Works

### Rendering

Two canvas layers run at all times:

- **Main canvas** — holds committed, finalized shapes
- **Temp canvas** — handles live previews during transforms (resize, rotate, selection box)

During any transform operation the flow is:

```
snapshot current state
        ↓
compute transform (anchor-pivot math)
        ↓
render preview on temp canvas
        ↓
commit to main canvas on mouse-up
```

This keeps previews fast and prevents partial state from leaking into the main layer.

### Shape System

Each shape is a plain object containing:

```ts
{
  id: string            // UUID
  type: ShapeType
  geometry: {...}       // position, dimensions
  stroke: {...}         // color, width
  transform: {...}      // current transformation state
  points?: Point[]      // freehand path data
}
```

Freehand strokes are resized using anchor-pivot scaling — translate to the anchor point, apply scale, translate back. This preserves the stroke's position relative to other shapes during a resize.

### Undo / Redo

History is stored as a list of events, not full canvas snapshots:

```ts
{
  type: "insertion" | "updated" | "delete"
  shapeId: string
  initialShape?: Shape
  updatedShape?: Shape
}
```

Undo reverses the event. Redo reapplies it. This keeps memory usage flat regardless of canvas complexity, and since events are small plain objects they can be broadcast directly over WebSockets — so undo/redo works across all connected clients, not just locally.

### Collaboration

The server holds a `roomId → shapes[]` map in memory. Every client operation — insert, update, delete, undo, redo — is sent to the server, applied to the room state, and broadcast to all other clients in that room. When a new user joins, the server sends the full current shapes array to bring them up to date instantly.

```
Client A draws a shape
        ↓
sends { op: "insert", shape } to server
        ↓
server updates room state
        ↓
broadcasts to all other clients in the room
```

### Monorepo Structure

```
apps/
  web/          → React frontend
  websocket/    → collaboration server

packages/
  types/        → shared TypeScript types
  typescript-config/
```

---

## Planned

- Eraser tool
- Text tool
- Shape fill colors
- Multi-select and group operations
- Zoom and pan (infinite canvas)
- Live cursor presence per user
- Export as PNG / SVG
- CRDT-based conflict resolution

---

## License

MIT