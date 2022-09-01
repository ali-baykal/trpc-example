import { remixHTTPRequestHandler } from 'trpc-remix/adapter';
import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';

export const { loader, action } = remixHTTPRequestHandler({
  createContext,
  router: appRouter,
});