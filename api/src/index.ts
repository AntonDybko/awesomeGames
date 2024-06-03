import mongoose, { ConnectOptions } from "mongoose";
import { server } from "./app";
import dbConfig from "./config/dbConfig";
import initGames from "./helpers/dbHelp/initGames";

mongoose.set("strictQuery", false);

const mongoConnectionURL = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

mongoose
    .connect(mongoConnectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
        console.log("Successful connection to database.");
        initGames();
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`API server is up and running on port ${port}`);
        });
    })
    .catch(error => console.error("Error connecting to database", error));
