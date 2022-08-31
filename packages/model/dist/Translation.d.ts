import { z } from 'zod';
export declare const Verb: "v";
export declare const Noun = "s";
export declare const e = "e";
export declare const r = "r";
export declare const Plural = "pl";
export declare const TranslationParser: z.ZodObject<{
    origin: z.ZodObject<{
        main: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        main: string;
    }, {
        main: string;
    }>;
    type: z.ZodEnum<["v", "s", "e", "r", "pl"]>;
    translation: z.ZodString;
    from: z.ZodEnum<["de", "tr"]>;
    to: z.ZodEnum<["de", "tr"]>;
}, "strip", z.ZodTypeAny, {
    origin: {
        main: string;
    };
    type: "v" | "s" | "e" | "r" | "pl";
    translation: string;
    from: "de" | "tr";
    to: "de" | "tr";
}, {
    origin: {
        main: string;
    };
    type: "v" | "s" | "e" | "r" | "pl";
    translation: string;
    from: "de" | "tr";
    to: "de" | "tr";
}>;
//# sourceMappingURL=Translation.d.ts.map