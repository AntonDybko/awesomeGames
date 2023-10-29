import dotenv from "dotenv";
dotenv.config();

interface IConfig {
    host: string;
    port: number | string;
    database: string;
    //user: string;
    //password: string;
}

const dbConfig: IConfig = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'awsome-games',
    //user: process.env.MONGO_USER || 'admin',
    //password: process.env.MONGO_PASSWORD || 'admin'
}

export default dbConfig;