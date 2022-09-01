import { ActionFunction, redirect } from "@remix-run/node"
import { trpc } from '../../trpcClient.server';

export const action:ActionFunction = async ({request, params}) => {
    const {translationId} = params as {translationId: string};
    const translationIdNum = parseInt(translationId);
    const formData = await request.formData();

    const translation = await trpc.getTranslationById.query(translationIdNum);

    if(translation === null){
        throw Error('Can\'t save non existing translation');
    }

    const originalData = formData.get('original') as string;
    const translationData = formData.get('translation') as string;

    console.debug('Recived original', originalData, 'translation', translationData);

    const updated = {
        ...translation,
        original: originalData,
        translation: translationData,
    };

    await trpc.saveTranslation.mutate({translation: updated, authorId: 1});

    return redirect('/');
}

export const loader = async () => redirect('/');
