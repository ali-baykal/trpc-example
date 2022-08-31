import {z} from 'zod';
import { PersistedAuthor, PersistedAuthorParser } from './Author';
import { Language } from './Language';

export const Verb = 'v' as const;
export const Noun = 's';
export const e = 'e';
export const r = 'r';
export const Plural = 'pl';
export const Adjective = 'aj';
export const Pre = 'pre';
export const Directive = 'd';

const TypeEnum = z.enum([Adjective, Verb, Noun, e, r, Plural, Pre, Directive]);

export const TranslationParser = z.object({
    origin: z.object({
        main: z.string()
    }),
    type: TypeEnum,
    translation: z.string(),
    from: Language,
    to: Language,
});

export const PersistedTranslationParser = TranslationParser.extend({
    id: z.number().int(),
    initiatedBy: PersistedAuthorParser,
    lastUpdatedBy: PersistedAuthorParser.optional()
});

export type PersistedTranslation = z.infer<typeof PersistedTranslationParser>;
export type Translation = z.infer<typeof TranslationParser> | PersistedTranslation;

export const setInitiatedBy = (translation: PersistedTranslation, author: PersistedAuthor): PersistedTranslation => ({
    ...translation,
    initiatedBy: author
});

export const setLastUpdatedBy = (translation: PersistedTranslation, author: PersistedAuthor): PersistedTranslation => ({
    ...translation,
    lastUpdatedBy: author
});

export const isPersistedTranslation = (translation: Translation): translation is PersistedTranslation =>
    // @ts-expect-error
    typeof translation.id === 'number';
