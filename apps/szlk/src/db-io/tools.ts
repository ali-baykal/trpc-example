import * as fs from 'fs/promises';
import { TranslationParser } from 'model/dist/Translation';
import { Author } from 'model/dist/Author';
import { z } from 'zod';
import * as path from 'path';
import { createAuthor, saveTranslation } from './client';
import { DBTranslation } from '@prisma/client';

const parser = z.array(TranslationParser);

const logSaved = (translation: DBTranslation) => (console.log('Saved', translation), translation);


export const transferTranslations = async (author: Author) => {

    const persistedAuthor = await createAuthor(author);
     console.debug('Persited author', persistedAuthor);

    const translationsPath = path.resolve(__dirname, './translations.json');
    const translationsJson = await fs.readFile(translationsPath, 'utf8');
    const translations = JSON.parse(translationsJson).map(
        (translation:any) => ({
            ...translation,
            from: 'de',
            to: 'tr'
        })
    ); 

    const translationsParsed = parser.safeParse(translations);

    if(translationsParsed.success){
        let promise:Promise<void | DBTranslation> | undefined = undefined;

        for(const translation of translations){
            if(typeof promise === 'undefined'){
                promise = saveTranslation(translation, persistedAuthor).then(
                    logSaved
                ).catch(console.error)
            } else {
                promise = promise
                    .then(() => saveTranslation(translation, persistedAuthor))
                    .then(logSaved)
                    .catch(console.error)
            }

            promise = promise;
        }
    } else {
        console.error(translationsParsed.error.errors.map(
            err => ({
                ...err,
                path: err.path.join('.')
            })
        ));
    }
}
