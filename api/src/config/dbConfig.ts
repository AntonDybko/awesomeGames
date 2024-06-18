import dotenv from "dotenv";
dotenv.config();

interface IConfig {
    host: string;
    port: number | string;
    database: string;
    uri: string;
}

const dbConfig: IConfig = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'awsome-games',
    uri: process.env.MONGO_URI || '',
}

export default dbConfig;