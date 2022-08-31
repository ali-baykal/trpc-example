import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TranslationParser, PersistedTranslationParser } from 'model/dist/Translation';
import { z } from 'zod';
import {getAuthorById, getTranslationById, readAllTranslations, saveTranslation} from './db-io/client'
import express from 'express';
const appRouter = trpc
  .router()
  .query('readAllTranslations', {
    async resolve(req) {
      return readAllTranslations();
    },
  })
  .query('getTranslation', {
    input: z.number().int(),
    async resolve(req){
        return getTranslationById(req.input)
    }
  })
  .query('getAUthorById', {
    input: z.number().int(),
   async resolve (req){
    return getAuthorById(req.input);
   }
  })
  .mutation('saveTranslation', {
    input: z.object({
        authorId: z.number().int(),
        translation: TranslationParser.or(PersistedTranslationParser)
    }),
    async resolve (req) {
        const {authorId, translation} = req.input;
        const author = await getAuthorById(authorId);

        if(author === null){
            throw Error(`Author with id ${authorId} does nost exist`);
        }

        return saveTranslation(translation, author);
    }
  })

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