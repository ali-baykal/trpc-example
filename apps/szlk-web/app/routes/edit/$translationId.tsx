import { useLoaderData, useParams } from '@remix-run/react';
import { trpc } from '../../trpcClient.server'
import type { PersistedTranslation } from 'model/dist/Translation';
import TranslationTable from '~/components/TranslationTable';


export const loader = async () => {
  return await trpc.readAllTranslations.query();
}


export default function EditTranslation() {
  const translations = useLoaderData() as PersistedTranslation[];
  const {translationId}  = useParams() as {translationId: string};
  const tranlastionIdNum = parseInt(translationId);

  return (
    <TranslationTable translations={translations} editedId={tranlastionIdNum}></TranslationTable>
  );
}