"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const usersController = {
    //just for development purposes, delete it or remove later
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.User.find();
        res.json(users);
    }),
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const username = req.params.username;
        const user = yield User_1.User.findOne({ username });
        const _a = JSON.parse(JSON.stringify(user)), { password, refreshToken, _id } = _a, userWithoutPassword = __rest(_a, ["password", "refreshToken", "_id"]);
        res.json(userWithoutPassword);
    }),
    editUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const request = req;
        const userToUpdate = req.body;
        const user = yield User_1.User.findOneAndUpdate({ _id: request.user._id }, Object.assign({}, userToUpdate), { returnNewDocument: true });
        const _b = JSON.parse(JSON.stringify(user)), { password, refreshToken, _id } = _b, userWithoutPassword = __rest(_b, ["password", "refreshToken", "_id"]);
        res.json(userWithoutPassword);
    }),
};
exports.default = usersController;
