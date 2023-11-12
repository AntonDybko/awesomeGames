import express, { Application, NextFunction, Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dbConfig from "./config/dbConfig";
import users from "./routes/users";
import cookieParser from "cookie-parser";
import http from "http";

mongoose.set("strictQuery", false);

const app: Application = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use((req, res, next) => {
    res.status(404).send('Route not Found');
});

const server = http.createServer(app);

const mongoConnectionURL = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

mongoose
    .connect(mongoConnectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
        console.log("Successfull connection to database.",
        );
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`API server is up and running`);
        });
    })
    .catch(error => console.error("Error connecting to database", error));
