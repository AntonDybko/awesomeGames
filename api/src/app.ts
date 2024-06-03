import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import users from "./routes/users";
import games from "./routes/games";
import rankings from "./routes/rankings";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from 'socket.io';
import socketManager from "./socket";

const app: Application = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
//app.use(express.json());
app.use(express.json({limit: '50mb'}));

app.use("/users", users);
app.use("/games", games);
app.use("/ranking", rankings);
app.use((req, res, next) => {
    res.status(404).send('Route not Found');
});

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
socketManager(io);

export { app, server };
