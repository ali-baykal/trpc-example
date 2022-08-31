import { z } from "zod";

export const AuthorParser = z.object({
    name: z.string()
})

export const PersistedAuthorParser  = AuthorParser.extend({
    id: z.number().int()
})

export type PersistedAuthor = z.infer<typeof PersistedAuthorParser>;
export type Author = z.infer<typeof AuthorParser> | PersistedAuthor;

export const isPersistedAuthor = (author: Author): author is PersistedAuthor =>
    // @ts-expect-error
    typeof author.id === 'number';

export const createAuthor = (name: string, id?: number): Author =>{
    return typeof id === 'number'
        ? PersistedAuthorParser.parse({name, id})
        : {name}
}
