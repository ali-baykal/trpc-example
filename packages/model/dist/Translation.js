"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationParser = exports.Plural = exports.r = exports.e = exports.Noun = exports.Verb = void 0;
const zod_1 = require("zod");
const Language_1 = require("./Language");
exports.Verb = 'v';
exports.Noun = 's';
exports.e = 'e';
exports.r = 'r';
exports.Plural = 'pl';
const TypeEnum = zod_1.z.enum([exports.Verb, exports.Noun, exports.e, exports.r, exports.Plural]);
exports.TranslationParser = zod_1.z.object({
    origin: zod_1.z.object({
        main: zod_1.z.string()
    }),
    type: TypeEnum,
    translation: zod_1.z.string(),
    from: Language_1.Language,
    to: Language_1.Language
});
