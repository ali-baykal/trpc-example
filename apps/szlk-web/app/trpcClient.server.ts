import { createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from 'szlk/dist/server';

export const trpc = createTRPCProxyClient<AppRouter>({
    url: 'http://localhost:4004/trpc',
});