"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = exports.Turkish = exports.German = void 0;
const zod_1 = require("zod");
exports.German = 'de';
exports.Turkish = 'tr';
exports.Language = zod_1.z.enum([exports.German, exports.Turkish]);
