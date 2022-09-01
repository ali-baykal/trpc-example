import { useLoaderData } from '@remix-run/react';
import { trpc } from '../trpcClient.server'
import type { PersistedTranslation } from 'model/dist/Translation';
import TranslationTable from '~/components/TranslationTable';


export const loader = async () => {
  return await trpc.readAllTranslations.query();
}


export default function Index() {
  const translations = useLoaderData() as PersistedTranslation[];

  return (
    <TranslationTable translations={translations}></TranslationTable>
  );
}
