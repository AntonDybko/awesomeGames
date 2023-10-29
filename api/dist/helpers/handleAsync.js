"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
exports.default = handleAsync;
