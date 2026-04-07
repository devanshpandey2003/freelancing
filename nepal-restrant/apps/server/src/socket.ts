import { Server } from "socket.io";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Admin joins a room to receive all order events
    socket.on("join:admin", () => {
      socket.join("admin_room");
      console.log(`👨‍💼 Admin joined: ${socket.id}`);
    });

    // Customer joins a table-specific room
    socket.on("join:table", (tableId: number) => {
      socket.join(`table_${tableId}`);
      console.log(`🪑 Customer joined table ${tableId}: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

// Helper to emit new order to admin room
export function emitNewOrder(io: Server, order: object) {
  io.to("admin_room").emit("order:new", order);
}

// Helper to emit status update to both admin and the specific table
export function emitOrderStatusUpdate(
  io: Server,
  tableId: number,
  payload: { orderId: string; status: string; order?: object }
) {
  io.to("admin_room").emit("order:status_updated", payload);
  io.to(`table_${tableId}`).emit("order:status_updated", payload);
}
