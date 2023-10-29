"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const users_1 = __importDefault(require("./routes/users"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
mongoose_1.default.set("strictQuery", false);
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", users_1.default);
app.use((req, res, next) => {
    res.status(404).send('Route not Found');
});
const server = http_1.default.createServer(app);
const mongoConnectionString = `mongodb://${dbConfig_1.default.host}:${dbConfig_1.default.port}/${dbConfig_1.default.database}`;
mongoose_1.default
    .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("Successfull connection to database.");
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        console.log(`API server is up and running`);
    });
})
    .catch(error => console.error("Error connecting to database", error));
