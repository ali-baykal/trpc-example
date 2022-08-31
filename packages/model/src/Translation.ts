import {z} from 'zod';
import { Language } from './Language';

export const Verb = 'v' as const;
export const Noun = 's';
export const e = 'e';
export const r = 'r';
export const Plural = 'pl';

const TypeEnum = z.enum([Verb, Noun, e, r, Plural])

export const TranslationParser = z.object({
    origin: z.object({
        main: z.string()
    }),
    type: TypeEnum,
    translation: z.string(),
    from: Language,
    to: Language
});

export type Translation = z.infer<typeof TranslationParser>;
