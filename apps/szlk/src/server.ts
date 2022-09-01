import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TranslationParser, PersistedTranslationParser } from 'model/dist/Translation';
import { z } from 'zod';
import {getAuthorById, getTranslationById, readAllTranslations, saveTranslation} from './db-io/client'
import express from 'express';

const trpc = initTRPC()();

const appRouter = trpc.router({
  readAllTranslations: trpc.procedure
    .query(
      (req) => readAllTranslations()
    ),
  getTranslationById: trpc.procedure
    .input((translationId: unknown) => z.number().int().parse(translationId))
    .query(req => getTranslationById(req.input)),
  getAuthorById: trpc.procedure
    .input((authorId: unknown) => z.number().int().parse(authorId))
    .query(req => getTranslationById(req.input)),
  saveTranslation: trpc.procedure
      .input(input => z.object({
          authorId: z.number().int(),
          translation: TranslationParser.or(PersistedTranslationParser)
      }).parse(input))
      .mutation(async (req) => {
        const {authorId, translation} = req.input;

        const author = await getAuthorById(authorId);

        if(author === null){
            throw Error(`Author with id ${authorId} does nost exist`);
        }

        return saveTranslation(translation, author);
      })
})

// const appRouter = trpc
//   .router()
//   .query('readAllTranslations', {
//     async resolve(req) {
//       return readAllTranslations();
//     },
//   })
//   .query('getTranslation', {
//     input: z.number().int(),
//     async resolve(req){
//         return getTranslationById(req.input)
//     }
//   })
//   .query('getAUthorById', {
//     input: z.number().int(),
//    async resolve (req){
//     return getAuthorById(req.input);
//    }
//   })
//   .mutation('saveTranslation', {
//     input: z.object({
//         authorId: z.number().int(),
//         translation: TranslationParser.or(PersistedTranslationParser)
//     }),
//     async resolve (req) {
//         const {authorId, translation} = req.input;
//         const author = await getAuthorById(authorId);

//         if(author === null){
//             throw Error(`Author with id ${authorId} does nost exist`);
//         }

//         return saveTranslation(translation, author);
//     }
//   })

// export type definition of API
export type AppRouter = typeof appRouter;

const app = express();

const createContext = ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

app.listen(4000);