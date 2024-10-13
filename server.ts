import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let isHelloVisible = false;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log('New user connected:', socket.id);

    socket.emit("toggleHello", isHelloVisible);

    socket.on("toggleHello", (newHelloState) => {
      // Update the state and broadcast to all connected clients
      isHelloVisible = newHelloState;
      io.emit("toggleHello", isHelloVisible); // Broadcast the new state to all clients
    });

    socket.on("message", (payload) => {
      console.log("The first message is", payload);
    });

    socket.on("disconnect", () => {
      console.log('User disconnected:', socket.id);
    });

    // socket.on("message", (payload) => {
    //   console.log("The first message is", payload);
    // });
    // socket.on("toggleHello", (isHelloVisible) => {
    //   io.emit("toggleHello", isHelloVisible); // Broadcast to all clients
    // });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
