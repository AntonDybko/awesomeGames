import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import users from "./routes/users";
import games from "./routes/games";
import rankings from "./routes/rankings";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from 'socket.io';
import socketManager from "./socket";
import { verifySocket } from "./middleware/jwtVerification";
import { AuthenticatedRequest } from "./types/AuthenticatedRequest";
import corsOptions from "./config/corsOptions";

const app: Application = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));

app.use("/users", users);
app.use("/games", games);
app.use("/ranking", rankings);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Route not Found');
});

const server = http.createServer(app);

const io = new Server(server, {cors: corsOptions});
io.engine.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    verifySocket(req, res, next);
});
socketManager(io)


export { app, server };
